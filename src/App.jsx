import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import dbConnect from "./functions/dbConnect.js";
import Welcome from "./components/Welcome";
import Dashboard from "./components/Dashboard";
import AddClassPage from "./components/AddClassPage";
import AddTaskPage from "./components/AddTaskPage";

function App() {
  useEffect(() => {
    // Initialize database on mount
    dbConnect();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-class" element={<AddClassPage />} />
        <Route path="/add-task" element={<AddTaskPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
