


// ─────────────────────────────────────────────────────────────
//  FileUpload.jsx
//
//  Drop-in upload component built on top of useS3Upload.
//  Works without any UI library — plain HTML + CSS-in-JS.
//
//  Props:
//    folder           → S3 folder prefix  (default: "uploads")
//    label            → field label
//    multiple         → allow multiple files
//    onUploadSuccess  → ({ key, signedUrl, file }) => void
//    onDeleteSuccess  → (key) => void
//    defaultFileList  → pre-populate from DB: [{ key, name, signedUrl }]
// ─────────────────────────────────────────────────────────────
import { useRef, useState } from "react";
import useS3Upload from "../employeeManagement/hooks/uses3upload";

const styles = {
  wrapper: {
    fontFamily: "'DM Sans', system-ui, sans-serif",
    maxWidth: 520,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 8,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  dropzone: (isDragging) => ({
    border: `2px dashed ${isDragging ? "#6366f1" : "#d1d5db"}`,
    borderRadius: 12,
    padding: "28px 20px",
    textAlign: "center",
    cursor: "pointer",
    background: isDragging ? "#eef2ff" : "#fafafa",
    transition: "all 0.2s ease",
  }),
  dropIcon: {
    fontSize: 32,
    marginBottom: 8,
    display: "block",
  },
  dropText: {
    fontSize: 14,
    color: "#6b7280",
    margin: 0,
  },
  dropHighlight: {
    color: "#6366f1",
    fontWeight: 600,
    cursor: "pointer",
  },
  hint: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 4,
    display: "block",
  },
  fileList: {
    marginTop: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  fileRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 13,
  },
  fileIcon: { fontSize: 18 },
  fileName: {
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "#111827",
    fontWeight: 500,
  },
  progressBar: (pct) => ({
    height: 3,
    borderRadius: 2,
    background: "#e5e7eb",
    marginTop: 4,
    overflow: "hidden",
    position: "relative",
  }),
  progressFill: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    borderRadius: 2,
    transition: "width 0.3s ease",
  }),
  badge: (status) => ({
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 7px",
    borderRadius: 20,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    background:
      status === "done"
        ? "#dcfce7"
        : status === "error"
        ? "#fee2e2"
        : "#ede9fe",
    color:
      status === "done"
        ? "#166534"
        : status === "error"
        ? "#991b1b"
        : "#5b21b6",
  }),
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
    fontSize: 16,
    padding: "2px 4px",
    borderRadius: 4,
    lineHeight: 1,
    transition: "color 0.15s",
  },
  previewLink: {
    fontSize: 11,
    color: "#6366f1",
    textDecoration: "none",
    marginTop: 2,
    display: "block",
  },
  error: {
    marginTop: 8,
    fontSize: 12,
    color: "#dc2626",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 6,
    padding: "6px 10px",
  },
};

// ── File type icon ─────────────────────────────────────────────
const getIcon = (name = "") => {
  if (name.endsWith(".pdf")) return "📄";
  if (name.endsWith(".docx") || name.endsWith(".doc")) return "📝";
  if (/\.(png|jpg|jpeg|webp)$/i.test(name)) return "🖼️";
  return "📎";
};

// ──────────────────────────────────────────────────────────────
const FileUpload = ({
  folder = "uploads",
  label = "Upload Document",
  multiple = false,
  allowedTypes,
  maxSizeMB,
  onUploadSuccess,
  onDeleteSuccess,
  defaultFileList = [], // [{ key, name, signedUrl }] — pre-populate from DB
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const [{ fileList, isUploading, isDeleting, error }, { upload, remove }] =
    useS3Upload({
      folder,
      ...(allowedTypes ? { allowedTypes } : {}),
      ...(maxSizeMB ? { maxSizeMB } : {}),
      onUploadSuccess,
      onDeleteSuccess,
    });

  // Merge default (from DB) + newly uploaded
  const displayList = [
    ...defaultFileList.filter((d) => !fileList.find((f) => f.key === d.key)),
    ...fileList,
  ];

  // ── Handlers ────────────────────────────────────────────────
  const handleFiles = (files) => {
    const arr = multiple ? Array.from(files) : [files[0]];
    arr.forEach(upload);
  };

  const handleInputChange = (e) => handleFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div style={styles.wrapper}>
      {label && <label style={styles.label}>{label}</label>}

      {/* Drop zone */}
      <div
        style={styles.dropzone(isDragging)}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
      >
        <span style={styles.dropIcon}>☁️</span>
        <p style={styles.dropText}>
          Drag & drop or{" "}
          <span style={styles.dropHighlight}>browse files</span>
        </p>
        <span style={styles.hint}>PDF, DOCX, JPG, PNG — max {maxSizeMB ?? 10} MB</span>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        style={{ display: "none" }}
        accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.webp"
        onChange={handleInputChange}
      />

      {/* Error */}
      {error && <div style={styles.error}>⚠ {error}</div>}

      {/* File list */}
      {displayList.length > 0 && (
        <div style={styles.fileList}>
          {displayList.map((file) => (
            <div key={file.uid ?? file.key} style={{ ...styles.fileRow, flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
                <span style={styles.fileIcon}>{getIcon(file.name)}</span>
                <span style={styles.fileName}>{file.name}</span>
                <span style={styles.badge(file.status ?? "done")}>
                  {file.status === "uploading"
                    ? `${file.progress ?? 0}%`
                    : file.status === "error"
                    ? "Error"
                    : "Done"}
                </span>
                <button
                  style={styles.deleteBtn}
                  disabled={isDeleting}
                  title="Remove"
                  onClick={() => remove(file.key)}
                >
                  ✕
                </button>
              </div>

              {/* Progress bar during upload */}
              {file.status === "uploading" && (
                <div style={{ ...styles.progressBar(file.progress), width: "100%", marginTop: 6 }}>
                  <div style={styles.progressFill(file.progress ?? 0)} />
                </div>
              )}

              {/* Preview link once done */}
              {file.status === "done" && file.signedUrl && (
                <a
                  href={file.signedUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.previewLink}
                >
                  🔗 Preview / Download
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {(isUploading || isDeleting) && (
        <p style={{ fontSize: 12, color: "#6366f1", marginTop: 8 }}>
          {isUploading ? "Uploading…" : "Deleting…"}
        </p>
      )}
    </div>
  );
};

export default FileUpload;