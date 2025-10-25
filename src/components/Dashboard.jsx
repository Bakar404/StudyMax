import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalendarView from "./CalendarView";
import ClassList from "./ClassList";
import TaskList from "./TaskList";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("calendar");
  const [classes, setClasses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    const request = window.indexedDB.open("studyMax", 1);

    request.onsuccess = (event) => {
      const database = event.target.result;
      setDb(database);
      loadData(database);
    };

    request.onerror = (event) => {
      console.error("Database error: ", event.target.error);
    };
  }, []);

  const loadData = (database) => {
    const classTransaction = database.transaction("Classes", "readonly");
    const classStore = classTransaction.objectStore("Classes");
    const classRequest = classStore.getAll();

    classRequest.onsuccess = () => {
      setClasses(classRequest.result || []);
    };

    const taskTransaction = database.transaction("Tasks", "readonly");
    const taskStore = taskTransaction.objectStore("Tasks");
    const taskRequest = taskStore.getAll();

    taskRequest.onsuccess = () => {
      setTasks(taskRequest.result || []);
    };

    const docTransaction = database.transaction("Documents", "readonly");
    const docStore = docTransaction.objectStore("Documents");
    const docRequest = docStore.getAll();

    docRequest.onsuccess = () => {
      setDocuments(docRequest.result || []);
    };
  };

  const refreshData = () => {
    if (db) {
      loadData(db);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-logo">StudyMax</h1>
          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/add-class")}
            >
              + Add Class
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/add-task")}
            >
              + Add Task
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-btn ${activeView === "calendar" ? "active" : ""}`}
          onClick={() => setActiveView("calendar")}
        >
          Calendar
        </button>
        <button
          className={`nav-btn ${activeView === "tasks" ? "active" : ""}`}
          onClick={() => setActiveView("tasks")}
        >
          Tasks
        </button>
        <button
          className={`nav-btn ${activeView === "classes" ? "active" : ""}`}
          onClick={() => setActiveView("classes")}
        >
          Classes
        </button>
      </nav>

      <main className="dashboard-content">
        {activeView === "calendar" && (
          <CalendarView tasks={tasks} classes={classes} />
        )}
        {activeView === "tasks" && (
          <TaskList tasks={tasks} classes={classes} onRefresh={refreshData} />
        )}
        {activeView === "classes" && (
          <ClassList
            classes={classes}
            documents={documents}
            onRefresh={refreshData}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
