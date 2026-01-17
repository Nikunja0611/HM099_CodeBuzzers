import os
import pickle
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from pymongo import MongoClient

# --- CONFIGURATION ---
app = Flask(__name__)
app.config['SECRET_KEY'] = 'impacthub_secret'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Database (MongoDB Local or Atlas)
client = MongoClient("mongodb://localhost:27017/")
db = client.impacthub_db

# --- LOAD AI MODELS ---
print("⏳ Loading AI Models...")
try:
    with open('models/sdg_classifier_real.pkl', 'rb') as f:
        tfidf, sdg_model = pickle.load(f)
    
    with open('models/impact_predictor_v2.pkl', 'rb') as f:
        impact_model = pickle.load(f)
    print("✅ Models Loaded Successfully!")
except Exception as e:
    print(f"⚠️ Warning: Models not found. AI features will run in mock mode. Error: {e}")
    sdg_model = None

# --- ROUTES ---

@app.route('/api/predict_sdg', methods=['POST'])
def predict_sdg():
    data = request.json
    text = data.get('description', '')
    
    if sdg_model:
        vec = tfidf.transform([text])
        pred = sdg_model.predict(vec)[0]
        conf = max(sdg_model.predict_proba(vec)[0])
        return jsonify({'sdg': str(pred), 'confidence': float(conf)})
    else:
        return jsonify({'sdg': 'SDG 6', 'confidence': 0.95}) # Mock if model missing

@app.route('/api/predict_impact', methods=['POST'])
def predict_impact():
    # Expects: { milestones_pct: 50, collaborators: 5, days_elapsed: 30 }
    data = request.json
    try:
        features = pd.DataFrame([[
            data.get('milestones_pct'),
            data.get('collaborators'),
            data.get('days_elapsed')
        ]], columns=['milestones_completed_pct', 'collaborators_count', 'days_elapsed'])
        
        pred = impact_model.predict(features)[0]
        return jsonify({'status': "🟢 On Track" if pred == 1 else "🔴 At Risk"})
    except:
        return jsonify({'status': "🟢 On Track"})

@app.route('/api/projects', methods=['GET', 'POST'])
def handle_projects():
    if request.method == 'POST':
        project = request.json
        db.projects.insert_one(project)
        return jsonify({'msg': 'Project Created'}), 201
    else:
        projects = list(db.projects.find({}, {'_id': 0}))
        return jsonify(projects)

# --- SOCKET.IO FOR CHAT ---
@socketio.on('connect')
def handle_connect():
    print('User connected to Chat')

@socketio.on('send_message')
def handle_message(data):
    # Broadcast message to all clients
    emit('receive_message', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, port=5000, debug=True)