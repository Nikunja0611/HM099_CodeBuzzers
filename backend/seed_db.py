import os
import pymongo
from datetime import datetime, timedelta
from urllib.parse import quote_plus
import certifi
import random

# --- CONFIGURATION ---
# Using the credentials from your app.py
username = quote_plus('sonawanenikunja_db_user')
password = quote_plus('#Nns@5643')
MONGO_URI = f"mongodb+srv://{username}:{password}@cluster0.fltqt43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

def seed_database():
    try:
        # 1. Connect
        print("⏳ Connecting to MongoDB Atlas...")
        client = pymongo.MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        db = client.impacthub_db
        
        # 2. Clear existing collections
        print("🧹 Clearing old data...")
        db.users.delete_many({})
        db.projects.delete_many({})
        
        # ==========================================
        #              SEED PARTNERS
        # ==========================================
        print("🌱 Seeding Partners (Startups, NGOs, Government)...")
        
        partners = [
            {
                "orgName": "Green Earth Foundation",
                "email": "contact@greenearth.org",
                "role": "NGO",
                "location": "Mumbai, India",
                "interests": "SDG 13, SDG 15, SDG 6",
                "description": "Leading NGO focused on climate action, reforestation, and biodiversity conservation in South Asia.",
                "skills": "Climate Research, Community Outreach, Policy Advocacy, Reforestation"
            },
            {
                "orgName": "SolarTech Innovations",
                "email": "hello@solartech.io",
                "role": "Startup",
                "location": "Bangalore, India",
                "interests": "SDG 7, SDG 9, SDG 11",
                "description": "A deep-tech startup developing affordable, portable solar grids for rural electrification.",
                "skills": "Renewable Energy, Hardware Engineering, IoT, Smart Grids"
            },
            {
                "orgName": "Ministry of Rural Development",
                "email": "info@rural.gov.in",
                "role": "Government",
                "location": "New Delhi, India",
                "interests": "SDG 1, SDG 2, SDG 6",
                "description": "Government body focused on poverty alleviation, rural infrastructure, and sanitation.",
                "skills": "Policy Implementation, Funding Allocation, Infrastructure, Public Health"
            },
            {
                "orgName": "EduTech Solutions",
                "email": "partners@edutech.com",
                "role": "Startup",
                "location": "Pune, India",
                "interests": "SDG 4, SDG 5, SDG 10",
                "description": "Building AI-driven learning platforms to bridge the digital divide for underprivileged children.",
                "skills": "AI/ML, Mobile Development, Curriculum Design, Digital Literacy"
            },
            {
                "orgName": "WaterAid India",
                "email": "support@wateraid.in",
                "role": "NGO",
                "location": "Hyderabad, India",
                "interests": "SDG 6, SDG 3",
                "description": "Ensuring clean water, decent toilets, and good hygiene for everyone, everywhere.",
                "skills": "Water Management, Sanitation, Hygiene Education, Field Research"
            },
            {
                "orgName": "AgriGrowth Tech",
                "email": "biz@agrigrowth.com",
                "role": "Startup",
                "location": "Chennai, India",
                "interests": "SDG 2, SDG 8, SDG 12",
                "description": "Agri-tech startup focusing on supply chain efficiency and fair trade for farmers using Blockchain.",
                "skills": "Supply Chain, Agriculture, Export/Import, Sustainability Reporting"
            },
            {
                "orgName": "HealthForall",
                "email": "contact@healthforall.org",
                "role": "NGO",
                "location": "Kolkata, India",
                "interests": "SDG 3, SDG 5",
                "description": "Providing mobile clinics and maternal healthcare in remote villages.",
                "skills": "Healthcare Services, Medical Training, Emergency Response"
            },
            {
                "orgName": "Ocean Blue Initiative",
                "email": "save@oceanblue.org",
                "role": "NGO",
                "location": "Goa, India",
                "interests": "SDG 14, SDG 12",
                "description": "Dedicated to cleaning coastal areas and reducing marine plastic pollution.",
                "skills": "Waste Management, Marine Biology, Volunteer Management"
            },
            {
                "orgName": "FinInclude",
                "email": "info@fininclude.io",
                "role": "Startup",
                "location": "Mumbai, India",
                "interests": "SDG 1, SDG 8, SDG 5",
                "description": "Fintech platform providing micro-loans to women entrepreneurs in rural areas.",
                "skills": "Fintech, Microfinance, Blockchain, Economic Empowerment"
            },
            {
                "orgName": "UrbanSmart City Dept",
                "email": "planning@urbansmart.gov",
                "role": "Government",
                "location": "Ahmedabad, India",
                "interests": "SDG 11, SDG 7",
                "description": "Municipal initiative for smart traffic management and green urban spaces.",
                "skills": "Urban Planning, IoT, Public Transport, Waste Management"
            }
        ]
        
        db.users.insert_many(partners)
        print(f"✅ Inserted {len(partners)} Partners.")

        # ==========================================
        #              SEED PROJECTS
        # ==========================================
        print("🌱 Seeding Projects...")
        
        projects = [
            {
                "title": "Clean Water Initiative for Rural Maharashtra",
                "description": "Implementing sustainable water purification systems in 50 villages across Maharashtra using solar-powered filtration technology to ensure safe drinking water and reduce waterborne diseases.",
                "owner": "support@wateraid.in",
                "status": "Active",
                "sdg": ["6", "3", "7"],  # Clean Water, Health, Energy
                "collaborators": 3,
                "resource_availability": "High",
                "budget_pct": 45,
                "milestones_pct": 0.5, # 50%
                "time_elapsed_pct": 0.3,
                "impact_score": 88,
                "confidence": 0.95,
                "created_at": datetime.now() - timedelta(days=60),
                "milestones": [
                    {"title": "Site Assessment Complete", "date": "2025-11-01", "completed": True},
                    {"title": "Vendor Selection", "date": "2025-12-15", "completed": True},
                    {"title": "Installation Phase 1", "date": "2026-02-01", "completed": False},
                    {"title": "Community Training", "date": "2026-03-01", "completed": False}
                ]
            },
            {
                "title": "AI-Powered Learning Platform for Girls",
                "description": "Developing a mobile-first learning platform with AI tutoring to improve education access for girls in underserved areas.",
                "owner": "partners@edutech.com",
                "status": "Active",
                "sdg": ["4", "5", "10"], # Quality Ed, Gender Eq, Reduced Ineq
                "collaborators": 2,
                "resource_availability": "Medium",
                "budget_pct": 20,
                "milestones_pct": 0.25,
                "time_elapsed_pct": 0.1,
                "impact_score": 92,
                "confidence": 0.89,
                "created_at": datetime.now() - timedelta(days=15),
                "milestones": [
                    {"title": "App Prototype Design", "date": "2026-01-10", "completed": True},
                    {"title": "Content Curation", "date": "2026-02-20", "completed": False},
                    {"title": "Pilot Launch in 5 Schools", "date": "2026-04-01", "completed": False},
                    {"title": "Feedback & Iteration", "date": "2026-05-15", "completed": False}
                ]
            },
            {
                "title": "Climate-Smart Agriculture Program",
                "description": "Training farmers in drought-prone regions on climate-resilient farming techniques and providing them with drought-resistant seeds.",
                "owner": "biz@agrigrowth.com",
                "status": "At Risk",
                "sdg": ["13", "2", "15"], # Climate Action, Zero Hunger, Life on Land
                "collaborators": 1,
                "resource_availability": "Low",
                "budget_pct": 70,
                "milestones_pct": 0.6,
                "time_elapsed_pct": 0.8, # Time running out vs milestones
                "impact_score": 65,
                "confidence": 0.78,
                "created_at": datetime.now() - timedelta(days=120),
                "milestones": [
                    {"title": "Farmer Enrollment", "date": "2025-09-01", "completed": True},
                    {"title": "Seed Distribution", "date": "2025-10-15", "completed": True},
                    {"title": "Training Workshops", "date": "2025-11-20", "completed": True},
                    {"title": "Harvest Yield Analysis", "date": "2026-03-01", "completed": False},
                    {"title": "Market Linkage Setup", "date": "2026-04-01", "completed": False}
                ]
            },
            {
                "title": "Solar Micro-Grids for Remote Health Centers",
                "description": "Deploying off-grid solar solutions to power health centers in remote locations, ensuring 24/7 electricity for vaccine storage.",
                "owner": "hello@solartech.io",
                "status": "Planning",
                "sdg": ["7", "3", "9"], # Energy, Health, Innovation
                "collaborators": 4,
                "resource_availability": "Medium",
                "budget_pct": 5,
                "milestones_pct": 0.0,
                "time_elapsed_pct": 0.0,
                "impact_score": 85,
                "confidence": 0.92,
                "created_at": datetime.now() - timedelta(days=5),
                "milestones": [
                    {"title": "Feasibility Study", "date": "2026-02-01", "completed": False},
                    {"title": "Procurement of Solar Panels", "date": "2026-03-15", "completed": False},
                    {"title": "Installation at Pilot Site", "date": "2026-05-01", "completed": False}
                ]
            },
            {
                "title": "Urban Waste-to-Energy Project",
                "description": "Setting up a decentralized waste management unit that converts organic municipal waste into biogas for local cooking fuel.",
                "owner": "planning@urbansmart.gov",
                "status": "Active",
                "sdg": ["11", "12", "7"], # Cities, Consumption, Energy
                "collaborators": 5,
                "resource_availability": "High",
                "budget_pct": 30,
                "milestones_pct": 0.4,
                "time_elapsed_pct": 0.4,
                "impact_score": 79,
                "confidence": 0.85,
                "created_at": datetime.now() - timedelta(days=90),
                "milestones": [
                    {"title": "Land Acquisition", "date": "2025-10-01", "completed": True},
                    {"title": "Equipment Import", "date": "2025-12-01", "completed": True},
                    {"title": "Operational Testing", "date": "2026-02-15", "completed": False},
                    {"title": "Full Scale Launch", "date": "2026-04-01", "completed": False}
                ]
            },
            {
                "title": "Women in Tech Mentorship Program",
                "description": "Connecting female engineering students with industry leaders for mentorship, career guidance, and technical skill development.",
                "owner": "partners@edutech.com",
                "status": "Completed",
                "sdg": ["5", "4", "8"], # Gender Eq, Education, Decent Work
                "collaborators": 10,
                "resource_availability": "High",
                "budget_pct": 95,
                "milestones_pct": 1.0,
                "time_elapsed_pct": 1.0,
                "impact_score": 98,
                "confidence": 0.99,
                "created_at": datetime.now() - timedelta(days=200),
                "milestones": [
                    {"title": "Mentor Recruitment", "date": "2025-06-01", "completed": True},
                    {"title": "Student Applications", "date": "2025-07-01", "completed": True},
                    {"title": "Program Kickoff", "date": "2025-08-01", "completed": True},
                    {"title": "Final Showcase", "date": "2025-12-01", "completed": True}
                ]
            }
        ]
        
        db.projects.insert_many(projects)
        print(f"✅ Inserted {len(projects)} Projects.")
        
        print("\n🎉 Database Seeded Successfully!")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")

if __name__ == "__main__":
    seed_database()