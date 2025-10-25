import z from "zod";

export const editPortfolioSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name must be at most 100 characters long"),
  subdomain: z
    .string()
    .toLowerCase()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/,
      "Subdomain must contain only lowercase letters, numbers, and hyphens, cannot start or end with a hyphen"
    )
    .refine((val) => val.toLowerCase() !== "design", {
      message: "Subdomain cannot be 'design'",
    }),
});
