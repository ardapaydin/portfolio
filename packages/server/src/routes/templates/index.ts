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

router.get("/", async (req, res) => {
  res.json({
    templates: portfolioTemplates.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      fieldSize: Object.keys(t.data.fields).length,
    })),
  });
});

export default router;
