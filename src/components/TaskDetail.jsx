import { useState, useEffect } from "react";
import { updateTask, addTaskFile, getTaskFiles, deleteTaskFile } from "../functions/supabaseDb";
import { validateFile, formatFileSize, getAcceptString, getSupportedFormatsText } from "../utils/fileValidation";

function TaskDetail({ task, onClose, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [taskFiles, setTaskFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  useEffect(() => {
    loadTaskFiles();
  }, [task.id]);

  const loadTaskFiles = async () => {
    setLoadingFiles(true);
    try {
      const result = await getTaskFiles(task.id);
      if (result.data) {
        setTaskFiles(result.data);
      }
    } catch (err) {
      console.error("Error loading task files:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      e.target.value = ''; // Reset file input
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      console.log('Uploading new file:', file.name);
      const uploadResult = await addTaskFile(task.id, file);
      
      if (uploadResult.error) {
        throw new Error(`File upload failed: ${uploadResult.error.message || uploadResult.error}`);
      }

      console.log('File uploaded successfully');
      setSuccess("File uploaded successfully!");
      
      // Reload files list
      await loadTaskFiles();
      
      // Reset input
      e.target.value = '';
      
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to upload file");
      console.error("Error uploading file:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId, filePath) => {
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      const result = await deleteTaskFile(fileId, filePath);
      if (result.error) {
        throw new Error(result.error.message || result.error);
      }
      
      setSuccess("File deleted successfully!");
      await loadTaskFiles();
      
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to delete file");
      console.error("Error deleting file:", err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const fileUrl = task.file_url || task.fileUrl;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content task-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task.taskTitle || task.task_title}</h2>
          <button className="btn-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="task-detail-content">
          <div className="detail-section">
            <h3>Details</h3>
            <div className="detail-item">
              <label>Class:</label>
              <span>{task.class}</span>
            </div>
            <div className="detail-item">
              <label>Due Date:</label>
              <span>{formatDate(task.deadline)}</span>
            </div>
            {task.workload && (
              <div className="detail-item">
                <label>Workload:</label>
                <span>{task.workload}</span>
              </div>
            )}
            {(task.taskDescription || task.task_description) && (
              <div className="detail-item">
                <label>Description:</label>
                <p>{task.taskDescription || task.task_description}</p>
              </div>
            )}
            {task.notes && (
              <div className="detail-item">
                <label>Notes:</label>
                <p>{task.notes}</p>
              </div>
            )}
          </div>

          <div className="detail-section files-section">
            <h3>Attached Files ({taskFiles.length})</h3>
            
            {loadingFiles ? (
              <p className="loading-files">Loading files...</p>
            ) : taskFiles.length > 0 ? (
              <div className="documents-list">
                {taskFiles.map((file) => (
                  <div key={file.id} className="attached-file">
                    <div className="file-info">
                      <div className="file-name">{file.file_name}</div>
                      <div className="file-meta">
                        {file.file_type && <span className="file-type">{file.file_type}</span>}
                        {file.file_size && <span className="file-size">{formatFileSize(file.file_size)}</span>}
                      </div>
                    </div>
                    <div className="file-actions">
                      <a 
                        href={file.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        View
                      </a>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteFile(file.id, file.file_path)}
                        title="Delete file"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-files">No files attached yet</p>
            )}

            <div className="upload-section">
              <label className="upload-label">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  accept={getAcceptString()}
                  style={{ display: 'none' }}
                />
                <button 
                  className="btn btn-secondary"
                  disabled={uploading}
                  onClick={(e) => {
                    e.preventDefault();
                    e.currentTarget.previousElementSibling.click();
                  }}
                >
                  {uploading ? "Uploading..." : "Add File"}
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

export default TaskDetail;
