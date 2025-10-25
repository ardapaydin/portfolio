import z from "zod";

export const Module = {
  GithubRepositories: 1,
};

export default [
  {
    id: Module.GithubRepositories,
    name: "GitHub Repositories",
    require: "oauth:github",
    config: {
      fields: {
        max: { type: "number", label: "Max Repo" },
        sort: {
          type: "enum",
          label: "Sorting",
          options: ["stars", "forks", "updated"],
        },
      },
      default: {
        max: 5,
        sort: "star",
      },
      validation: z.object({
        max: z.int().max(16),
        sort: z.enum(["stars", "forks", "updated"]),
      }),
    },
  },
];
