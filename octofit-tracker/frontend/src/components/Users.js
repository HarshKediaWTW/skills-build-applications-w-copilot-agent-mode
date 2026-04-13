import React, { useState, useEffect, useCallback } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Users endpoint:', endpoint);

      const response = await fetch(endpoint);
      const data = await response.json();

      console.log('Users fetched data:', data);

      const usersList = data.results || data;
      const normalized = Array.isArray(usersList) ? usersList : [];
      setUsers(normalized);
      setFilteredUsers(normalized);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(`Failed to fetch users: ${err.message}`);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredUsers(users);
      return;
    }

    setFilteredUsers(
      users.filter((user) =>
        [user.username, user.email, user.first_name, user.last_name, String(user.id)]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(term)
      )
    );
  }, [searchTerm, users]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <h2 className="h3 fw-bold mb-0">Users</h2>
          <a className="btn btn-link" href={endpoint} target="_blank" rel="noreferrer">
            API Link
          </a>
        </div>

        <form
          className="row g-2 align-items-center mb-3"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Filter users"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-grid d-md-flex justify-content-md-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
              Clear
            </button>
            <button type="button" className="btn btn-primary" onClick={fetchUsers}>
              Refresh
            </button>
          </div>
        </form>

        {loading && <p className="mb-0">Loading users...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">No users found.</td>
                  </tr>
                )}
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{user.first_name || 'N/A'}</td>
                    <td>{user.last_name || 'N/A'}</td>
                    <td>{user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setSelectedUser(user)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedUser && (
          <>
            <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">User Details</h5>
                    <button type="button" className="btn-close" onClick={() => setSelectedUser(null)}></button>
                  </div>
                  <div className="modal-body">
                    <pre className="bg-light p-3 rounded mb-0">{JSON.stringify(selectedUser, null, 2)}</pre>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
