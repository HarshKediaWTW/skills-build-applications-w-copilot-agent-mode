import React, { useState, useEffect, useCallback } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);

  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Teams endpoint:', endpoint);

      const response = await fetch(endpoint);
      const data = await response.json();

      console.log('Teams fetched data:', data);

      const teamsList = data.results || data;
      const normalized = Array.isArray(teamsList) ? teamsList : [];
      setTeams(normalized);
      setFilteredTeams(normalized);
      setError(null);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError(`Failed to fetch teams: ${err.message}`);
      setTeams([]);
      setFilteredTeams([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredTeams(teams);
      return;
    }

    setFilteredTeams(
      teams.filter((team) =>
        [team.name, team.description, String(team.members_count || 0)]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(term)
      )
    );
  }, [searchTerm, teams]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <h2 className="h3 fw-bold mb-0">Teams</h2>
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
              placeholder="Filter teams"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-grid d-md-flex justify-content-md-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
              Clear
            </button>
            <button type="button" className="btn btn-primary" onClick={fetchTeams}>
              Refresh
            </button>
          </div>
        </form>

        {loading && <p className="mb-0">Loading teams...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Members</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">No teams found.</td>
                  </tr>
                )}
                {filteredTeams.map((team) => (
                  <tr key={team.id}>
                    <td>{team.id}</td>
                    <td>{team.name || 'N/A'}</td>
                    <td>{team.description || 'N/A'}</td>
                    <td>{team.members_count || 0}</td>
                    <td>{team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setSelectedTeam(team)}
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

        {selectedTeam && (
          <>
            <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Team Details</h5>
                    <button type="button" className="btn-close" onClick={() => setSelectedTeam(null)}></button>
                  </div>
                  <div className="modal-body">
                    <pre className="bg-light p-3 rounded mb-0">{JSON.stringify(selectedTeam, null, 2)}</pre>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedTeam(null)}>
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

export default Teams;
