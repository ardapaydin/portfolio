import z from "zod";
const link = z.object({
  name: z.string().min(2).max(100),
  url: z.url("Invalid URL"),
});

const hexRegex = /^#([0-9A-Fa-f]{6})$/;

export const portfolioTemplates = [
  {
    id: "wai",
    name: "Wai",
    description: "Just a simple and clean portfolio template.",
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
          label: "Profile Picture",
        },
        bio: {
          type: "text",
          label: "Bio",
        },
        links: {
          type: "list",
          label: "Links",
          item: {
            name: { type: "string", label: "Display Name" },
            url: { type: "string", label: "URL" },
          },
        },
        projects: {
          type: "list",
          label: "Projects",
          item: {
            name: { type: "string", label: "Project Name" },
            url: { type: "string", label: "Project URL" },
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
        picture: "",
        bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. In provident voluptatem, porro soluta labore quaerat minima maxime at et necessitatibus eos iusto culpa placeat temporibus sit cumque ipsum deleniti obcaecati!",
        links: [
          { name: "GitHub", url: "#" },
          { name: "LinkedIn", url: "#" },
          { name: "Twitter", url: "#" },
        ],
        projects: [
          { name: "Project 1", url: "#" },
          { name: "Project 2", url: "#" },
          { name: "Project 3", url: "#" },
        ],
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
        picture: z.uuid().optional(),
        bio: z.string().max(500, "Bio must be at most 500 characters"),
        links: z.array(link).max(10, "You can add up to 10 links"),
        projects: z.array(link).max(20, "You can add up to 20 projects"),
        backgroundColor: z.regex(
          hexRegex,
          "Background color mus tbe a valid hex color"
        ),
        primaryTextColor: z.regex(
          hexRegex,
          "Primary text color must be a valid hex color"
        ),
        secondaryTextColor: z.regex(
          hexRegex,
          "Secondary text color must be a valid hex color"
        ),
        boxColor: z.regex(hexRegex, "Box color must be a valid hex color"),
      }),
    },
  },
];
