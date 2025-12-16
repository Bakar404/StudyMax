import { useState, useEffect } from "react";
import { deleteTask, updateTask, getTaskFiles } from "../functions/supabaseDb";
import TaskDetail from "./TaskDetail";

function TaskList({ tasks, classes, onRefresh }) {
  const [filter, setFilter] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskFileCounts, setTaskFileCounts] = useState({});

  useEffect(() => {
    loadFileCountsForTasks();
  }, [tasks]);

  const loadFileCountsForTasks = async () => {
    const counts = {};
    for (const task of tasks) {
      const result = await getTaskFiles(task.id);
      counts[task.id] = result.data?.length || 0;
    }
    setTaskFileCounts(counts);
  };

  const getClassColor = (className) => {
    const cls = classes.find((c) => c.courseTitle === className);
    return cls?.color || "#667eea";
  };

  const toggleTaskComplete = async (taskId, currentStatus) => {
    await updateTask(taskId, { completed: !currentStatus });
    onRefresh();
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId);
      onRefresh();
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
                  {task.completed && ""}
                </button>
                <h3 className="task-item-title">{task.taskTitle}</h3>
                <div className="task-actions">
                  <button
                    className="btn-view"
                    onClick={() => setSelectedTask(task)}
                    title="View details and manage files"
                  >
                    View Details
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete task"
                  >
                    Delete
                  </button>
                </div>
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
                {taskFileCounts[task.id] > 0 && (
                  <span className="task-file-indicator">
                    {taskFileCounts[task.id]} file{taskFileCounts[task.id] !== 1 ? 's' : ''} attached
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTask && (
        <TaskDetail 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)}
          onUpdate={() => {
            setSelectedTask(null);
            onRefresh();
            loadFileCountsForTasks();
          }}
        />
      )}
    </div>
  );
}

export default TaskList;
