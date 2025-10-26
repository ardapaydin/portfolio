import z from "zod";

export function validZod(
  def: any
):
  | z.ZodString
  | z.ZodNumber
  | z.ZodObject
  | z.ZodArray
  | z.ZodOptional
  | z.ZodNullable
  | z.ZodAny {
  if (!def) return z.any();
  switch (def.type) {
    case "string":
      let s = z.string();
      if (def.minLength) s = s.min(def.minLength);
      if (def.maxLength) s = s.max(def.maxLength);
      if (def.format == "url") s = s.url();
      return s;

    case "number":
      let n = z.number();
      if (def.max) n.max(def.max);
      if (def.min) n.min(def.min);
      return n;

    case "object":
      const sh: any = {};
      for (const [key, value] of Object.entries<{ def: Record<string, any> }>(
        def.shape
      ))
        sh[key] = validZod(value.def);
      return z.object(sh);

    case "array":
      return z.array(validZod(def.element.def));

    case "optional":
      return validZod(def?.def?.innerType?.def).optional();

    case "nullable":
      return validZod(def.innerType.def).nullable();

    default:
      return z.any();
  }
}
