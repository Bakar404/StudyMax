import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getClasses, getTasks, getDocuments } from "../functions/supabaseDb";
import CalendarView from "./CalendarView";
import ClassList from "./ClassList";
import TaskList from "./TaskList";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeView, setActiveView] = useState("calendar");
  const [classes, setClasses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [classesResult, tasksResult, documentsResult] = await Promise.all([
        getClasses(),
        getTasks(),
        getDocuments(),
      ]);

      if (classesResult.data) {
        // Transform Supabase data to match component expectations
        setClasses(classesResult.data.map(cls => ({
          id: cls.id,
          courseTitle: cls.course_title,
          courseDescription: cls.course_description,
          color: cls.color,
          days: cls.days,
          time: cls.time,
        })));
      }

      if (tasksResult.data) {
        setTasks(tasksResult.data.map(task => ({
          id: task.id,
          taskTitle: task.task_title,
          taskDescription: task.task_description,
          class: task.class,
          deadline: task.deadline,
          workload: task.workload,
          notes: task.notes,
          completed: task.completed,
          createdAt: task.created_at,
          file_path: task.file_path,
          file_url: task.file_url,
          file_name: task.file_name,
          file_type: task.file_type,
          file_size: task.file_size,
        })));
      }

      if (documentsResult.data) {
        setDocuments(documentsResult.data.map(doc => ({
          id: doc.id,
          documentTitle: doc.document_title,
          documentType: doc.document_type,
          uploadDate: doc.created_at,
          class: doc.class,
          fileData: doc.file_url,
          fileUrl: doc.file_url,
          filePath: doc.file_path,
          fileSize: doc.file_size,
          file_size: doc.file_size,
          file_url: doc.file_url,
        })));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading your data...</p>
      </div>
    );
  }

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
            <button
              className="btn btn-secondary"
              onClick={handleSignOut}
            >
              Sign Out
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
