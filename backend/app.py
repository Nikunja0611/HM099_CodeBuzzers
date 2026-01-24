import os
import pickle
import joblib
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

# --- NEW GOOGLE GENAI SDK ---
from google import genai
from google.genai import types

try:
    from sentence_transformers import SentenceTransformer
    from sklearn.metrics.pairwise import cosine_similarity
except ImportError:
    print("⚠️ WARNING: sentence-transformers not installed.")

# --- CONFIGURATION ---
app = Flask(__name__)
app.config['SECRET_KEY'] = 'impacthub_secret'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# --- GEMINI SETUP ---
GEMINI_API_KEY = "AIzaSyCP3-IBG72cz3Cdd9eD7Fr2TW_Db8lG_so"
genai_client = genai.Client(api_key=GEMINI_API_KEY)

# --- MONGODB SETUP ---
username = quote_plus('sonawanenikunja_db_user')
password = quote_plus('#Nns@5643') 
MONGO_URI = f"mongodb+srv://{username}:{password}@cluster0.fltqt43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

try:
    mongo_client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = mongo_client.impacthub_db
    projects_col = db.projects
    users_col = db.users
    grants_col = db.grants  # RENAMED from proposals to grants
    mongo_client.admin.command('ping')
    print("✅ Successfully connected to MongoDB Atlas!")
except Exception as e:
    print(f"❌ MongoDB Connection Failed: {e}")

# --- LOAD AI MODELS ---
print("⏳ Loading AI Models...")
models = {}
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'ml_models')

MODEL_FEATURES = [
    'milestones_completion_pct', 'time_elapsed_pct', 'collaborators',
    'resource_availability_code', 'budget_used_pct', 'sdg_confidence_avg',
    'schedule_variance', 'budget_efficiency', 'delivery_velocity'
]

try:
    path_sdg = os.path.join(MODEL_DIR, 'sdg_classifier_real.pkl')
    if os.path.exists(path_sdg):
        with open(path_sdg, 'rb') as f:
            models['sdg_vec'], models['sdg_clf'] = pickle.load(f)
        print("   - SDG Classifier: Loaded")

    path_pipeline = os.path.join(MODEL_DIR, 'project_status_predictor_pipeline.pkl')
    path_le = os.path.join(MODEL_DIR, 'label_encoder.pkl')
    if os.path.exists(path_pipeline) and os.path.exists(path_le):
        models['status_pipeline'] = joblib.load(path_pipeline)
        models['label_encoder'] = joblib.load(path_le)
        print("   - Status Predictor (XGBoost): Loaded")

    path_rec = os.path.join(MODEL_DIR, 'partner_reccomender.pkl')
    if os.path.exists(path_rec):
        with open(path_rec, 'rb') as f:
            rec_data = pickle.load(f)
            if isinstance(rec_data, dict) and rec_data.get('model_type') == 'sbert':
                models['sbert'] = SentenceTransformer('all-MiniLM-L6-v2')
                print("   - SBERT Model: Loaded")
            elif isinstance(rec_data, (tuple, list)):
                models['rec_vec'] = rec_data[0]
                models['rec_model'] = rec_data[1]
    print("✅ AI Models Load Process Complete")
except Exception as e:
    print(f"⚠️ Warning: Model loading error: {e}")

# --- HELPER FUNCTIONS ---
def serialize_doc(doc):
    if doc:
        doc['_id'] = str(doc['_id'])
    return doc

def add_derived_features(df):
    df = df.copy()
    df['schedule_variance'] = df['milestones_completion_pct'] - df['time_elapsed_pct']
    df['budget_efficiency'] = df['milestones_completion_pct'] / (df['budget_used_pct'] / 100.0 + 1e-6)
    df['delivery_velocity'] = df['milestones_completion_pct'] / (df['time_elapsed_pct'].clip(lower=1e-6))
    return df

# ==========================================
#          LLM GENERATION ENDPOINTS
# ==========================================

def generate_content_safe(prompt):
    model_candidates = ["gemini-2.5-flash", "gemini-1.5-flash-001", "gemini-pro"]
    last_error = None
    for model_name in model_candidates:
        try:
            print(f"🤖 Attempting with {model_name}...")
            response = genai_client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    safety_settings=[
                        types.SafetySetting(category='HARM_CATEGORY_HATE_SPEECH', threshold='BLOCK_NONE'),
                        types.SafetySetting(category='HARM_CATEGORY_DANGEROUS_CONTENT', threshold='BLOCK_NONE'),
                        types.SafetySetting(category='HARM_CATEGORY_HARASSMENT', threshold='BLOCK_NONE'),
                        types.SafetySetting(category='HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold='BLOCK_NONE')
                    ]
                )
            )
            return response.text
        except Exception as e:
            print(f"⚠️ Failed with {model_name}: {e}")
            last_error = e
    raise last_error

