import pymongo
from datetime import datetime, timedelta
from urllib.parse import quote_plus
import certifi
import random

# --- CONFIGURATION ---
username = quote_plus('sonawanenikunja_db_user')
password = quote_plus('#Nns@5643')
MONGO_URI = f"mongodb+srv://{username}:{password}@cluster0.fltqt43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# --- 1. EXTENSIVE TOPIC & DOMAIN ENGINE ---

DOMAINS = {
    "Healthcare": {
        "sdgs": ["SDG 3", "SDG 10"],
        "topics": [
            "Telemedicine", "Maternal Health", "Pediatrics", "Oncology", "Mental Health",
            "Nutrition", "Vaccination", "Genomics", "Prosthetics", "Medical Devices",
            "Pharma Supply Chain", "Rural Clinics", "Emergency Response", "Bio-hacking",
            "Stem Cells", "Public Hygiene", "Dental Care", "Eye Care", "Rehabilitation"
        ]
    },
    "Green Energy": {
        "sdgs": ["SDG 7", "SDG 13"],
        "topics": [
            "Solar PV", "Wind Turbines", "Geothermal", "Green Hydrogen", "Biofuels",
            "Tidal Energy", "Grid Storage", "Lithium Batteries", "Smart Grids",
            "Carbon Capture", "Energy Efficiency", "LED Lighting", "Offshore Wind",
            "Micro-hydro", "Concentrated Solar", "Thermal Storage", "EV Charging"
        ]
    },
    "Technology": {
        "sdgs": ["SDG 9", "SDG 8"],
        "topics": [
            "AI/ML", "Blockchain", "IoT", "Big Data", "Cybersecurity", "Cloud Computing",
            "Edge Computing", "5G Networks", "Quantum Computing", "Robotics", "Drones",
            "3D Printing", "Semiconductors", "Nanotech", "Biometrics", "Fintech", "GovTech"
        ]
    },
    "Agriculture": {
        "sdgs": ["SDG 2", "SDG 12"],
        "topics": [
            "Organic Farming", "Hydroponics", "Vertical Farming", "Permaculture",
            "Drip Irrigation", "Soil Health", "Agroforestry", "Precision Ag",
            "Drone Spraying", "Seed Banks", "Livestock Mgmt", "Aquaculture", "Fisheries",
            "Beekeeping", "Food Security", "Cold Chain", "Farm-to-Table"
        ]
    },
    "Education": {
        "sdgs": ["SDG 4", "SDG 5"],
        "topics": [
            "K-12 Ed", "Higher Ed", "Vocational Training", "STEM", "Coding Bootcamps",
            "EdTech", "Special Needs Ed", "Adult Literacy", "Early Childhood",
            "Teacher Training", "Scholarships", "Distance Learning", "Gamification"
        ]
    },
    "Water & Sanitation": {
        "sdgs": ["SDG 6", "SDG 14"],
        "topics": [
            "Water Filtration", "Desalination", "Rainwater Harvest", "Sewage Treatment",
            "Ocean Cleanup", "Sanitation Facilities", "Watershed Mgmt", "Flood Control"
        ]
    },
    "Social Impact": {
        "sdgs": ["SDG 1", "SDG 5", "SDG 16"],
        "topics": [
            "Gender Equality", "Refugee Aid", "Legal Aid", "Human Rights", "Anti-Trafficking",
            "Child Protection", "Prison Reform", "Disability Rights", "Labor Unions",
            "Fair Trade", "Social Housing", "Homelessness", "Disaster Relief"
        ]
    },
    "Infrastructure": {
        "sdgs": ["SDG 9", "SDG 11"],
        "topics": [
            "Smart Cities", "Green Building", "Affordable Housing", "Public Transport",
            "Urban Planning", "Civil Engineering", "Sustainable Materials", "Logistics"
        ]
    }
}

# Global Locations for Partners (Mixed)
LOCATIONS = [
    "Mumbai, India", "Delhi, India", "Bangalore, India", "New York, USA", "London, UK",
    "Nairobi, Kenya", "Lagos, Nigeria", "Berlin, Germany", "Singapore", "Sydney, Australia",
    "Toronto, Canada", "Paris, France", "Tokyo, Japan", "Sao Paulo, Brazil", "Dubai, UAE",
    "Jakarta, Indonesia", "Seoul, South Korea", "Mexico City, Mexico", "Cape Town, South Africa",
    "Pune, India", "Hyderabad, India", "Chennai, India", "Kolkata, India", "Ahmedabad, India"
]

