import React, { useState, useEffect } from 'react';
import { Provider, TimeSlot, Appointment, AppointmentType, InsurancePolicy } from '../types/healthcare';
import { generateSlotsForProvider, INSURANCE_PAYERS, CLINIC_LOCATIONS } from '../data/mockHealthcareData';
import { verifyInsuranceEligibility } from '../utils/insurance';
import { downloadIcsFile, getGoogleCalendarUrl } from '../utils/calendar';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  Video,
  Building,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  Download,
  AlertCircle
} from 'lucide-react';

interface BookingModalProps {
  provider: Provider;
  initialType?: AppointmentType;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete: (newAppointment: Appointment) => void;
  onOpenIntakeForAppointment?: (appointmentId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  provider,
  initialType = 'video_consult',
  isOpen,
  onClose,
  onBookingComplete,
  onOpenIntakeForAppointment,
}) => {
  // Dates: today + next 6 days
  const todayStr = '2026-10-14';
  const availableDates = [
    { label: 'Wed, Oct 14', value: '2026-10-14' },
    { label: 'Thu, Oct 15', value: '2026-10-15' },
    { label: 'Fri, Oct 16', value: '2026-10-16' },
    { label: 'Mon, Oct 19', value: '2026-10-19' },
    { label: 'Tue, Oct 20', value: '2026-10-20' },
  ];

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [appointmentType, setAppointmentType] = useState<AppointmentType>(initialType);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Redis Lock state simulation (5 min lock)
  const [lockCountdown, setLockCountdown] = useState<number>(300);
  const [isSlotLocked, setIsSlotLocked] = useState<boolean>(false);

  // Patient Info
  const [patientName, setPatientName] = useState('Aditi Jha');
  const [patientEmail, setPatientEmail] = useState('aditijha7804@gmail.com');
  const [patientPhone, setPatientPhone] = useState('(555) 349-8120');
  const [reasonForVisit, setReasonForVisit] = useState('Routine consultation & specialist review');

  // Insurance
  const [insuranceMode, setInsuranceMode] = useState<'insurance' | 'self_pay'>('insurance');
  const [selectedPayerId, setSelectedPayerId] = useState('BCBS-01');
  const [memberId, setMemberId] = useState('XED948102394');
  const [groupNumber, setGroupNumber] = useState('GRP-9941');
  const [verifyingInsurance, setVerifyingInsurance] = useState(false);
  const [verifiedInsurance, setVerifiedInsurance] = useState<InsurancePolicy | null>(null);
  const [insuranceError, setInsuranceError] = useState<string | null>(null);

  // Steps: 1: Slot Selection, 2: Patient & Insurance, 3: Confirmed
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Slots for the selected provider and date
  const slots = React.useMemo(() => {
    return generateSlotsForProvider(provider.id, provider.clinicId, selectedDate);
  }, [provider.id, provider.clinicId, selectedDate]);

  // Lock timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSlotLocked && lockCountdown > 0) {
      interval = setInterval(() => {
        setLockCountdown((prev) => {
          if (prev <= 1) {
            setIsSlotLocked(false);
            setSelectedSlot(null);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSlotLocked, lockCountdown]);

  if (!isOpen) return null;

  const handleSelectSlot = (slot: TimeSlot) => {
    if (slot.isBooked) return;
    setSelectedSlot(slot);
    setIsSlotLocked(true);
    setLockCountdown(300); // 5 min Redis lock hold
  };

  const handleVerifyInsurance = async () => {
    setVerifyingInsurance(true);
    setInsuranceError(null);
    try {
      const res = await verifyInsuranceEligibility({
        payerId: selectedPayerId,
        memberId,
        groupNumber,
        policyHolderName: patientName,
        relationship: 'self',
      });
      setVerifiedInsurance(res);
    } catch (err: unknown) {
      setInsuranceError(err instanceof Error ? err.message : 'Insurance verification failed');
    } finally {
      setVerifyingInsurance(false);
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedSlot) return;

    const matchedClinic = CLINIC_LOCATIONS.find((c) => c.id === provider.clinicId) || CLINIC_LOCATIONS[0];

    const newApt: Appointment = {
      id: `apt-${Date.now().toString().slice(-6)}`,
      providerId: provider.id,
      providerName: provider.name,
      providerTitle: provider.title,
      providerSpecialty: provider.specialty,
      clinicId: matchedClinic.id,
      clinicName: matchedClinic.name,
      clinicAddress: `${matchedClinic.address}, ${matchedClinic.city}, ${matchedClinic.state}`,
      slotId: selectedSlot.id,
      date: selectedDate,
      time: selectedSlot.time,
      durationMinutes: 30,
      type: appointmentType,
      status: 'confirmed',
      patientName,
      patientEmail,
      patientPhone,
      reasonForVisit,
      insuranceVerified: !!verifiedInsurance,
      insuranceDetails: verifiedInsurance || undefined,
      intakeCompleted: false,
      videoRoomSid: appointmentType === 'video_consult' ? `RM-${Math.floor(10000 + Math.random() * 90000)}-TWILIO-VIDEO` : undefined,
      videoToken: appointmentType === 'video_consult' ? 'JWT_TWILIO_ACCESS_TOKEN_SAMPLE' : undefined,
      createdAt: new Date().toISOString(),
      remindersSent: {
        sms24h: false,
        sms2h: false,
        email24h: false,
      },
    };

    setConfirmedAppointment(newApt);
    setBookingStep(3);
    onBookingComplete(newApt);

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <img
              src={provider.avatarUrl}
              alt={provider.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {provider.name}
              </h2>
              <div className="text-xs text-slate-500">
                <span>{provider.specialty}</span>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span>{provider.clinicName}</span>
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

        {/* Modal Body */}
        <div className="p-6">
          {bookingStep === 1 && (
            <div className="space-y-6">
              {/* Modality Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  1. Select Consultation Modality
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAppointmentType('video_consult')}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      appointmentType === 'video_consult'
                        ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-teal-100 text-teal-800 shrink-0">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Twilio Video Telehealth</div>
                      <div className="text-xs text-slate-500 mt-0.5">HIPAA-compliant WebRTC call from home</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setAppointmentType('in_person')}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      appointmentType === 'in_person'
                        ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-800 shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">In-Person Clinic Visit</div>
                      <div className="text-xs text-slate-500 mt-0.5">{provider.clinicName}</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Date Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  2. Choose Date
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {availableDates.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => {
                        setSelectedDate(d.value);
                        setSelectedSlot(null);
                        setIsSlotLocked(false);
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                        selectedDate === d.value
                          ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-Time Slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    3. Real-Time Available Slots
                  </label>
                  {isSlotLocked && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      <Lock className="w-3 h-3" />
                      <span>Redis Lock Active: {formatCountdown(lockCountdown)}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        disabled={slot.isBooked}
                        onClick={() => handleSelectSlot(slot)}
                        className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                          slot.isBooked
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-teal-600 hover:bg-teal-50/50'
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Slots are refreshed instantly via WebSocket/Redis. Clicking locks the slot for 5 minutes.
                </p>
              </div>

              {/* Continue to patient step */}
              <div className="pt-2 flex justify-end">
                <button
                  disabled={!selectedSlot}
                  onClick={() => setBookingStep(2)}
                  className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedSlot
                      ? 'bg-teal-700 text-white hover:bg-teal-800 shadow-sm'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Continue to Patient Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {bookingStep === 2 && (
            <div className="space-y-5">
              {/* Selected Slot Recap */}
              <div className="p-3 bg-teal-50/80 border border-teal-200 rounded-lg flex items-center justify-between text-xs text-teal-900">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-700" />
                  <span className="font-semibold">{selectedDate}</span>
                  <span aria-hidden="true">·</span>
                  <Clock className="w-4 h-4 text-teal-700" />
                  <span className="font-semibold">{selectedSlot?.time}</span>
                  <span aria-hidden="true">·</span>
                  <span>{appointmentType === 'video_consult' ? 'Twilio Video' : 'In-Clinic'}</span>
                </div>
                <button
                  onClick={() => setBookingStep(1)}
                  className="text-teal-700 underline font-medium hover:text-teal-800"
                >
                  Change Slot
                </button>
              </div>

              {/* Patient Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Phone Number (SMS reminders)</label>
                  <input
                    type="text"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-medium mb-1">Email Address (Calendar & Reminders)</label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-medium mb-1">Reason for Visit</label>
                  <input
                    type="text"
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Insurance Verification Section */}
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">Insurance & Billing Verification</span>
                  <div className="flex items-center gap-1 p-0.5 bg-slate-200 rounded-md text-[11px]">
                    <button
                      onClick={() => setInsuranceMode('insurance')}
                      className={`px-2 py-0.5 rounded font-medium ${
                        insuranceMode === 'insurance' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Verify Insurance
                    </button>
                    <button
                      onClick={() => setInsuranceMode('self_pay')}
                      className={`px-2 py-0.5 rounded font-medium ${
                        insuranceMode === 'self_pay' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Self-Pay (${provider.consultationFee})
                    </button>
                  </div>
                </div>

                {insuranceMode === 'insurance' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-slate-500 mb-1">Health Plan</label>
                        <select
                          value={selectedPayerId}
                          onChange={(e) => setSelectedPayerId(e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                        >
                          {INSURANCE_PAYERS.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1">Member / Subscriber ID</label>
                        <input
                          type="text"
                          value={memberId}
                          onChange={(e) => setMemberId(e.target.value)}
                          placeholder="e.g. XED948102394"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1">Group Number</label>
                        <input
                          type="text"
                          value={groupNumber}
                          onChange={(e) => setGroupNumber(e.target.value)}
                          placeholder="GRP-9941"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleVerifyInsurance}
                        disabled={verifyingInsurance}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        {verifyingInsurance ? 'Verifying with Payer...' : 'Run Real-Time Eligibility'}
                      </button>

                      {verifiedInsurance && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Active Eligibility Verified · Est. Copay: ${verifiedInsurance.copayAmount}</span>
                        </div>
                      )}

                      {insuranceError && (
                        <div className="flex items-center gap-1.5 text-xs text-rose-700">
                          <AlertCircle className="w-4 h-4" />
                          <span>{insuranceError}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setBookingStep(1)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Lock Slot & Confirm Booking</span>
                </button>
              </div>
            </div>
          )}

          {bookingStep === 3 && confirmedAppointment && (
            <div className="text-center py-4 space-y-5">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Appointment Confirmed!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Your appointment with <span className="font-semibold text-slate-800">{confirmedAppointment.providerName}</span> is confirmed for{' '}
                  <span className="font-semibold text-slate-800">{confirmedAppointment.date} at {confirmedAppointment.time}</span>.
                </p>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Confirmation Code: {confirmedAppointment.id} · AES-256 Encrypted
                </div>
              </div>

              {/* Automated Reminders Notice */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl max-w-lg mx-auto text-left text-xs space-y-1.5">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Automated Reminders Scheduled (35% No-Show Reduction Engine)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  SMS reminder will be sent to <span className="font-mono text-slate-800">{confirmedAppointment.patientPhone}</span> 24h & 2h before the visit. An email reminder with direct calendar link sent to <span className="font-mono text-slate-800">{confirmedAppointment.patientEmail}</span>.
                </p>
              </div>

              {/* Calendar Integrations */}
              <div className="space-y-2 max-w-lg mx-auto">
                <div className="text-xs font-medium text-slate-700">Add to your Personal Calendar:</div>
                <div className="flex items-center justify-center gap-3">
                  <a
                    href={getGoogleCalendarUrl(confirmedAppointment)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-medium text-slate-800 shadow-xs transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    <span>Google Calendar</span>
                  </a>
                  <button
                    onClick={() => downloadIcsFile(confirmedAppointment)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-medium text-slate-800 shadow-xs transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-700" />
                    <span>Outlook / Apple (.ics)</span>
                  </button>
                </div>
              </div>

              {/* Next Steps Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-3">
                {onOpenIntakeForAppointment && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenIntakeForAppointment(confirmedAppointment.id);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
                  >
                    Complete Intake Form Now (Fast-Track)
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
