"""
LifeLink Database Initializer and Schema Executor
Supports SQLite (Local zero-config) and PostgreSQL.
"""

import sqlite3
import os
import json

DB_FILE = os.path.join(os.path.dirname(__file__), "lifelink_local.db")

def init_local_database():
    print(f"[LifeLink DB] Initializing local database at {DB_FILE}...")
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # 1. Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT UNIQUE,
        role TEXT NOT NULL DEFAULT 'PATIENT',
        avatar_url TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Patient Profiles
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patient_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        age INTEGER,
        gender TEXT,
        blood_group TEXT,
        allergies TEXT,
        chronic_conditions TEXT,
        previous_surgeries TEXT,
        current_medications TEXT,
        insurance_provider TEXT,
        insurance_policy_number TEXT,
        consent_emergency_data_share INTEGER DEFAULT 1,
        consent_ai_triage INTEGER DEFAULT 1
    );
    """)

    # 3. Hospitals
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS hospitals (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        rating REAL DEFAULT 4.8,
        contact_phone TEXT NOT NULL,
        total_beds INTEGER DEFAULT 180,
        available_beds INTEGER DEFAULT 28,
        icu_beds_available INTEGER DEFAULT 5,
        er_beds_available INTEGER DEFAULT 8,
        current_load_percent INTEGER DEFAULT 65,
        estimated_wait_minutes INTEGER DEFAULT 12
    );
    """)

    # 4. Hospital Beds
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS hospital_beds (
        id TEXT PRIMARY KEY,
        hospital_id TEXT NOT NULL REFERENCES hospitals(id),
        bed_number TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'AVAILABLE',
        floor TEXT,
        assigned_patient_name TEXT,
        attending_doctor TEXT,
        admission_time TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 5. Ambulances
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ambulances (
        id TEXT PRIMARY KEY,
        plate_number TEXT UNIQUE NOT NULL,
        call_sign TEXT NOT NULL,
        vehicle_type TEXT NOT NULL,
        driver_name TEXT NOT NULL,
        driver_phone TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'AVAILABLE',
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        speed_kmh INTEGER DEFAULT 0,
        fuel_percent INTEGER DEFAULT 92,
        oxygen_level_percent INTEGER DEFAULT 98
    );
    """)

    # 6. Medicines & Pharmacy
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS medicines (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        min_quantity INTEGER NOT NULL DEFAULT 20,
        batch_number TEXT NOT NULL,
        expiry_date TEXT NOT NULL,
        supplier TEXT,
        price REAL NOT NULL,
        location TEXT
    );
    """)

    # 7. Emergency Requests
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS emergency_requests (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        patient_name TEXT NOT NULL,
        patient_phone TEXT NOT NULL,
        pickup_address TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        symptoms_json TEXT NOT NULL,
        ai_severity TEXT NOT NULL,
        ai_score REAL,
        assigned_ambulance_id TEXT,
        assigned_hospital_id TEXT,
        status TEXT NOT NULL,
        eta_minutes INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 8. Appointments
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        queue_token TEXT NOT NULL,
        patient_id TEXT NOT NULL,
        patient_name TEXT NOT NULL,
        hospital_id TEXT NOT NULL,
        hospital_name TEXT NOT NULL,
        doctor_name TEXT NOT NULL,
        department TEXT NOT NULL,
        appointment_date TEXT NOT NULL,
        time_slot TEXT NOT NULL,
        status TEXT DEFAULT 'CONFIRMED',
        reason TEXT
    );
    """)

    # Seed Initial Data if empty
    cursor.execute("SELECT COUNT(*) FROM users;")
    if cursor.fetchone()[0] == 0:
        print("[LifeLink DB] Seeding initial Indian demo users...")
        cursor.execute("""
        INSERT INTO users (id, email, password_hash, name, phone, role) VALUES 
        ('usr-1', 'patient@lifelink.demo', 'demo_hash_patient', 'Rahul Sharma', '+91 98765 43210', 'PATIENT'),
        ('usr-2', 'hospital@lifelink.demo', 'demo_hash_hosp', 'Dr. Sarah Vance', '+91 91234 56780', 'HOSPITAL_ADMIN'),
        ('usr-3', 'doctor@lifelink.demo', 'demo_hash_doc', 'Dr. Rajesh Verma', '+91 98201 23456', 'DOCTOR'),
        ('usr-4', 'driver@lifelink.demo', 'demo_hash_drv', 'Rajesh Kumar (Driver Raj)', '+91 97110 44556', 'AMBULANCE_DRIVER'),
        ('usr-5', 'admin@lifelink.demo', 'demo_hash_adm', 'Vikramaditya Singhania', '+91 99000 88888', 'SUPER_ADMIN');
        """)

    cursor.execute("SELECT COUNT(*) FROM hospitals;")
    if cursor.fetchone()[0] == 0:
        print("[LifeLink DB] Seeding initial premier hospitals...")
        cursor.execute("""
        INSERT INTO hospitals (id, name, address, latitude, longitude, rating, contact_phone, total_beds, available_beds, icu_beds_available, er_beds_available) VALUES
        ('hosp-1', 'Apollo Indraprastha & Trauma Institute', 'Sarita Vihar, Mathura Road, New Delhi', 28.5355, 77.2910, 4.9, '+91 11 2692 5858', 240, 34, 6, 9),
        ('hosp-2', 'Fortis Memorial Research Institute', 'Sector 44, Gurugram, NCR', 28.4595, 77.0725, 4.8, '+91 124 4962200', 280, 42, 7, 11),
        ('hosp-3', 'AIIMS Apex Trauma Center', 'Ansari Nagar, New Delhi', 28.5672, 77.2100, 4.9, '+91 11 2659 8700', 350, 48, 8, 14);
        """)

    conn.commit()
    conn.close()
    print(f"[LifeLink DB] Database initialized successfully at {DB_FILE} with complete relational schema!")

if __name__ == "__main__":
    init_local_database()
