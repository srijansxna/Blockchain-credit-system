/**
 * Credit Controller
 * Storage Isolation Test
 */

import { generateLoanId } from "../utils/id.util.js";
import { createCreditApplication } from "../models/credit.model.js";
import { evaluateCredit } from "../services/credit.service.js";
import { generateEligibilityProof } from "../services/zkp.service.js";
import { encryptApplication } from "../services/encryption.service.js";
import { storeApprovedLoan } from "../services/storage.service.js";

export async function applyForCredit(req, res) {
  try {
    const loanId = generateLoanId();

    const application = createCreditApplication({
      loanId,
      applicant: {
        name: req.body.fullName,
        aadhaar: req.body.aadhaarNumber,
        pan: req.body.panNumber
      },
      financials: {
        salary_3_month_avg: req.body.avgSalary,
        itr: {
          year_1: req.body.itrYear1,
          year_2: req.body.itrYear2,
          year_3: req.body.itrYear3
        }
      },
      loan: {
        amount_requested: req.body.loanAmount
      }
    });

    const evaluation = evaluateCredit(application);
    const proof = generateEligibilityProof(evaluation);
    const encrypted = encryptApplication(application);

    console.log("TESTING STORAGE");

    storeApprovedLoan({
      loanId,
      encrypted_payload: encrypted.encrypted_payload,
      encryption_meta: encrypted.encryption_meta
    });

    console.log("STORAGE COMPLETED");

    return res.status(200).json({
      message: "Storage working",
      loanId
    });

  } catch (error) {
    console.error("STORAGE ERROR:", error);
    return res.status(500).json({
      error: error.message
    });
  }
}
