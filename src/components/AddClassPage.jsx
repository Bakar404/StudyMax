import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addClass } from "../functions/supabaseDb";
import "./Dashboard.css";

function AddClassPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseTitle: "",
    courseDescription: "",
    color: "#5B2C83",
    days: [],
    time: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const predefinedColors = [
    "#5B2C83",
    "#7a3da8",
    "#9b59d0",
    "#b075e8",
    "#f093fb",
    "#f5576c",
    "#4facfe",
    "#00f2fe",
    "#43e97b",
    "#38f9d7",
    "#fa709a",
    "#fee140",
    "#30cfd0",
    "#330867",
    "#a8edea",
    "#fed6e3",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.courseTitle.trim()) {
      setError("Please enter a class name");
      return;
    }

    if (formData.days.length === 0) {
      setError("Please select at least one day");
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting class:', formData);
      const result = await addClass({
        courseTitle: formData.courseTitle,
        courseDescription: formData.courseDescription,
        color: formData.color,
        days: formData.days,
        time: formData.time,
      });

      console.log('Result:', result);

      if (result.error) {
        const errorMsg = result.error.message || result.error.toString();
        setError(`Failed to add class: ${errorMsg}`);
        console.error('Error details:', result.error);
      } else {
        console.log('Class added successfully!');
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMsg = err.message || err.toString();
      setError(`Failed to add class: ${errorMsg}`);
      console.error('Caught error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
        <h1>Add New Class</h1>
      </div>

      <div className="page-content">
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="courseTitle">Class Name *</label>
              <input
                type="text"
                id="courseTitle"
                name="courseTitle"
                value={formData.courseTitle}
                onChange={handleChange}
                placeholder="e.g., Mathematics 201"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="courseDescription">Description</label>
              <textarea
                id="courseDescription"
                name="courseDescription"
                value={formData.courseDescription}
                onChange={handleChange}
                placeholder="Brief description of the class"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Class Color *</label>
              <div className="color-picker">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${
                      formData.color === color ? "selected" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                    title={color}
                  />
                ))}
              </div>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="color-input"
              />
            </div>

            <div className="form-group">
              <label>Days of Week *</label>
              <div className="days-selector">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`day-btn ${
                      formData.days.includes(day) ? "selected" : ""
                    }`}
                    onClick={() => handleDayToggle(day)}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="time">Class Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Adding..." : "Add Class"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddClassPage;
