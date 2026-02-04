import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
    console.log('Activities - Fetching from API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Activities - Raw API response:', data);
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        console.log('Activities - Processed data:', activitiesData);
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Activities - Error fetching data:', error);
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
        <p className="mt-3">Loading activities...</p>
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Activity Log</h2>
        <button className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Log Activity
        </button>
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">User</th>
              <th scope="col">Activity Type</th>
              <th scope="col">Duration</th>
              <th scope="col">Calories</th>
              <th scope="col">Distance</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <div className="text-muted">
                    <i className="bi bi-inbox" style={{fontSize: '3rem'}}></i>
                    <p className="mt-2">No activities logged yet</p>
                  </div>
                </td>
              </tr>
            ) : (
              activities.map(activity => (
                <tr key={activity.id}>
                  <td><span className="badge bg-secondary">{activity.id}</span></td>
                  <td><strong>{activity.user_name || activity.user || 'N/A'}</strong></td>
                  <td>
                    <span className="badge bg-info">{activity.activity_type}</span>
                  </td>
                  <td>{activity.duration} min</td>
                  <td>
                    <span className="badge bg-danger">{activity.calories} cal</span>
                  </td>
                  <td>{activity.distance} km</td>
                  <td>{new Date(activity.date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {activities.length > 0 && (
        <div className="mt-3 text-end">
          <small className="text-muted">Total activities: {activities.length}</small>
        </div>
      )}
    </div>
  );
}

export default Activities;