# --- NEW: Specific Indian Locations for Projects ---
# We use this list specifically for generating the "Flagship Projects" 
# so you can test location matching effectively.
INDIAN_LOCATIONS = [
    "Mumbai, India", "Delhi, India", "Bangalore, India", "Pune, India",
    "Hyderabad, India", "Chennai, India", "Kolkata, India", "Ahmedabad, India",
    "Jaipur, India", "Surat, India", "Lucknow, India", "Kanpur, India",
    "Nagpur, India", "Indore, India", "Thane, India", "Bhopal, India",
    "Visakhapatnam, India", "Pimpri-Chinchwad, India", "Patna, India", "Vadodara, India",
    "Nashik, India", "Gurgaon, India", "Noida, India", "Coimbatore, India"
]

ROLES = ["Startup", "NGO", "Government", "Corporate"]
ROLE_WEIGHTS = [0.4, 0.3, 0.15, 0.15] # 40% Startups, 30% NGOs

PREFIXES = ["Global", "National", "Eco", "Smart", "Future", "Community", "Bright", "Hope", "Impact", "Next", "Pro", "Ultra", "Max", "Prime", "Zen", "Blue", "Red", "Green", "Urban", "Rural", "Open", "Civic"]
ROOTS = ["Tech", "Health", "Agri", "Edu", "Water", "Power", "Gen", "Sys", "Net", "Link", "Core", "Base", "Hub", "Lab", "Works", "Flow", "Mind", "Life", "Earth", "Sky", "Grid", "Trust"]
SUFFIXES = ["Foundation", "Institute", "Group", "Solutions", "Technologies", "Corp", "Ltd", "Partners", "Alliance", "Network", "Ventures", "Systems", "Labs", "Center", "Trust", "Collective", "Union"]

def generate_partner(i):
    # 1. Pick Domain & Topic
    domain_name = random.choice(list(DOMAINS.keys()))
    domain_data = DOMAINS[domain_name]
    topic = random.choice(domain_data["topics"])
    
    # 2. Assign Role
    role = random.choices(ROLES, weights=ROLE_WEIGHTS, k=1)[0]
    
    # 3. Generate Name
    name = f"{random.choice(PREFIXES)} {topic.split(' ')[0]} {random.choice(SUFFIXES)}"
    if random.random() > 0.8:
        name = f"{random.choice(PREFIXES)}{random.choice(ROOTS)} {random.choice(SUFFIXES)}"
    
    # 4. Generate Description (Semantic for AI)
    templates = [
        "Specializing in {topic} to drive sustainable {domain} outcomes.",
        "A {role} dedicated to advancing {topic} through innovation.",
        "Providing {topic} resources and expertise for collaborative projects.",
        "Leading the way in {topic} with a focus on {domain} impact.",
        "Connecting stakeholders to improve {topic} accessibility."
    ]
    description = random.choice(templates).format(topic=topic, domain=domain_name, role=role)
    
    # 5. Assign SDGs (Domain defaults + random extra)
    sdgs = domain_data["sdgs"][:]
    if random.random() > 0.6:
        sdgs.append(f"SDG {random.randint(1,17)}")
    
    # 6. Generate Skills
    skills = [topic, domain_name, "Project Mgmt", "Collaboration"]
    
    return {
        "orgName": f"{name} {i}",
        "email": f"contact_{i}_{random.randint(10000,99999)}@impact.org",
        "role": role,
        "location": random.choice(LOCATIONS), # Partners can be from anywhere (including India)
        "interests": ", ".join(list(set(sdgs))), # Format: "SDG 1, SDG 4"
        "description": description,
        "skills": ", ".join(skills)
    }

