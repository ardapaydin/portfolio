import express from "express";
import { requireAuth } from "../../helpers/middlewares/auth";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fileUpload from "express-fileupload";
import { db } from "../../database/db";
import { portfolioTable } from "../../database";
import { and, eq } from "drizzle-orm";
import { attachmentsTable } from "../../database/schemas/attachments";
const router = express.Router();

router.use(fileUpload({ safeFileNames: true }));

const { S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } =
  process.env;
if (!S3_ENDPOINT || !S3_REGION || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY)
  throw new Error(
    "missing required aws s3 environment variables for attachments"
  );

const s3 = new S3Client({
  endpoint: S3_ENDPOINT,
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
});

router.get("/:portfolioId", requireAuth, async (req, res) => {
  const { portfolioId } = req.params;
  if (!portfolioId)
    return res
      .status(400)
      .json({ success: false, message: "No portfolioId specified" });

  const [portfolio] = await db
    .select()
    .from(portfolioTable)
    .where(
      and(
        eq(portfolioTable.id, portfolioId),
        eq(portfolioTable.userId, req.user!.id)
      )
    );

  if (!portfolio)
    return res
      .status(404)
      .json({ success: false, message: "portfolio not found or inaccessible" });

  const attachments = await db
    .select()
    .from(attachmentsTable)
    .where(eq(attachmentsTable.relatedPortfolioId, portfolioId));

  return res.status(200).json(attachments);
});

router.post("/", requireAuth, async (req, res) => {
  const file = req.files?.file;
  const { portfolioId, type } = req.body;
  if (!file)
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  if (Array.isArray(file))
    return res
      .status(400)
      .json({ success: false, message: "Multiple files uploaded" });
  if (!type)
    return res
      .status(400)
      .json({ success: false, message: "No type specified" });
  const allowedTypes = ["picture"];
  if (!allowedTypes.includes(type))
    return res.status(400).json({ success: false, message: "Invalid type" });
  if (!portfolioId)
    return res
      .status(400)
      .json({ success: false, message: "No portfolioId specified" });
  if (type === "picture" && !file.mimetype.startsWith("image/"))
    return res
      .status(400)
      .json({ success: false, message: "Invalid file type for picture" });
  const [portfolio] = await db
    .select()
    .from(portfolioTable)
    .where(
      and(
        eq(portfolioTable.id, portfolioId),
        eq(portfolioTable.userId, req.user!.id)
      )
    );
  if (!portfolio)
    return res
      .status(404)
      .json({ success: false, message: "portfolio not found or inaccessible" });
  const id = crypto.randomUUID();
  const s3Key = `attachments/${id}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: s3Key,
      Body: file.data,
      ContentType: file.mimetype,
      ACL: "public-read",
    })
  );

  await db.insert(attachmentsTable).values({
    id,
    relatedPortfolioId: portfolio.id,
    type,
    name: file.name,
  });
  return res.status(200).json({ success: true, url: s3Key, id });
});

export default router;
