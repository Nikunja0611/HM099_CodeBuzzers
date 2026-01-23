import os
import pickle
import joblib  # Added for loading the pipeline
import pandas as pd
import numpy as np
import certifi
import re 
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
from datetime import datetime
from bson.objectid import ObjectId
from urllib.parse import quote_plus

try:
    from sentence_transformers import SentenceTransformer
    from sklearn.metrics.pairwise import cosine_similarity
except ImportError:
    print("⚠️ WARNING: sentence-transformers not installed. Run: pip install sentence-transformers")

# --- CONFIGURATION ---
app = Flask(__name__)
app.config['SECRET_KEY'] = 'impacthub_secret'
CORS(app)
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
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'ml_models')

# Features expected by the trained XGBoost model
MODEL_FEATURES = [
    'milestones_completion_pct', 'time_elapsed_pct', 'collaborators',
    'resource_availability_code', 'budget_used_pct', 'sdg_confidence_avg',
    'schedule_variance', 'budget_efficiency', 'delivery_velocity'
]

try:
    # 1. SDG Classifier
    path_sdg = os.path.join(MODEL_DIR, 'sdg_classifier_real.pkl')
    if os.path.exists(path_sdg):
        with open(path_sdg, 'rb') as f:
            models['sdg_vec'], models['sdg_clf'] = pickle.load(f)
        print("   - SDG Classifier: Loaded")

    # 2. Project Status Predictor (NEW XGBOOST PIPELINE)
    path_pipeline = os.path.join(MODEL_DIR, 'project_status_predictor_pipeline.pkl')
    path_le = os.path.join(MODEL_DIR, 'label_encoder.pkl')
    
    if os.path.exists(path_pipeline) and os.path.exists(path_le):
        models['status_pipeline'] = joblib.load(path_pipeline)
        models['label_encoder'] = joblib.load(path_le)
        print("   - Status Predictor (XGBoost): Loaded")
    else:
        print("   ⚠️ Status Predictor files not found. Using fallback logic.")

    # 3. Partner Recommender (SBERT COMPATIBLE)
    path_rec = os.path.join(MODEL_DIR, 'partner_reccomender.pkl')
    if os.path.exists(path_rec):
        with open(path_rec, 'rb') as f:
            rec_data = pickle.load(f)
            
            # Check if it's the dictionary from your notebook
            if isinstance(rec_data, dict) and 'model_type' in rec_data:
                print(f"   - Detected {rec_data['model_type']} recommender")
                
                if rec_data['model_type'] == 'sbert':
                    # Load the SBERT model specifically
                    try:
                        models['sbert'] = SentenceTransformer('all-MiniLM-L6-v2')
                        models['rec_type'] = 'sbert'
                        print("   - SBERT Model: Loaded")
                    except Exception as e:
                        print(f"   ❌ SBERT Load Failed: {e}")
            
            # Fallback for old tuples
            elif isinstance(rec_data, tuple) or isinstance(rec_data, list):
                models['rec_vec'] = rec_data[0]
                models['rec_model'] = rec_data[1]
                models['rec_type'] = 'tfidf'

    print("✅ AI Models Load Process Complete")
except Exception as e:
    print(f"⚠️ Warning: Model loading error: {e}")

# --- HELPER FUNCTIONS ---

def serialize_doc(doc):
    if doc:
        doc['_id'] = str(doc['_id'])
    return doc

def predict_sdg_logic(text):
    if 'sdg_clf' not in models: return [(17, 0.0)]
    try:
        vec_text = models['sdg_vec'].transform([text])
        probabilities = models['sdg_clf'].predict_proba(vec_text)[0]
        results = []
        for idx, score in enumerate(probabilities):
            results.append((models['sdg_clf'].classes_[idx], score))
        results.sort(key=lambda x: x[1], reverse=True)
        top_results = [r for r in results[:3] if r[1] > 0.01]
        if not top_results:
            top_results.append((results[0][0], results[0][1]))
        return top_results
    except Exception as e:
        print(f"AI Logic Error: {e}")
        return [(17, 0.0)]

