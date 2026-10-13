import React, { useState } from 'react';
import { INSURANCE_PAYERS } from '../data/mockHealthcareData';
import { verifyInsuranceEligibility } from '../utils/insurance';
import { InsurancePolicy } from '../types/healthcare';
import { ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, CreditCard, DollarSign } from 'lucide-react';

export const InsuranceVerification: React.FC = () => {
  const [payerId, setPayerId] = useState('BCBS-01');
  const [memberId, setMemberId] = useState('XED948102394');
  const [groupNumber, setGroupNumber] = useState('GRP-9941');
  const [policyHolderName, setPolicyHolderName] = useState('Aditi Jha');
  const [loading, setLoading] = useState(false);
  const [policy, setPolicy] = useState<InsurancePolicy | null>({
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
    verifiedAt: new Date().toISOString(),
  });
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await verifyInsuranceEligibility({
        payerId,
        memberId,
        groupNumber,
        policyHolderName,
        relationship: 'self',
      });
      setPolicy(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Eligibility check failed');
      setPolicy(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-600" />
            <span>Real-Time Insurance Eligibility Verification</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant EDI 270/271 electronic health plan eligibility engine.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-medium">Direct Payer Gateway Connected</span>
        </div>
      </div>

      <form onSubmit={handleVerify} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="block text-slate-600 font-medium mb-1">Insurance Carrier</label>
          <select
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          >
            {INSURANCE_PAYERS.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.planType})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-600 font-medium mb-1">Subscriber / Member ID</label>
          <input
            type="text"
            required
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
          />
        </div>

        <div>
          <label className="block text-slate-600 font-medium mb-1">Group Number</label>
          <input
            type="text"
            value={groupNumber}
            onChange={(e) => setGroupNumber(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
          />
        </div>

        <div>
          <label className="block text-slate-600 font-medium mb-1">Insured Full Name</label>
          <input
            type="text"
            required
            value={policyHolderName}
            onChange={(e) => setPolicyHolderName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
          />
        </div>

        <div className="sm:col-span-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{loading ? 'Querying Payer Clearinghouse...' : 'Run Real-Time Verification'}</span>
          </button>
        </div>
      </form>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {policy && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Eligibility Confirmed · Active In-Network Benefits</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Verified: {policy.verifiedAt.slice(0, 19).replace('T', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="text-slate-500 text-[11px]">Specialist Copay</div>
              <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                ${policy.copayAmount}.00
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="text-slate-500 text-[11px]">Remaining Deductible</div>
              <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                ${policy.deductibleRemaining}.00
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="text-slate-500 text-[11px]">In-Network Co-Insurance</div>
              <div className="text-lg font-bold font-mono text-emerald-700 mt-1 tabular-nums">
                {policy.coveragePercentage}%
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="text-slate-500 text-[11px]">Member Status</div>
              <div className="text-lg font-bold text-teal-800 mt-1">
                Active
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
