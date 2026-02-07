const { useState, useEffect } = React;

function App() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    instagramLink: '',
    fabrics: [],
    moneySpent: '',
    fabricUsed: '',
    timeSpent: '',
    comments: ''
  });
  const [fabricInput, setFabricInput] = useState('');

  // Load projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sewingProjects');
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  // Save projects to localStorage
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('sewingProjects', JSON.stringify(projects));
    }
  }, [projects]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingProject) {
      setProjects(projects.map(p =>
        p.id === editingProject.id
          ? { ...formData, id: p.id }
          : p
      ));
      setEditingProject(null);
    } else {
      const newProject = {
        ...formData,
        id: Date.now()
      };
      setProjects([newProject, ...projects]);
    }

    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      instagramLink: '',
      fabrics: [],
      moneySpent: '',
      fabricUsed: '',
      timeSpent: '',
      comments: ''
    });
    setFabricInput('');
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData(project);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const addFabric = () => {
    if (fabricInput.trim()) {
      setFormData({
        ...formData,
        fabrics: [...formData.fabrics, fabricInput.trim()]
      });
      setFabricInput('');
    }
  };

  const removeFabric = (index) => {
    setFormData({
      ...formData,
      fabrics: formData.fabrics.filter((_, i) => i !== index)
    });
  };

  const getTotalStats = () => {
    return {
      totalProjects: projects.length,
      totalSpent: projects.reduce((sum, p) => sum + (parseFloat(p.moneySpent) || 0), 0),
      totalFabric: projects.reduce((sum, p) => sum + (parseFloat(p.fabricUsed) || 0), 0),
      totalTime: projects.reduce((sum, p) => sum + (parseFloat(p.timeSpent) || 0), 0)
    };
  };

  const stats = getTotalStats();

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-top">
            <h1 className="logo">Jasmina's Atelier</h1>
            <button
              className="btn-new-project"
              onClick={() => {
                setShowForm(!showForm);
                setEditingProject(null);
                resetForm();
              }}
            >
              {showForm ? '✕ Close' : '+ New Project'}
            </button>
          </div>
          <p className="tagline">Your sewing project journal</p>

          <div className="stats-bar">
            <div className="stat">
              <span className="stat-value">{stats.totalProjects}</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat">
              <span className="stat-value">${stats.totalSpent.toFixed(2)}</span>
              <span className="stat-label">Total Spent</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.totalFabric.toFixed(1)}m</span>
              <span className="stat-label">Fabric Used</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.totalTime.toFixed(1)}h</span>
              <span className="stat-label">Hours</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        {showForm && (
          <div className="form-container">
            <form onSubmit={handleSubmit} className="project-form">
              <h2 className="form-title">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h2>

              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="e.g., Floral Summer Dress"
                />
              </div>

              <div className="form-group">
                <label>Instagram Link</label>
                <input
                  type="url"
                  value={formData.instagramLink}
                  onChange={(e) => setFormData({...formData, instagramLink: e.target.value})}
                  placeholder="https://instagram.com/p/..."
                />
              </div>

              <div className="form-group">
                <label>Fabrics Used</label>
                <div className="fabric-input-group">
                  <input
                    type="text"
                    value={fabricInput}
                    onChange={(e) => setFabricInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFabric())}
                    placeholder="e.g., Cotton floral print"
                  />
                  <button type="button" onClick={addFabric} className="btn-add">
                    Add
                  </button>
                </div>
                <div className="fabric-tags">
                  {formData.fabrics.map((fabric, index) => (
                    <span key={index} className="fabric-tag">
                      {fabric}
                      <button
                        type="button"
                        onClick={() => removeFabric(index)}
                        className="remove-tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Money Spent ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.moneySpent}
                    onChange={(e) => setFormData({...formData, moneySpent: e.target.value})}
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Fabric Used (meters)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.fabricUsed}
                    onChange={(e) => setFormData({...formData, fabricUsed: e.target.value})}
                    placeholder="0.0"
                  />
                </div>

                <div className="form-group">
                  <label>Time Spent (hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.timeSpent}
                    onChange={(e) => setFormData({...formData, timeSpent: e.target.value})}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Comments</label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  placeholder="Notes about the project, challenges, what you learned..."
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingProject ? 'Update Project' : 'Save Project'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProject(null);
                    resetForm();
                  }}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="projects-grid">
          {projects.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <h3>No projects yet</h3>
              <p>Start tracking your sewing projects by creating your first entry</p>
            </div>
          ) : (
            projects.map((project, index) => (
              <div
                key={project.id}
                className="project-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="project-header">
                  <h3 className="project-name">{project.name}</h3>
                  <div className="project-actions">
                    {project.instagramLink && (
                      <a
                        href={project.instagramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-icon"
                        title="View on Instagram"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                    <button
                      onClick={() => handleEdit(project)}
                      className="btn-icon"
                      title="Edit"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="btn-icon btn-delete"
                      title="Delete"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {project.fabrics.length > 0 && (
                  <div className="project-fabrics">
                    {project.fabrics.map((fabric, i) => (
                      <span key={i} className="fabric-badge">{fabric}</span>
                    ))}
                  </div>
                )}

                <div className="project-details">
                  {project.moneySpent && (
                    <div className="detail">
                      <span className="detail-icon">💰</span>
                      <span className="detail-label">Cost</span>
                      <span className="detail-value">${parseFloat(project.moneySpent).toFixed(2)}</span>
                    </div>
                  )}
                  {project.fabricUsed && (
                    <div className="detail">
                      <span className="detail-icon">📏</span>
                      <span className="detail-label">Fabric</span>
                      <span className="detail-value">{parseFloat(project.fabricUsed).toFixed(1)}m</span>
                    </div>
                  )}
                  {project.timeSpent && (
                    <div className="detail">
                      <span className="detail-icon">⏱️</span>
                      <span className="detail-label">Time</span>
                      <span className="detail-value">{parseFloat(project.timeSpent).toFixed(1)}h</span>
                    </div>
                  )}
                </div>

                {project.comments && (
                  <div className="project-comments">
                    <p>{project.comments}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
