/**
 * Credit Controller
 * Final Cloud Deployment Version
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

    // ✅ IMPORTANT: Force numeric casting
    const application = createCreditApplication({
      loanId,
      applicant: {
        name: req.body.fullName,
        aadhaar: req.body.aadhaarNumber,
        pan: req.body.panNumber
      },
      financials: {
        salary_3_month_avg: Number(req.body.avgSalary),
        itr: {
          year_1: Number(req.body.itrYear1),
          year_2: Number(req.body.itrYear2),
          year_3: Number(req.body.itrYear3)
        }
      },
      loan: {
        amount_requested: Number(req.body.loanAmount)
      }
    });

    const evaluation = evaluateCredit(application);

    // Reject case
    if (!evaluation.threshold_passed) {
      return res.status(400).json({
        loanId,
        status: "REJECTED",
        score: evaluation.final_score
      });
    }

    const proof = generateEligibilityProof(evaluation);
    const encrypted = encryptApplication(application);

    // Store encrypted record
    storeApprovedLoan({
      loanId,
      encrypted_payload: encrypted.encrypted_payload,
      encryption_meta: encrypted.encryption_meta
    });

    return res.status(200).json({
      loanId,
      status: "ELIGIBLE",
      score: evaluation.final_score,
      zkp_commitment: proof.zkp_proof.commitment
    });

  } catch (error) {
    console.error("CREDIT FLOW ERROR:", error);
    return res.status(500).json({
      error: error.message
    });
  }
}
