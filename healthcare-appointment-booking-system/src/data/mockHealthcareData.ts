import { ClinicLocation, Provider, Specialty, TimeSlot, Appointment } from '../types/healthcare';

export const CLINIC_LOCATIONS: ClinicLocation[] = [
  {
    id: 'clinic-1',
    name: 'Metro Health Downtown Pavilion',
    address: '742 Evergreen Medical Plaza, Suite 400',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    phone: '(415) 892-4100',
    openHours: 'Mon-Fri: 7:00 AM - 7:00 PM, Sat: 8:00 AM - 2:00 PM',
    coordinates: { lat: 37.7749, lng: -122.4194 },
  },
  {
    id: 'clinic-2',
    name: 'Westside Specialty Care Center',
    address: '1090 Harbor Boulevard, Building B',
    city: 'San Francisco',
    state: 'CA',
    zip: '94122',
    phone: '(415) 762-3300',
    openHours: 'Mon-Fri: 8:00 AM - 6:00 PM',
    coordinates: { lat: 37.7609, lng: -122.4835 },
  },
  {
    id: 'clinic-3',
    name: 'North Suburban Family Health',
    address: '450 Northridge Way',
    city: 'San Rafael',
    state: 'CA',
    zip: '94901',
    phone: '(415) 620-8910',
    openHours: 'Mon-Sat: 8:00 AM - 5:30 PM',
    coordinates: { lat: 37.9735, lng: -122.5311 },
  },
  {
    id: 'clinic-4',
    name: 'East Bay Regional Medical Complex',
    address: '2200 Broadway Health Park',
    city: 'Oakland',
    state: 'CA',
    zip: '94612',
    phone: '(510) 934-2200',
    openHours: 'Mon-Sun: 24/7 Urgent & Scheduled Care',
    coordinates: { lat: 37.8044, lng: -122.2711 },
  },
  {
    id: 'clinic-5',
    name: 'South Shore Pediatrics & Wellness',
    address: '880 Marina Parkway',
    city: 'South San Francisco',
    state: 'CA',
    zip: '94080',
    phone: '(650) 441-7890',
    openHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    coordinates: { lat: 37.6547, lng: -122.4077 },
  },
  {
    id: 'clinic-6',
    name: 'Summit Orthopedic & Spine Institute',
    address: '1550 Crestline Center',
    city: 'Berkeley',
    state: 'CA',
    zip: '94704',
    phone: '(510) 840-5120',
    openHours: 'Mon-Fri: 7:30 AM - 5:30 PM',
    coordinates: { lat: 37.8715, lng: -122.273 },
  },
  {
    id: 'clinic-7',
    name: 'Valley Dermatology & Skin Center',
    address: '320 Magnolia Avenue',
    city: 'Palo Alto',
    state: 'CA',
    zip: '94301',
    phone: '(650) 329-8800',
    openHours: 'Mon-Thu: 8:30 AM - 5:00 PM',
    coordinates: { lat: 37.4419, lng: -122.143 },
  },
  {
    id: 'clinic-8',
    name: 'Highland Neurology & Brain Health',
    address: '910 Highland Ridge, Suite 210',
    city: 'San Mateo',
    state: 'CA',
    zip: '94402',
    phone: '(650) 571-3340',
    openHours: 'Mon-Fri: 8:00 AM - 4:30 PM',
    coordinates: { lat: 37.563, lng: -122.3255 },
  },
];

export const INSURANCE_PAYERS = [
  { id: 'BCBS-01', name: 'Blue Cross Blue Shield', planType: 'PPO / HMO / EPO', defaultCopay: 25 },
  { id: 'AETNA-02', name: 'Aetna Health', planType: 'Open Choice PPO', defaultCopay: 30 },
  { id: 'UHC-03', name: 'UnitedHealthcare', planType: 'Choice Plus Network', defaultCopay: 20 },
  { id: 'CIGNA-04', name: 'Cigna Healthcare', planType: 'Open Access Plus', defaultCopay: 25 },
  { id: 'KAISER-05', name: 'Kaiser Permanente', planType: 'Integrated Care HMO', defaultCopay: 15 },
  { id: 'MEDICARE-06', name: 'Medicare Part B', planType: 'Federal Healthcare', defaultCopay: 0 },
  { id: 'HUMANA-07', name: 'Humana', planType: 'Gold Plus Network', defaultCopay: 35 },
];

