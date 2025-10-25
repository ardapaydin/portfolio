export type TypeModule = {
  id: number;
  name: string;
  require: string;
  config: {
    fields: Record<string, { type: string; label: string; options: string[] }>;
    default: Record<any, any>;
  };
};
