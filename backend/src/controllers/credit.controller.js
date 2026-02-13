/**
 * Credit Controller
 * Orchestrates evaluation, ZKP proof, encryption, and storage
 * (Blockchain layer mocked for cloud deployment)
 */

//import { submitCreditToBlockchain } from "../fabric/fabric.service.js";

import { generateLoanId } from "../utils/id.util.js";
import { createCreditApplication } from "../models/credit.model.js";
import { evaluateCredit } from "../services/credit.service.js";
import { encryptApplication } from "../services/encryption.service.js";
import { storeApprovedLoan } from "../services/storage.service.js";
import { generateEligibilityProof } from "../services/zkp.service.js";

/**export async function applyForCredit(req, res) {
  try {
    // 1. Generate system loan ID
    const loanId = generateLoanId();

    // 2. Build canonical credit application
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

    // 3. Evaluate creditworthiness
    const evaluation = evaluateCredit(application);

    // 4. Reject if below threshold
    if (!evaluation.threshold_passed) {
      return res.status(400).json({
        loanId,
        status: "REJECTED",
        score: evaluation.final_score
      });
    }

    // 5. Generate ZKP-style eligibility proof
    const proof = generateEligibilityProof(evaluation);

    // 6. MOCK Blockchain Write (Fabric Disabled)
    const mockBlockchainResponse = {
      transactionId: "MOCK-TX-" + Math.random().toString(36).substring(2, 12),
      committed: true,
      timestamp: new Date().toISOString()
    };

    // 7. Encrypt approved application
    const encrypted = encryptApplication(application);

    // 8. Store encrypted record locally
    storeApprovedLoan({
      loanId,
      encrypted_payload: encrypted.encrypted_payload,
      encryption_meta: encrypted.encryption_meta
    });

    // 9. Respond success
    return res.status(200).json({
      loanId,
      status: "ELIGIBLE",
      score: evaluation.final_score,
      zkp_commitment: proof.zkp_proof.commitment,
      transactionId: mockBlockchainResponse.transactionId
    });

  } catch (error) {
    console.error("CREDIT FLOW ERROR:", error);
    return res.status(500).json({
      error: error.message
    });
  }
}*/

export async function applyForCredit(req, res) {
  try {
    console.log("STEP 1: Controller entered");

    const loanId = "DEBUG-" + Date.now();

    console.log("STEP 2: Returning early");

    return res.status(200).json({
      loanId,
      message: "Controller working",
      body: req.body
    });

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}
