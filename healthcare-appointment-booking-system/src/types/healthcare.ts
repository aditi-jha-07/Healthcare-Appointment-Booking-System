export type Specialty =
  | 'Primary Care'
  | 'Cardiology'
  | 'Pediatrics'
  | 'Dermatology'
  | 'Neurology'
  | 'Orthopedics'
  | 'Psychiatry'
  | 'Family Medicine';

export type AppointmentType = 'in_person' | 'video_consult';

export type AppointmentStatus =
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'rescheduled'
  | 'in_progress';

export interface ClinicLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  openHours: string;
  coordinates: { lat: number; lng: number };
}

export interface Provider {
  id: string;
  name: string;
  title: string;
  specialty: Specialty;
  clinicId: string;
  clinicName: string;
  rating: number;
  reviewCount: number;
  avatarUrl: string;
  experienceYears: number;
  bio: string;
  languages: string[];
  insurancesAccepted: string[];
  consultationFee: number;
  acceptsNewPatients: boolean;
  videoConsultAvailable: boolean;
  nextAvailableSlot: string;
}

export interface TimeSlot {
  id: string;
  providerId: string;
  clinicId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm format
  durationMinutes: number;
  isBooked: boolean;
  isLocked?: boolean; // Redis lock simulation
  lockedUntil?: number;
  type: AppointmentType;
}

export interface PatientIntake {
  id: string;
  appointmentId?: string;
  patientName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  primarySymptoms: string;
  allergies: string[];
  currentMedications: string[];
  medicalHistory: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  hipaaConsentSigned: boolean;
  signatureDate: string;
}

export interface InsurancePolicy {
  payerName: string;
  payerId: string;
  memberId: string;
  groupNumber: string;
  policyHolderName: string;
  relationship: 'self' | 'spouse' | 'child' | 'other';
  status: 'verified' | 'pending' | 'ineligible';
  copayAmount: number;
  deductibleRemaining: number;
  coveragePercentage: number;
  verifiedAt: string;
}

export interface Appointment {
  id: string;
  providerId: string;
  providerName: string;
  providerTitle: string;
  providerSpecialty: Specialty;
  clinicId: string;
  clinicName: string;
  clinicAddress: string;
  slotId: string;
  date: string;
  time: string;
  durationMinutes: number;
  type: AppointmentType;
  status: AppointmentStatus;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  reasonForVisit: string;
  insuranceVerified: boolean;
  insuranceDetails?: InsurancePolicy;
  intakeCompleted: boolean;
  intakeData?: PatientIntake;
  videoRoomSid?: string;
  videoToken?: string;
  createdAt: string;
  remindersSent: {
    sms24h: boolean;
    sms2h: boolean;
    email24h: boolean;
  };
}

export interface ReminderLog {
  id: string;
  appointmentId: string;
  patientName: string;
  recipient: string;
  channel: 'SMS' | 'Email';
  scheduledTime: string;
  sentTime?: string;
  status: 'sent' | 'scheduled' | 'delivered';
  messageBody: string;
}

export interface HipaaAuditLog {
  id: string;
  timestamp: string;
  action: 'PHI_READ' | 'PHI_WRITE' | 'APPOINTMENT_CREATE' | 'VIDEO_CALL_INIT' | 'INSURANCE_VERIFY';
  actorRole: 'PATIENT' | 'PROVIDER' | 'CLINIC_ADMIN' | 'AUTOMATED_SYSTEM';
  actorId: string;
  resourceId: string;
  ipAddress: string;
  encryptionStatus: 'AES-256-GCM_VERIFIED';
}
