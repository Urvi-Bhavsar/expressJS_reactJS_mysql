// ─────────────────────────────────────────────────────────────
//  s3Controller.js
//  Handles: generate presigned upload URL, get signed download URL, delete
// ─────────────────────────────────────────────────────────────
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// ── S3 Client setup ──────────────────────────────────────────
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_BUCKET_NAME;

// ── Allowed file types ───────────────────────────────────────
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// ─────────────────────────────────────────────────────────────
//  POST /api/s3/presign-upload
//
//  Body: { fileName: "report.pdf", fileType: "application/pdf", folder: "inward-docs" }
//
//  Returns: { key, uploadUrl }
//  - key       → unique S3 object key  (save this in your DB)
//  - uploadUrl → PUT this URL directly from the browser
// ─────────────────────────────────────────────────────────────
const getPresignedUploadUrl = async (req, res) => {
  try {
    const { fileName, fileType, fileSize, folder = "uploads" } = req.body;

    // ── Validate ─────────────────────────────────────────────
    if (!fileName || !fileType) {
      return res
        .status(400)
        .json({ message: "fileName and fileType are required" });
    }
    if (!ALLOWED_MIME_TYPES.includes(fileType)) {
      return res
        .status(400)
        .json({ message: `File type "${fileType}" is not allowed` });
    }
    if (fileSize && fileSize > MAX_FILE_SIZE_BYTES) {
      return res.status(400).json({ message: "File exceeds 10 MB limit" });
    }

    // ── Build a unique S3 key ─────────────────────────────────
    const ext = path.extname(fileName); // ".pdf"
    const uniqueKey = `${folder}/${uuidv4()}${ext}`; // "inward-docs/abc-123.pdf"

    // ── Create the presigned PUT URL (expires in 5 minutes) ───
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: uniqueKey,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return res.status(200).json({
      key: uniqueKey, // ← store this in your DB as document_file
      uploadUrl, // ← PUT the file to this URL from the browser
    });
  } catch (error) {
    console.error("getPresignedUploadUrl error:", error);
    return res.status(500).json({ message: "Failed to generate upload URL" });
  }
};

// ─────────────────────────────────────────────────────────────
//  POST /api/s3/signed-url
//
//  Body: { files: ["inward-docs/abc-123.pdf", ...] }
//
//  Returns: { files: [{ key, signedUrl, originalName }] }
//  signedUrl is a temporary GET URL valid for 60 minutes.
// ─────────────────────────────────────────────────────────────
const getSignedDownloadUrls = async (req, res) => {
  try {
    const { files } = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ message: "files array is required" });
    }

    const signedFiles = await Promise.all(
      files.map(async (key) => {
        const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
        return { key, signedUrl };
      }),
    );

    return res.status(200).json({ files: signedFiles });
  } catch (error) {
    console.error("getSignedDownloadUrls error:", error);
    return res
      .status(500)
      .json({ message: "Failed to generate download URLs" });
  }
};

// ─────────────────────────────────────────────────────────────
//  DELETE /api/s3/delete
//
//  Body: { files: ["inward-docs/abc-123.pdf"] }
// ─────────────────────────────────────────────────────────────
const deleteFiles = async (req, res) => {
  try {
    const { files } = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ message: "files array is required" });
    }

    await Promise.all(
      files.map((key) =>
        s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key })),
      ),
    );

    return res.status(200).json({ message: "Files deleted successfully" });
  } catch (error) {
    console.error("deleteFiles error:", error);
    return res.status(500).json({ message: "Failed to delete files" });
  }
};

module.exports = { getPresignedUploadUrl, getSignedDownloadUrls, deleteFiles };
