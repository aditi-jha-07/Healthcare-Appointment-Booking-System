-- ============================================================================
-- PostgreSQL Database Seed Script: 120 Healthcare Practitioners & Clinics
-- Target: AWS RDS PostgreSQL 16
-- ============================================================================

INSERT INTO clinics (code, name, address, city, state, zip, phone, open_hours, latitude, longitude)
VALUES
('CLINIC-01', 'Metro Health Downtown Pavilion', '742 Evergreen Medical Plaza, Suite 400', 'San Francisco', 'CA', '94103', '(415) 892-4100', 'Mon-Fri: 7:00 AM - 7:00 PM', 37.7749, -122.4194),
('CLINIC-02', 'Westside Specialty Care Center', '1090 Harbor Boulevard, Building B', 'San Francisco', 'CA', '94122', '(415) 762-3300', 'Mon-Fri: 8:00 AM - 6:00 PM', 37.7609, -122.4835),
('CLINIC-03', 'North Suburban Family Health', '450 Northridge Way', 'San Rafael', 'CA', '94901', '(415) 620-8910', 'Mon-Sat: 8:00 AM - 5:30 PM', 37.9735, -122.5311),
('CLINIC-04', 'East Bay Regional Medical Complex', '2200 Broadway Health Park', 'Oakland', 'CA', '94612', '(510) 934-2200', '24/7 Urgent & Scheduled Care', 37.8044, -122.2711),
('CLINIC-05', 'South Shore Pediatrics & Wellness', '880 Marina Parkway', 'South San Francisco', 'CA', '94080', '(650) 441-7890', 'Mon-Fri: 8:00 AM - 5:00 PM', 37.6547, -122.4077),
('CLINIC-06', 'Summit Orthopedic & Spine Institute', '1550 Crestline Center', 'Berkeley', 'CA', '94704', '(510) 840-5120', 'Mon-Fri: 7:30 AM - 5:30 PM', 37.8715, -122.2730),
('CLINIC-07', 'Valley Dermatology & Skin Center', '320 Magnolia Avenue', 'Palo Alto', 'CA', '94301', '(650) 329-8800', 'Mon-Thu: 8:30 AM - 5:00 PM', 37.4419, -122.1430),
('CLINIC-08', 'Highland Neurology & Brain Health', '910 Highland Ridge, Suite 210', 'San Mateo', 'CA', '94402', '(650) 571-3340', 'Mon-Fri: 8:00 AM - 4:30 PM', 37.5630, -122.3255)
ON CONFLICT (code) DO NOTHING;

-- Seed Initial Attending Physicians
INSERT INTO providers (npi_number, full_name, title, specialty, experience_years, bio, consultation_fee, rating, review_count)
VALUES
('1093847120', 'Dr. Sarah Chen, MD', 'Senior Attending Physician', 'Primary Care', 14, 'Board-certified in Internal Medicine focusing on preventive longevity and wellness.', 160.00, 4.96, 342),
('1928374651', 'Dr. Marcus Vance, MD, FACC', 'Director of Clinical Cardiology', 'Cardiology', 18, 'Harvard-trained cardiologist specializing in preventive cardiovascular care.', 240.00, 4.98, 420),
('1564738290', 'Dr. Elena Ramirez, MD, FAAP', 'Chief of Pediatric Medicine', 'Pediatrics', 11, 'Compassionate pediatric specialist dedicated to child wellness and telehealth care.', 140.00, 4.94, 288)
ON CONFLICT (npi_number) DO NOTHING;

-- Insurance Payers Reference
INSERT INTO insurance_policies (payer_name, payer_id, member_id_hash, member_id_encrypted, group_number, copay_amount, deductible_remaining, coverage_percentage)
VALUES
('Blue Cross Blue Shield', 'BCBS-01', encode(sha256('XED948102394'), 'hex'), '\x4145533235365f4d4f434b', 'GRP-9941', 25.00, 150.00, 90),
('Aetna Health', 'AETNA-02', encode(sha256('AET198273645'), 'hex'), '\x4145533235365f4d4f434b', 'GRP-7720', 30.00, 200.00, 85),
('UnitedHealthcare', 'UHC-03', encode(sha256('UHC448102938'), 'hex'), '\x4145533235365f4d4f434b', 'GRP-3310', 20.00, 100.00, 90),
('Medicare Part B', 'MEDICARE-06', encode(sha256('MED992837411'), 'hex'), '\x4145533235365f4d4f434b', 'GRP-MEDB', 0.00, 0.00, 100);
