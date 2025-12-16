import { useState } from "react";
import { addTask, uploadTaskFile } from "../functions/supabaseDb";
import { validateFile, getAcceptString, getSupportedFormatsText } from "../utils/fileValidation";

function AddTask({ classes, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    taskTitle: "",
    taskDescription: "",
    class: "",
    deadline: "",
    workload: "",
    notes: "",
  });

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const workloadOptions = ["Light", "Moderate", "Heavy", "Very Heavy"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file
      const validation = validateFile(selectedFile);
      if (!validation.valid) {
        setError(validation.error);
        e.target.value = ''; // Reset file input
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.taskTitle.trim()) {
      setError("Please enter a task title");
      return;
    }

    if (!formData.class) {
      setError("Please select a class");
      return;
    }

    if (!formData.deadline) {
      setError("Please select a deadline");
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting task:', formData);
      
      // Upload file first if present
      let fileData = null;
      if (file) {
        console.log('Uploading file:', file.name);
        const uploadResult = await uploadTaskFile(file);
        if (uploadResult.error) {
          throw new Error(`File upload failed: ${uploadResult.error.message || uploadResult.error}`);
        }
        fileData = uploadResult.data;
        console.log('File uploaded:', fileData);
      }
      
      const result = await addTask({
        taskTitle: formData.taskTitle,
        taskDescription: formData.taskDescription,
        class: formData.class,
        deadline: formData.deadline,
        workload: formData.workload,
        notes: formData.notes,
        completed: false,
        file_path: fileData?.path || null,
        file_url: fileData?.url || null,
        file_name: file?.name || null,
        file_type: file?.type || null,
        file_size: file?.size || null,
      });

      console.log('Result:', result);

      if (result.error) {
        const errorMsg = result.error.message || result.error.toString();
        setError(`Failed to add task: ${errorMsg}`);
        console.error('Error details:', result.error);
      } else {
        console.log('Task added successfully!');
        onSuccess();
        onClose();
      }
    } catch (err) {
      const errorMsg = err.message || err.toString();
      setError(`Failed to add task: ${errorMsg}`);
      console.error('Caught error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Task/Assignment</h2>
          <button className="btn-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="taskTitle">Task Title *</label>
            <input
              type="text"
              id="taskTitle"
              name="taskTitle"
              value={formData.taskTitle}
              onChange={handleChange}
              placeholder="e.g., Complete Math Problem Set"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="class">Associated Class *</label>
            <select
              id="class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              required
            >
              <option value="">Select a class...</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.courseTitle}>
                  {cls.courseTitle}
                </option>
              ))}
            </select>
            {classes.length === 0 && (
              <small className="form-hint">
                Please add a class first before creating tasks
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Due Date *</label>
            <input
              type="datetime-local"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="workload">Workload</label>
            <select
              id="workload"
              name="workload"
              value={formData.workload}
              onChange={handleChange}
            >
              <option value="">Select workload...</option>
              {workloadOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="taskDescription">Description</label>
            <textarea
              id="taskDescription"
              name="taskDescription"
              value={formData.taskDescription}
              onChange={handleChange}
              placeholder="Details about the task"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="file">Attach File (Optional)</label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              accept={getAcceptString()}
            />
            {file && (
              <small className="form-hint">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </small>
            )}
            <small className="form-hint">
              Max 10MB. Supported: {getSupportedFormatsText()}
            </small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTask;
