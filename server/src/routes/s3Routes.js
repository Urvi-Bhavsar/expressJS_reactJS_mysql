// ─────────────────────────────────────────────────────────────
//  s3Routes.js
// ─────────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const {
  getPresignedUploadUrl,
  getSignedDownloadUrls,
  deleteFiles,
} = require("../controllers/s3Controller");

// POST /api/s3/presign-upload  → returns { key, uploadUrl }
router.post("/presign-upload", getPresignedUploadUrl);

// POST /api/s3/signed-url      → returns { files: [{ key, signedUrl }] }
router.post("/signed-url", getSignedDownloadUrls);

// DELETE /api/s3/delete        → deletes objects from S3
router.delete("/delete", deleteFiles);

module.exports = router;

// ─────────────────────────────────────────────────────────────
//  Mount in your app.js / server.js like this:
//
//  const s3Routes = require("./s3Routes");
//  app.use("/api/s3", s3Routes);
// ─────────────────────────────────────────────────────────────
