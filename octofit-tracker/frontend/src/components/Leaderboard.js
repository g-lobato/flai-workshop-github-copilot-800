import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
    console.log('Leaderboard - Fetching from API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard - Raw API response:', data);
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        console.log('Leaderboard - Processed data:', leaderboardData);
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Leaderboard - Error fetching data:', error);
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
        <p className="mt-3">Loading leaderboard...</p>
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

  const getRankBadgeClass = (rank) => {
    if (rank === 1) return 'rank-badge rank-1';
    if (rank === 2) return 'rank-badge rank-2';
    if (rank === 3) return 'rank-badge rank-3';
    return 'rank-badge rank-other';
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">🏆 Leaderboard</h2>
        <button className="btn btn-outline-primary btn-sm">
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>
      
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col" style={{width: '80px'}}>Rank</th>
              <th scope="col">User</th>
              <th scope="col">Team</th>
              <th scope="col" className="text-center">Points</th>
              <th scope="col" className="text-center">Calories Burned</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  <div className="text-muted">
                    <i className="bi bi-trophy" style={{fontSize: '3rem'}}></i>
                    <p className="mt-2">No leaderboard entries yet</p>
                  </div>
                </td>
              </tr>
            ) : (
              leaderboard.map((entry, index) => {
                const rank = index + 1;
                return (
                  <tr key={entry.id}>
                    <td>
                      <div className={getRankBadgeClass(rank)}>
                        {rank}
                      </div>
                    </td>
                    <td>
                      <strong>{entry.user_name || entry.user || 'N/A'}</strong>
                      <br />
                      <small className="text-muted">ID: {entry.id}</small>
                    </td>
                    <td>
                      <span className="badge bg-primary">{entry.team_name || entry.team || 'N/A'}</span>
                    </td>
                    <td className="text-center">
                      <h5 className="mb-0">
                        <span className="badge bg-success">{entry.total_points}</span>
                      </h5>
                    </td>
                    <td className="text-center">
                      <h5 className="mb-0">
                        <span className="badge bg-danger">{entry.total_calories}</span>
                      </h5>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
