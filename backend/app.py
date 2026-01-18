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
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# --- MONGODB ATLAS CONNECTION ---
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
    with open('ml_models/sdg_classifier_real.pkl', 'rb') as f:
        models['tfidf'], models['sdg'] = pickle.load(f)
    with open('ml_models/impact_predictor_v2.pkl', 'rb') as f:
        models['impact'] = pickle.load(f)
    with open('ml_models/partner_recommendation.pkl', 'rb') as f:
        models['recommender'] = pickle.load(f)
    print("✅ All AI Models Loaded Successfully!")
except Exception as e:
    print(f"⚠️ Warning: Could not load models. Error: {e}")

# --- HELPER FUNCTIONS ---
def serialize_doc(doc):
    if doc:
        doc['_id'] = str(doc['_id'])
    return doc

def predict_sdg_logic(text, threshold=0.10):
    if 'sdg' not in models or 'tfidf' not in models: return [(17, 0.0)]
    try:
        vec_text = models['tfidf'].transform([text])
        probabilities = models['sdg'].predict_proba(vec_text)[0]
        results = []
        for idx, score in enumerate(probabilities):
            if score > threshold: results.append((models['sdg'].classes_[idx], score))
        results.sort(key=lambda x: x[1], reverse=True)
        if not results:
            top_idx = np.argmax(probabilities)
            results.append((models['sdg'].classes_[top_idx], probabilities[top_idx]))
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
            resource_map = {'Low': 1, 'Medium': 2, 'High': 3}
            res_val = resource_map.get(data.get('resource_availability', 'Medium'), 2)
            features = pd.DataFrame([[
                float(data.get('milestones_pct', 0)),    
                float(data.get('time_elapsed_pct', 0)),  
                int(data.get('collaborators', 1)),       
                int(res_val),                            
                float(data.get('budget_pct', 0))         
            ]], columns=['Milestones_Completed_Pct', 'Time_Elapsed_Pct', 'Num_Collaborators', 'Resource_Availability', 'Budget_Used_Pct'])
            pred = models['impact'].predict(features)[0]
            status = "On Track" if pred == 1 else "At Risk"
            return jsonify({'status': status})
        except Exception as e:
            print(f"AI Impact Error: {e}")
            return jsonify({'status': "On Track"})
    return jsonify({'status': "On Track"})

# ==========================================
#            PROJECT ENDPOINTS
# ==========================================

@app.route('/api/projects', methods=['GET', 'POST'])
def handle_projects():
    if request.method == 'POST':
        project_data = request.json
        project_data['created_at'] = datetime.now()
        project_data['status'] = 'Planning'
        # Simple Logic for impact score if missing
        if 'impact_score' not in project_data:
            project_data['impact_score'] = min(95, len(project_data.get('description', '')) // 2)
        result = projects_col.insert_one(project_data)
        return jsonify({'msg': 'Project Saved', 'id': str(result.inserted_id)}), 201
    else:
        # GET ALL
        projects = list(projects_col.find().sort('created_at', -1))
        return jsonify([serialize_doc(p) for p in projects])

@app.route('/api/projects/<id>', methods=['GET'])
def get_project(id):
    try:
        project = projects_col.find_one({'_id': ObjectId(id)})
        if project: return jsonify(serialize_doc(project))
        return jsonify({'error': 'Not found'}), 404
    except:
        return jsonify({'error': 'Invalid ID'}), 400

# --- ADD THIS TO backend/app.py ---

@app.route('/api/projects/<id>', methods=['PUT'])
def update_project(id):
    try:
        data = request.json
        # Remove _id if it exists in the payload to avoid immutable field error
        if '_id' in data: del data['_id']
        
        # Update the project in MongoDB
        result = projects_col.update_one(
            {'_id': ObjectId(id)},
            {'$set': data}
        )
        
        if result.modified_count > 0:
            return jsonify({'msg': 'Project updated successfully'})
        return jsonify({'msg': 'No changes made'}), 200
    except Exception as e:
        print(f"Update Error: {e}")
        return jsonify({'error': 'Failed to update project'}), 500
    
# ==========================================
#      PARTNERS & RECOMMENDATIONS
# ==========================================

@app.route('/api/partners', methods=['GET'])
def get_partners():
    partners = list(users_col.find({}, {'password': 0})) 
    return jsonify([serialize_doc(p) for p in partners])

@app.route('/api/projects/<id>/recommendations', methods=['GET'])
def get_recommendations(id):
    try:
        project = projects_col.find_one({'_id': ObjectId(id)})
        if not project: return jsonify([])
        
        # Handle Array vs String for vectorizer
        sdg_raw = project.get('sdg', '')
        if isinstance(sdg_raw, list):
            sdg_str = " ".join([str(s) for s in sdg_raw])
            target_sdg = sdg_raw[0] if len(sdg_raw) > 0 else "17"
        else:
            sdg_str = str(sdg_raw)
            target_sdg = sdg_str

        # Fallback Logic: Find partners with matching role or SDG interest
        pipeline = [
            { "$match": { "$or": [{"role": "NGO"}, {"role": "Startup"}, {"interests": target_sdg}] } },
            { "$sample": { "size": 3 } }, 
            { "$project": { "password": 0 } }
        ]
        recommendations = list(users_col.aggregate(pipeline))
        return jsonify([serialize_doc(p) for p in recommendations])
    except Exception as e:
        print(f"Rec Error: {e}")
        return jsonify([])

# ==========================================
#              DASHBOARD STATS
# ==========================================

@app.route('/api/stats', methods=['GET'])
def get_stats():
    total = projects_col.count_documents({})
    active = projects_col.count_documents({'status': 'Active'})
    partners = users_col.count_documents({})
    
    # Accurate counting for Multi-SDG projects
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

# --- SOCKET IO ---
@socketio.on('send_message')
def handle_message(data):
    emit('receive_message', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)