import z from "zod";
import { portfolioTemplates } from "../../data/templates";
export const createPortfolioSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name must be at most 100 characters long"),
  template: z.enum(
    portfolioTemplates.map((template) => template.id),
    "Invalid template selected"
  ),
  subdomain: z
    .string()
    .toLowerCase()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/,
      "Subdomain must contain only lowercase letters, numbers, and hyphens, cannot start or end with a hyphen"
    )
    .optional()
    .refine((val) => val?.toLowerCase() !== "design", {
      message: "Subdomain cannot be 'design'",
    }),
});
