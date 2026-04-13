import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <nav className="navbar navbar-expand-lg navbar-dark app-navbar shadow-sm">
          <div className="container">
            <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
              <img src="/octofitapp-small.png" alt="OctoFit logo" className="app-brand-logo" />
              <strong className="app-brand-text">OctoFit Tracker</strong>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">
                    Activities
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">
                    Leaderboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">
                    Teams
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">
                    Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">
                    Workouts
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main className="container py-4 py-md-5">
          <Routes>
          <Route
            path="/"
            element={
              <div className="card border-0 shadow-lg">
                <div className="card-body p-4 p-md-5">
                  <h1 className="display-5 fw-bold mb-3">Welcome to OctoFit Tracker</h1>
                  <p className="lead text-secondary mb-4">
                    Explore your performance across activities, teams, workouts, users, and rankings.
                    Use the navigation links above to open each dashboard.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <Link className="btn btn-primary" to="/activities">View Activities</Link>
                    <Link className="btn btn-outline-primary" to="/leaderboard">Open Leaderboard</Link>
                    <Link className="btn btn-outline-secondary" to="/teams">See Teams</Link>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
