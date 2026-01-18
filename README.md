
# 🌍 AI-Powered SDG Collaboration & Impact Platform

![AI](https://img.shields.io/badge/AI-ML-blue)
![NLP](https://img.shields.io/badge/NLP-TF--IDF-green)
![Backend](https://img.shields.io/badge/Backend-FastAPI-teal)
![Frontend](https://img.shields.io/badge/Frontend-React-blue)
![Status](https://img.shields.io/badge/Status-Prototype-orange)

An AI-driven collaboration platform that connects NGOs, startups, governments, and researchers working on the United Nations Sustainable Development Goals (SDGs).  
The system uses Natural Language Processing (NLP) and Machine Learning (ML) to automatically classify projects, recommend collaboration partners, and provide transparent SDG-aligned insights.

---

## 🚩 Problem Statement

Organizations contributing to SDGs currently work in silos, leading to:
- Difficulty in discovering suitable collaboration partners
- Manual and inconsistent SDG classification
- Lack of intelligent decision-support systems
- Poor transparency in SDG progress tracking

There is no unified platform that combines AI-driven collaboration, SDG mapping, and analytics in one system.

---

## 💡 Proposed Solution

This project introduces an AI-powered SDG Collaboration & Impact Platform that:
- Automatically classifies projects into relevant SDGs using NLP
- Recommends ideal partners using ML-based similarity scoring
- Provides role-based dashboards for organizations and admins
- Enables data-driven collaboration and SDG transparency

AI is the core engine of the system.

---

## 👥 User Roles

### Organization User
- NGOs
- Startups
- Government bodies
- Researchers

### Admin
- Platform analytics
- SDG-wise project monitoring
- User and project moderation

---

## ⚙️ Key Features

### Organization Dashboard
- Organization profile creation
- Project creation with description
- AI-based SDG auto-classification
- ML-based partner recommendations
- Project summary and status tracking
- SDG impact visualization

### Admin Dashboard
- Platform-wide analytics
- SDG-wise project distribution
- Organization and project overview

---

## 🧠 AI / ML Implementation

### 1️⃣ SDG Auto-Classification (NLP)
- Input: Project title and description
- Technique: TF-IDF vectorization (bi-grams)
- Model: Logistic Regression (Multinomial)
- Output: SDG labels with confidence scores

### 2️⃣ Partner Recommendation Engine (ML)
- Content-based recommendation system
- TF-IDF + Cosine Similarity
- Output: Ranked partner list with match percentage and explanation

### 3️⃣ Impact Prediction (Future Scope)
- Predicts project status: On Track / Delayed / At Risk
- Planned using milestone and collaboration data

---

## 🏗️ System Architecture


---

## 🔄 User Flow

### Organization User
1. Register and login
2. Create organization profile
3. Create project
4. AI auto-classifies SDGs
5. View partner recommendations
6. Track project summary and impact

### Admin
1. Login
2. View analytics dashboard
3. Monitor SDG-wise distribution

---

## 🧰 Technology Stack

**Frontend:** React.js, Firebase Auth, Chart.js  
**Backend:** FastAPI / Flask, REST APIs  
**AI/ML:** Python, Scikit-learn, TF-IDF, Cosine Similarity  
**Database:** MongoDB / PostgreSQL  
**Deployment:** Vercel, Render / Railway

---

## 📁 Project Structure

sdg-collab-platform/
│
├── frontend/
├── backend/
│ ├── ml/
│ │ ├── sdg_classifier.py
│ │ ├── recommender.py
│ │ └── impact_predictor.py
│ ├── data/
│ └── main.py
│
├── README.md
└── .gitignore

---

## 📊 Dataset Strategy
- OSDG Community Dataset (open-source)
- UN SDG descriptions
- Synthetic project and organization data

---

## 🚀 Conclusion

This platform demonstrates a viable, explainable, and scalable AI solution for SDG collaboration, combining real ML models with strong social impact and clear system design.

---

## 📜 License
Educational and hackathon use only.
