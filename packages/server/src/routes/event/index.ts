import express from "express";
import BodyValidationMiddleware from "../../helpers/middlewares/validation";
import { eventSchema } from "../../helpers/validations/event";
const router = express.Router();

router.post(
  "/event",
  (req, res, next) => BodyValidationMiddleware(req, res, next, eventSchema),

  async (req, res) => {
    return res.status(200).json({});
  }
);

export default router;
