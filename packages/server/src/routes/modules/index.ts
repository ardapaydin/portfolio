import express from "express";
import modules from "../../helpers/data/modules";
import { portfolioTemplates } from "../../helpers/data/templates";
const router = express.Router();

router.get("/", async (req, res) => {
  let d = modules;
  const { templateId } = req.query;
  if (templateId) {
    const findtemplate = portfolioTemplates.find((x) => x.id == templateId);
    if (!findtemplate)
      return res
        .status(400)
        .json({ success: false, message: "invalid template" });
    if (findtemplate?.supportedModules)
      d = d.filter((x) =>
        findtemplate.supportedModules.includes(x.id as never)
      );
  }

  return res.json(d);
});

export default router;
