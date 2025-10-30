import express from "express";
import { db } from "../../database/db";
import {
  backupCodesTable,
  devicesTable,
  twoFactorAuthenticationTable,
} from "../../database";
import { and, eq } from "drizzle-orm";
import speakeasy from "speakeasy";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
const router = express.Router();
const appUrl = process.env.DESIGN_APP_URL as string;
const rpID = appUrl.includes("localhost")
  ? "localhost"
  : appUrl.replace(/^https?:\/\//, "");

router.post("/finish", async (req, res) => {
  const { type, code, ticket, data } = req.body;
  const verifyTicket = verify(
    ticket,
    process.env.MFA_JWT_SECRET as string
  ) as JwtPayload;
  if (!verifyTicket.userId || verifyTicket.type !== "ticket")
    return res.status(400).json({
      success: false,
      message: "Invalid ticket",
    });
  if (!verifyTicket.options.includes(type))
    return res.status(400).json({
      success: false,
      message: "This type not supported for this ticket",
    });
  if (type == "totp") {
    const [totp] = await db
      .select()
      .from(twoFactorAuthenticationTable)
      .where(
        and(
          eq(twoFactorAuthenticationTable.userId, verifyTicket.userId),
          eq(twoFactorAuthenticationTable.verified, true)
        )
      );

    if (!totp)
      return res.status(400).json({
        success: false,
        message: "This type is not enabled for this account",
      });

    const verify = speakeasy.totp.verify({
      secret: totp.secret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!verify)
      return res.status(400).json({
        success: false,
        message: "Invalid code",
        errors: { code: ["Invalid code provided."] },
      });
  } else if (type == "backup") {
    const [findCode] = await db
      .select()
      .from(backupCodesTable)
      .where(
        and(
          eq(backupCodesTable.userId, verifyTicket.userId),
          eq(backupCodesTable.key, code),
          eq(backupCodesTable.used, false)
        )
      );

    if (!findCode)
      return res.status(400).json({
        success: false,
        message: "Invalid code",
        errors: {
          code: ["Backup code is invalid or already used"],
        },
      });

    await db
      .update(backupCodesTable)
      .set({ used: true })
      .where(eq(backupCodesTable.id, findCode.id));
  } else if (type == "webauthn") {
    const [device] = await db
      .select()
      .from(devicesTable)
      .where(
        and(
          eq(
            devicesTable.credId,
            btoa(data.attestationResponse.rawId).replace(/=+$/, "")
          ),
          eq(devicesTable.userId, verifyTicket.userId)
        )
      );
    if (!device)
      return res
        .status(400)
        .json({ success: false, message: "device not found" });
    const challenge = JSON.parse(
      atob(data.attestationResponse.response.clientDataJSON)
    ).challenge;

    const verification = await verifyAuthenticationResponse({
      response: data.attestationResponse,
      expectedChallenge: challenge,
      expectedOrigin: appUrl,
      expectedRPID: rpID,
      credential: {
        id: device.id,
        publicKey: new Uint8Array(Buffer.from(device.publicKey, "base64")),
        counter: device.counter,
        transports: JSON.parse(device.transports as string),
      },
    });

    if (!verification.verified)
      return res
        .status(400)
        .json({ success: false, message: "validation failed." });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid type provided." });
  }
  const token = sign(
    {
      type,
      userId: verifyTicket.userId,
    },
    process.env.MFA_JWT_SECRET as string,
    { expiresIn: "10m" }
  );

  return res.json({
    token,
  });
});

export default router;
