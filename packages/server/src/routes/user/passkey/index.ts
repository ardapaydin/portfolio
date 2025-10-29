import express from "express";
import { requireAuth } from "../../../helpers/middlewares/auth";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { db } from "../../../database/db";
import { devicesTable, usersTable } from "../../../database";
import { eq } from "drizzle-orm";
import { bufferToBase64URLString } from "@simplewebauthn/browser";
import BodyValidationMiddleware from "../../../helpers/middlewares/validation";
import { passkeyRegisterResponse } from "../../../helpers/validations/user/passkey/response";

const router = express.Router();

const rpName = process.env.APP_NAME as string;
const appUrl = process.env.DESIGN_APP_URL as string;
const rpID = appUrl.includes("localhost")
  ? "localhost"
  : appUrl.replace(/^https?:\/\//, "");

const challenges: Record<string, string> = {};

router.post("/register-request", requireAuth, async (req, res) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.user!.id));

  const devices = await db
    .select()
    .from(devicesTable)
    .where(eq(devicesTable.userId, user.id));

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: new TextEncoder().encode(user.id),
    userName: user.id,
    userDisplayName: user.name || "",
    attestationType: "none",
    timeout: 60000,
    excludeCredentials: devices.map((d) => ({
      id: d.id,
      type: "public-key",
      transports: JSON.parse(d.transports as string),
    })),
    supportedAlgorithmIDs: [-7, -257],
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
  });

  challenges[user.id] = options.challenge;
  res.json(options);
});

router.post(
  "/register-response",
  requireAuth,
  (req, res, next) =>
    BodyValidationMiddleware(req, res, next, passkeyRegisterResponse),
  async (req, res) => {
    const { attestationResponse, name } = req.body;

    const expectedChallenge = challenges[req.user!.id];
    if (!expectedChallenge)
      return res
        .status(400)
        .json({ success: false, message: "No challenge found" });
    const verification = await verifyRegistrationResponse({
      response: attestationResponse,
      expectedChallenge,
      expectedOrigin: appUrl,
      expectedRPID: rpID,
      requireUserVerification: false,
    });

    if (!verification.verified)
      return res
        .status(400)
        .json({ success: false, message: "Verification failed" });

    const { credential } = verification.registrationInfo!;
    const credId = bufferToBase64URLString(
      new Uint8Array(Buffer.from(credential.id)).buffer
    );
    const credPublicKey = bufferToBase64URLString(
      new Uint8Array(Buffer.from(credential.id)).buffer
    );
    const [insert] = await db
      .insert(devicesTable)
      .values({
        credId,
        userId: req.user!.id,
        name,
        publicKey: credPublicKey,
        counter: credential.counter,
        transports: credential.transports,
      })
      .$returningId();

    delete challenges[req.user!.id];

    res.json({
      success: true,
      device: {
        id: insert.id,
        name,
      },
    });
  }
);

export default router;
