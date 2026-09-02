-- ============================================================================
-- LIFELINK POSTGRESQL DATABASE SCHEMA (NORMALIZED RELATIONAL DDL)
-- Specification 44: Production-Grade Schema with Foreign Keys, Indexes & Enums
-- ============================================================================

-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role_enum AS ENUM (
    'PATIENT',
    'HOSPITAL_ADMIN',
    'DOCTOR',
    'NURSE',
    'AMBULANCE_DRIVER',
    'SUPER_ADMIN'
);

CREATE TYPE emergency_status_enum AS ENUM (
    'REQUESTED',
    'VERIFYING',
    'DISPATCHING',
    'AMBULANCE_ASSIGNED',
    'DRIVER_ACCEPTED',
    'EN_ROUTE',
    'PICKUP',
    'PATIENT_ONBOARD',
    'HOSPITAL_EN_ROUTE',
    'ARRIVED',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE severity_level_enum AS ENUM (
    'STABLE',
    'URGENT',
    'CRITICAL'
);

CREATE TYPE bed_category_enum AS ENUM (
    'ICU',
    'ER_TRAUMA',
    'GENERAL_WARD',
    'PRIVATE',
    'PEDIATRIC',
    'ISOLATION',
    'OPERATION_THEATRE'
);

CREATE TYPE bed_status_enum AS ENUM (
    'AVAILABLE',
    'OCCUPIED',
    'RESERVED',
    'CLEANING',
    'MAINTENANCE'
);

CREATE TYPE doctor_status_enum AS ENUM (
    'ON_DUTY',
    'OFF_DUTY',
    'BUSY',
    'ON_BREAK',
    'EMERGENCY_ONLY'
);

CREATE TYPE appointment_status_enum AS ENUM (
    'CONFIRMED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'RESCHEDULED'
);

-- 2. USERS & AUTHENTICATION
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE,
    role user_role_enum NOT NULL DEFAULT 'PATIENT',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 3. PATIENT PROFILES & EMERGENCY CONTACTS
CREATE TABLE patient_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    age INT,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    allergies TEXT,
    chronic_conditions TEXT,
    previous_surgeries TEXT,
    current_medications TEXT,
    insurance_provider VARCHAR(255),
    insurance_policy_number VARCHAR(100),
    preferred_hospital_id UUID,
    consent_emergency_data_share BOOLEAN DEFAULT TRUE,
    consent_ai_triage BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    contact_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. HOSPITALS & BEDS
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 4.8,
    contact_phone VARCHAR(50) NOT NULL,
    is_open_24x7 BOOLEAN DEFAULT TRUE,
    has_trauma_center_level1 BOOLEAN DEFAULT TRUE,
    has_cardiac_cath_lab BOOLEAN DEFAULT TRUE,
    has_blood_bank BOOLEAN DEFAULT TRUE,
    has_radiology_24x7 BOOLEAN DEFAULT TRUE,
    has_24x7_pharmacy BOOLEAN DEFAULT TRUE,
    current_load_percent INT DEFAULT 65,
    estimated_wait_minutes INT DEFAULT 12,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hospital_beds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    bed_number VARCHAR(50) NOT NULL,
    category bed_category_enum NOT NULL,
    status bed_status_enum NOT NULL DEFAULT 'AVAILABLE',
    floor VARCHAR(100),
    assigned_patient_id UUID REFERENCES users(id),
    attending_doctor_id UUID REFERENCES users(id),
    admission_timestamp TIMESTAMP WITH TIME ZONE,
    last_status_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_beds_hospital_status ON hospital_beds(hospital_id, status);

-- 5. DOCTORS & SHIFT ROSTERS
CREATE TABLE doctor_departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    department_name VARCHAR(255) NOT NULL,
    head_of_department_id UUID REFERENCES users(id)
);

CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    department_id UUID REFERENCES doctor_departments(id),
    specialty VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    is_emergency_standby BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctor_rosters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    shift_start_time TIME NOT NULL,
    shift_end_time TIME NOT NULL,
    shift_date DATE NOT NULL,
    current_status doctor_status_enum DEFAULT 'ON_DUTY',
    active_patient_count INT DEFAULT 0
);

-- 6. AMBULANCE FLEET & GPS LOCATION STATE
CREATE TABLE ambulances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plate_number VARCHAR(50) UNIQUE NOT NULL,
    call_sign VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL, -- ALS, BLS, MICU
    current_driver_id UUID REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    heading INT DEFAULT 0,
    speed_kmh INT DEFAULT 0,
    fuel_percent INT DEFAULT 95,
    oxygen_level_percent INT DEFAULT 98,
    last_location_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ambulance_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ambulance_id UUID NOT NULL REFERENCES ambulances(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed_kmh INT,
    heading INT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_amb_locations ON ambulance_locations(ambulance_id, recorded_at DESC);

-- 7. EMERGENCY REQUESTS & DISPATCHES
CREATE TABLE emergency_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id UUID REFERENCES users(id),
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    pickup_address TEXT NOT NULL,
    reported_symptoms TEXT[] NOT NULL,
    heart_rate INT,
    spo2_percent INT,
    blood_pressure_sys INT,
    blood_pressure_dia INT,
    temperature DECIMAL(4, 1),
    ai_severity severity_level_enum NOT NULL DEFAULT 'URGENT',
    ai_confidence_score DECIMAL(3, 2),
    bert_extracted_intent TEXT,
    icu_pre_alert_required BOOLEAN DEFAULT FALSE,
    assigned_ambulance_id UUID REFERENCES ambulances(id),
    assigned_hospital_id UUID REFERENCES hospitals(id),
    status emergency_status_enum NOT NULL DEFAULT 'REQUESTED',
    eta_minutes INT,
    hospital_pre_alert_acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE emergency_timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emergency_id UUID NOT NULL REFERENCES emergency_requests(id) ON DELETE CASCADE,
    status emergency_status_enum NOT NULL,
    note TEXT,
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. APPOINTMENTS & DIGITAL QUEUE PASSES
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    queue_token VARCHAR(50) NOT NULL,
    patient_id UUID NOT NULL REFERENCES users(id),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    status appointment_status_enum DEFAULT 'CONFIRMED',
    consultation_type VARCHAR(50) DEFAULT 'IN_PERSON',
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. MEDICINES, INVENTORY & PHARMACY
CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    min_quantity INT NOT NULL DEFAULT 20,
    batch_number VARCHAR(100) NOT NULL,
    expiry_date DATE NOT NULL,
    supplier VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    storage_location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL, -- STOCK_IN, DISPENSED, EXPIRED
    delta_quantity INT NOT NULL,
    performed_by_id UUID REFERENCES users(id),
    transaction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. LAB ORDERS & DIAGNOSTICS
CREATE TABLE lab_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES users(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    test_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    results_json JSONB,
    doctor_remarks TEXT,
    order_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_timestamp TIMESTAMP WITH TIME ZONE
);

-- 11. AUDIT LOGS & CLINICAL OVERRIDES
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details_json JSONB,
    ip_address VARCHAR(50),
    log_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
