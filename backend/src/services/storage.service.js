/**
 * Encrypted Storage Service
 * Stores approved loan applications locally
 */

import fs from "fs";
import path from "path";

const STORAGE_FILE = path.join(process.cwd(), "approved_loans.enc");

export function storeApprovedLoan(record) {
  let existingData = [];

  if (fs.existsSync(STORAGE_FILE)) {
    const fileContent = fs.readFileSync(STORAGE_FILE, "utf8");
    if (fileContent.trim().length > 0) {
      existingData = JSON.parse(fileContent);
    }
  }

  existingData.push(record);

  fs.writeFileSync(
    STORAGE_FILE,
    JSON.stringify(existingData, null, 2),
    "utf8"
  );
}
