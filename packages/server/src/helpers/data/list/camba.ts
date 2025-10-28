import z from "zod";
import { findImage, hexRegex, meta, modules } from "../validation";
import { Module } from "../modules";

export default {
  id: "camba",
  name: "Camba",
  description:
    "Camba is a fully responsive personal portfolio website, responsive for all devices.",
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
      email: {
        type: "string",
        label: "Email",
      },
      location: {
        type: "string",
        label: "Location",
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
      services: {
        type: "list",
        label: "Services/What I'm Doing",
        item: {
          name: { type: "string", label: "Title" },
          description: {
            type: "text",
            label: "Description",
            markdown: true,
          },
        },
      },
      education: {
        type: "list",
        label: "Education",
        item: {
          name: { type: "string", label: "Name" },
          period: { type: "string", label: "Period" },
          description: {
            type: "text",
            label: "Description",
            markdown: true,
          },
        },
      },
      experience: {
        type: "list",
        label: "Experience",
        item: {
          name: {
            type: "string",
            label: "Name",
          },
          period: { type: "string", label: "Period" },
          description: { type: "text", label: "Description", markdown: true },
        },
      },
      backgroundColor: { type: "color", label: "Background Color" },
      primaryTextColor: { type: "color", label: "Primary Text Color" },
      secondaryTextColor: { type: "color", label: "Secondary Text Color" },
      boxColor: { type: "color", label: "Box Color" },
      secondaryBoxColor: { type: "color", label: "Secondary Box Color" },
      borderColor: { type: "color", label: "Border Color" },
      underlineColor: { type: "color", label: "Underline Color" },
    },
    default: {
      name: "Camba",
      jobTitle: "Web Developer",
      email: "example@example.com",
      location: "World",
      picture: null,
      bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus asperiores veniam pariatur facere, aspernatur sequi illum rem, vitae architecto quas voluptatibus ut. Earum quae iusto necessitatibus laudantium iste culpa repellat? Accusantium quos fugiat aspernatur nesciunt necessitatibus possimus animi earum rem! Et eveniet unde neque, quaerat repudiandae corrupti facilis. Quibusdam nam autem asperiores atque corrupti. Maiores corporis voluptas eaque veritatis mollitia!",
      services: [
        {
          name: "Web Design",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit voluptate, optio nostrum dignissimos impedit excepturi maxime deserunt ipsum delectus vel laudantium amet earum.",
        },
        {
          name: "Web Development",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit voluptate, optio nostrum dignissimos impedit excepturi maxime deserunt ipsum delectus vel laudantium amet earum.",
        },
        {
          name: "Mobile Apps",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit voluptate, optio nostrum dignissimos impedit excepturi maxime deserunt ipsum delectus vel laudantium amet earum.",
        },
        {
          name: "Security Researching",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit voluptate, optio nostrum dignissimos impedit excepturi maxime deserunt ipsum delectus vel laudantium amet earum.",
        },
      ],
      education: [
        {
          name: "1",
          period: "2025 - 2025",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit",
        },
        {
          name: "2",
          period: "2025 — 2025",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        },
        {
          name: "3",
          period: "2025 — 2025",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        },
      ],
      experience: [
        {
          name: "1",
          period: "2025 - 2025",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit",
        },
        {
          name: "2",
          period: "2025 — 2025",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        },
      ],
      backgroundColor: "#171717",
      primaryTextColor: "#ffffff",
      secondaryTextColor: "#fff085",
      boxColor: "#222222",
      secondaryBoxColor: "#202022",
      borderColor: "#252525",
      underlineColor: "#ffdb70",
    },
    validation: z.object({
      name: z
        .string()
        .min(2)
        .max(100, "Name must be between 2 and 100 characters"),
      jobTitle: z.string().max(100),
      email: z.string().max(100),
      picture: z.uuid().nullable().optional().refine(findImage),
      services: z
        .array(
          z.object({
            name: z.string().max(100),
            description: z.string().max(512),
          })
        )
        .max(10),
      education: z
        .array(
          z.object({
            name: z.string().max(100),
            period: z.string().max(64),
            description: z.string().max(512),
          })
        )
        .max(10),
      experience: z
        .array(
          z.object({
            name: z.string().max(100),
            period: z.string().max(64),
            description: z.string().max(512),
          })
        )
        .max(10),
      backgroundColor: z
        .string()
        .regex(hexRegex, "Background color mus tbe a valid hex color"),
      primaryTextColor: z.string().regex(hexRegex),
      secondaryTextColor: z.string().regex(hexRegex),
      boxColor: z.string().regex(hexRegex),
      secondaryBoxColor: z.string().regex(hexRegex),
      borderColor: z.string().regex(hexRegex),
      underlineColor: z.string().regex(hexRegex),
      meta,
      modules,
    }),
  },
};
