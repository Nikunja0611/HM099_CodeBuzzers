import os
import pickle
import pandas as pd
import numpy as np
import certifi
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
from datetime import datetime
from bson.objectid import ObjectId
from urllib.parse import quote_plus

# --- CONFIGURATION ---
app = Flask(__name__)
app.config['SECRET_KEY'] = 'impacthub_secret'
# --- ADD CORS HERE ---
CORS(app, resources={r"/*": {"origins": "*"}}) 
# Note: Once your Vercel frontend is live (e.g., https://impacthub.vercel.app),
# replace "*" with that specific URL for better security.

socketio = SocketIO(app, cors_allowed_origins="*")

# --- MONGODB CONNECTION ---
username = quote_plus('sonawanenikunja_db_user')
password = quote_plus('#Nns@5643') 
MONGO_URI = f"mongodb+srv://{username}:{password}@cluster0.fltqt43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

try:
    client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = client.impacthub_db
    projects_col = db.projects
    users_col = db.users
    client.admin.command('ping')
    print("✅ Successfully connected to MongoDB Atlas!")
except Exception as e:
    print(f"❌ MongoDB Connection Failed: {e}")

# --- LOAD AI MODELS ---
print("⏳ Loading AI Models...")
models = {}

try:
    # 1. SDG Classifier (Saved as tuple: vectorizer, classifier)
    with open('ml_models/sdg_classifier_real.pkl', 'rb') as f:
        models['sdg_vec'], models['sdg_clf'] = pickle.load(f)
    print("   - SDG Classifier: Loaded")

    # 2. Impact Predictor (Saved as model object)
    with open('ml_models/impact_predictor_v2.pkl', 'rb') as f:
        models['impact'] = pickle.load(f)
    print("   - Impact Predictor: Loaded")

    # 3. Partner Recommender
    # Assuming this pickle contains: (vectorizer, knn_model, partner_ids/data)
    with open('ml_models/partner_recommendation.pkl', 'rb') as f:
        loaded_rec = pickle.load(f)
        # Handle different save formats safely
        if isinstance(loaded_rec, tuple) or isinstance(loaded_rec, list):
            models['rec_vec'] = loaded_rec[0]
            models['rec_model'] = loaded_rec[1]
            # Optional: loaded_rec[2] might be the partner IDs mapping
        else:
            models['rec_model'] = loaded_rec
            models['rec_vec'] = models['sdg_vec'] # Fallback to SDG vectorizer if none specific
    print("   - Partner Recommender: Loaded")

    print("✅ All AI Models Loaded Successfully!")
except Exception as e:
    print(f"⚠️ Warning: Could not load models. Error: {e}")

# --- HELPER FUNCTIONS ---

def serialize_doc(doc):
    if doc:
        doc['_id'] = str(doc['_id'])
    return doc

def predict_sdg_logic(text, threshold=0.10):
    if 'sdg_clf' not in models: return [(17, 0.0)]
    
    try:
        # 1. Vectorize using the loaded vectorizer
        vec_text = models['sdg_vec'].transform([text])
        
        # 2. Predict Probabilities
        probabilities = models['sdg_clf'].predict_proba(vec_text)[0]
        
        # 3. Filter & Sort
        results = []
        for idx, score in enumerate(probabilities):
            if score > threshold:
                results.append((models['sdg_clf'].classes_[idx], score))
        
        results.sort(key=lambda x: x[1], reverse=True)
        
        if not results:
            top_idx = np.argmax(probabilities)
            results.append((models['sdg_clf'].classes_[top_idx], probabilities[top_idx]))
            
        return results
    except Exception as e:
        print(f"AI Logic Error: {e}")
        return []

# ==========================================
#              AI ENDPOINTS
# ==========================================

@app.route('/api/predict_sdg', methods=['POST'])
def predict_sdg():
    data = request.json
    text = data.get('description', '')
    predictions = predict_sdg_logic(text)
    response = [{'sdg': str(p[0]), 'confidence': float(p[1])} for p in predictions]
    return jsonify(response)

@app.route('/api/predict_impact', methods=['POST'])
def predict_impact():
    data = request.json
    if 'impact' in models:
        try:
            # Ensure features match your training columns EXACTLY
            resource_map = {'Low': 1, 'Medium': 2, 'High': 3}
            res_val = resource_map.get(data.get('resource_availability', 'Medium'), 2)

            features = pd.DataFrame([[
                float(data.get('milestones_pct', 0)),    
                float(data.get('time_elapsed_pct', 0)),  
                int(data.get('collaborators', 1)),       
                int(res_val),                            
                float(data.get('budget_pct', 0))         
            ]], columns=[
                'Milestones_Completed_Pct', 'Time_Elapsed_Pct', 'Num_Collaborators', 
                'Resource_Availability', 'Budget_Used_Pct'
            ])
            
            # Predict Class (0 or 1) and Probability (Confidence)
            pred_class = models['impact'].predict(features)[0]
            pred_prob = models['impact'].predict_proba(features)[0][1] # Probability of "Success/On Track"
            
            status = "On Track" if pred_class == 1 else "At Risk"
            # Return actual confidence from model, not mock data
            return jsonify({'status': status, 'confidence': round(pred_prob * 100, 1)})
            
        except Exception as e:
            print(f"AI Impact Error: {e}")
            return jsonify({'status': "On Track", 'confidence': 50})
            
    return jsonify({'status': "On Track", 'confidence': 0})

