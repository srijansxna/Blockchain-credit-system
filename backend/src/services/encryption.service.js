import crypto from "crypto";

/**
 * Derive a per-loan encryption key using the bank master key
 */
function deriveLoanKey(masterKey, loanId) {
  return crypto
    .createHmac("sha256", masterKey)
    .update(loanId)
    .digest()
    .slice(0, 32); // 256-bit key
}

/**
 * Encrypt approved loan application (bank-grade)
 */
export function encryptApplication(application) {
  const masterKey = Buffer.from(process.env.BANK_MASTER_KEY, "base64");

  if (!masterKey || masterKey.length !== 32) {
    throw new Error("BANK_MASTER_KEY is missing or invalid");
  }

  if (!application.loanId) {
    throw new Error("Loan ID missing during encryption");
  }

  const loanId = application.loanId;
  const key = deriveLoanKey(masterKey, loanId);

  const iv = crypto.randomBytes(12); // AES-GCM standard
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(
    JSON.stringify(application),
    "utf8",
    "base64"
  );
  encrypted += cipher.final("base64");

  return {
    encrypted_payload: encrypted,
    encryption_meta: {
      algorithm: "aes-256-gcm",
      iv: iv.toString("base64"),
      authTag: cipher.getAuthTag().toString("base64")
    }
  };
}

/**
 * Decrypt approved loan application (bank-only)
 * loanId MUST be provided externally
 */
export function decryptApplication(record, loanId) {
  const masterKey = Buffer.from(process.env.BANK_MASTER_KEY, "base64");

  if (!masterKey || masterKey.length !== 32) {
    throw new Error("BANK_MASTER_KEY is missing or invalid");
  }

  if (!loanId) {
    throw new Error("Loan ID required for decryption");
  }

  if (
    !record.encryption_meta ||
    !record.encryption_meta.iv ||
    !record.encryption_meta.authTag ||
    !record.encrypted_payload
  ) {
    throw new Error("Invalid or legacy encrypted record");
  }

  const key = deriveLoanKey(masterKey, loanId);

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(record.encryption_meta.iv, "base64")
  );

  decipher.setAuthTag(
    Buffer.from(record.encryption_meta.authTag, "base64")
  );

  let decrypted = decipher.update(
    record.encrypted_payload,
    "base64",
    "utf8"
  );
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
}