# --- 2. FLAGSHIP PROJECTS (Updated with Indian Context) ---
PROJECT_TEMPLATES = [
    {"fmt": "Solar Power for {loc} Schools", "topic": "Solar PV", "sdg": ["7", "4"]},
    {"fmt": "Clean Water Access in {loc} Slums", "topic": "Water Filtration", "sdg": ["6", "3"]},
    {"fmt": "AI-Driven Healthcare in {loc}", "topic": "AI/ML", "sdg": ["3", "9"]},
    {"fmt": "Sustainable Farming in {loc} Districts", "topic": "Organic Farming", "sdg": ["2", "12"]},
    {"fmt": "Women's Coding Bootcamp {loc}", "topic": "Coding Bootcamps", "sdg": ["5", "4"]},
    {"fmt": "Smart Traffic Mgmt in {loc}", "topic": "Smart Cities", "sdg": ["11", "9"]},
    {"fmt": "Rural Telemedicine Network near {loc}", "topic": "Telemedicine", "sdg": ["3", "10"]},
    {"fmt": "Green Housing Initiative {loc}", "topic": "Green Building", "sdg": ["11", "13"]},
    {"fmt": "River Cleanup Drive in {loc}", "topic": "Water Conservation", "sdg": ["14", "6"]},
    {"fmt": "Youth Vocational Training {loc}", "topic": "Skill Development", "sdg": ["8", "4"]},
    {"fmt": "Digital Literacy for {loc} Villages", "topic": "EdTech", "sdg": ["4", "10"]},
    {"fmt": "{loc} Community Health Centers", "topic": "Public Health", "sdg": ["3", "11"]}
]

def generate_projects():
    projects = []
    # Generate 50 projects (High quality, mostly Indian locations)
    for i in range(50):
        tmpl = random.choice(PROJECT_TEMPLATES)
        
        # USE INDIAN LOCATIONS FOR PROJECTS
        loc = random.choice(INDIAN_LOCATIONS).split(",")[0] # Just City name (e.g. "Pune")
        
        # Create Score Map
        sdg_scores = {s: random.randint(85, 99) for s in tmpl["sdg"]}
        
        project = {
            "title": tmpl["fmt"].format(loc=loc),
            "description": f"A comprehensive project focused on {tmpl['topic']} to improve lives in {loc} and surrounding regions.",
            "status": "Active",
            "sdg": tmpl["sdg"],
            "owner": "admin@impacthub.com",
            "location": f"{loc}, India", # Explicitly adding the country for better matching
            "collaborators": random.randint(1, 5),
            "resource_availability": random.choice(["Medium", "High"]),
            "budget_pct": random.randint(10, 80),
            "milestones_pct": random.random(),
            "time_elapsed_pct": random.random(),
            "impact_score": 85 + random.randint(-10, 10),
            "confidence": 95,
            "sdg_scores": sdg_scores,
            "created_at": datetime.now() - timedelta(days=random.randint(1, 60)),
            "milestones": [
                {"title": "Planning Phase", "date": "2024-01-01", "completed": True},
                {"title": "Implementation", "date": "2024-06-01", "completed": False}
            ]
        }
        projects.append(project)
    return projects

def seed_10k_db():
    try:
        print("⏳ Connecting to MongoDB Atlas...")
        client = pymongo.MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        db = client.impacthub_db
        
        # 1. Clean Data
        print("🧹 Clearing old data (Full Reset)...")
        db.users.delete_many({})
        db.projects.delete_many({})

        # 2. Generate 10,000+ Partners
        print("🌱 Generating 10,500 Partners across 500+ topics...")
        partners_to_insert = []
        BATCH_SIZE = 2000
        
        for i in range(10500):
            partners_to_insert.append(generate_partner(i))
            
            # Batch Insert to prevent timeout
            if len(partners_to_insert) >= BATCH_SIZE:
                db.users.insert_many(partners_to_insert)
                print(f"   ...inserted batch of {BATCH_SIZE} (Total: {i+1})")
                partners_to_insert = [] # Reset batch
        
        # Insert remaining
        if partners_to_insert:
            db.users.insert_many(partners_to_insert)
            print(f"   ...inserted final batch of {len(partners_to_insert)}")

        print("✅ Successfully seeded 10,500 Partners.")

        # 3. Seed Projects
        print("🚀 Seeding 50 Indian Location-Specific Projects...")
        projects = generate_projects()
        db.projects.insert_many(projects)
        print(f"✅ Successfully seeded {len(projects)} Projects.")
        
        print("\n🎉 MASSIVE SEED COMPLETE! Your platform is populated.")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")

if __name__ == "__main__":
    seed_10k_db()