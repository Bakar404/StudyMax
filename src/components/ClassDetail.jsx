import { useState } from "react";
import { uploadDocument } from "../functions/supabaseDb";
import {
  validateFile,
  formatFileSize,
  getAcceptString,
  getSupportedFormatsText,
} from "../utils/fileValidation";

function ClassDetail({ classData, documents, onClose, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      e.target.value = ""; // Reset file input
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Uploading document:", file.name);
      const uploadResult = await uploadDocument(
        file,
        classData.courseTitle || classData.course_title
      );

      if (uploadResult.error) {
        throw new Error(
          `File upload failed: ${
            uploadResult.error.message || uploadResult.error
          }`
        );
      }

      console.log("Document uploaded successfully");
      setSuccess("Document uploaded successfully!");

      setTimeout(() => {
        setSuccess("");
        onUpdate();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to upload document");
      console.error("Error uploading document:", err);
    } finally {
      setUploading(false);
    }
  };

  const classDocuments = documents.filter(
    (doc) => doc.class === (classData.courseTitle || classData.course_title)
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content task-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{classData.courseTitle || classData.course_title}</h2>
          <button className="btn-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="task-detail-content">
          <div className="detail-section">
            <h3>Class Details</h3>
            {(classData.courseDescription || classData.course_description) && (
              <div className="detail-item">
                <label>Description:</label>
                <p>
                  {classData.courseDescription || classData.course_description}
                </p>
              </div>
            )}
            {classData.days && classData.days.length > 0 && (
              <div className="detail-item">
                <label>Days:</label>
                <span>
                  {Array.isArray(classData.days)
                    ? classData.days.join(", ")
                    : classData.days}
                </span>
              </div>
            )}
            {classData.time && (
              <div className="detail-item">
                <label>Time:</label>
                <span>{classData.time}</span>
              </div>
            )}
          </div>

          <div className="detail-section files-section">
            <h3>Class Materials ({classDocuments.length})</h3>

            {classDocuments.length > 0 ? (
              <div className="documents-list">
                {classDocuments.map((doc) => (
                  <div key={doc.id} className="attached-file">
                    <div className="file-info">
                      <div className="file-name">
                        {doc.document_title || doc.documentTitle}
                      </div>
                      <div className="file-meta">
                        {doc.document_type && (
                          <span className="file-type">{doc.document_type}</span>
                        )}
                        {(doc.file_size || doc.fileSize) && (
                          <span className="file-size">
                            {formatFileSize(doc.file_size || doc.fileSize)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="file-actions">
                      <a
                        href={doc.file_url || doc.fileUrl || doc.fileData}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-files">No materials uploaded yet</p>
            )}

            <div className="upload-section">
              <label className="upload-label">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  accept={getAcceptString()}
                  style={{ display: "none" }}
                />
                <button
                  className="btn btn-secondary"
                  disabled={uploading}
                  onClick={(e) => {
                    e.preventDefault();
                    e.currentTarget.previousElementSibling.click();
                  }}
                >
                  {uploading ? "Uploading..." : "Upload New Material"}
                </button>
              </label>
              <small className="form-hint">
                Max 10MB. Supported: {getSupportedFormatsText()}
              </small>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClassDetail;
