import z from "zod";
import { findImage, hexRegex, meta, modules } from "../validation";
import { Module } from "../modules";

export default {
  id: "eon",
  name: "Eon",
  description: "A modern portfolio template.",
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
      bio: {
        type: "text",
        label: "Bio",
      },
      projectsDescription: {
        type: "string",
        label: "Projects Description",
      },
      contactDescription: {
        type: "string",
        label: "Contact Description",
      },
      picture: {
        type: "image",
        label: "Picture",
      },
      projects: {
        type: "list",
        label: "Projects",
        item: {
          name: { type: "string", label: "Project Name" },
          subtitle: { type: "string", label: "Subtitle" },
          description: {
            type: "text",
            label: "Project Description",
            markdown: true,
          },
        },
      },
      contact: {
        type: "list",
        label: "Contact Informations",
        item: {
          name: { type: "string", label: "Title" },
          url: { type: "link", label: "URL" },
        },
      },
      backgroundColor: { type: "color", label: "Background Color" },
      secondaryBackgroundColor: {
        type: "color",
        label: "Secondary Background Color",
      },
      primaryTextColor: { type: "color", label: "Primary Text Color" },
      boxColor: { type: "color", label: "Box Color" },
      underlineColor: { type: "color", label: "Underline Color" },
    },
    default: {
      name: "Eon",
      bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea distinctio beatae ab aliquid doloremque.",
      projectsDescription:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi amet et minus dolores assumenda error unde, mollitia, dignissimos quas aut incidunt a quae debitis accusantium beatae adipisci, cumque laudantium nobis?",
      contactDescription:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi amet et minus dolores assumenda error unde, mollitia, dignissimos quas aut incidunt a quae debitis accusantium beatae adipisci, cumque laudantium nobis?",
      picture: null,
      projects: [
        {
          name: "Project 1",
          subtitle: "01/2022 - 12/2022",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores nam natus corporis? Similique eos, earum, eius ad vel repellat possimus quisquam dolore fugiat perspiciatis atque itaque dolor, harum qui rerum.",
        },
        {
          name: "Project 2",
          subtitle: "01/2023 - 12/2024",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores nam natus corporis? Similique eos, earum, eius ad vel repellat possimus quisquam dolore fugiat perspiciatis atque itaque dolor, harum qui rerum.",
        },
      ],
      contact: [
        {
          name: "Twitter",
          url: "https://x.com",
        },
        {
          name: "Whatsapp",
          url: "https://wa.me/+",
        },
      ],
      backgroundColor: "#282828",
      secondaryBackgroundColor: "#252525",
      primaryTextColor: "#ffffff",
      boxColor: "#252525",
      underlineColor: "#5f3eff",
    },
    validation: z.object({
      name: z
        .string()
        .min(2)
        .max(100, "Name must be between 2 and 100 characters"),
      bio: z.string().max(500, "Bio must be at most 500 characters"),
      projectsDescription: z
        .string()
        .min(2)
        .max(256, "Projects Description must be between 2 and 256 characters"),
      contactDescription: z
        .string()
        .min(2)
        .max(256, "Contact Description must be between 2 and 256 characters"),
      picture: z.uuid().nullable().optional().refine(findImage),
      projects: z
        .array(
          z.object({
            name: z.string().max(100),
            subtitle: z.string().max(100),
            description: z.string().max(512),
          })
        )
        .max(10, "You can add up to 10 projects"),
      contact: z.array(
        z.object({
          name: z.string().max(100),
          url: z.url("Invalid URL").refine((val) => /^https?:\/\//.test(val), {
            message: "URL must start with http or https",
          }),
        })
      ),
      backgroundColor: z
        .string()
        .regex(hexRegex, "Background color mus tbe a valid hex color"),
      secondaryBackgroundColor: z
        .string()
        .regex(
          hexRegex,
          "Secondary Background color mus tbe a valid hex color"
        ),
      primaryTextColor: z
        .string()
        .regex(hexRegex, "Primary text color must be a valid hex color"),
      boxColor: z
        .string()
        .regex(hexRegex, "Box color must be a valid hex color"),
      underlineColor: z
        .string()
        .regex(hexRegex, "Underline color must be a valid hex color"),
      meta,
      modules,
    }),
  },
};
