import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    console.log('Teams - Fetching from API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams - Raw API response:', data);
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        console.log('Teams - Processed data:', teamsData);
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Teams - Error fetching data:', error);
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
        <p className="mt-3">Loading teams...</p>
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
        <h2 className="mb-0">🏅 Teams</h2>
        <button className="btn btn-success">
          <i className="bi bi-plus-circle"></i> Create Team
        </button>
      </div>
      
      <div className="row">
        {teams.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center" role="alert">
              <i className="bi bi-people" style={{fontSize: '3rem'}}></i>
              <p className="mt-2 mb-0">No teams found. Create your first team!</p>
            </div>
          </div>
        ) : (
          teams.map(team => (
            <div key={team.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">{team.name}</h5>
                    <span className="badge bg-primary">ID: {team.id}</span>
                  </div>
                  
                  <p className="card-text flex-grow-1">
                    {team.description || 'No description available'}
                  </p>
                  
                  <hr />
                  
                  <div className="mb-3">
                    <div className="text-muted mb-2">
                      <i className="bi bi-people-fill"></i> Members: <strong>{team.member_count || 0}</strong>
                    </div>
                    <small className="text-muted">
                      <i className="bi bi-calendar"></i> Created: {new Date(team.created_at).toLocaleDateString()}
                    </small>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary btn-sm">
                      View Team
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                      Join Team
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {teams.length > 0 && (
        <div className="mt-3 text-center">
          <small className="text-muted">Total teams: {teams.length}</small>
        </div>
      )}
    </div>
  );
}

export default Teams;
