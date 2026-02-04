import React, { useState, useEffect, useCallback } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    team_id: ''
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchUsers = useCallback(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
    console.log('Users - Fetching from API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Users - Raw API response:', data);
        const usersData = data.results || data;
        console.log('Users - Processed data:', usersData);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Users - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const fetchTeams = useCallback(() => {
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
        const teamsData = data.results || data;
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      })
      .catch(error => {
        console.error('Teams - Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, [fetchUsers, fetchTeams]);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      team_id: user.team_id || ''
    });
    setSaveError(null);
    setSaveSuccess(false);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', team_id: '' });
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/${editingUser.id}/`;
      console.log('Updating user:', apiUrl, formData);

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
      console.log('User updated successfully:', updatedUser);

      // Update the users list
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === editingUser.id ? updatedUser : user
        )
      );

      setSaveSuccess(true);
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Error updating user:', error);
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading users...</p>
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
        <h2 className="mb-0">👥 Users</h2>
        <button className="btn btn-success">
          <i className="bi bi-person-plus"></i> Add User
        </button>
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Team</th>
              <th scope="col">Member Since</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  <div className="text-muted">
                    <i className="bi bi-people" style={{fontSize: '3rem'}}></i>
                    <p className="mt-2">No users found</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td><span className="badge bg-secondary">{user.id}</span></td>
                  <td>
                    <strong>{user.name}</strong>
                  </td>
                  <td>
                    <a href={`mailto:${user.email}`} className="text-decoration-none">
                      {user.email}
                    </a>
                  </td>
                  <td>
                    <span className="badge bg-primary">
                      {user.team_name || 'No Team'}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEditClick(user)}
                      title="Edit User"
                    >
                      <i className="bi bi-pencil"></i> Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {users.length > 0 && (
        <div className="mt-3 text-end">
          <small className="text-muted">Total users: {users.length}</small>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <>
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-pencil-square"></i> Edit User
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleCloseModal}
                    disabled={saving}
                  ></button>
                </div>
                <form onSubmit={handleSaveUser}>
                  <div className="modal-body">
                    {saveError && (
                      <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle"></i> {saveError}
                      </div>
                    )}
                    {saveSuccess && (
                      <div className="alert alert-success" role="alert">
                        <i className="bi bi-check-circle"></i> User updated successfully!
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <label htmlFor="userName" className="form-label">
                        <strong>Name</strong>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="userName"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={saving}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="userEmail" className="form-label">
                        <strong>Email</strong>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="userEmail"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={saving}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="userTeam" className="form-label">
                        <strong>Team</strong>
                      </label>
                      <select
                        className="form-select"
                        id="userTeam"
                        name="team_id"
                        value={formData.team_id}
                        onChange={handleInputChange}
                        disabled={saving}
                      >
                        <option value="">No Team</option>
                        {teams.map(team => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                      <small className="form-text text-muted">
                        Select a team or leave as "No Team"
                      </small>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={handleCloseModal}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save"></i> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </>
      )}
    </div>
  );
}

export default Users;
