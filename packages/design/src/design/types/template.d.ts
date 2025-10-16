export type TypeTemplate = {
  id: string;
  name: string;
  description: string;
  fieldSize: number;
  data: Record<string, any>;
  createdAt: string;
  fields: Record<
    string,
    {
      markdown: boolean;
      label: string;
      type: string;
      item: { name: string; url: string }[];
    }
  >;
  [key: string]: any;
};