# ==========================================
#      PARTNER RECOMMENDATIONS (FIXED)
# ==========================================

@app.route('/api/projects/<id>/recommendations', methods=['GET'])
def get_recommendations(id):
    try:
        project = projects_col.find_one({'_id': ObjectId(id)})
        if not project: return jsonify([])
        
        # 1. Prepare Text for Recommendation Model
        # Concatenate Title + Description + SDG Keywords
        sdg_val = " ".join(project.get('sdg', [])) if isinstance(project.get('sdg'), list) else str(project.get('sdg', ''))
        input_text = f"{project.get('title', '')} {project.get('description', '')} {sdg_val}"

        recommendations = []

        # 2. Try ML Model First (Nearest Neighbors)
        if 'rec_model' in models and 'rec_vec' in models:
            try:
                # Transform text
                vec = models['rec_vec'].transform([input_text])
                
                # Find K Nearest Neighbors (e.g., top 3)
                distances, indices = models['rec_model'].kneighbors(vec, n_neighbors=3)
                
                # 'indices' usually points to the row number in your training dataset (users collection)
                # Since we can't map indices directly to Mongo IDs without the original training list,
                # We often save the 'user_ids' list in the pickle too.
                # IF NOT AVAILABLE: Fallback to Content-Based DB Query below.
                
                print(f"Model found indices: {indices}")
                
            except Exception as ml_err:
                print(f"ML Rec Model Failed: {ml_err}")

        # 3. DATABASE FALLBACK (Content-Based Filtering)
        # If ML fails or isn't fully linked, use smart DB query
        if not recommendations:
            target_sdg = project.get('sdg')
            if isinstance(target_sdg, list) and len(target_sdg) > 0:
                target_sdg = target_sdg[0] # Take primary SDG
            
            pipeline = [
                { 
                    "$match": { 
                        "$or": [
                            {"interests": {"$regex": str(target_sdg), "$options": "i"}}, # Match SDG in interests string
                            {"role": "NGO"},
                            {"skills": {"$regex": "Sustainability", "$options": "i"}}
                        ]
                    } 
                },
                { "$sample": { "size": 3 } }, # Randomize results slightly for variety
                { "$project": { "password": 0 } }
            ]
            recommendations = list(users_col.aggregate(pipeline))

        return jsonify([serialize_doc(p) for p in recommendations])

    except Exception as e:
        print(f"Recommendation Error: {e}")
        return jsonify([])

# ==========================================
#            OTHER ENDPOINTS
# ==========================================

@app.route('/api/projects', methods=['GET', 'POST'])
def handle_projects():
    if request.method == 'POST':
        project_data = request.json
        project_data['created_at'] = datetime.now()
        if 'status' not in project_data: project_data['status'] = 'Planning'
        
        # Initial Impact Calculation
        if 'impact_score' not in project_data:
             # Basic heuristic if model fails
             project_data['impact_score'] = 50 
        
        result = projects_col.insert_one(project_data)
        return jsonify({'msg': 'Project Saved', 'id': str(result.inserted_id)}), 201
    else:
        projects = list(projects_col.find().sort('created_at', -1))
        return jsonify([serialize_doc(p) for p in projects])

@app.route('/api/projects/<id>', methods=['GET', 'PUT'])
def handle_single_project(id):
    if request.method == 'PUT':
        data = request.json
        if '_id' in data: del data['_id']
        projects_col.update_one({'_id': ObjectId(id)}, {'$set': data})
        return jsonify({'msg': 'Updated'})
        
    project = projects_col.find_one({'_id': ObjectId(id)})
    if project: return jsonify(serialize_doc(project))
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/partners', methods=['GET'])
def get_partners():
    partners = list(users_col.find({}, {'password': 0})) 
    return jsonify([serialize_doc(p) for p in partners])

@app.route('/api/stats', methods=['GET'])
def get_stats():
    total = projects_col.count_documents({})
    active = projects_col.count_documents({'status': 'Active'})
    partners = users_col.count_documents({})
    pipeline = [
        {"$project": {"sdg": {"$cond": {"if": {"$isArray": "$sdg"}, "then": "$sdg", "else": ["$sdg"]}}}},
        {"$unwind": "$sdg"},
        {"$group": {"_id": "$sdg", "count": {"$sum": 1}}}
    ]
    sdg_dist = list(projects_col.aggregate(pipeline))
    return jsonify({'total': total, 'active': active, 'partners': partners, 'sdg_dist': sdg_dist})

@app.route('/api/register', methods=['POST'])
def register_user():
    user_data = request.json
    if users_col.find_one({"email": user_data['email']}):
        return jsonify({"error": "User already exists"}), 400
    users_col.insert_one(user_data)
    return jsonify({"msg": "User registered"}), 201

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)