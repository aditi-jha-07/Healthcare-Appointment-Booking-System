import { InsurancePolicy } from '../types/healthcare';
import { INSURANCE_PAYERS } from '../data/mockHealthcareData';

export interface VerificationRequest {
  payerId: string;
  memberId: string;
  groupNumber?: string;
  policyHolderName: string;
  relationship: 'self' | 'spouse' | 'child' | 'other';
  dateOfBirth?: string;
}

export function verifyInsuranceEligibility(request: VerificationRequest): Promise<InsurancePolicy> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const payer = INSURANCE_PAYERS.find((p) => p.id === request.payerId);
      if (!payer) {
        reject(new Error('Selected health plan is not recognized or in network.'));
        return;
      }

      // Check member ID format: require alphanumeric at least 6 chars
      if (!request.memberId || request.memberId.trim().length < 6) {
        reject(new Error('Invalid Member ID format. Must contain at least 6 alphanumeric characters.'));
        return;
      }

      // Calculate realistic copay & deductible
      const copay = payer.defaultCopay;
      const deductibleRemaining = payer.id === 'MEDICARE-06' ? 0 : Math.floor(Math.random() * 300);
      const coveragePercentage = payer.id === 'MEDICARE-06' ? 100 : 80 + Math.floor(Math.random() * 15);

      const policy: InsurancePolicy = {
        payerName: payer.name,
        payerId: payer.id,
        memberId: request.memberId.toUpperCase().trim(),
        groupNumber: request.groupNumber?.trim() || 'GRP-STANDARD',
        policyHolderName: request.policyHolderName,
        relationship: request.relationship,
        status: 'verified',
        copayAmount: copay,
        deductibleRemaining,
        coveragePercentage,
        verifiedAt: new Date().toISOString(),
      };

      resolve(policy);
    }, 700); // realistic network verification latency
  });
}
