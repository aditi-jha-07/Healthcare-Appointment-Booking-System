import React, { useState } from 'react';
import { Appointment, HipaaAuditLog } from '../types/healthcare';
import { ALL_120_PROVIDERS, CLINIC_LOCATIONS } from '../data/mockHealthcareData';
import { createAuditLogEntry } from '../utils/crypto';
import {
  Calendar,
  Users,
  ShieldCheck,
  Video,
  Building,
  TrendingDown,
  Search,
  Filter,
  FileText,
  Clock,
  Lock,
  Activity
} from 'lucide-react';

interface DoctorEHRDashboardProps {
  appointments: Appointment[];
  onStartVideoSession: (apt: Appointment) => void;
}

export const DoctorEHRDashboard: React.FC<DoctorEHRDashboardProps> = ({
  appointments,
  onStartVideoSession,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'providers' | 'audit_logs'>('schedule');
  const [clinicFilter, setClinicFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample Audit Logs
  const [auditLogs] = useState<HipaaAuditLog[]>([
    createAuditLogEntry('APPOINTMENT_CREATE', 'PATIENT', 'usr-aditi-901', 'apt-901'),
    createAuditLogEntry('PHI_READ', 'PROVIDER', 'dr-chen', 'intake-901'),
    createAuditLogEntry('INSURANCE_VERIFY', 'AUTOMATED_SYSTEM', 'sys-cron-88', 'claim-bcbs-441'),
    createAuditLogEntry('VIDEO_CALL_INIT', 'PROVIDER', 'dr-chen', 'room-twilio-rm77402'),
    createAuditLogEntry('PHI_WRITE', 'PATIENT', 'usr-aditi-901', 'intake-hipaa-consent'),
  ]);

  const filteredProviders = ALL_120_PROVIDERS.filter((p) => {
    if (clinicFilter !== 'all' && p.clinicId !== clinicFilter) return false;
    if (specialtyFilter !== 'all' && p.specialty !== specialtyFilter) return false;
    if (searchTerm.trim() && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top EHR Summary Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Network Operations & Provider Clinical EHR
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time synchronization across 8 regional clinics and 120 onboarded practitioners.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'schedule' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today's Schedule ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'providers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            120 Provider Network
          </button>
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'audit_logs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            HIPAA Audit Logs
          </button>
        </div>
      </div>

      {activeTab === 'schedule' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Upcoming Patient Encounters</span>
            </div>
            <div className="text-xs text-slate-500">
              <span className="font-mono tabular-nums">{appointments.length} active visits</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0 font-bold">
                    {apt.type === 'video_consult' ? <Video className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{apt.patientName}</span>
                      <span className="text-[11px] font-normal text-slate-500">with {apt.providerName}</span>
                    </div>
                    <div className="text-slate-600 mt-0.5">
                      <span className="font-semibold text-teal-800">{apt.date} at {apt.time}</span>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span>{apt.reasonForVisit}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{apt.clinicName}</span>
                      <span aria-hidden="true">·</span>
                      <span className={apt.insuranceVerified ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                        {apt.insuranceVerified ? 'Insurance Verified' : 'Self-Pay'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={apt.intakeCompleted ? 'text-emerald-700 font-medium' : 'text-amber-700'}>
                        {apt.intakeCompleted ? 'Intake Complete' : 'Intake Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {apt.type === 'video_consult' && (
                    <button
                      onClick={() => onStartVideoSession(apt)}
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Start Video Encounter</span>
                    </button>
                  )}
                  <div className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    {apt.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3 text-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter 120 onboarded providers by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
            </div>
            <select
              value={clinicFilter}
              onChange={(e) => setClinicFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="all">All Clinics (8 Locations)</option>
              {CLINIC_LOCATIONS.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="all">All Specialties</option>
              <option value="Primary Care">Primary Care</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
            </select>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700 flex justify-between">
              <span>Physician & Specialty</span>
              <span>Clinic & Utilization</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto text-xs">
              {filteredProviders.map((prov) => (
                <div key={prov.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                      {prov.name.split(' ')[1]?.[0] || 'D'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{prov.name}</div>
                      <div className="text-[11px] text-teal-700">{prov.specialty} · {prov.experienceYears} yrs experience</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-800 font-medium">{prov.clinicName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Rating: {prov.rating} · Fee: ${prov.consultationFee}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit_logs' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>HIPAA Compliance & Cryptographic Access Ledger (45 CFR § 164.312)</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              AES-256-GCM AT REST VERIFIED
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Actor Role</th>
                  <th className="p-3">Actor / Resource</th>
                  <th className="p-3">Security & Encryption</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="p-3 text-slate-500 tabular-nums">{log.timestamp.slice(0, 19).replace('T', ' ')}</td>
                    <td className="p-3 font-semibold text-slate-900">{log.action}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[10px] font-sans font-medium">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">
                      {log.actorId} → {log.resourceId}
                    </td>
                    <td className="p-3 text-emerald-700 flex items-center gap-1 font-sans">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>{log.encryptionStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
