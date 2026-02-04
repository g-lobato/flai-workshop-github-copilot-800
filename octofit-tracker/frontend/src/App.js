import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function Home() {
  return (
    <div className="container mt-4">
      <div className="jumbotron">
        <h1 className="display-4">Welcome to OctoFit Tracker!</h1>
        <p className="lead">Your fitness companion for tracking activities, competing with teams, and achieving your fitness goals.</p>
        <hr className="my-4" />
        <p>Use the navigation menu above or click on the cards below to explore different features:</p>
        
        <div className="row mt-4">
          <div className="col-md-6 col-lg-4 mb-3">
            <Link to="/users" className="text-decoration-none">
              <div className="card h-100 shadow-sm hover-card">
                <div className="card-body text-center">
                  <i className="bi bi-people-fill" style={{fontSize: '3rem', color: '#0d6efd'}}></i>
                  <h5 className="card-title mt-3">Users</h5>
                  <p className="card-text">View all registered users</p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="col-md-6 col-lg-4 mb-3">
            <Link to="/activities" className="text-decoration-none">
              <div className="card h-100 shadow-sm hover-card">
                <div className="card-body text-center">
                  <i className="bi bi-activity" style={{fontSize: '3rem', color: '#198754'}}></i>
                  <h5 className="card-title mt-3">Activities</h5>
                  <p className="card-text">Track and view fitness activities</p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="col-md-6 col-lg-4 mb-3">
            <Link to="/teams" className="text-decoration-none">
              <div className="card h-100 shadow-sm hover-card">
                <div className="card-body text-center">
                  <i className="bi bi-flag-fill" style={{fontSize: '3rem', color: '#ffc107'}}></i>
                  <h5 className="card-title mt-3">Teams</h5>
                  <p className="card-text">Manage and join fitness teams</p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="col-md-6 col-lg-4 mb-3">
            <Link to="/leaderboard" className="text-decoration-none">
              <div className="card h-100 shadow-sm hover-card">
                <div className="card-body text-center">
                  <i className="bi bi-trophy-fill" style={{fontSize: '3rem', color: '#dc3545'}}></i>
                  <h5 className="card-title mt-3">Leaderboard</h5>
                  <p className="card-text">See who's leading the fitness challenge</p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="col-md-6 col-lg-4 mb-3">
            <Link to="/workouts" className="text-decoration-none">
              <div className="card h-100 shadow-sm hover-card">
                <div className="card-body text-center">
                  <i className="bi bi-heart-pulse-fill" style={{fontSize: '3rem', color: '#6f42c1'}}></i>
                  <h5 className="card-title mt-3">Workouts</h5>
                  <p className="card-text">Get personalized workout suggestions</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src="/octofitapp-small.png" alt="OctoFit Logo" className="navbar-logo" />
            OctoFit Tracker
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
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/users">Users</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/activities">Activities</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/teams">Teams</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/workouts">Workouts</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </div>
  );
}

export default App;
