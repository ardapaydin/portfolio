import z from "zod";
import { findImage, hexRegex, link, meta, modules } from "../validation";
import { Module } from "../modules";

export default {
  id: "wai",
  name: "Wai",
  description: "Just a simple and clean portfolio template.",
  supportedModules: [
    Module.GithubRepositories,
    Module.GithubReadMe,
    Module.GitLabProjects,
  ],
  data: {
    fields: {
      name: {
        type: "string",
        label: "Name",
      },
      jobTitle: {
        type: "string",
        label: "Job Title",
      },
      picture: {
        type: "image",
        label: "Picture",
      },
      bio: {
        type: "text",
        label: "Bio",
        markdown: true,
      },
      links: {
        type: "list",
        label: "Links",
        item: {
          name: { type: "string", label: "Display Name" },
          url: { type: "link", label: "URL" },
        },
      },
      projects: {
        type: "list",
        label: "Projects",
        item: {
          name: { type: "string", label: "Project Name" },
          url: { type: "link", label: "Project URL" },
        },
      },
      backgroundColor: { type: "color", label: "Background Color" },
      primaryTextColor: { type: "color", label: "Primary Text Color" },
      secondaryTextColor: { type: "color", label: "Secondary Text Color" },
      boxColor: { type: "color", label: "Box Color" },
    },
    default: {
      name: "Wai",
      jobTitle: "Job Title",
      picture: null,
      bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. In provident voluptatem, porro soluta labore quaerat minima maxime at et necessitatibus eos iusto culpa placeat temporibus sit cumque ipsum deleniti obcaecati!",
      links: [
        { name: "GitHub", url: "https://github.com" },
        { name: "LinkedIn", url: "https://linkedin.com" },
        { name: "Twitter", url: "https://x.com" },
      ],
      projects: [{ name: "Project 1", url: "https://example.com" }],
      backgroundColor: "#313030",
      primaryTextColor: "#ffffff",
      secondaryTextColor: "#ffffff",
      boxColor: "#000000",
    },
    validation: z.object({
      name: z
        .string()
        .min(2)
        .max(100, "Name must be between 2 and 100 characters"),
      jobTitle: z
        .string()
        .min(2)
        .max(100, "Job title must be between 2 and 100 characters"),
      picture: z.uuid().nullable().optional().refine(findImage),
      bio: z.string().max(500, "Bio must be at most 500 characters"),
      links: z.array(link).max(10, "You can add up to 10 links"),
      projects: z.array(link).max(20, "You can add up to 20 projects"),
      backgroundColor: z
        .string()
        .regex(hexRegex, "Background color mus tbe a valid hex color"),
      primaryTextColor: z
        .string()
        .regex(hexRegex, "Primary text color must be a valid hex color"),
      secondaryTextColor: z
        .string()
        .regex(hexRegex, "Secondary text color must be a valid hex color"),
      boxColor: z
        .string()
        .regex(hexRegex, "Box color must be a valid hex color"),
      meta,
      modules,
    }),
  },
};