@app.route('/api/generate_draft', methods=['POST'])
def generate_draft():
    try:
        data = request.json
        project_title = data.get('title', '')
        description = data.get('description', '')
        draft_type = data.get('type', 'grant') # 'grant' or 'partnership'
        partner_name = data.get('partner_name', 'Organization')
        
        budget_items = data.get('budget_items', [])
        budget_summary = ", ".join([f"{item.get('item','Item')}: ${item.get('cost',0)}" for item in budget_items])
        impact_metrics = data.get('impact_metrics', {})

        if draft_type == 'grant':
            prompt = f"""
            Act as a professional grant writer. Write a Grant Application.
            **Project:** {project_title}
            **Description:** {description}
            **Target Funder:** {partner_name}
            **Budget:** {budget_summary}
            **Impact:** {impact_metrics}
            
            **Structure:**
            1. Executive Summary
            2. Problem Statement
            3. Methodology
            4. Budget Justification
            5. Monitoring & Evaluation
            """
        else: # Partnership
            prompt = f"""
            Act as a strategic partnership manager. Draft a Collaboration Proposal Email.
            **My Project:** {project_title}
            **Description:** {description}
            **Target Partner:** {partner_name}
            
            **Structure:**
            1. Professional Subject Line
            2. Warm Introduction (We admire your work in...)
            3. Value Proposition (Why collaborate?)
            4. Concrete Proposal
            5. Call to Action (Meeting request)
            """

        draft_text = generate_content_safe(prompt)
        return jsonify({'draft': draft_text})

    except Exception as e:
        print(f"LLM Error: {e}")
        return jsonify({'error': str(e)}), 500

# ==========================================
#       GRANTS & PROPOSALS CRUD
# ==========================================

@app.route('/api/grants/save', methods=['POST'])
def save_grant():
    try:
        data = request.json
        grant_id = data.get('_id')
        
        doc = {
            # ADD THESE FIELDS for filtering:
            'sender_id': data.get('sender_id'),      # CRITICAL for "My Grants" tab
            'recipient_id': data.get('partner_id'),  # CRITICAL for Partner's Inbox
            'recipient_name': data.get('partner_name'),
            
            'type': data.get('type', 'grant'),       # 'grant' or 'partnership'
            'title': data.get('title'),
            'content': data.get('content'),
            'status': data.get('status', 'Draft'),
            'budget_data': data.get('budget_data', []),
            'updated_at': datetime.now()
        }

        if not grant_id:
            doc['created_at'] = datetime.now()
            result = grants_col.insert_one(doc)
            return jsonify({'msg': 'Draft saved', 'id': str(result.inserted_id)})
        else:
            grants_col.update_one({'_id': ObjectId(grant_id)}, {'$set': doc})
            return jsonify({'msg': 'Draft updated', 'id': grant_id})

    except Exception as e:
        return jsonify({'error': str(e)}), 500@app.route('/api/grants/submit', methods=['POST'])
def submit_grant():
    try:
        data = request.json
        # If it's a new submission directly
        if '_id' not in data or not data['_id']:
             data['status'] = 'Submitted'
             data['created_at'] = datetime.now()
             data['submitted_at'] = datetime.now()
             result = grants_col.insert_one(data)
             return jsonify({'msg': 'Submitted successfully', 'id': str(result.inserted_id)})
        
        # Updating existing draft to submitted
        grants_col.update_one(
            {'_id': ObjectId(data['_id'])}, 
            {'$set': {'status': 'Submitted', 'submitted_at': datetime.now(), 'content': data.get('content')}}
        )
        return jsonify({'msg': 'Submitted successfully', 'id': data['_id']})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/submissions', methods=['GET'])
def get_submissions():
    """
    Fetch items with filtering for Tabs (Grants vs Proposals) and Users (Sent vs Received).
    Usage: /api/submissions?type=grant&user_id=123&view=sent
    """
    try:
        # Get query parameters
        doc_type = request.args.get('type') # 'grant' or 'partnership'
        user_id = request.args.get('user_id') 
        view = request.args.get('view', 'sent') # 'sent' or 'received'

        query = {}
        
        # 1. Filter by Type (Grant vs Proposal)
        if doc_type:
            query['type'] = doc_type
        
        # 2. Filter by User (Real-time security)
        if user_id:
            if view == 'received':
                # Show items SENT TO this user (Inbox)
                query['recipient_id'] = user_id
                query['status'] = 'Submitted' # Only show submitted items, not drafts
            else:
                # Show items CREATED BY this user (My Work)
                query['sender_id'] = user_id 

        # Fetch from 'grants' collection
        submissions = list(grants_col.find(query).sort('updated_at', -1))
        return jsonify([serialize_doc(p) for p in submissions])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==========================================
#          EXISTING ML ENDPOINTS
# ==========================================

@app.route('/api/predict_sdg', methods=['POST'])
def predict_sdg():
    data = request.json
    text = data.get('description', '')
    if 'sdg_clf' not in models: return jsonify([])
    try:
        vec_text = models['sdg_vec'].transform([text])
        probabilities = models['sdg_clf'].predict_proba(vec_text)[0]
        results = [(models['sdg_clf'].classes_[i], prob) for i, prob in enumerate(probabilities)]
        results.sort(key=lambda x: x[1], reverse=True)
        return jsonify([{'sdg': str(r[0]), 'confidence': float(r[1])} for r in results[:3]])
    except:
        return jsonify([])

