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
});
