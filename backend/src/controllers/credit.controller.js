/**
 * Credit Controller
 * Isolation Debug Version
 * Evaluation + ZKP + Encryption (No Storage, No Fabric)
 */

import { evaluateCredit } from "../services/credit.service.js";
import { generateEligibilityProof } from "../services/zkp.service.js";
import { encryptApplication } from "../services/encryption.service.js";

export async function applyForCredit(req, res) {
  try {
    console.log("STEP 1: Evaluation");

    const application = {
      applicant: {
        name: req.body.fullName
      },
      financials: {
        salary_3_month_avg: req.body.avgSalary
      }
    };

    const evaluation = evaluateCredit(application);

    console.log("STEP 2: ZKP");

    const proof = generateEligibilityProof(evaluation);

    console.log("STEP 3: Encryption");

    const encrypted = encryptApplication(application);

    return res.status(200).json({
      message: "Evaluation + ZKP + Encryption working",
      evaluation,
      zkp_commitment: proof?.zkp_proof?.commitment || "none",
      encrypted_preview:
        encrypted?.encrypted_payload?.slice?.(0, 20) || "encryption ok"
    });

  } catch (error) {
    console.error("CREDIT FLOW ERROR:", error);
    return res.status(500).json({
      error: error.message
    });
  }
}
