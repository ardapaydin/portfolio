import express from "express";
import { requireNoAuth } from "../../helpers/middlewares/auth";
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import BodyValidationMiddleware from "../../helpers/middlewares/validation";
import { passkeyLoginSchema } from "../../helpers/validations/auth/passkey";
import { db } from "../../database/db";
import { devicesTable } from "../../database";
import { eq } from "drizzle-orm";
import { signToken } from "../../helpers/jwt";
const router = express.Router();
const appUrl = process.env.DESIGN_APP_URL as string;
const rpID = appUrl.includes("localhost")
  ? "localhost"
  : appUrl.replace(/^https?:\/\//, "");

router.post("/passkey/login/start", requireNoAuth, async (req, res) => {
  const data = await generateAuthenticationOptions({
    userVerification: "preferred",
    rpID,
  });

  return res.status(200).json({ success: true, data });
});

router.post(
  "/passkey/login/finish",
  requireNoAuth,
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, passkeyLoginSchema),
  async (req, res) => {
    const { attestationResponse } = req.body;
    const [device] = await db
      .select()
      .from(devicesTable)
      .where(
        eq(
          devicesTable.credId,
          btoa(attestationResponse.rawId).replace(/=+$/, "")
        )
      );

    if (!device || !device?.userId)
      return res.status(400).json({
        success: false,
        message: "Device with this cred id not found.",
      });

    const challenge = JSON.parse(
      atob(attestationResponse.response.clientDataJSON)
    ).challenge;
    const verification = await verifyAuthenticationResponse({
      response: attestationResponse,
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

    res.json({
      success: true,
      data: { id: device.userId, token: signToken(device.userId) },
    });
  }
);

export default router;
