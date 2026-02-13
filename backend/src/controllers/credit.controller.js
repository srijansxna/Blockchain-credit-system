/**
 * Credit Controller
 * Isolation Debug Version
 * Evaluation + ZKP + Encryption (No Storage, No Fabric)
 */

import { generateLoanId } from "../utils/id.util.js";
import { createCreditApplication } from "../models/credit.model.js";
import { evaluateCredit } from "../services/credit.service.js";
import { generateEligibilityProof } from "../services/zkp.service.js";
import { encryptApplication } from "../services/encryption.service.js";

export async function applyForCredit(req, res) {
  try {
    console.log("STEP 1: Building application");

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

    console.log("STEP 2: Evaluation");

    const evaluation = evaluateCredit(application);

    console.log("STEP 3: ZKP");

    const proof = generateEligibilityProof(evaluation);

    console.log("STEP 4: Encryption");

    const encrypted = encryptApplication(application);

    return res.status(200).json({
      message: "Evaluation + ZKP + Encryption working",
      loanId,
      score: evaluation.final_score,
      zkp_commitment: proof?.zkp_proof?.commitment || "none",
      encrypted_preview:
        encrypted?.encrypted_payload?.slice?.(0, 20) || "ok"
    });

  } catch (error) {
    console.error("CREDIT FLOW ERROR:", error);
    return res.status(500).json({
      error: error.message
    });
  }
}
