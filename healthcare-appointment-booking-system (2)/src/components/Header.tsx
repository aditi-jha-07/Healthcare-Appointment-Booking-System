import React from 'react';
import { ShieldCheck, Smartphone, Monitor, Stethoscope, Video, Calendar } from 'lucide-react';

export type AppViewMode = 'web_booking' | 'mobile_app' | 'ehr_portal' | 'telehealth_room';

interface HeaderProps {
  currentView: AppViewMode;
  onSelectView: (view: AppViewMode) => void;
  activeAppointmentsCount: number;
  onOpenQuickBook: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  activeAppointmentsCount,
  onOpenQuickBook,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Primary Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectView('web_booking')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm font-semibold">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block whitespace-nowrap">
                Aegis Health Network
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectView('web_booking')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-teal-700 py-1 ${
              currentView === 'web_booking' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : ''
            }`}
          >
            Find Care & Slots
          </button>
          <button
            onClick={() => onSelectView('web_booking')}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-teal-700 py-1"
          >
            My Appointments ({activeAppointmentsCount})
          </button>
          <button
            onClick={() => onSelectView('ehr_portal')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-teal-700 py-1 ${
              currentView === 'ehr_portal' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : ''
            }`}
          >
            Provider EHR & 120 Network
          </button>
          <button
            onClick={() => onSelectView('telehealth_room')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-teal-700 py-1 ${
              currentView === 'telehealth_room' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : ''
            }`}
          >
            Twilio Video Room
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenQuickBook}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Book Appointment
          </button>
        </div>
      </div>

      {/* Sub-bar: Platform Switcher & HIPAA Status */}
      <div className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 p-0.5 bg-slate-200/80 rounded-lg">
            <button
              onClick={() => onSelectView('web_booking')}
              className={`flex items-center gap-1.5 px-3 py-1 font-medium rounded-md transition-all whitespace-nowrap ${
                currentView === 'web_booking'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Next.js Web Portal</span>
            </button>
            <button
              onClick={() => onSelectView('mobile_app')}
              className={`flex items-center gap-1.5 px-3 py-1 font-medium rounded-md transition-all whitespace-nowrap ${
                currentView === 'mobile_app'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>React Native Mobile</span>
            </button>
            <button
              onClick={() => onSelectView('ehr_portal')}
              className={`flex items-center gap-1.5 px-3 py-1 font-medium rounded-md transition-all whitespace-nowrap ${
                currentView === 'ehr_portal'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Provider Schedule & 35% Stats</span>
            </button>
            <button
              onClick={() => onSelectView('telehealth_room')}
              className={`flex items-center gap-1.5 px-3 py-1 font-medium rounded-md transition-all whitespace-nowrap ${
                currentView === 'telehealth_room'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>WebRTC Consultation</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-slate-700">HIPAA Compliant</span>
            <span aria-hidden="true">·</span>
            <span>AES-256 at Rest</span>
            <span aria-hidden="true">·</span>
            <span>Redis TTL Locks</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-500">120 Providers Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
