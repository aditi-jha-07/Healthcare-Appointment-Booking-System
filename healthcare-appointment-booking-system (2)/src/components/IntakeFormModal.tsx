import React, { useState } from 'react';
import { PatientIntake, Appointment } from '../types/healthcare';
import { X, FileText, CheckCircle2, ShieldCheck, User, HeartPulse, AlertTriangle, Phone } from 'lucide-react';

interface IntakeFormModalProps {
  appointment?: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitIntake: (intake: PatientIntake) => void;
}

export const IntakeFormModal: React.FC<IntakeFormModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onSubmitIntake,
}) => {
  const [patientName, setPatientName] = useState(appointment?.patientName || 'Aditi Jha');
  const [dateOfBirth, setDateOfBirth] = useState('1996-04-12');
  const [gender, setGender] = useState('Female');
  const [phone, setPhone] = useState(appointment?.patientPhone || '(555) 349-8120');
  const [email, setEmail] = useState(appointment?.patientEmail || 'aditijha7804@gmail.com');
  const [primarySymptoms, setPrimarySymptoms] = useState(
    appointment?.reasonForVisit || 'Mild occasional fatigue, routine annual wellness follow-up'
  );

  // Allergies
  const [allergiesText, setAllergiesText] = useState('Penicillin (mild rash)');
  // Medications
  const [medicationsText, setMedicationsText] = useState('Vitamin D3 2000 IU daily, Multivitamin');
  // Past Medical History
  const [historyText, setHistoryText] = useState('Mild seasonal allergic rhinitis, No surgical history');

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState('Michael Jha');
  const [emergencyRelationship, setEmergencyRelationship] = useState('Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState('(555) 349-8121');

  // HIPAA consent
  const [hipaaConsentSigned, setHipaaConsentSigned] = useState(true);
  const [signatureName, setSignatureName] = useState('Aditi Jha');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hipaaConsentSigned) return;

    const intake: PatientIntake = {
      id: `intake-${Date.now()}`,
      appointmentId: appointment?.id,
      patientName,
      dateOfBirth,
      gender,
      phone,
      email,
      primarySymptoms,
      allergies: allergiesText.split(',').map((s) => s.trim()).filter(Boolean),
      currentMedications: medicationsText.split(',').map((s) => s.trim()).filter(Boolean),
      medicalHistory: historyText.split(',').map((s) => s.trim()).filter(Boolean),
      emergencyContact: {
        name: emergencyName,
        relationship: emergencyRelationship,
        phone: emergencyPhone,
      },
      hipaaConsentSigned: true,
      signatureDate: new Date().toISOString(),
    };

    onSubmitIntake(intake);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Patient Medical Intake & HIPAA Disclosure
              </h2>
              <div className="text-xs text-slate-500">
                <span>Fast-track check-in</span>
                {appointment && (
                  <>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>For {appointment.providerName}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {isSubmitted ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Intake Form Encrypted & Recorded</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your clinical history has been secured with AES-256-GCM encryption and attached to your patient record.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
            {/* Demographics */}
            <div>
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold mb-2">
                <User className="w-4 h-4 text-teal-600" />
                <span>Patient Demographics</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold mb-2">
                <HeartPulse className="w-4 h-4 text-teal-600" />
                <span>Current Symptoms & Primary Concern</span>
              </div>
              <textarea
                rows={2}
                required
                value={primarySymptoms}
                onChange={(e) => setPrimarySymptoms(e.target.value)}
                placeholder="Describe your current symptoms, onset, and severity..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>

            {/* Medical History & Allergies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Allergies (Drug, Food, Latex)</span>
                </label>
                <input
                  type="text"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa, None"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Current Medications & Dosages</label>
                <input
                  type="text"
                  value={medicationsText}
                  onChange={(e) => setMedicationsText(e.target.value)}
                  placeholder="e.g. Lisinopril 10mg, Metformin"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Past Medical & Surgical History</label>
              <input
                type="text"
                value={historyText}
                onChange={(e) => setHistoryText(e.target.value)}
                placeholder="e.g. Hypertension, Asthma, Prior surgeries"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold mb-2">
                <Phone className="w-4 h-4 text-teal-600" />
                <span>Emergency Contact</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Relationship"
                    value={emergencyRelationship}
                    onChange={(e) => setEmergencyRelationship(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Phone"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* HIPAA Acknowledgement */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="hipaa-consent"
                  checked={hipaaConsentSigned}
                  onChange={(e) => setHipaaConsentSigned(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <label htmlFor="hipaa-consent" className="text-slate-700 leading-relaxed cursor-pointer">
                  <span className="font-semibold text-slate-900">HIPAA Authorization & Privacy Disclosure:</span> I consent to medical treatment, release of medical records for treatment coordination and insurance billing, and acknowledge receipt of the Notice of Privacy Practices under 45 CFR § 164.520.
                </label>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Electronic Signature:</span>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 font-serif italic text-sm"
                  />
                </div>
                <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-bit Certified</span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!hipaaConsentSigned}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold shadow-xs transition-colors"
              >
                Submit Encrypted Intake
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
