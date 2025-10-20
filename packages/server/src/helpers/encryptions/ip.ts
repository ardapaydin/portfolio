import crypto from "crypto";

if (!process.env.ENCRYPTION_KEY || !process.env.ENCRYPTION_IV)
  throw new Error(
    "ENCRYPTION_KEY and ENCRYPTION_IV must be set in environment variables."
  );

const x = {
  key: Buffer.from(process.env.ENCRYPTION_KEY, "hex"),
  iv: Buffer.from(process.env.ENCRYPTION_IV, "hex"),
};

export const encryptIp = (ip: string) => {
  let cipher = crypto.createCipheriv("aes-256-cbc", x.key, x.iv);
  let encrypted = cipher.update(ip, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decryptIp = (encrypted: string) => {
  let decipher = crypto.createDecipheriv("aes-256-cbc", x.key, x.iv);
  let dc = decipher.update(encrypted, "utf-8", "hex");
  dc = decipher.final("hex");
  return dc;
};
