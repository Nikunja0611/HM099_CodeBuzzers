import os
import pickle
import pandas as pd
import numpy as np
import certifi  # <--- REQUIRED FOR ATLAS SSL
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
## 1. ENCODE YOUR CREDENTIALS
# This converts symbols like '@' and '#' into safe text (e.g. %40, %23)
username = quote_plus('sonawanenikunja_db_user')
password = quote_plus('#Nns@5643') 

# 2. CONSTRUCT THE SECURE URI
MONGO_URI = f"mongodb+srv://{username}:{password}@cluster0.fltqt43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
try:
    # tlsCAFile=certifi.where() is CRITICAL for cloud connections to avoid SSL errors
    client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = client.impacthub_db
    projects_col = db.projects
    users_col = db.users
    # Test connection immediately
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
        
    print("✅ All AI Models Loaded Successfully!")
except Exception as e:
    print(f"⚠️ Warning: Could not load models. using Mock AI. Error: {e}")

# --- HELPER FUNCTIONS ---
def serialize_doc(doc):
    """Convert MongoDB ObjectId to string for JSON"""
    doc['_id'] = str(doc['_id'])
    return doc

# --- AI ENDPOINTS ---

@app.route('/api/predict_sdg', methods=['POST'])
def predict_sdg():
    data = request.json
    text = data.get('description', '')
    
    if 'sdg' in models:
        vec = models['tfidf'].transform([text])
        pred = models['sdg'].predict(vec)[0]
        conf = max(models['sdg'].predict_proba(vec)[0])
        return jsonify({'sdg': str(pred), 'confidence': float(conf)})
    else:
        return jsonify({'sdg': '6', 'confidence': 0.95}) # Mock

@app.route('/api/predict_impact', methods=['POST'])
def predict_impact():
    data = request.json
    if 'impact' in models:
        features = pd.DataFrame([[
            data.get('milestones_pct', 0),
            data.get('collaborators', 1),
            data.get('days_elapsed', 10)
        ]], columns=['milestones_completed_pct', 'collaborators_count', 'days_elapsed'])
        
        pred = models['impact'].predict(features)[0]
        status = "On Track" if pred == 1 else "At Risk"
        return jsonify({'status': status})
    return jsonify({'status': "On Track"})

# --- PROJECT ENDPOINTS ---

@app.route('/api/projects', methods=['GET', 'POST'])
def handle_projects():
    if request.method == 'POST':
        project_data = request.json
        project_data['created_at'] = datetime.now()
        project_data['status'] = 'Planning'
        project_data['impact_score'] = min(95, len(project_data.get('description', '')) // 5)
        
        result = projects_col.insert_one(project_data)
        return jsonify({'msg': 'Project Saved', 'id': str(result.inserted_id)}), 201

    else:
        # Fetch all projects
        projects = list(projects_col.find().sort('created_at', -1))
        return jsonify([serialize_doc(p) for p in projects])

@app.route('/api/projects/<id>', methods=['GET'])
def get_project(id):
    try:
        project = projects_col.find_one({'_id': ObjectId(id)})
        if project:
            return jsonify(serialize_doc(project))
        return jsonify({'error': 'Not found'}), 404
    except:
        return jsonify({'error': 'Invalid ID'}), 400

@app.route('/api/stats', methods=['GET'])
def get_stats():
    total = projects_col.count_documents({})
    active = projects_col.count_documents({'status': 'Active'})
    
    pipeline = [{"$group": {"_id": "$sdg", "count": {"$sum": 1}}}]
    sdg_dist = list(projects_col.aggregate(pipeline))
    
    return jsonify({
        'total': total,
        'active': active,
        'partners': 12, # Mock
        'sdg_dist': sdg_dist
    })

# --- SOCKET IO ---
@socketio.on('send_message')
def handle_message(data):
    emit('receive_message', data, broadcast=True)

if __name__ == '__main__':
    # Use 0.0.0.0 to make it accessible if you deploy later
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)