export const FEATURED_PROVIDERS: Provider[] = [
  {
    id: 'dr-chen',
    name: 'Dr. Sarah Chen, MD',
    title: 'Senior Attending Physician',
    specialty: 'Primary Care',
    clinicId: 'clinic-1',
    clinicName: 'Metro Health Downtown Pavilion',
    rating: 4.96,
    reviewCount: 342,
    avatarUrl: '/src/assets/images/provider_dr_chen_1791899885717.jpg',
    experienceYears: 14,
    bio: 'Board-certified in Internal Medicine with clinical emphasis on preventive medicine, chronic disease management, and longevity health protocols.',
    languages: ['English', 'Mandarin'],
    insurancesAccepted: ['Blue Cross Blue Shield', 'Aetna Health', 'UnitedHealthcare', 'Cigna Healthcare', 'Medicare Part B'],
    consultationFee: 160,
    acceptsNewPatients: true,
    videoConsultAvailable: true,
    nextAvailableSlot: 'Today at 2:30 PM',
  },
  {
    id: 'dr-marcus',
    name: 'Dr. Marcus Vance, MD, FACC',
    title: 'Director of Clinical Cardiology',
    specialty: 'Cardiology',
    clinicId: 'clinic-2',
    clinicName: 'Westside Specialty Care Center',
    rating: 4.98,
    reviewCount: 420,
    avatarUrl: '/src/assets/images/provider_dr_marcus_1791899885939.jpg',
    experienceYears: 18,
    bio: 'Harvard-trained cardiologist specializing in non-invasive cardiovascular imaging, hypertension optimization, and ischemic heart disease management.',
    languages: ['English', 'Spanish'],
    insurancesAccepted: ['Blue Cross Blue Shield', 'UnitedHealthcare', 'Aetna Health', 'Medicare Part B', 'Cigna Healthcare'],
    consultationFee: 240,
    acceptsNewPatients: true,
    videoConsultAvailable: true,
    nextAvailableSlot: 'Tomorrow at 10:00 AM',
  },
  {
    id: 'dr-elena',
    name: 'Dr. Elena Ramirez, MD, FAAP',
    title: 'Chief of Pediatric Medicine',
    specialty: 'Pediatrics',
    clinicId: 'clinic-5',
    clinicName: 'South Shore Pediatrics & Wellness',
    rating: 4.94,
    reviewCount: 288,
    avatarUrl: '/src/assets/images/provider_dr_elena_1791899887346.jpg',
    experienceYears: 11,
    bio: 'Compassionate pediatric specialist dedicated to newborn wellness, adolescent development, pediatric allergy management, and urgent telehealth visits.',
    languages: ['English', 'Spanish'],
    insurancesAccepted: ['Blue Cross Blue Shield', 'Aetna Health', 'Kaiser Permanente', 'Cigna Healthcare', 'UnitedHealthcare'],
    consultationFee: 140,
    acceptsNewPatients: true,
    videoConsultAvailable: true,
    nextAvailableSlot: 'Today at 4:15 PM',
  },
];

// Generate the full 120 onboarded providers across specialties and clinics to meet prompt specs
const SPECIALTIES: Specialty[] = [
  'Primary Care',
  'Cardiology',
  'Pediatrics',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Psychiatry',
  'Family Medicine',
];

const FIRST_NAMES = [
  'Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Amelia', 'James', 'Ava', 'William', 'Sophia',
  'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Evelyn', 'Alexander', 'Harper', 'Sebastian', 'Camila',
  'Julian', 'Gianna', 'Daniel', 'Abigail', 'Matthew', 'Emily', 'Samuel', 'Ella', 'David', 'Elizabeth',
  'Joseph', 'Sofia', 'Carter', 'Avery', 'Owen', 'Scarlett', 'Wyatt', 'Emily', 'John', 'Chloe'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'
];

export function generateAllProviders(): Provider[] {
  const all: Provider[] = [...FEATURED_PROVIDERS];
  const targetCount = 120;
  
  let i = 4;
  while (all.length < targetCount) {
    const fName = FIRST_NAMES[(i * 3) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i * 7) % LAST_NAMES.length];
    const specialty = SPECIALTIES[i % SPECIALTIES.length];
    const clinic = CLINIC_LOCATIONS[i % CLINIC_LOCATIONS.length];
    const isVideo = i % 3 !== 0; // 66% available for telehealth video
    const rating = Number((4.6 + ((i * 13) % 40) / 100).toFixed(2));
    const reviews = 45 + ((i * 29) % 350);
    const expYears = 5 + (i % 25);
    const fee = 130 + (i % 8) * 20;

    all.push({
      id: `dr-auto-${i}`,
      name: `Dr. ${fName} ${lName}, MD`,
      title: `${specialty} Specialist`,
      specialty,
      clinicId: clinic.id,
      clinicName: clinic.name,
      rating,
      reviewCount: reviews,
      avatarUrl: `https://images.unsplash.com/photo-${1559839734 + (i % 100)}?auto=format&fit=crop&q=80&w=256`, // fallback avatar
      experienceYears: expYears,
      bio: `Dedicated clinician offering clinical excellence in ${specialty.toLowerCase()}, preventative evaluation, and patient-centered treatment plans.`,
      languages: i % 2 === 0 ? ['English', 'Spanish'] : ['English'],
      insurancesAccepted: ['Blue Cross Blue Shield', 'Aetna Health', 'UnitedHealthcare', 'Cigna Healthcare'],
      consultationFee: fee,
      acceptsNewPatients: i % 5 !== 0,
      videoConsultAvailable: isVideo,
      nextAvailableSlot: i % 2 === 0 ? 'Today at 3:00 PM' : 'Tomorrow at 11:30 AM',
    });
    i++;
  }

  return all;
}

