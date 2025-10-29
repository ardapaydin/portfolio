import { eq } from "drizzle-orm";
import { devicesTable, twoFactorAuthenticationTable } from "../../database";
import { db } from "../../database/db";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
const appUrl = process.env.DESIGN_APP_URL as string;
const rpID = appUrl.includes("localhost")
  ? "localhost"
  : appUrl.replace(/^https?:\/\//, "");

export async function validateMFA(
  req: Express.Request,
  options: ("backup" | "webauthn" | "totp")[] = ["totp", "backup", "webauthn"]
) {
  const [find] = await db
    .select()
    .from(twoFactorAuthenticationTable)
    .where(eq(twoFactorAuthenticationTable.userId, req.user!.id));
  const devices = await db
    .select()
    .from(devicesTable)
    .where(eq(devicesTable.userId, req.user!.id));
  const mfa = req.headers["x-mfa-authorization"];
  if (find || devices.length) {
    const ticket = sign(
      { userId: req.user!.id, type: "ticket", options },
      process.env.MFA_JWT_SECRET as string
    );

    if (!mfa) {
      return {
        success: false,
        message: "2FA",
        mfa: { ticket, options: await createOptions(options, devices) },
      };
    }
    let verifytoken;
    try {
      verifytoken = (await verify(
        mfa,
        process.env.MFA_JWT_SECRET as string
      )) as JwtPayload;
    } catch {
      return {
        success: false,
        message: "2FA",
        mfa: { ticket, options: await createOptions(options, devices) },
      };
    }
    if (!verifytoken.userId || verifytoken.userId != req.user!.id)
      return {
        success: false,
        message: "Invalid token",
      };

    if (!options.includes(verifytoken.type))
      return { success: false, message: "not supported option" };
  }

  return { success: true };
}

async function createOptions(
  options: string[],
  devices: (typeof devicesTable.$inferSelect)[]
) {
  return await Promise.all(
    options.map(async (option) => {
      let optionData;
      if (option === "webauthn") {
        optionData = await generateAuthenticationOptions({
          allowCredentials: devices.map((device) => ({
            id: atob(device.credId),
            type: "public-key",
            transports: JSON.parse(device.transports as string),
          })),
          userVerification: "preferred",
          rpID,
        });
      }

      return {
        type: option,
        data: optionData,
      };
    })
  );
}
