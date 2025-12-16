import { useState } from "react";
import {
  deleteClass,
  uploadDocument,
  deleteDocument,
  downloadDocument,
} from "../functions/supabaseDb";
import ClassDetail from "./ClassDetail";

function ClassList({ classes, documents, onRefresh }) {
  const [expandedClass, setExpandedClass] = useState(null);
  const [uploadingTo, setUploadingTo] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  const handleDeleteClass = async (classId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this class? This will not delete associated tasks."
      )
    ) {
      await deleteClass(classId);
      onRefresh();
    }
  };

  const toggleExpanded = (classId) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  const getClassDocuments = (className) => {
    return documents.filter((doc) => doc.class === className);
  };

  const handleFileUpload = async (className, event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    setUploadingTo(className);

    try {
      // Upload files one by one
      for (const file of Array.from(files)) {
        await uploadDocument(file, className);
      }
      onRefresh();
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload some files. Please try again.");
    } finally {
      setUploadingTo(null);
    }
  };

  const handleDeleteDocument = async (doc) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      await deleteDocument(doc.id, doc.filePath);
      onRefresh();
    }
  };

  const handleDownloadDocument = async (doc) => {
    // If it's a public URL, just open it
    if (doc.fileData && doc.fileData.startsWith("http")) {
      window.open(doc.fileData, "_blank");
    } else if (doc.filePath) {
      // Use the download function from supabaseDb
      await downloadDocument(doc.filePath, doc.documentTitle);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="class-list-container">
      <div className="list-header">
        <h2>My Classes</h2>
      </div>

      {classes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">No classes</div>
          <h3>No classes yet</h3>
          <p>Add your first class to get started!</p>
        </div>
      ) : (
        <div className="classes-grid">
          {classes.map((cls) => {
            const classDocuments = getClassDocuments(cls.courseTitle);
            const isExpanded = expandedClass === cls.id;

            return (
              <div
                key={cls.id}
                className="class-card"
                style={{ borderTop: `4px solid ${cls.color}` }}
              >
                <div className="class-card-header">
                  <div className="class-info">
                    <div
                      className="class-color-indicator"
                      style={{ backgroundColor: cls.color }}
                    />
                    <div>
                      <h3 className="class-title">{cls.courseTitle}</h3>
                      {cls.courseDescription && (
                        <p className="class-description">
                          {cls.courseDescription}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="class-actions">
                    <button
                      className="btn-view"
                      onClick={() => setSelectedClass(cls)}
                      title="View details and manage materials"
                    >
                      View Details
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteClass(cls.id)}
                      title="Delete class"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {cls.days && cls.days.length > 0 && (
                  <div className="class-schedule">
                    <span className="schedule-label">Schedule:</span>
                    <div className="schedule-days">
                      {cls.days.map((day) => (
                        <span key={day} className="day-badge">
                          {day.substring(0, 3)}
                        </span>
                      ))}
                    </div>
                    {cls.time && (
                      <span className="schedule-time">Time: {cls.time}</span>
                    )}
                  </div>
                )}

                <div className="class-materials">
                  <button
                    className="materials-toggle"
                    onClick={() => toggleExpanded(cls.id)}
                  >
                    Materials ({classDocuments.length})
                    <span
                      className={`toggle-icon ${isExpanded ? "expanded" : ""}`}
                    >
                      ▼
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="materials-content">
                      <div className="upload-section">
                        <label
                          htmlFor={`upload-${cls.id}`}
                          className="btn btn-upload"
                        >
                          + Upload Files
                        </label>
                        <input
                          type="file"
                          id={`upload-${cls.id}`}
                          multiple
                          onChange={(e) => handleFileUpload(cls.courseTitle, e)}
                          style={{ display: "none" }}
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        />
                      </div>

                      {classDocuments.length === 0 ? (
                        <p className="no-materials">
                          No materials uploaded yet
                        </p>
                      ) : (
                        <div className="documents-list">
                          {classDocuments.map((doc) => (
                            <div key={doc.id} className="document-item">
                              <div className="document-icon">File</div>
                              <div className="document-info">
                                <div className="document-name">
                                  {doc.documentTitle}
                                </div>
                                <div className="document-meta">
                                  {formatFileSize(doc.fileSize)} •{" "}
                                  {formatDate(doc.uploadDate)}
                                </div>
                              </div>
                              <div className="document-actions">
                                <button
                                  className="btn-icon"
                                  onClick={() => handleDownloadDocument(doc)}
                                  title="Download"
                                >
                                  Download
                                </button>
                                <button
                                  className="btn-icon"
                                  onClick={() => handleDeleteDocument(doc)}
                                  title="Delete"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedClass && (
        <ClassDetail
          classData={selectedClass}
          documents={documents}
          onClose={() => setSelectedClass(null)}
          onUpdate={() => {
            setSelectedClass(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

export default ClassList;
