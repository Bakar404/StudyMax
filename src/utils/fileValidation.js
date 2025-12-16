/**
 * File validation and handling utilities
 */

// Supported file types with their MIME types and extensions
export const SUPPORTED_FILE_TYPES = {
  // Documents
  pdf: { mime: "application/pdf", ext: ".pdf", category: "document" },
  doc: { mime: "application/msword", ext: ".doc", category: "document" },
  docx: {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ext: ".docx",
    category: "document",
  },
  txt: { mime: "text/plain", ext: ".txt", category: "document" },

  // Presentations
  ppt: {
    mime: "application/vnd.ms-powerpoint",
    ext: ".ppt",
    category: "document",
  },
  pptx: {
    mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ext: ".pptx",
    category: "document",
  },

  // Spreadsheets
  xls: { mime: "application/vnd.ms-excel", ext: ".xls", category: "document" },
  xlsx: {
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ext: ".xlsx",
    category: "document",
  },

  // Images
  jpg: { mime: "image/jpeg", ext: ".jpg", category: "image" },
  jpeg: { mime: "image/jpeg", ext: ".jpeg", category: "image" },
  png: { mime: "image/png", ext: ".png", category: "image" },
  gif: { mime: "image/gif", ext: ".gif", category: "image" },
  webp: { mime: "image/webp", ext: ".webp", category: "image" },
  svg: { mime: "image/svg+xml", ext: ".svg", category: "image" },

  // Archives
  zip: { mime: "application/zip", ext: ".zip", category: "archive" },
  rar: {
    mime: "application/x-rar-compressed",
    ext: ".rar",
    category: "archive",
  },
};

// Maximum file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext || "";
};

/**
 * Validate file type
 */
export const isFileTypeSupported = (file) => {
  const ext = getFileExtension(file.name);
  const mimeType = file.type;

  // Check if extension is supported
  if (!SUPPORTED_FILE_TYPES[ext]) {
    return { valid: false, error: `File type ".${ext}" is not supported` };
  }

  // Check if MIME type matches (some browsers may not provide MIME type)
  const supportedType = SUPPORTED_FILE_TYPES[ext];
  if (mimeType && !mimeType.startsWith(supportedType.category)) {
    // Allow if MIME type is empty or matches the expected pattern
    if (mimeType !== supportedType.mime && !mimeType.includes(ext)) {
      console.warn(
        `MIME type mismatch for .${ext}: expected ${supportedType.mime}, got ${mimeType}`
      );
    }
  }

  return { valid: true, category: supportedType.category };
};

/**
 * Validate file size
 */
export const isFileSizeValid = (file) => {
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `File size must be less than ${sizeMB}MB` };
  }
  return { valid: true };
};

/**
 * Validate file completely
 */
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  // Check file size
  const sizeValidation = isFileSizeValid(file);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  // Check file type
  const typeValidation = isFileTypeSupported(file);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  return { valid: true, category: typeValidation.category };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Get accept string for file input
 */
export const getAcceptString = () => {
  return Object.values(SUPPORTED_FILE_TYPES)
    .map((type) => type.ext)
    .join(",");
};

/**
 * Get human-readable list of supported formats
 */
export const getSupportedFormatsText = () => {
  const extensions = Object.keys(SUPPORTED_FILE_TYPES).map((ext) =>
    ext.toUpperCase()
  );
  return extensions.join(", ");
};
