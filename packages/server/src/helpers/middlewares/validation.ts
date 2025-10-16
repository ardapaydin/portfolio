import { NextFunction, Request, Response } from "express";
import { ErrorStyle } from "../validations/error";
import { ZodObject } from "zod";

export default async function BodyValidationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
  schema: ZodObject
) {
  const validationResult = await schema.safeParseAsync(req.body);

  if (!validationResult.success) {
    const { error } = validationResult;
    if (
      error.issues.some(
        (issue) => issue.path.length === 0 && issue.code === "invalid_type"
      )
    )
      return res.status(400).json({
        success: false,
        message: "Content-Type header is missing or invalid",
      });

    return res.status(400).json(ErrorStyle(error));
  }

  next();
}
