import nodemailer from "nodemailer";
import fs from "fs";

const templates = {
  layout: fs.readFileSync(`${__dirname}/templates/layout.html`, "utf-8"),
  verifyEmail: fs.readFileSync(
    `${__dirname}/templates/verifyEmail.html`,
    "utf-8"
  ),
};

export async function sendEmail(
  template: keyof typeof templates,
  email: string,
  data: Record<string, string>
) {
  data.APP_NAME = process.env.APP_NAME || "";
  const body = templates[template];
  const html = addLayout(body).replace(/{{(.*?)}}/g, (_, key) => {
    return data[key] || "";
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: data["SUBJECT"],
    html,
  });
}

function addLayout(body: string) {
  return templates.layout.replace("{{BODY}}", body);
}
