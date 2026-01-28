import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { decryptApplication } from "../services/encryption.service.js";

// -----------------------------
// Read loanId from terminal
// -----------------------------
const loanId = process.argv[2];

if (!loanId) {
  console.error("❌ Usage: node src/utils/bankCli.js <loanId>");
  process.exit(1);
}

// -----------------------------
// Load encrypted loans file
// -----------------------------
const dataPath = path.resolve("approved_loans.enc");

if (!fs.existsSync(dataPath)) {
  console.error("❌ approved_loans.enc not found");
  process.exit(1);
}

try {
  const raw = fs.readFileSync(dataPath, "utf8");
  const parsed = JSON.parse(raw);

  // ✅ Normalize to array
  const loans = Array.isArray(parsed) ? parsed : [parsed];

  const record = loans.find(l => l.loanId === loanId);
  if (!record) {
    throw new Error("Loan ID not found in bank records");
  }

  if (
    !record.encryption_meta ||
    !record.encryption_meta.iv ||
    !record.encryption_meta.authTag ||
    !record.encrypted_payload
  ) {
    throw new Error("Invalid or legacy encrypted record");
  }

  // 🔐 Decrypt
  const decrypted = decryptApplication(record, loanId);

  console.log("\n🏦 BANK LOAN INSPECTION");
  console.log("────────────────────────");
  console.log("Loan ID:", loanId);

  console.log("\nApplicant Details:");
  console.log(" Name:", decrypted.applicant.name);
  console.log(" Aadhaar:", decrypted.applicant.aadhaar);
  console.log(" PAN:", decrypted.applicant.pan);

  console.log("\nFinancial Details:");
  console.log(" Avg Salary:", decrypted.financials.salary_3_month_avg);
  console.log(" ITR Year 1:", decrypted.financials.itr.year_1);
  console.log(" ITR Year 2:", decrypted.financials.itr.year_2);
  console.log(" ITR Year 3:", decrypted.financials.itr.year_3);

  console.log("\nLoan Request:");
  console.log(" Amount Requested:", decrypted.loan.amount_requested);

  console.log("\n✅ Decryption successful using BANK_MASTER_KEY");

} catch (err) {
  console.error("❌ Bank inspection failed:", err.message);
}
