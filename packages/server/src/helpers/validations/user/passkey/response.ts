import z from "zod";

export const passkeyRegisterResponse = z.object({
  attestationResponse: z.object({
    id: z.string(),
    rawId: z.string(),
    response: z.object({
      attestationObject: z.string(),
      clientDataJSON: z.string(),
      transports: z.array(z.string()),
      publicKeyAlgorithm: z.number(),
      publicKey: z.string(),
      authenticatorData: z.string(),
    }),
    type: z.literal("public-key"),
    clientExtensionResults: z.object({
      credProps: z.object({
        rk: z.boolean(),
      }),
    }),
    authenticatorAttachment: z.string(),
  }),
  name: z.string().trim().max(50),
});