export const ALL_120_PROVIDERS: Provider[] = generateAllProviders();

// Function to generate dynamic slots for any provider and date
export function generateSlotsForProvider(providerId: string, clinicId: string, targetDateStr: string): TimeSlot[] {
  const times = [
    '08:30 AM', '09:15 AM', '10:00 AM', '10:45 AM',
    '11:30 AM', '01:15 PM', '02:00 PM', '02:45 PM',
    '03:30 PM', '04:15 PM', '05:00 PM'
  ];

  // deterministic seed based on providerId and date string
  const hash = (providerId + targetDateStr).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  return times.map((time, idx) => {
    const isBooked = ((hash + idx * 7) % 5 === 0) || (idx === 2); // some slots already taken
    const isVideo = (idx % 2 === 0);
    return {
      id: `slot-${providerId}-${targetDateStr}-${idx}`,
      providerId,
      clinicId,
      date: targetDateStr,
      time,
      durationMinutes: 30,
      isBooked,
      isLocked: false,
      type: isVideo ? 'video_consult' : 'in_person',
    };
  });
}

// Initial active appointments for demo
export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-901',
    providerId: 'dr-chen',
    providerName: 'Dr. Sarah Chen, MD',
    providerTitle: 'Senior Attending Physician',
    providerSpecialty: 'Primary Care',
    clinicId: 'clinic-1',
    clinicName: 'Metro Health Downtown Pavilion',
    clinicAddress: '742 Evergreen Medical Plaza, Suite 400, San Francisco, CA',
    slotId: 'slot-dr-chen-2026-10-14-1',
    date: '2026-10-14',
    time: '09:15 AM',
    durationMinutes: 30,
    type: 'video_consult',
    status: 'confirmed',
    patientName: 'Aditi Jha',
    patientEmail: 'aditijha7804@gmail.com',
    patientPhone: '(555) 349-8120',
    reasonForVisit: 'Routine wellness consultation & lab review',
    insuranceVerified: true,
    insuranceDetails: {
      payerName: 'Blue Cross Blue Shield',
      payerId: 'BCBS-01',
      memberId: 'XED948102394',
      groupNumber: 'GRP-9941',
      policyHolderName: 'Aditi Jha',
      relationship: 'self',
      status: 'verified',
      copayAmount: 25,
      deductibleRemaining: 150,
      coveragePercentage: 90,
      verifiedAt: '2026-10-13T06:55:00Z',
    },
    intakeCompleted: true,
    intakeData: {
      id: 'intake-901',
      patientName: 'Aditi Jha',
      dateOfBirth: '1996-04-12',
      gender: 'Female',
      phone: '(555) 349-8120',
      email: 'aditijha7804@gmail.com',
      primarySymptoms: 'Mild fatigue, annual health checkup',
      allergies: ['Penicillin'],
      currentMedications: ['Multivitamin daily'],
      medicalHistory: ['Mild seasonal allergies'],
      emergencyContact: {
        name: 'Michael Jha',
        relationship: 'Spouse',
        phone: '(555) 349-8121',
      },
      hipaaConsentSigned: true,
      signatureDate: '2026-10-13',
    },
    videoRoomSid: 'RM-77402-METRO-TELEHEALTH',
    videoToken: 'TWILIO_JWT_TOKEN_ACTIVE_MOCK',
    createdAt: '2026-10-13T06:30:00Z',
    remindersSent: {
      sms24h: true,
      sms2h: false,
      email24h: true,
    },
  },
  {
    id: 'apt-902',
    providerId: 'dr-marcus',
    providerName: 'Dr. Marcus Vance, MD, FACC',
    providerTitle: 'Director of Clinical Cardiology',
    providerSpecialty: 'Cardiology',
    clinicId: 'clinic-2',
    clinicName: 'Westside Specialty Care Center',
    clinicAddress: '1090 Harbor Boulevard, Building B, San Francisco, CA',
    slotId: 'slot-dr-marcus-2026-10-16-3',
    date: '2026-10-16',
    time: '10:45 AM',
    durationMinutes: 30,
    type: 'in_person',
    status: 'confirmed',
    patientName: 'Aditi Jha',
    patientEmail: 'aditijha7804@gmail.com',
    patientPhone: '(555) 349-8120',
    reasonForVisit: 'Cardiovascular checkup & Holter monitor follow-up',
    insuranceVerified: true,
    insuranceDetails: {
      payerName: 'Blue Cross Blue Shield',
      payerId: 'BCBS-01',
      memberId: 'XED948102394',
      groupNumber: 'GRP-9941',
      policyHolderName: 'Aditi Jha',
      relationship: 'self',
      status: 'verified',
      copayAmount: 30,
      deductibleRemaining: 150,
      coveragePercentage: 90,
      verifiedAt: '2026-10-13T06:55:00Z',
    },
    intakeCompleted: false,
    createdAt: '2026-10-13T06:40:00Z',
    remindersSent: {
      sms24h: false,
      sms2h: false,
      email24h: false,
    },
  },
];
