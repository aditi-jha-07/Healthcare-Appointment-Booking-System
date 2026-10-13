import React, { useState } from 'react';
import { Appointment, Provider, PatientIntake, AppointmentType } from './types/healthcare';
import { INITIAL_APPOINTMENTS, FEATURED_PROVIDERS } from './data/mockHealthcareData';
import { Header, AppViewMode } from './components/Header';
import { ProviderSearch } from './components/ProviderSearch';
import { BookingModal } from './components/BookingModal';
import { IntakeFormModal } from './components/IntakeFormModal';
import { VideoConsultation } from './components/VideoConsultation';
import { RemindersManager } from './components/RemindersManager';
import { InsuranceVerification } from './components/InsuranceVerification';
import { MobileAppView } from './components/MobileAppView';
import { DoctorEHRDashboard } from './components/DoctorEHRDashboard';
import { downloadIcsFile, getGoogleCalendarUrl } from './utils/calendar';
import {
  Calendar,
  Clock,
  Video,
  ShieldCheck,
  FileText,
  Trash2,
  ExternalLink,
  Download,
  AlertCircle,
  TrendingDown,
  Building2,
  Users
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppViewMode>('web_booking');
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  // Booking Modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingProvider, setBookingProvider] = useState<Provider>(FEATURED_PROVIDERS[0]);
  const [bookingInitialType, setBookingInitialType] = useState<AppointmentType>('video_consult');

  // Intake Modal state
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [intakeTargetAptId, setIntakeTargetAptId] = useState<string | null>(null);

  // Video call active appointment
  const [videoConsultApt, setVideoConsultApt] = useState<Appointment | null>(INITIAL_APPOINTMENTS[0]);

  // Mobile Push Notification simulator message
  const [mobilePushMsg, setMobilePushMsg] = useState<string | null>(null);

  // Handle provider selection
  const handleSelectProvider = (provider: Provider, preselectedType?: AppointmentType) => {
    setBookingProvider(provider);
    if (preselectedType) {
      setBookingInitialType(preselectedType);
    }
    setIsBookingOpen(true);
  };

  // Handle booking completion
  const handleBookingComplete = (newAppointment: Appointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
  };

  // Open intake form
  const handleOpenIntake = (appointmentId?: string) => {
    setIntakeTargetAptId(appointmentId || null);
    setIsIntakeOpen(true);
  };

  // Handle intake submission
  const handleSubmitIntake = (intake: PatientIntake) => {
    if (intake.appointmentId) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === intake.appointmentId
            ? { ...apt, intakeCompleted: true, intakeData: intake }
            : apt
        )
      );
    }
  };

  // Handle joining video consult
  const handleJoinVideo = (apt: Appointment) => {
    setVideoConsultApt(apt);
    setCurrentView('telehealth_room');
  };

  // Cancel appointment
  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  // Trigger test reminder
  const handleTriggerTestReminder = (apt: Appointment, channel: 'SMS' | 'Email') => {
    const text = channel === 'SMS'
      ? `Aegis Health Reminder: Upcoming appointment with ${apt.providerName} on ${apt.date} at ${apt.time}. Reply 1 to Confirm.`
      : `Confirmation & Preparation details for your visit with ${apt.providerName} on ${apt.date}.`;

    // Trigger mobile push notification banner
    setMobilePushMsg(text);
    setTimeout(() => {
      setMobilePushMsg(null);
    }, 6000);

    // Call express backend endpoint silently
    fetch('/api/reminders/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appointmentId: apt.id,
        channel,
        recipient: channel === 'SMS' ? apt.patientPhone : apt.patientEmail,
      }),
    }).catch(() => {
      // safe fallback
    });
  };

  const intakeAppointment = appointments.find((a) => a.id === intakeTargetAptId);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <Header
        currentView={currentView}
        onSelectView={setCurrentView}
        activeAppointmentsCount={appointments.length}
        onOpenQuickBook={() => {
          setBookingProvider(FEATURED_PROVIDERS[0]);
          setIsBookingOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* VIEW 1: Next.js Web Portal View */}
        {currentView === 'web_booking' && (
          <div className="space-y-8">
            {/* Context Hero Banner */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
                    <ShieldCheck className="w-4 h-4 text-teal-700" />
                    <span>Regional Healthcare Network Scheduling System</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                    Instant Multi-Clinic Appointment Scheduling & Telehealth
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                    Coordinate care effortlessly across 8 regional medical facilities. Features real-time Redis slot locking, integrated Twilio WebRTC video consultations, automated SMS/email reminders, and instant insurance verification.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                    <button
                      onClick={() => {
                        setBookingProvider(FEATURED_PROVIDERS[0]);
                        setIsBookingOpen(true);
                      }}
                      className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shadow-xs transition-colors"
                    >
                      Book Visit Today
                    </button>
                    <button
                      onClick={() => setCurrentView('mobile_app')}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg border border-slate-200 transition-colors"
                    >
                      View React Native Mobile App
                    </button>
                  </div>
                </div>

                {/* KPI Adjacency Cards (Claim to Proof Adjacency) */}
                <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="text-slate-500 font-medium flex items-center justify-between">
                      <span>No-Show Rate</span>
                      <TrendingDown className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
                      -35%
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      via automated multi-touch reminders
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="text-slate-500 font-medium flex items-center justify-between">
                      <span>Network Scale</span>
                      <Users className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                      120
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Providers onboarded in 4 months
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="text-slate-500 font-medium flex items-center justify-between">
                      <span>Facilities</span>
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                      8 Clinics
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Full regional coverage
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="text-slate-500 font-medium flex items-center justify-between">
                      <span>Data Privacy</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                      AES-256
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      HIPAA compliance verified
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scheduled Appointments Management Section */}
            {appointments.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span>Your Scheduled Appointments ({appointments.length})</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Calendar synchronizations and automated reminder queue are active.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="border border-slate-200 rounded-xl p-4.5 bg-slate-50/50 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{apt.providerName}</span>
                            <span className="text-xs text-teal-700 font-medium">{apt.providerSpecialty}</span>
                          </div>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            apt.type === 'video_consult'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-slate-200 text-slate-800'
                          }`}>
                            {apt.type === 'video_consult' ? 'Twilio Video' : 'In-Person'}
                          </span>
                        </div>

                        <div className="mt-2.5 space-y-1 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5 font-medium text-slate-900">
                            <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>{apt.date} at {apt.time} ({apt.durationMinutes} mins)</span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {apt.clinicName} · {apt.clinicAddress}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Reason: {apt.reasonForVisit}
                          </div>
                        </div>

                        {/* Status checks */}
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                          <span className={`font-medium ${apt.insuranceVerified ? 'text-emerald-700' : 'text-slate-500'}`}>
                            {apt.insuranceVerified ? '✓ Insurance Verified' : 'Self-Pay'}
                          </span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className={`font-medium ${apt.intakeCompleted ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {apt.intakeCompleted ? '✓ Intake Done' : '! Intake Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          {/* Calendar Export */}
                          <a
                            href={getGoogleCalendarUrl(apt)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-600 hover:text-blue-600 rounded bg-white border border-slate-200 hover:border-blue-300 transition-colors"
                            title="Add to Google Calendar"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => downloadIcsFile(apt)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 rounded bg-white border border-slate-200 hover:border-slate-300 transition-colors"
                            title="Download Outlook / Apple .ics file"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          {!apt.intakeCompleted && (
                            <button
                              onClick={() => handleOpenIntake(apt.id)}
                              className="px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200 transition-colors flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Fast Intake</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {apt.type === 'video_consult' && (
                            <button
                              onClick={() => handleJoinVideo(apt)}
                              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Video</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                            title="Cancel Appointment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Provider Search & Real-Time Availability View */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Find In-Network Providers & Live Slots
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Filter across 8 clinics, 8 specialties, and insurance coverage.
                  </p>
                </div>
              </div>

              <ProviderSearch
                onSelectProvider={handleSelectProvider}
                onOpenQuickBook={() => {
                  setBookingProvider(FEATURED_PROVIDERS[0]);
                  setIsBookingOpen(true);
                }}
              />
            </div>

            {/* Insurance Verification Panel */}
            <InsuranceVerification />

            {/* Automated Reminders Engine & 35% No-Show Reducer */}
            <RemindersManager
              appointments={appointments}
              onTriggerTestReminder={handleTriggerTestReminder}
            />
          </div>
        )}

        {/* VIEW 2: React Native Mobile View */}
        {currentView === 'mobile_app' && (
          <div className="space-y-4">
            <div className="text-center max-w-lg mx-auto">
              <h2 className="text-lg font-bold text-slate-900">
                React Native Mobile Application
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Authentic mobile patient experience with tab navigation, quick slot booking, push reminders, and mobile WebRTC telehealth.
              </p>
            </div>

            <MobileAppView
              appointments={appointments}
              activeReminderPush={mobilePushMsg}
              onOpenBooking={(prov) => {
                setBookingProvider(prov);
                setIsBookingOpen(true);
              }}
              onJoinVideo={handleJoinVideo}
              onOpenIntake={handleOpenIntake}
            />
          </div>
        )}

        {/* VIEW 3: Provider Clinical EHR & 120 Network Portal */}
        {currentView === 'ehr_portal' && (
          <DoctorEHRDashboard
            appointments={appointments}
            onStartVideoSession={handleJoinVideo}
          />
        )}

        {/* VIEW 4: Twilio Video Consult Room */}
        {currentView === 'telehealth_room' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Twilio Video WebRTC Telehealth Room
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  End-to-end encrypted video session with SOAP clinical notes, vitals telemetry, and in-call chat.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('web_booking')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Back to Appointments
              </button>
            </div>

            <VideoConsultation
              appointment={videoConsultApt}
              onEndCall={() => setCurrentView('web_booking')}
            />
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          provider={bookingProvider}
          initialType={bookingInitialType}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          onBookingComplete={handleBookingComplete}
          onOpenIntakeForAppointment={(aptId) => handleOpenIntake(aptId)}
        />
      )}

      {/* Intake Form Modal */}
      {isIntakeOpen && (
        <IntakeFormModal
          appointment={intakeAppointment}
          isOpen={isIntakeOpen}
          onClose={() => setIsIntakeOpen(false)}
          onSubmitIntake={handleSubmitIntake}
        />
      )}

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Aegis Health Network</span>
            <span aria-hidden="true">·</span>
            <span>Appointment Booking & Telehealth System</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <span>Twilio Video WebRTC</span>
            <span aria-hidden="true">·</span>
            <span>PostgreSQL & Redis</span>
            <span aria-hidden="true">·</span>
            <span>45 CFR § 164.312 HIPAA Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
