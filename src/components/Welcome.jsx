import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";
import Signup from "./Signup";
import "../styles.css";

function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupClick = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const handleCloseModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  return (
    <div>
      <header className="header">
        <div className="nav-container">
          <div className="logo">StudyMax</div>
          <div className="auth-buttons">
            <button
              onClick={handleLoginClick}
              className="btn btn-login"
            >
              Log In
            </button>
            <button
              onClick={handleSignupClick}
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
                onClick={handleSignupClick}
                className="btn btn-signup btn-large"
              >
                Get Started Free
              </button>
              <button
                onClick={handleLoginClick}
                className="btn btn-login btn-large"
              >
                Log In
              </button>
            </div>
          </div>
        </section>

        <section className="gallery-section">
          <div className="container">
            <h2 className="section-title">See StudyMax in Action</h2>
            <p className="section-subtitle">
              Discover how students are transforming their study habits
            </p>
            <div className="slider">
              <div className="slide" id="slide1">
                <img
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900&h=500&fit=crop"
                  alt="Student studying with organized notes"
                />
              </div>
              <div className="slide" id="slide2">
                <img
                  src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=900&h=500&fit=crop"
                  alt="Digital planner and schedule"
                />
              </div>
              <div className="slide" id="slide3">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&h=500&fit=crop"
                  alt="Productive study workspace"
                />
              </div>
              <div className="slide" id="slide4">
                <img
                  src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&h=500&fit=crop"
                  alt="Student achievement and success"
                />
              </div>

              <a href="#slide4" className="slider-nav prev">
                &#10094;
              </a>
              <a href="#slide1" className="slider-nav prev">
                &#10094;
              </a>
              <a href="#slide2" className="slider-nav prev">
                &#10094;
              </a>
              <a href="#slide3" className="slider-nav prev">
                &#10094;
              </a>

              <a href="#slide2" className="slider-nav next">
                &#10095;
              </a>
              <a href="#slide3" className="slider-nav next">
                &#10095;
              </a>
              <a href="#slide4" className="slider-nav next">
                &#10095;
              </a>
              <a href="#slide1" className="slider-nav next">
                &#10095;
              </a>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2 className="section-title">Why Choose StudyMax?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Smart Timetables</h3>
                <p>
                  Create personalized class schedules and study plans that adapt
                  to your routine.
                </p>
              </div>
              <div className="feature-card">
                <h3>Priority Management</h3>
                <p>
                  Organize tasks by priority and focus on what matters most for
                  your success.
                </p>
              </div>
              <div className="feature-card">
                <h3>Study Materials Hub</h3>
                <p>
                  Upload and organize all your teaching materials in one secure,
                  accessible place.
                </p>
              </div>
              <div className="feature-card">
                <h3>Smart Reminders</h3>
                <p>
                  Get email and push notifications as deadlines approach so you
                  never miss a thing.
                </p>
              </div>
              <div className="feature-card">
                <h3>Progress Tracking</h3>
                <p>
                  Monitor your completion rates and track your academic progress
                  in real-time.
                </p>
              </div>
              <div className="feature-card">
                <h3>Customizable Pages</h3>
                <p>
                  Design unique pages for each subject to suit your learning
                  style and preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Transform Your Study Life?</h2>
              <p>
                Join thousands of students who are achieving their academic
                goals with StudyMax
              </p>
              <div className="cta-buttons-bottom">
                <button
                  onClick={handleSignupClick}
                  className="btn btn-signup btn-large"
                >
                  Start Free Today
                </button>
                <p className="cta-note">
                  No credit card required • Free forever plan available
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>StudyMax</h3>
              <p>
                Empowering students to achieve academic excellence through smart
                productivity tools.
              </p>
            </div>
            <div className="footer-section">
              <h3>Resources</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">Help Center</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Study Tips</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 StudyMax. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {showLogin && (
        <Login 
          onClose={handleCloseModals} 
          onSwitchToSignup={handleSignupClick}
        />
      )}
      
      {showSignup && (
        <Signup 
          onClose={handleCloseModals} 
          onSwitchToLogin={handleLoginClick}
        />
      )}
    </div>
  );
}

export default Welcome;
