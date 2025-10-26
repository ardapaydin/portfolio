import z from "zod";

export const Module = {
  GithubRepositories: 1,
  GithubReadMe: 2,
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
  {
    id: Module.GithubReadMe,
    name: "GitHub ReadMe",
    require: "oauth:github",
    config: {
      fields: {
        branch: {
          label: "Branch",
          type: "string",
        },
      },
      default: {
        branch: "master",
      },
      validation: z.object({
        branch: z
          .string()
          .max(255)
          .regex(/^[a-zA-Z0-9._-]+$/, "Invalid branch"),
      }),
    },
  },
];
