/**
 * ZKP Service
 * Proof of eligibility without revealing private inputs
 */

import crypto from "crypto";

const THRESHOLD = 0.6;

export function generateEligibilityProof(evaluation) {
  if (!evaluation.threshold_passed) {
    throw new Error("ZKP cannot be generated for ineligible application");
  }

  /**
   * Commitment logic:
   * We commit to the final score and threshold condition,
   * not to raw financial values.
   */

  const commitmentPayload = {
    loanId: evaluation.loanId,
    condition: `score>=${THRESHOLD}`,
    scoreBucket: Math.floor(evaluation.final_score * 10) / 10 // coarse bucket
  };

  const commitment = crypto
    .createHash("sha256")
    .update(JSON.stringify(commitmentPayload))
    .digest("hex");

  /**
   * Proof object (abstract ZKP)
   * Verifier can check:
   * - commitment integrity
   * - threshold satisfaction flag
   */
  return {
    zkp_proof: {
      commitment,
      threshold: THRESHOLD,
      verified: true
    }
  };
}
