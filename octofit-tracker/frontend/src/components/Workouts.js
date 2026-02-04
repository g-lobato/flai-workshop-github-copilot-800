import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
    console.log('Workouts - Fetching from API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts - Raw API response:', data);
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Workouts - Processed data:', workoutsData);
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Workouts - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading workouts...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const getDifficultyBadge = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'beginner':
        return <span className="badge bg-success">Beginner</span>;
      case 'intermediate':
        return <span className="badge bg-warning text-dark">Intermediate</span>;
      case 'advanced':
        return <span className="badge bg-danger">Advanced</span>;
      default:
        return <span className="badge bg-secondary">{difficulty}</span>;
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">💪 Workout Suggestions</h2>
        <button className="btn btn-primary">
          <i className="bi bi-shuffle"></i> Get New Suggestions
        </button>
      </div>
      
      <div className="row">
        {workouts.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center" role="alert">
              <i className="bi bi-info-circle" style={{fontSize: '2rem'}}></i>
              <p className="mt-2 mb-0">No workout suggestions available</p>
            </div>
          </div>
        ) : (
          workouts.map(workout => (
            <div key={workout.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">{workout.name}</h5>
                    {getDifficultyBadge(workout.difficulty_level)}
                  </div>
                  
                  <p className="card-text flex-grow-1">{workout.description}</p>
                  
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-info">{workout.category}</span>
                      <small className="text-muted">ID: {workout.id}</small>
                    </div>
                    
                    <hr />
                    
                    <div className="row text-center">
                      <div className="col-6">
                        <div className="mb-1">
                          <i className="bi bi-clock"></i>
                        </div>
                        <strong>{workout.duration_minutes}</strong>
                        <br />
                        <small className="text-muted">minutes</small>
                      </div>
                      <div className="col-6">
                        <div className="mb-1">
                          <i className="bi bi-fire"></i>
                        </div>
                        <strong>{workout.estimated_calories}</strong>
                        <br />
                        <small className="text-muted">calories</small>
                      </div>
                    </div>
                    
                    <button className="btn btn-outline-primary w-100 mt-3">
                      Start Workout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {workouts.length > 0 && (
        <div className="mt-3 text-center">
          <small className="text-muted">Showing {workouts.length} workout suggestions</small>
        </div>
      )}
    </div>
  );
}

export default Workouts;
