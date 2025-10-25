import { useState } from "react";
import { deleteData } from "../functions/dbDelete";
import storeData from "../functions/dbStore";

function ClassList({ classes, documents, onRefresh }) {
  const [expandedClass, setExpandedClass] = useState(null);
  const [uploadingTo, setUploadingTo] = useState(null);

  const handleDeleteClass = (classId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this class? This will not delete associated tasks."
      )
    ) {
      deleteData("Classes", classId);
      setTimeout(onRefresh, 100);
    }
  };

  const toggleExpanded = (classId) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  const getClassDocuments = (className) => {
    return documents.filter((doc) => doc.class === className);
  };

  const handleFileUpload = (className, event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        storeData("Documents", {
          documentTitle: file.name,
          documentType: file.type,
          uploadDate: new Date().toISOString(),
          class: className,
          fileData: e.target.result,
          fileSize: file.size,
        });
      };
      reader.readAsDataURL(file);
    });

    setTimeout(() => {
      onRefresh();
      setUploadingTo(null);
    }, 200);
  };

  const handleDeleteDocument = (docId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteData("Documents", docId);
      setTimeout(onRefresh, 100);
    }
  };

  const downloadDocument = (doc) => {
    const link = document.createElement("a");
    link.href = doc.fileData;
    link.download = doc.documentTitle;
    link.click();
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
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteClass(cls.id)}
                    title="Delete class"
                  >
                    Delete
                  </button>
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
                                  onClick={() => downloadDocument(doc)}
                                  title="Download"
                                >
                                  Download
                                </button>
                                <button
                                  className="btn-icon"
                                  onClick={() => handleDeleteDocument(doc.id)}
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
    </div>
  );
}

export default ClassList;
