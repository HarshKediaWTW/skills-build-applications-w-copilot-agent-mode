import React, { useState, useEffect, useCallback } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Leaderboard endpoint:', endpoint);

      const response = await fetch(endpoint);
      const data = await response.json();

      console.log('Leaderboard fetched data:', data);

      const leaderboardList = data.results || data;
      const normalized = Array.isArray(leaderboardList) ? leaderboardList : [];
      setLeaderboard(normalized);
      setFilteredLeaderboard(normalized);
      setError(null);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(`Failed to fetch leaderboard: ${err.message}`);
      setLeaderboard([]);
      setFilteredLeaderboard([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredLeaderboard(leaderboard);
      return;
    }

    setFilteredLeaderboard(
      leaderboard.filter((entry) =>
        [entry.user_name, entry.username, entry.team_name, entry.team, String(entry.points || 0)]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(term)
      )
    );
  }, [searchTerm, leaderboard]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <h2 className="h3 fw-bold mb-0">Leaderboard</h2>
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
              placeholder="Filter leaderboard"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-grid d-md-flex justify-content-md-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
              Clear
            </button>
            <button type="button" className="btn btn-primary" onClick={fetchLeaderboard}>
              Refresh
            </button>
          </div>
        </form>

        {loading && <p className="mb-0">Loading leaderboard...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Team</th>
                  <th>Points</th>
                  <th>Activities</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaderboard.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">No leaderboard data found.</td>
                  </tr>
                )}
                {filteredLeaderboard.map((entry, index) => (
                  <tr key={entry.id || index}>
                    <td>{index + 1}</td>
                    <td>{entry.user_name || entry.username || 'N/A'}</td>
                    <td>{entry.team_name || entry.team || 'N/A'}</td>
                    <td className="fw-semibold">{entry.points || 0}</td>
                    <td>{entry.activities_count || 0}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setSelectedEntry(entry)}
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

        {selectedEntry && (
          <>
            <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Leaderboard Entry</h5>
                    <button type="button" className="btn-close" onClick={() => setSelectedEntry(null)}></button>
                  </div>
                  <div className="modal-body">
                    <pre className="bg-light p-3 rounded mb-0">{JSON.stringify(selectedEntry, null, 2)}</pre>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedEntry(null)}>
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

export default Leaderboard;
