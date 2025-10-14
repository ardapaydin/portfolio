import { ZodError } from "zod";

export function ErrorStyle(error: ZodError) {
  const errors: Record<string, string[]> = {};

  error.issues.forEach((e) => {
    const path = e.path.join(".") || "body";
    if (!errors[path]) errors[path] = [];

    errors[path].push(e.message);
  });

  return {
    success: false,
    message: "Bad Request",
    errors,
  };
}
