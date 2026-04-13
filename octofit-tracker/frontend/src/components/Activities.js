import React, { useState, useEffect, useCallback } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);

  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Activities endpoint:', endpoint);

      const response = await fetch(endpoint);
      const data = await response.json();

      console.log('Activities fetched data:', data);

      const activityList = data.results || data;
      const normalized = Array.isArray(activityList) ? activityList : [];
      setActivities(normalized);
      setFilteredActivities(normalized);
      setError(null);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(`Failed to fetch activities: ${err.message}`);
      setActivities([]);
      setFilteredActivities([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredActivities(activities);
      return;
    }

    setFilteredActivities(
      activities.filter((activity) =>
        [activity.activity_type, activity.description, String(activity.id)]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(term)
      )
    );
  }, [searchTerm, activities]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <h2 className="h3 fw-bold mb-0">Activities</h2>
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
              placeholder="Filter activities"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-grid d-md-flex justify-content-md-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
              Clear
            </button>
            <button type="button" className="btn btn-primary" onClick={fetchActivities}>
              Refresh
            </button>
          </div>
        </form>

        {loading && <p className="mb-0">Loading activities...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Activity Type</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">No activities found.</td>
                  </tr>
                )}
                {filteredActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td>{activity.id}</td>
                    <td>{activity.activity_type || 'N/A'}</td>
                    <td>{activity.description || 'N/A'}</td>
                    <td>{activity.created_at ? new Date(activity.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setSelectedActivity(activity)}
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

        {selectedActivity && (
          <>
            <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Activity Details</h5>
                    <button type="button" className="btn-close" onClick={() => setSelectedActivity(null)}></button>
                  </div>
                  <div className="modal-body">
                    <pre className="bg-light p-3 rounded mb-0">{JSON.stringify(selectedActivity, null, 2)}</pre>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedActivity(null)}>
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

export default Activities;
