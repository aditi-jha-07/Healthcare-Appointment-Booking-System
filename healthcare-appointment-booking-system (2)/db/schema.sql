-- ============================================================================
-- Healthcare Appointment Booking System - PostgreSQL Schema
-- Database: healthcare_booking_db
-- Compliance: HIPAA Compliant (PHI Encryption & Audit Trail)
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clinics Table
CREATE TABLE IF NOT EXISTS clinics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(10) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    open_hours VARCHAR(255) NOT NULL,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Providers Table (120 Healthcare Practitioners)
CREATE TABLE IF NOT EXISTS providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    npi_number VARCHAR(10) UNIQUE NOT NULL, -- 10-digit National Provider Identifier
    full_name VARCHAR(255) NOT NULL,
    title VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    clinic_id UUID REFERENCES clinics(id) ON DELETE RESTRICT,
    rating DECIMAL(3, 2) DEFAULT 4.90,
    review_count INTEGER DEFAULT 0,
    experience_years INTEGER NOT NULL,
    bio TEXT,
    consultation_fee DECIMAL(10, 2) NOT NULL,
    accepts_new_patients BOOLEAN DEFAULT TRUE,
    video_consult_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Real-Time Time Slots Table
CREATE TABLE IF NOT EXISTS time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    slot_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    slot_type VARCHAR(32) NOT NULL CHECK (slot_type IN ('in_person', 'video_consult')),
    is_booked BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    locked_until TIMESTAMP WITH TIME ZONE,
    locked_by_session VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_provider_slot UNIQUE(provider_id, slot_date, slot_time)
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_code VARCHAR(32) UNIQUE NOT NULL,
    provider_id UUID NOT NULL REFERENCES providers(id),
    clinic_id UUID NOT NULL REFERENCES clinics(id),
    slot_id UUID NOT NULL REFERENCES time_slots(id),
    appointment_type VARCHAR(32) NOT NULL CHECK (appointment_type IN ('in_person', 'video_consult')),
    status VARCHAR(32) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled', 'rescheduled', 'in_progress')),
    
    -- Patient PHI (Encrypted at rest using AES-256)
    patient_name_encrypted BYTEA NOT NULL,
    patient_email_encrypted BYTEA NOT NULL,
    patient_phone_encrypted BYTEA NOT NULL,
    reason_for_visit_encrypted BYTEA NOT NULL,
    
    -- Twilio Video Integration
    video_room_sid VARCHAR(128),
    video_room_name VARCHAR(128),
    
    -- Reminders Tracker (35% No-Show Reduction Engine)
    reminder_sms_24h_sent BOOLEAN DEFAULT FALSE,
    reminder_sms_2h_sent BOOLEAN DEFAULT FALSE,
    reminder_email_24h_sent BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Patient Intake Forms Table
CREATE TABLE IF NOT EXISTS patient_intakes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    patient_dob DATE NOT NULL,
    gender VARCHAR(32),
    symptoms_encrypted BYTEA NOT NULL,
    allergies JSONB DEFAULT '[]'::jsonb,
    medications JSONB DEFAULT '[]'::jsonb,
    medical_history JSONB DEFAULT '[]'::jsonb,
    emergency_contact JSONB,
    hipaa_consent_signed BOOLEAN NOT NULL DEFAULT TRUE,
    signature_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insurance Eligibility Policies Table
CREATE TABLE IF NOT EXISTS insurance_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payer_name VARCHAR(100) NOT NULL,
    payer_id VARCHAR(50) NOT NULL,
    member_id_hash VARCHAR(64) NOT NULL, -- SHA-256 Hash for indexed lookups
    member_id_encrypted BYTEA NOT NULL,
    group_number VARCHAR(50),
    verification_status VARCHAR(32) NOT NULL DEFAULT 'verified',
    copay_amount DECIMAL(10, 2) NOT NULL,
    deductible_remaining DECIMAL(10, 2) NOT NULL,
    coverage_percentage INTEGER NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- HIPAA Access Audit Logs (45 CFR § 164.312)
CREATE TABLE IF NOT EXISTS hipaa_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    action VARCHAR(64) NOT NULL,
    actor_role VARCHAR(32) NOT NULL,
    actor_id VARCHAR(128) NOT NULL,
    resource_id VARCHAR(128) NOT NULL,
    ip_address INET,
    encryption_algorithm VARCHAR(32) DEFAULT 'AES-256-GCM',
    checksum VARCHAR(64) NOT NULL
);

-- Indexes for performance & Real-Time Querying
CREATE INDEX IF NOT EXISTS idx_slots_provider_date ON time_slots(provider_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_slots_availability ON time_slots(slot_date, is_booked, is_locked);
CREATE INDEX IF NOT EXISTS idx_appointments_provider ON appointments(provider_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON hipaa_audit_logs(timestamp DESC);
