/**
 * Loan / Credit ID Generator
 */

import crypto from "crypto";

export function generateLoanId() {
  return crypto.randomUUID();
}