# Feature Engineering Logic (Matches training script)
def add_derived_features(df):
    df = df.copy()
    # schedule variance: completion - elapsed
    df['schedule_variance'] = df['milestones_completion_pct'] - df['time_elapsed_pct']
    # budget_efficiency: completion / budget (avoid divide by zero)
    df['budget_efficiency'] = df['milestones_completion_pct'] / (df['budget_used_pct'] / 100.0 + 1e-6)
    # delivery_velocity: completion_pct / time_elapsed_pct (scaled)
    df['delivery_velocity'] = df['milestones_completion_pct'] / (df['time_elapsed_pct'].clip(lower=1e-6))
    return df

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
    
    # Check if new model exists
    if 'status_pipeline' in models and 'label_encoder' in models:
        try:
            # 1. Map Resource Availability Text -> Code
            ra_map = {"Low": 0, "Medium": 1, "High": 2}
            ra_val = ra_map.get(data.get('resource_availability', 'Medium'), 1)

            # 2. Construct Base DataFrame
            input_payload = {
                'milestones_completion_pct': float(data.get('milestones_pct', 0.0)),
                'time_elapsed_pct': float(data.get('time_elapsed_pct', 0.0)),
                'collaborators': int(data.get('collaborators', 1)),
                'resource_availability_code': int(ra_val),
                'budget_used_pct': float(data.get('budget_pct', 0.0)),
                # Default to 0.85 if not provided (High confidence assumption)
                'sdg_confidence_avg': float(data.get('sdg_confidence', 0.85))
            }
            
            df_in = pd.DataFrame([input_payload])

            # 3. Add Derived Features (CRITICAL: Must match training logic)
            df_in = add_derived_features(df_in)

            # 4. Filter columns to match model expectation
            X_in = df_in[MODEL_FEATURES]
            X_in_array = X_in.values

            # 5. Predict
            pipeline = models['status_pipeline']
            le = models['label_encoder']
            
            # Get probabilities
            probs = pipeline.predict_proba(X_in_array)[0]
            pred_idx = int(np.argmax(probs))
            
            # Get class label and confidence score
            status_label = le.inverse_transform([pred_idx])[0]
            confidence_score = float(probs[pred_idx]) * 100  # Convert to percentage

            return jsonify({'status': status_label, 'confidence': round(confidence_score, 1)})

        except Exception as e:
            print(f"❌ AI Status Prediction Error: {e}")
            # Fall through to default if error occurs
    
    # Fallback / Default
    return jsonify({'status': "On Track", 'confidence': 85.0})

# ==========================================
#       PARTNER RECOMMENDATIONS (SBERT)
# ==========================================

@app.route('/api/projects/<id>/recommendations', methods=['GET'])
def get_recommendations(id):
    try:
        project = projects_col.find_one({'_id': ObjectId(id)})
        if not project: return jsonify([])

        project_title = project.get('title', '')
        project_desc = project.get('description', '')
        project_text = f"{project_title} {project_desc}"
        
        # 1. Broad Database Filter (Get ~500 candidates)
        project_sdg = project.get('sdg')
        target_sdgs = [str(s) for s in project_sdg] if isinstance(project_sdg, list) else ([str(project_sdg)] if project_sdg else ["17"])
        
        or_conditions = []
        or_conditions.append({"skills": {"$regex": project_title.split(" ")[0] if project_title else "Impact", "$options": "i"}})
        for sdg in target_sdgs:
            or_conditions.append({"interests": {"$regex": f"SDG {sdg}\\b", "$options": "i"}})
            or_conditions.append({"interests": {"$regex": f"\\b{sdg}\\b", "$options": "i"}})

        partners = list(users_col.find({"$or": or_conditions}, 
            {"password": 0, "created_at": 0, "phone": 0}
        ).limit(500))

        # Backup if too few results
        if len(partners) < 5:
            partners = list(users_col.find({}, {"password": 0}).sort('_id', -1).limit(100))

        scored_partners = []

        # 2. SBERT Semantic Scoring (High Accuracy)
        if 'sbert' in models and partners:
            try:
                # Encode Project
                project_embedding = models['sbert'].encode([project_text]) # Shape: (1, 384)

                # Batch Encode Partners (Faster than loop)
                partner_texts = [f"{p.get('description','')} {p.get('skills','')} {p.get('interests','')}" for p in partners]
                partner_embeddings = models['sbert'].encode(partner_texts) # Shape: (N, 384)

                # Calculate Cosine Similarity
                similarities = cosine_similarity(project_embedding, partner_embeddings)[0]

                # Assign scores
                for idx, partner in enumerate(partners):
                    score = float(similarities[idx])
                    partner['match_score'] = round(max(score * 100, 0), 2) # Ensure positive
                    scored_partners.append(partner)

                scored_partners.sort(key=lambda x: x['match_score'], reverse=True)

            except Exception as e:
                print("SBERT scoring error:", e)
                # Fallback logic if SBERT fails
                for p in partners: p['match_score'] = 60.0
                scored_partners = partners
        
        # 3. Legacy TF-IDF Fallback
        elif 'rec_vec' in models and partners:
            try:
                project_vec = models['rec_vec'].transform([project_text])
                for partner in partners:
                    partner_text = f"{partner.get('description','')} {partner.get('skills','')} {partner.get('interests','')}"
                    partner_vec = models['rec_vec'].transform([partner_text])
                    score = float(np.dot(project_vec.toarray(), partner_vec.toarray().T)[0][0])
                    partner['match_score'] = round(min(score * 100, 100), 2)
                    scored_partners.append(partner)
                scored_partners.sort(key=lambda x: x['match_score'], reverse=True)
            except Exception:
                scored_partners = partners
        else:
            scored_partners = partners

        return jsonify([serialize_doc(p) for p in scored_partners[:5]])

    except Exception as e:
        print("Partner Recommendation Error:", e)
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
        if 'confidence' in project_data:
            try:
                val = float(project_data['confidence'])
                if val < 1: val = val * 100
                project_data['confidence'] = int(val)
            except:
                project_data['confidence'] = 0
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
    partners = list(users_col.find({}, {'password': 0}).limit(100))
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