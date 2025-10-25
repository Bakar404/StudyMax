import { useState } from "react";
import { deleteData } from "../functions/dbDelete";

function TaskList({ tasks, classes, onRefresh }) {
  const [filter, setFilter] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");

  const getClassColor = (className) => {
    const cls = classes.find((c) => c.courseTitle === className);
    return cls?.color || "#667eea";
  };

  const toggleTaskComplete = (taskId, currentStatus) => {
    const request = window.indexedDB.open("studyMax", 1);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("Tasks", "readwrite");
      const store = transaction.objectStore("Tasks");
      const getRequest = store.get(taskId);

      getRequest.onsuccess = () => {
        const task = getRequest.result;
        task.completed = !currentStatus;
        const updateRequest = store.put(task);
        updateRequest.onsuccess = () => {
          onRefresh();
        };
      };
    };
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteData("Tasks", taskId);
      setTimeout(onRefresh, 100);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed" && !task.completed) return false;
    if (filter === "pending" && task.completed) return false;
    if (selectedClass !== "all" && task.class !== selectedClass) return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const isOverdue = (deadline, completed) => {
    if (completed) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="task-list-container">
      <div className="list-header">
        <h2>Tasks & Assignments</h2>
        <div className="list-filters">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.courseTitle}>
                {cls.courseTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">No tasks</div>
          <h3>No tasks found</h3>
          <p>Add your first task to get started!</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`task-item-card ${task.completed ? "completed" : ""} ${
                isOverdue(task.deadline, task.completed) ? "overdue" : ""
              }`}
              style={{ borderLeft: `5px solid ${getClassColor(task.class)}` }}
            >
              <div className="task-item-header">
                <button
                  className={`task-checkbox ${task.completed ? "checked" : ""}`}
                  onClick={() => toggleTaskComplete(task.id, task.completed)}
                >
                  {task.completed && "✓"}
                </button>
                <h3 className="task-item-title">{task.taskTitle}</h3>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteTask(task.id)}
                  title="Delete task"
                >
                  Delete
                </button>
              </div>

              <div className="task-item-meta">
                <span
                  className="task-class"
                  style={{ color: getClassColor(task.class) }}
                >
                  {task.class}
                </span>
                <span
                  className={`task-deadline ${
                    isOverdue(task.deadline, task.completed) ? "overdue" : ""
                  }`}
                >
                  Due: {formatDate(task.deadline)}
                </span>
              </div>

              {task.taskDescription && (
                <p className="task-description">{task.taskDescription}</p>
              )}

              <div className="task-item-footer">
                {task.workload && (
                  <span className="task-workload">
                    Workload: {task.workload}
                  </span>
                )}
                {task.notes && (
                  <span className="task-notes" title={task.notes}>
                    Notes available
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
