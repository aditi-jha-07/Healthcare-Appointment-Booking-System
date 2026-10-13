import React, { useState } from 'react';
import { Appointment } from '../types/healthcare';
import { Bell, Send, CheckCircle2, TrendingDown, Clock, ShieldCheck, Phone, Mail } from 'lucide-react';

interface RemindersManagerProps {
  appointments: Appointment[];
  onTriggerTestReminder: (apt: Appointment, channel: 'SMS' | 'Email') => void;
}

export const RemindersManager: React.FC<RemindersManagerProps> = ({
  appointments,
  onTriggerTestReminder,
}) => {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(appointments[0]?.id || '');
  const [testNotificationSent, setTestNotificationSent] = useState<string | null>(null);

  const selectedApt = appointments.find((a) => a.id === selectedAppointmentId) || appointments[0];

  const handleSendTest = (channel: 'SMS' | 'Email') => {
    if (!selectedApt) return;
    onTriggerTestReminder(selectedApt, channel);
    setTestNotificationSent(`Test ${channel} reminder dispatched to ${channel === 'SMS' ? selectedApt.patientPhone : selectedApt.patientEmail}`);
    setTimeout(() => {
      setTestNotificationSent(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* 35% No-Show Reduction KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>No-Show Rate Reduction</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-2 tabular-nums">
            -35.3%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Baseline: 18.4% → Current: 11.9%
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Reminders Dispatched (30d)</span>
            <Bell className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            28,490
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            99.8% SMS delivery success rate
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Slots Saved by Re-Booking</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            1,412
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Early cancellation release window
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Onboarded Providers</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            120
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across 8 regional clinic centers
          </div>
        </div>
      </div>

      {/* Automated Reminder Architecture & Testing Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Cadence Architecture */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Automated Reminder Cadence Engine
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Scheduled cron workers trigger bidirectional SMS and email notices before scheduled appointments.
            </p>
          </div>

          <div className="space-y-3">
            {/* 24-hour trigger */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>T - 24 Hours: Primary Confirmation Notice</span>
                </span>
                <span className="text-[11px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  SMS & Email
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Sends full clinic directions, doctor details, calendar attachment (.ics), and 1-tap fast confirmation ("Reply YES to confirm, NO to reschedule").
              </p>
            </div>

            {/* 2-hour trigger */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>T - 2 Hours: Urgent Check-in & Video Link</span>
                </span>
                <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  SMS Only
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Dispatches secure Twilio WebRTC video join link for telehealth appointments, or arrival parking guidance and digital intake check-in link for in-clinic visits.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Live Test Dispatcher */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Simulate Reminder Dispatch
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an active appointment to test automated delivery.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Target Appointment</label>
              <select
                value={selectedAppointmentId}
                onChange={(e) => setSelectedAppointmentId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                {appointments.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.providerName} · {apt.date} at {apt.time} ({apt.patientName})
                  </option>
                ))}
              </select>
            </div>

            {selectedApt && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-slate-600">
                <div><span className="font-medium text-slate-800">Patient:</span> {selectedApt.patientName}</div>
                <div><span className="font-medium text-slate-800">Phone:</span> {selectedApt.patientPhone}</div>
                <div><span className="font-medium text-slate-800">Email:</span> {selectedApt.patientEmail}</div>
                <div><span className="font-medium text-slate-800">Location:</span> {selectedApt.clinicName}</div>
              </div>
            )}

            {testNotificationSent && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-medium">{testNotificationSent}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleSendTest('SMS')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Dispatch Test SMS</span>
              </button>
              <button
                onClick={() => handleSendTest('Email')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors shadow-xs"
              >
                <Mail className="w-4 h-4" />
                <span>Dispatch Test Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
