// ─────────────────────────────────────────────────────────────
//  useS3Upload.js
//
//  A self-contained hook that handles the full upload lifecycle:
//    1. Request a presigned PUT URL from your backend
//    2. PUT the file directly from the browser to S3
//    3. Optionally fetch a signed GET URL for preview
//    4. Delete a previously uploaded file
//
//  Usage:
//    const [state, actions] = useS3Upload({ folder: "inward-docs" });
//    const { fileList, isUploading, isDeleting } = state;
//    const { upload, remove, getSignedUrl } = actions;
// ─────────────────────────────────────────────────────────────
import { useState, useCallback } from "react";
import axios from "axios";

// ── API helpers (swap these with your own axios instance / api util) ──
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
const api = {
  // Step 1 — ask backend for a presigned PUT URL
  getPresignUrl: (payload) =>
    axios
      .post(`${API_BASE}/api/s3/presign-upload`, payload)
      .then((r) => r.data),

  // Step 3 — get temporary GET (download/preview) URL
  getSignedUrl: (files) =>
    axios.post(`${API_BASE}/api/s3/signed-url`, { files }).then((r) => r.data),

  // Delete
  deleteFile: (files) =>
    axios
      .delete(`${API_BASE}/api/s3/delete`, { data: { files } })
      .then((r) => r.data),
};

// ─────────────────────────────────────────────────────────────
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_SIZE_MB = 10;

// ─────────────────────────────────────────────────────────────
const useS3Upload = ({
  folder = "uploads",
  allowedTypes = ALLOWED_TYPES,
  maxSizeMB = MAX_SIZE_MB,
  onUploadSuccess = () => {}, // ({ key, signedUrl, file }) => void
  onUploadError = () => {}, // (error) => void
  onDeleteSuccess = () => {}, // (key) => void
  fetchSignedUrlAfterUpload = true, // auto-fetch preview URL after upload
} = {}) => {
  const [state, setState] = useState({
    fileList: [], // [{ uid, name, key, status, signedUrl, progress, error }]
    isUploading: false,
    isDeleting: false,
    error: null,
  });

  const updateFile = (uid, patch) =>
    setState((prev) => ({
      ...prev,
      fileList: prev.fileList.map((f) =>
        f.uid === uid ? { ...f, ...patch } : f,
      ),
    }));

  // ── Validate ───────────────────────────────────────────────
  const validate = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return `"${file.name}" — type not allowed. Accepted: ${allowedTypes.join(", ")}`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `"${file.name}" exceeds ${maxSizeMB} MB limit`;
    }
    return null;
  };

  // ── UPLOAD ─────────────────────────────────────────────────
  // Call this from your file input onChange or Ant Design's customRequest.
  // `file` is a native File object.
  const upload = useCallback(
    async (file) => {
      const validationError = validate(file);
      if (validationError) {
        setState((prev) => ({ ...prev, error: validationError }));
        onUploadError(new Error(validationError));
        return null;
      }

      const uid = `${Date.now()}-${file.name}`;
      const pendingEntry = {
        uid,
        name: file.name,
        key: null,
        status: "uploading", // "uploading" | "done" | "error"
        signedUrl: null,
        progress: 0,
        error: null,
      };

      setState((prev) => ({
        ...prev,
        isUploading: true,
        error: null,
        fileList: [...prev.fileList, pendingEntry],
      }));

      try {
        // ── Step 1: Get presigned PUT URL from your backend ──
        const { key, uploadUrl } = await api.getPresignUrl({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          folder,
        });

        // ── Step 2: PUT directly to S3 ────────────────────────
        await axios.put(uploadUrl, file, {
          headers: { "Content-Type": file.type },
          onUploadProgress: (evt) => {
            const progress = Math.round((evt.loaded / evt.total) * 100);
            updateFile(uid, { progress });
          },
        });

        // ── Step 3 (optional): Fetch a signed GET URL ─────────
        let signedUrl = null;
        if (fetchSignedUrlAfterUpload) {
          const { files } = await api.getSignedUrl([key]);
          signedUrl = files?.[0]?.signedUrl ?? null;
        }

        // ── Done ──────────────────────────────────────────────
        updateFile(uid, { key, status: "done", signedUrl, progress: 100 });
        setState((prev) => ({ ...prev, isUploading: false }));
        onUploadSuccess({ key, signedUrl, file });
        return { key, signedUrl };
      } catch (err) {
        updateFile(uid, { status: "error", error: err.message });
        setState((prev) => ({
          ...prev,
          isUploading: false,
          error: err.message,
        }));
        onUploadError(err);
        return null;
      }
    },
    [folder, fetchSignedUrlAfterUpload, onUploadSuccess, onUploadError],
  );

  // ── DELETE ─────────────────────────────────────────────────
  // `key` is the S3 key returned from upload, or pass the fileList entry.
  const remove = useCallback(
    async (keyOrEntry) => {
      const key = typeof keyOrEntry === "string" ? keyOrEntry : keyOrEntry.key;
      if (!key) return;

      setState((prev) => ({ ...prev, isDeleting: true, error: null }));
      try {
        await api.deleteFile([key]);
        setState((prev) => ({
          ...prev,
          isDeleting: false,
          fileList: prev.fileList.filter((f) => f.key !== key),
        }));
        onDeleteSuccess(key);
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isDeleting: false,
          error: err.message,
        }));
      }
    },
    [onDeleteSuccess],
  );

  // ── GET SIGNED URL (on demand) ─────────────────────────────
  // Pass an array of S3 keys, returns [{ key, signedUrl }]
  const getSignedUrls = useCallback(async (keys) => {
    if (!keys?.length) return [];
    const { files } = await api.getSignedUrl(keys);
    return files;
  }, []);

  // ── Reset ──────────────────────────────────────────────────
  const reset = useCallback(() => {
    setState({
      fileList: [],
      isUploading: false,
      isDeleting: false,
      error: null,
    });
  }, []);

  return [state, { upload, remove, getSignedUrls, reset }];
};

export default useS3Upload;
