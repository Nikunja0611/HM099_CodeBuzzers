<div align="center">
```html
<img src="./frontend/src/logo.svg" alt="ImpactHub Logo" width="120" height="120" />

# 🌍 ImpactHub
### AI-Powered SDG Collaboration Ecosystem

<p>
    <b>Connect. Collaborate. Accelerate.</b><br>
    Bridging the gap between NGOs, Startups, and Governments to achieve the UN Sustainable Development Goals using Artificial Intelligence.
</p>

<p>
    <a href="https://reactjs.org/">
        <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Tailwind-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    </a>
    <a href="https://flask.palletsprojects.com/">
        <img src="https://img.shields.io/badge/Backend-Flask%20API-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
    </a>
    <a href="https://scikit-learn.org/">
        <img src="https://img.shields.io/badge/AI-Scikit__Learn_%7C_BERT-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" alt="AI" />
    </a>
    <a href="https://www.mongodb.com/">
        <img src="https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    </a>
</p>

<p>
    <a href="#-key-features">Key Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-ai-architecture">AI Models</a> •
    <a href="#-setup--installation">Setup</a> •
    <a href="#-deployment">Deployment</a>
</p>
```
</div>

---

## 📸 Project Screenshots

| **Smart Dashboard** | **Project Details & AI Insights** |
|:---:|:---:|
| <img src="https://via.placeholder.com/600x350/f3f4f6/000000?text=Dashboard+Screenshot" alt="Dashboard" width="100%"> | <img src="https://via.placeholder.com/600x350/f3f4f6/000000?text=Project+Details+Screenshot" alt="Project Details" width="100%"> |
| *Real-time analytics & SDG distribution* | *AI Status Forecast & Impact Score* |

---

## 🚩 Problem Statement

Organizations working on **Sustainable Development Goals (SDGs)** often operate in silos, leading to:
* ❌ **Discovery Gap:** Finding the right partner takes months of manual searching.
* ❌ **Data Fragmentation:** No unified standard for tracking SDG alignment.
* ❌ **Predictive Blindness:** Projects fail due to lack of early warning systems regarding resource/budget risks.

---

## 💡 The Solution: ImpactHub

We built a unified platform that combines **Semantic Search**, **Predictive Analytics**, and **Dynamic Visualizations** to foster smarter collaboration.

### ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🤖 AI Auto-Classification** | Automatically tags projects with relevant SDGs (e.g., "Goal 6: Clean Water") using NLP. |
| **🔮 Impact Predictor** | Forecasts if a project is **"On Track"** or **"At Risk"** based on milestones, budget, and team size. |
| **🤝 Smart Partner Matching** | Recommends partners based on **semantic similarity** of skills and past project history. |
| **📊 Interactive Dashboards** | Visualizes global SDG efforts vs. individual organization performance using **Recharts**. |
| **⚡ Real-time Collaboration** | Milestone tracking, resource management, and secure partner connection requests. |

---

## 🧠 AI / ML Architecture

The platform is powered by **three distinct AI models**:

### 1️⃣ SDG Classifier (NLP)
* **Task:** Multi-label classification of project descriptions into 17 SDG categories.
* **Tech:** `TF-IDF Vectorization` + `Logistic Regression`.
* **Performance:** 92% Accuracy on OSDG Community Dataset.

### 2️⃣ Impact Predictor (Structured ML)
* **Task:** Predict project health status.
* **Input Features:** Budget %, Milestones %, Resource Availability (Low/Med/High).
* **Tech:** `Scikit-Learn Classifier`.
* **Output:** Impact Score (0-100) & Risk Status.

### 3️⃣ Partner Recommender (Semantic Search)
* **Task:** Find organizations with complementary skills.
* **Tech:** `Sentence-Transformers` (BERT-based embeddings) + `K-Nearest Neighbors`.
* **Fallback:** Content-based filtering via MongoDB Aggregation.

---

## 🛠 Tech Stack

| Component | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Lucide Icons, Recharts, Firebase Auth |
| **Backend** | Python, Flask, PyMongo, RESTful API |
| **AI / ML** | Scikit-Learn, Pandas, Sentence-Transformers, NumPy |
| **Database** | MongoDB Atlas (Cloud NoSQL) |
| **DevOps** | Vercel (Frontend), Render (Backend) |

---

## 🚀 Setup & Installation

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/impacthub.git](https://github.com/your-username/impacthub.git)
cd impacthub