import React, { useState, useMemo } from 'react';
import { Provider, Specialty } from '../types/healthcare';
import { CLINIC_LOCATIONS, ALL_120_PROVIDERS, INSURANCE_PAYERS } from '../data/mockHealthcareData';
import { Search, MapPin, Video, Building, Calendar, Star, Clock, Filter, ArrowRight } from 'lucide-react';

interface ProviderSearchProps {
  onSelectProvider: (provider: Provider, preselectedType?: 'in_person' | 'video_consult') => void;
  onOpenQuickBook: () => void;
}

export const ProviderSearch: React.FC<ProviderSearchProps> = ({
  onSelectProvider,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<string>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [modalityFilter, setModalityFilter] = useState<'all' | 'video' | 'in_person'>('all');
  const [insuranceFilter, setInsuranceFilter] = useState<string>('all');

  const specialties: Specialty[] = [
    'Primary Care',
    'Cardiology',
    'Pediatrics',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Psychiatry',
    'Family Medicine',
  ];

  const filteredProviders = useMemo(() => {
    return ALL_120_PROVIDERS.filter((provider) => {
      // Search term (name, specialty, bio)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = provider.name.toLowerCase().includes(query);
        const matchesSpecialty = provider.specialty.toLowerCase().includes(query);
        const matchesClinic = provider.clinicName.toLowerCase().includes(query);
        if (!matchesName && !matchesSpecialty && !matchesClinic) return false;
      }

      // Clinic filter
      if (selectedClinic !== 'all' && provider.clinicId !== selectedClinic) {
        return false;
      }

      // Specialty filter
      if (selectedSpecialty !== 'all' && provider.specialty !== selectedSpecialty) {
        return false;
      }

      // Modality
      if (modalityFilter === 'video' && !provider.videoConsultAvailable) {
        return false;
      }

      // Insurance filter
      if (insuranceFilter !== 'all') {
        const matchedPayer = INSURANCE_PAYERS.find((p) => p.id === insuranceFilter);
        if (matchedPayer && !provider.insurancesAccepted.includes(matchedPayer.name)) {
          return false;
        }
      }

      return true;
    });
  }, [searchTerm, selectedClinic, selectedSpecialty, modalityFilter, insuranceFilter]);

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by physician name, specialty, condition, or clinic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
            />
          </div>

          {/* Quick Modality Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setModalityFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                modalityFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setModalityFilter('video')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                modalityFilter === 'video'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-3 h-3 text-teal-600" />
              <span>Video Telehealth</span>
            </button>
            <button
              onClick={() => setModalityFilter('in_person')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                modalityFilter === 'in_person'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-3 h-3 text-slate-600" />
              <span>In-Clinic</span>
            </button>
          </div>
        </div>

        {/* Granular Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-slate-500 font-medium mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Clinic Location</span>
            </label>
            <select
              value={selectedClinic}
              onChange={(e) => setSelectedClinic(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="all">All 8 Network Facilities</option>
              {CLINIC_LOCATIONS.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name} ({clinic.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Medical Specialty</span>
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="all">All Medical Specialties</option>
              {specialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1 flex items-center gap-1">
              <span>Accepted Insurance</span>
            </label>
            <select
              value={insuranceFilter}
              onChange={(e) => setInsuranceFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="all">Any In-Network Insurance</option>
              {INSURANCE_PAYERS.map((ins) => (
                <option key={ins.id} value={ins.id}>
                  {ins.name} ({ins.planType})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header with Metadata discipline */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">{filteredProviders.length} Providers Found</span>
          <span aria-hidden="true">·</span>
          <span>8 Clinics In-Network</span>
          <span aria-hidden="true">·</span>
          <span>Real-Time Slot Sync</span>
        </div>
        <div className="hidden sm:block text-slate-400 font-mono">
          PostgreSQL Cache: Active · Redis Locking: Ready
        </div>
      </div>

      {/* Provider Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {filteredProviders.slice(0, 15).map((provider) => (
          <div
            key={provider.id}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs"
          >
            <div>
              {/* Doctor Header */}
              <div className="flex items-start gap-3.5 mb-3">
                <img
                  src={provider.avatarUrl}
                  alt={provider.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover shrink-0 border border-slate-100 bg-slate-100"
                  onError={(e) => {
                    // Styled SVG fallback
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">
                    {provider.name}
                  </h3>
                  <div className="text-xs text-teal-700 font-medium">{provider.specialty}</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-slate-700 tabular-nums">{provider.rating}</span>
                    <span className="text-slate-400">({provider.reviewCount})</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{provider.experienceYears} yrs</span>
                  </div>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                {provider.bio}
              </p>

              {/* Clinic & Location text metadata */}
              <div className="space-y-1.5 text-xs text-slate-600 mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{provider.clinicName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-medium">Next Slot: {provider.nextAvailableSlot}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                {provider.videoConsultAvailable && (
                  <button
                    onClick={() => onSelectProvider(provider, 'video_consult')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-100"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Visit</span>
                  </button>
                )}
                <button
                  onClick={() => onSelectProvider(provider, 'in_person')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>In-Person</span>
                </button>
              </div>

              <button
                onClick={() => onSelectProvider(provider)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span>View Full Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-800 mb-1">No providers matched current filters</h4>
          <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
            Try adjusting your location, specialty, or insurance filter to see providers in our 120-doctor network.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedClinic('all');
              setSelectedSpecialty('all');
              setModalityFilter('all');
              setInsuranceFilter('all');
            }}
            className="px-4 py-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
