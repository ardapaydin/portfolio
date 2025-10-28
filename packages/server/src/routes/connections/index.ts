import express from "express";
import { requireAuth } from "../../helpers/middlewares/auth";
import { db } from "../../database/db";
import { connectionsTable } from "../../database";
import { and, eq } from "drizzle-orm";
const router = express.Router();

router.get("/:service", requireAuth, async (req, res) => {
  const { service } = req.params;
  if (service.toLowerCase() == "github") {
    return res.json({
      success: true,
      url:
        "https://github.com/login/oauth/authorize?scope=read:user&client_id=" +
        process.env.GITHUB_CLIENT_ID +
        "&redirect_uri=" +
        process.env.GITHUB_REDIRECT_URI,
    });
  } else if (service.toLowerCase() == "gitlab") {
    return res.json({
      success: true,
      url:
        "https://gitlab.com/oauth/authorize?client_id=" +
        process.env.GITLAB_CLIENT_ID +
        "&redirect_uri=" +
        process.env.GITLAB_REDIRECT_URI +
        "&response_type=" +
        "code" +
        "&scope=" +
        "read_user",
    });
  }

  return res
    .status(400)
    .json({ success: false, message: "Invalid service provided" });
});

router.get("/:service/callback", requireAuth, async (req, res) => {
  const { code } = req.query;
  let { service } = req.params;
  if (!code)
    return res.status(400).json({ success: false, message: "code missing" });
  service = service.toLowerCase();
  if (service == "github") {
    const r = await fetch("https://github.com/login/oauth/access_token", {
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
      }),
      method: "POST",
    });

    const d = await r.json();
    if (!r.ok)
      return res
        .status(500)
        .json({ success: false, message: "An error occurred." });

    const user = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: "Bearer " + d.access_token,
      },
    });

    const userjson = await user.json();
    if (!user.ok)
      return res
        .status(500)
        .json({ success: false, message: "An error occurred." });

    const [f] = await db
      .select()
      .from(connectionsTable)
      .where(
        and(
          eq(connectionsTable.userId, req.user!.id),
          eq(connectionsTable.service, service)
        )
      );

    if (f)
      await db.update(connectionsTable).set({
        serviceUser: {
          id: userjson.id,
          slug: userjson.login,
          name: userjson.name,
        },
        accessToken: d.access_token,
      });
    else
      await db.insert(connectionsTable).values({
        serviceUser: {
          id: userjson.id,
          slug: userjson.login,
          name: userjson.name,
        },
        accessToken: d.access_token,
        userId: req.user!.id,
        service: "github",
      });
  } else if (service == "gitlab") {
    const r = await fetch("https://gitlab.com/oauth/token", {
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GITLAB_CLIENT_ID!,
        client_secret: process.env.GITLAB_CLIENT_SECRET!,
        code: code as string,
        grant_type: "authorization_code",
        redirect_uri: process.env.GITLAB_REDIRECT_URI!,
      }),
      method: "POST",
    });

    const d = await r.json();
    if (!r.ok)
      return res
        .status(500)
        .json({ success: false, message: "An error occurred." });

    const user = await fetch("https://gitlab.com/api/v4/user", {
      headers: {
        Authorization: "Bearer " + d.access_token,
      },
    });

    const userjson = await user.json();
    if (!user.ok)
      return res
        .status(500)
        .json({ success: false, message: "An error occurred." });

    const [f] = await db
      .select()
      .from(connectionsTable)
      .where(
        and(
          eq(connectionsTable.userId, req.user!.id),
          eq(connectionsTable.service, service)
        )
      );

    if (f)
      await db.update(connectionsTable).set({
        serviceUser: {
          id: userjson.id,
          slug: userjson.username,
          name: userjson.name,
        },
        accessToken: d.access_token,
      });
    else
      await db.insert(connectionsTable).values({
        serviceUser: {
          id: userjson.id,
          slug: userjson.username,
          name: userjson.name,
        },
        accessToken: d.access_token,
        userId: req.user!.id,
        service: "gitlab",
      });
  }

  return res.status(200).json({ success: true });
});

export default router;
