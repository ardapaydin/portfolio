import express from "express";
const router = express.Router();

import { portfolioTemplates } from "../../helpers/data/templates";

router.get("/:id", async (req, res) => {
  const template = portfolioTemplates.find((t) => t.id === req.params.id);
  if (!template)
    return res
      .status(404)
      .json({ success: false, message: "Template not found" });
  res.json(template);
});
export default router;
