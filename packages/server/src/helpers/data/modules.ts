import z from "zod";

export const Module = {
  GithubRepositories: 1,
  GithubReadMe: 2,
  GitLabProjects: 3,
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
        max: z.int().max(16).min(1),
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
  {
    id: Module.GitLabProjects,
    name: "GitLab Projects",
    require: "oauth:gitlab",
    config: {
      fields: {
        max: { type: "number", label: "Max Projects" },
        sort: {
          type: "enum",
          label: "Sorting",
          options: ["star_count", "created_at", "updated_at"],
        },
      },
      default: {
        max: 5,
        sort: "star_count",
      },
      validation: z.object({
        max: z.int().max(16).min(1),
        sort: z.enum(["star_count", "created_at", "updated_at"]),
      }),
    },
  },
];
