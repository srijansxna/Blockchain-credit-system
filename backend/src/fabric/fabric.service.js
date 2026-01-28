/**
 * Fabric CLI Service
 * Invokes Hyperledger Fabric via peer CLI
 */

import { execFile } from "child_process";
import path from "path";

console.log("FABRIC SERVICE LOADED");

const scriptPath = path.resolve(process.cwd(), "scripts/invokeCredit.sh");

export function submitCreditToBlockchain(payload) {
  console.log("submitCreditToBlockchain CALLED", payload);

  return new Promise((resolve, reject) => {
    const args = [
      payload.loanId,
      payload.score_commitment,
      payload.approval_status,
      payload.timestamp
    ];

    execFile(scriptPath, args, (error, stdout, stderr) => {
      if (error) {
        console.error("FABRIC CLI ERROR:", stderr || error.message);
        return reject(error);
      }
      console.log("FABRIC CLI SUCCESS:", stdout);
      resolve();
    });
  });
}
