import { useNavigate } from "react-router-dom";
import "../styles.css";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div>
      <header className="header">
        <div className="nav-container">
          <div className="logo">📚 StudyMax</div>
          <div className="auth-buttons">
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-login"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-signup"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Welcome to StudyMax</h1>
            <p className="tagline">Your Academic Productivity Partner</p>
            <p className="hero-description">
              StudyMax is an educational productivity platform designed to help
              students excel. Create custom timetables, organize your classes,
              prioritize tasks, and never miss a deadline. Upload study
              materials, customize your subject pages, and receive timely
              reminders. Track your progress in real-time as you complete
              assignments and achieve your academic goals.
            </p>
            <div className="cta-buttons">
              <button
                onClick={() => navigate("/dashboard")}
                className="btn btn-signup btn-large"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="btn btn-login btn-large"
              >
                Log In
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Welcome;
