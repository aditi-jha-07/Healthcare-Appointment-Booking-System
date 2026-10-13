import React, { useState } from 'react';
import { Provider, Appointment } from '../types/healthcare';
import { FEATURED_PROVIDERS, CLINIC_LOCATIONS } from '../data/mockHealthcareData';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  User,
  Shield,
  Bell,
  Star,
  ChevronRight,
  Stethoscope,
  FileText,
  Phone,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface MobileAppViewProps {
  onOpenBooking: (provider: Provider) => void;
  onJoinVideo: (appointment: Appointment) => void;
  onOpenIntake: (appointmentId?: string) => void;
  appointments: Appointment[];
  activeReminderPush?: string | null;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({
  onOpenBooking,
  onJoinVideo,
  onOpenIntake,
  appointments,
  activeReminderPush,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'visits' | 'intake' | 'profile'>('home');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

  const specialties = ['All', 'Primary Care', 'Cardiology', 'Pediatrics', 'Dermatology'];

  const filteredDoctors = selectedSpecialty === 'All'
    ? FEATURED_PROVIDERS
    : FEATURED_PROVIDERS.filter((p) => p.specialty === selectedSpecialty);

  const upcomingApt = appointments[0];

  return (
    <div className="flex justify-center py-6">
      {/* Mobile Device Frame (iPhone 16 Pro styling) */}
      <div className="w-[380px] h-[780px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-4 border-slate-700/80 relative flex flex-col overflow-hidden">
        {/* Dynamic Island / Speaker */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ml-auto mr-3" />
        </div>

        {/* Screen Bezel Content */}
        <div className="w-full h-full bg-slate-50 rounded-[40px] overflow-hidden flex flex-col relative">
          {/* Status Bar */}
          <div className="h-11 pt-2.5 px-7 flex items-center justify-between text-[11px] font-semibold text-slate-800 bg-white border-b border-slate-100 z-40">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="text-[10px]">5G</span>
              <div className="w-4 h-2 border border-slate-700 rounded-xs p-0.5">
                <div className="w-full h-full bg-slate-700 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Interactive Simulated Push Notification Banner */}
          {activeReminderPush && (
            <div className="absolute top-12 inset-x-3 z-50 bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl border border-slate-700/60 animate-bounce text-xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-md bg-teal-600 flex items-center justify-center">
                  <Stethoscope className="w-3 h-3 text-white" />
                </div>
                <span className="font-semibold text-[11px]">Aegis Health · Automated Reminder</span>
                <span className="text-slate-400 text-[10px] ml-auto">now</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-tight">
                {activeReminderPush}
              </p>
            </div>
          )}

          {/* Native Header */}
          <div className="px-5 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
                A
              </div>
              <span className="text-sm font-bold text-slate-900">Aegis Mobile</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <Shield className="w-3 h-3" />
              <span>HIPAA Secure</span>
            </div>
          </div>

          {/* Screen Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'home' && (
              <>
                {/* Upcoming Appointment Widget */}
                {upcomingApt && (
                  <div className="bg-gradient-to-br from-teal-800 to-slate-900 text-white p-4 rounded-2xl shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-teal-200">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Next Appointment
                      </span>
                      <span className="font-mono bg-teal-700/60 px-2 py-0.5 rounded text-teal-100">
                        {upcomingApt.type === 'video_consult' ? 'Video Visit' : 'In-Clinic'}
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-sm text-white">{upcomingApt.providerName}</div>
                      <div className="text-xs text-teal-100">{upcomingApt.providerSpecialty}</div>
                      <div className="text-[11px] text-teal-200 mt-1">
                        {upcomingApt.date} · {upcomingApt.time}
                      </div>
                    </div>

                    <div className="pt-1 flex gap-2">
                      {upcomingApt.type === 'video_consult' && (
                        <button
                          onClick={() => onJoinVideo(upcomingApt)}
                          className="flex-1 py-1.5 bg-white text-teal-900 font-bold rounded-lg text-xs flex items-center justify-center gap-1 shadow-xs"
                        >
                          <Video className="w-3.5 h-3.5 text-teal-700" />
                          <span>Join Video Call</span>
                        </button>
                      )}
                      {!upcomingApt.intakeCompleted && (
                        <button
                          onClick={() => onOpenIntake(upcomingApt.id)}
                          className="flex-1 py-1.5 bg-teal-700/80 hover:bg-teal-700 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Fast Intake</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Specialty Horizontal Chips */}
                <div>
                  <div className="text-xs font-bold text-slate-800 mb-2">Find by Specialty</div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {specialties.map((spec) => (
                      <button
                        key={spec}
                        onClick={() => setSelectedSpecialty(spec)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                          selectedSpecialty === spec
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Available Doctors List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Available Providers</span>
                    <span className="text-slate-400 font-mono text-[11px]">120 in Network</span>
                  </div>

                  {filteredDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.avatarUrl}
                          alt={doc.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover border border-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{doc.name}</h4>
                          <div className="text-[11px] text-teal-700 font-medium">{doc.specialty}</div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="font-semibold text-slate-700 tabular-nums">{doc.rating}</span>
                            <span>({doc.reviewCount})</span>
                            <span aria-hidden="true">·</span>
                            <span>{doc.nextAvailableSlot}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                        <span className="text-[11px] text-slate-500 truncate max-w-[170px]">
                          {doc.clinicName}
                        </span>
                        <button
                          onClick={() => onOpenBooking(doc)}
                          className="px-3 py-1 bg-teal-700 text-white rounded-lg font-semibold text-xs shadow-xs"
                        >
                          Book Slot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'visits' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-800">My Scheduled Visits</div>
                {appointments.map((apt) => (
                  <div key={apt.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{apt.providerName}</span>
                      <span className="text-[10px] bg-teal-50 text-teal-700 font-semibold px-2 py-0.5 rounded">
                        {apt.type === 'video_consult' ? 'Video' : 'In-Person'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {apt.date} at {apt.time} ({apt.durationMinutes} min)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Clinic: {apt.clinicName}
                    </div>
                    <div className="pt-2 flex gap-2">
                      {apt.type === 'video_consult' && (
                        <button
                          onClick={() => onJoinVideo(apt)}
                          className="flex-1 py-1.5 bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                        >
                          <Video className="w-3 h-3" />
                          <span>Join Video</span>
                        </button>
                      )}
                      <button
                        onClick={() => onOpenIntake(apt.id)}
                        className="flex-1 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Intake</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'intake' && (
              <div className="space-y-3 text-xs">
                <div className="text-xs font-bold text-slate-800">Health Intake & Insurance</div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-teal-600" />
                    <span>Digital Health Wallet</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Complete your digital clinical intake and verify insurance eligibility to skip the waiting room.
                  </p>
                  <button
                    onClick={() => onOpenIntake()}
                    className="w-full py-2 bg-teal-700 text-white rounded-lg font-semibold mt-2"
                  >
                    Open Fast-Track Intake
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-3 text-xs">
                <div className="text-xs font-bold text-slate-800">Patient Profile & Security</div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                      AJ
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Aditi Jha</div>
                      <div className="text-[11px] text-slate-500">aditijha7804@gmail.com</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                    <div><span className="font-medium">Insurance:</span> Blue Cross Blue Shield (Verified)</div>
                    <div><span className="font-medium">AES-256 Storage:</span> Enforced at Rest</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Native Bottom Tab Bar */}
          <div className="h-16 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] font-medium text-slate-500 z-40">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 ${
                activeTab === 'home' ? 'text-teal-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Explore</span>
            </button>
            <button
              onClick={() => setActiveTab('visits')}
              className={`flex flex-col items-center gap-1 ${
                activeTab === 'visits' ? 'text-teal-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Visits ({appointments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('intake')}
              className={`flex flex-col items-center gap-1 ${
                activeTab === 'intake' ? 'text-teal-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Intake</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 ${
                activeTab === 'profile' ? 'text-teal-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </div>

          {/* Home Indicator Bar */}
          <div className="h-4 bg-white flex items-center justify-center pb-1">
            <div className="w-28 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
