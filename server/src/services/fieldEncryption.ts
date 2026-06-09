import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

const ENCRYPTION_PREFIX = "enc:v1";

const getEncryptionKey = (): Buffer => {
  const secret = process.env.DATA_ENCRYPTION_KEY || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("DATA_ENCRYPTION_KEY eller JWT_SECRET saknas");
  }

  return createHash("sha256").update(secret).digest();
};

export const isEncryptedValue = (value: unknown): value is string => {
  return typeof value === "string" && value.startsWith(`${ENCRYPTION_PREFIX}:`);
};

export const encryptSensitiveValue = (value: string): string => {
  if (!value || isEncryptedValue(value)) {
    return value;
  }

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const authenticationTag = cipher.getAuthTag();

  return [
    ENCRYPTION_PREFIX,
    iv.toString("base64url"),
    authenticationTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(":");
};

export const decryptSensitiveValue = (value: string): string => {
  if (!isEncryptedValue(value)) {
    return value;
  }

  const [, , encodedIv, encodedTag, encodedValue] = value.split(":");
  if (!encodedIv || !encodedTag || !encodedValue) {
    throw new Error("Ogiltigt krypterat dataformat");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(encodedIv, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(encodedTag, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encodedValue, "base64url")),
    decipher.final(),
  ]).toString("utf8");
};