@app.route('/api/predict_impact', methods=['POST'])
def predict_impact():
    data = request.json
    if 'status_pipeline' in models:
        try:
            ra_map = {"Low": 0, "Medium": 1, "High": 2}
            df_in = pd.DataFrame([{
                'milestones_completion_pct': float(data.get('milestones_pct', 0)),
                'time_elapsed_pct': float(data.get('time_elapsed_pct', 0)),
                'collaborators': int(data.get('collaborators', 1)),
                'resource_availability_code': ra_map.get(data.get('resource_availability', 'Medium'), 1),
                'budget_used_pct': float(data.get('budget_pct', 0)),
                'sdg_confidence_avg': 0.85
            }])
            df_in = add_derived_features(df_in)
            probs = models['status_pipeline'].predict_proba(df_in[MODEL_FEATURES].values)[0]
            pred_idx = np.argmax(probs)
            return jsonify({
                'status': models['label_encoder'].inverse_transform([pred_idx])[0],
                'confidence': round(float(probs[pred_idx]) * 100, 1)
            })
        except Exception as e:
            print(f"Impact Error: {e}")
    return jsonify({'status': "On Track", 'confidence': 85.0})

@app.route('/api/projects/<id>/recommendations', methods=['GET'])
def get_recommendations(id):
    try:
        project = projects_col.find_one({'_id': ObjectId(id)})
        if not project: return jsonify([])
        partners = list(users_col.find({}, {"password": 0}).limit(100))
        if 'sbert' in models and partners:
            proj_desc = project.get('description', '') + " " + project.get('title', '')
            proj_emb = models['sbert'].encode([proj_desc])
            partner_texts = [p.get('description', '') + " " + p.get('interests', '') for p in partners]
            partner_embs = models['sbert'].encode(partner_texts)
            sims = cosine_similarity(proj_emb, partner_embs)[0]
            for i, p in enumerate(partners):
                p['match_score'] = round(float(sims[i]) * 100, 1)
            partners.sort(key=lambda x: x['match_score'], reverse=True)
        return jsonify([serialize_doc(p) for p in partners[:5]])
    except Exception as e:
        return jsonify([])

@app.route('/api/projects', methods=['GET', 'POST'])
def handle_projects():
    if request.method == 'POST':
        data = request.json
        data['created_at'] = datetime.now()
        data['status'] = 'Planning'
        res = projects_col.insert_one(data)
        return jsonify({'msg': 'Saved', 'id': str(res.inserted_id)}), 201
    projects = list(projects_col.find().sort('created_at', -1))
    return jsonify([serialize_doc(p) for p in projects])

@app.route('/api/projects/<id>', methods=['GET', 'PUT'])
def handle_single_project(id):
    if request.method == 'PUT':
        projects_col.update_one({'_id': ObjectId(id)}, {'$set': request.json})
        return jsonify({'msg': 'Updated'})
    p = projects_col.find_one({'_id': ObjectId(id)})
    return jsonify(serialize_doc(p)) if p else (jsonify({'error': 'Not found'}), 404)

@app.route('/api/partners', methods=['GET'])
def get_partners():
    return jsonify([serialize_doc(p) for p in users_col.find({}, {'password': 0})])

@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify({
        'total': projects_col.count_documents({}), 
        'active': projects_col.count_documents({'status': 'Active'}),
        'partners': users_col.count_documents({}),
        'sdg_dist': [] 
    })

@app.route('/api/register', methods=['POST'])
def register():
    if users_col.find_one({"email": request.json['email']}):
        return jsonify({"error": "Exists"}), 400
    users_col.insert_one(request.json)
    return jsonify({"msg": "Registered"}), 201


# --- ADMIN ENDPOINTS ---

@app.route('/api/admin/stats', methods=['GET'])

def get_admin_stats():

    total_users = users_col.count_documents({})

    user_dist_pipeline = [{"$group": {"_id": "$role", "count": {"$sum": 1}}}]

    user_distribution = list(users_col.aggregate(user_dist_pipeline))

    formatted_dist = [{'name': d['_id'] or 'Unknown', 'value': d['count']} for d in user_distribution]

    total_projects = projects_col.count_documents({})

    active_projects = projects_col.count_documents({'status': 'Active'})

    ai_status = {

        'sdg_classifier': 'Active' if 'sdg_clf' in models else 'Offline',

        'status_predictor': 'Active' if 'status_pipeline' in models else 'Offline',

        'recommender': 'Active' if 'sbert' in models else 'Offline'

    }

    recent_projects = list(projects_col.find({}, {'title': 1, 'created_at': 1}).sort('created_at', -1).limit(5))

    return jsonify({

        'total_users': total_users,

        'user_distribution': formatted_dist,

        'total_projects': total_projects,

        'active_projects': active_projects,

        'ai_status': ai_status,

        'recent_activity': [serialize_doc(p) for p in recent_projects]

    })



if __name__ == '__main__':

    socketio.run(app, host='0.0.0.0', port=5000, debug=True)