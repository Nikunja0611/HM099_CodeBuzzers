import pymongo
import certifi
from datetime import datetime
from urllib.parse import quote_plus

# --- CONFIGURATION ---
# 1. Encode Credentials (SAME AS YOUR APP.PY)
username = quote_plus('sonawanenikunja_db_user')
password = quote_plus('#Nns@5643') 

# 2. Connection String
MONGO_URI = f"mongodb+srv://{username}:{password}@cluster0.fltqt43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

print("⏳ Connecting to MongoDB Atlas...")

try:
    client = pymongo.MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = client.impacthub_db
    users_col = db.users
    projects_col = db.projects
    
    # Test connection
    client.admin.command('ping')
    print("✅ Connected successfully!")
except Exception as e:
    print(f"❌ Connection failed: {e}")
    exit()

# --- DATA TO INSERT ---

# 1. REALISTIC PARTNERS (Users)
partners_data = [
    {
        "email": "contact@greenearth.org",
        "orgName": "Green Earth Foundation",
        "role": "NGO",
        "interests": "SDG 13",
        "location": "Mumbai, India",
        "password": "hashed_secret_password" # In real app, hash this!
    },
    {
        "email": "info@solartech.com",
        "orgName": "SolarTech Innovations",
        "role": "Startup",
        "interests": "SDG 7",
        "location": "Bangalore, India",
        "password": "hashed_secret_password"
    },
    {
        "email": "admin@ruraldev.gov.in",
        "orgName": "Ministry of Rural Development",
        "role": "Government",
        "interests": "SDG 1",
        "location": "New Delhi, India",
        "password": "hashed_secret_password"
    },
    {
        "email": "partners@edutech.io",
        "orgName": "EduTech Solutions",
        "role": "Startup",
        "interests": "SDG 4",
        "location": "Pune, India",
        "password": "hashed_secret_password"
    },
    {
        "email": "research@iitb.ac.in",
        "orgName": "IIT Bombay Climate Lab",
        "role": "Research",
        "interests": "SDG 13",
        "location": "Mumbai, India",
        "password": "hashed_secret_password"
    },
    {
        "email": "health@redcross.org",
        "orgName": "Red Cross India",
        "role": "NGO",
        "interests": "SDG 3",
        "location": "Delhi, India",
        "password": "hashed_secret_password"
    }
]

# 2. REALISTIC PROJECTS
projects_data = [
    {
        "title": "Solar Powered Schools in Rural Maharashtra",
        "description": "Installing solar panels in 50 village schools to ensure uninterrupted electricity for digital learning tools.",
        "sdg": "7",
        "status": "Active",
        "owner": "contact@greenearth.org",
        "impact_score": 85,
        "collaborators": 3,
        "created_at": datetime.now(),
        # ML Features
        "milestones_pct": 45,
        "time_elapsed_pct": 30,
        "resource_availability": "High",
        "budget_pct": 40,
        "milestones": [
            {"title": "Site Survey", "date": "2024-01-10", "completed": True},
            {"title": "Procurement", "date": "2024-02-15", "completed": True},
            {"title": "Installation Phase 1", "date": "2024-04-01", "completed": False}
        ]
    },
    {
        "title": "AI-Driven Crop Disease Detection",
        "description": "Mobile app for farmers to detect crop diseases early using image recognition, reducing crop loss by 30%.",
        "sdg": "2",
        "status": "Planning",
        "owner": "info@solartech.com",
        "impact_score": 92,
        "collaborators": 2,
        "created_at": datetime.now(),
        # ML Features
        "milestones_pct": 10,
        "time_elapsed_pct": 5,
        "resource_availability": "Medium",
        "budget_pct": 15,
        "milestones": [
            {"title": "Model Training", "date": "2024-05-20", "completed": False},
            {"title": "Field Testing", "date": "2024-08-10", "completed": False}
        ]
    },
    {
        "title": "Clean Water for Urban Slums",
        "description": "Setting up 20 community water ATMs providing purified water at nominal costs in Mumbai slums.",
        "sdg": "6",
        "status": "At Risk",
        "owner": "admin@ruraldev.gov.in",
        "impact_score": 65,
        "collaborators": 4,
        "created_at": datetime.now(),
        # ML Features
        "milestones_pct": 20,
        "time_elapsed_pct": 60, # High time elapsed, low progress = At Risk
        "resource_availability": "Low",
        "budget_pct": 70,       # High budget used = At Risk
        "milestones": [
            {"title": "Location Permits", "date": "2023-11-01", "completed": True},
            {"title": "Machine Installation", "date": "2024-01-15", "completed": False}
        ]
    },
    {
        "title": "Women Entrepreneurship Bootcamp",
        "description": "A 3-month intensive training program for 500 women to launch their own sustainable businesses.",
        "sdg": "5",
        "status": "Active",
        "owner": "partners@edutech.io",
        "impact_score": 78,
        "collaborators": 5,
        "created_at": datetime.now(),
        # ML Features
        "milestones_pct": 60,
        "time_elapsed_pct": 50,
        "resource_availability": "High",
        "budget_pct": 50,
        "milestones": [
            {"title": "Curriculum Design", "date": "2023-12-01", "completed": True},
            {"title": "Participant Selection", "date": "2024-02-01", "completed": True}
        ]
    }
]

# --- EXECUTION ---

print("🧹 Clearing old dummy data (optional)...")
# OPTIONAL: Uncomment if you want to wipe the DB clean before inserting
# users_col.delete_many({})
# projects_col.delete_many({})

print(f"🌱 Seeding {len(partners_data)} Partners...")
try:
    # Use insert_many for bulk speed, but wrap in try/catch to ignore duplicates if emails exist
    users_col.insert_many(partners_data)
except Exception as e:
    print(f"⚠️ Note: Some users might already exist.")

print(f"🌱 Seeding {len(projects_data)} Projects...")
projects_col.insert_many(projects_data)

print("\n🎉 DATABASE SEEDING COMPLETE!")
print("Go to your Dashboard to see the new data.")