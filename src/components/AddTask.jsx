import { useState } from "react";
import storeData from "../functions/dbStore";

function AddTask({ classes, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    taskTitle: "",
    taskDescription: "",
    class: "",
    deadline: "",
    workload: "",
    notes: "",
  });

  const [error, setError] = useState("");

  const workloadOptions = ["Light", "Moderate", "Heavy", "Very Heavy"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
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

    try {
      storeData("Tasks", {
        taskTitle: formData.taskTitle,
        taskDescription: formData.taskDescription,
        class: formData.class,
        deadline: formData.deadline,
        workload: formData.workload,
        notes: formData.notes,
        completed: false,
        createdAt: new Date().toISOString(),
      });

      // Wait a moment for the database to update
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 100);
    } catch (err) {
      setError("Failed to add task. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Task/Assignment</h2>
          <button className="btn-close" onClick={onClose}>
            ✕
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

          {error && <div className="error-message">{error}</div>}

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTask;
