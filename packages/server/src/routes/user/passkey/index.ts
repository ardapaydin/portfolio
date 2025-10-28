import express from "express";
import { requireAuth } from "../../../helpers/middlewares/auth";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { db } from "../../../database/db";
import { devicesTable, usersTable } from "../../../database";
import { eq } from "drizzle-orm";

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
    attestationType: "none",
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

router.post("/register-response", requireAuth, async (req, res) => {
  const { attestationResponse } = req.body;

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
  });

  if (!verification.verified)
    return res
      .status(400)
      .json({ success: false, message: "Verification failed" });

  const { credential } = verification.registrationInfo!;

  await db.insert(devicesTable).values({
    id: credential.id,
    userId: req.user!.id,
    publicKey: Buffer.from(credential.publicKey).toString("base64url"),
    counter: credential.counter,
    transports: JSON.stringify(credential.transports),
  });

  delete challenges[req.user!.id];

  res.json({ success: true });
});

export default router;
