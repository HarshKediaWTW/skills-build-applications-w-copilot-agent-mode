import React, { useState, useEffect, useCallback } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Workouts endpoint:', endpoint);

      const response = await fetch(endpoint);
      const data = await response.json();

      console.log('Workouts fetched data:', data);

      const workoutsList = data.results || data;
      const normalized = Array.isArray(workoutsList) ? workoutsList : [];
      setWorkouts(normalized);
      setFilteredWorkouts(normalized);
      setError(null);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(`Failed to fetch workouts: ${err.message}`);
      setWorkouts([]);
      setFilteredWorkouts([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredWorkouts(workouts);
      return;
    }

    setFilteredWorkouts(
      workouts.filter((workout) =>
        [
          workout.workout_type,
          workout.intensity,
          String(workout.duration_minutes || ''),
          String(workout.calories_burned || ''),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(term)
      )
    );
  }, [searchTerm, workouts]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <h2 className="h3 fw-bold mb-0">Workouts</h2>
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
              placeholder="Filter workouts"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-grid d-md-flex justify-content-md-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
              Clear
            </button>
            <button type="button" className="btn btn-primary" onClick={fetchWorkouts}>
              Refresh
            </button>
          </div>
        </form>

        {loading && <p className="mb-0">Loading workouts...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Workout Type</th>
                  <th>Duration (min)</th>
                  <th>Intensity</th>
                  <th>Calories Burned</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkouts.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">No workouts found.</td>
                  </tr>
                )}
                {filteredWorkouts.map((workout) => (
                  <tr key={workout.id}>
                    <td>{workout.id}</td>
                    <td>{workout.workout_type || 'N/A'}</td>
                    <td>{workout.duration_minutes || 'N/A'}</td>
                    <td>{workout.intensity || 'N/A'}</td>
                    <td>{workout.calories_burned || 0}</td>
                    <td>{workout.date ? new Date(workout.date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setSelectedWorkout(workout)}
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

        {selectedWorkout && (
          <>
            <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Workout Details</h5>
                    <button type="button" className="btn-close" onClick={() => setSelectedWorkout(null)}></button>
                  </div>
                  <div className="modal-body">
                    <pre className="bg-light p-3 rounded mb-0">{JSON.stringify(selectedWorkout, null, 2)}</pre>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedWorkout(null)}>
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

export default Workouts;
