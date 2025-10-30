import z from "zod";

export const passkeyLoginSchema = z.object({
  attestationResponse: z.object({
    id: z.string(),
    rawId: z.string(),
    response: z.object({
      authenticatorData: z.string(),
      clientDataJSON: z.string(),
      signature: z.string(),
      userHandle: z.string(),
    }),
    type: z.literal("public-key"),
    clientExtensionResults: z.record(z.string(), z.any()).optional(),
    authenticatorAttachment: z.string(),
  }),
});
