import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchProjects = () => API.get('/projects').then(r => setProjects(r.data));

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await API.post('/projects', form);
    setForm({ name: '', description: '' });
    fetchProjects();
  };

  const handleDelete = async (id) => {
    await API.delete(`/projects/${id}`);
    fetchProjects();
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Projects</h2>

      {user?.role === 'admin' && (
        <form onSubmit={handleCreate} style={{ marginBottom: 24 }}>
          <input placeholder="Project name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ marginRight: 8, padding: 8 }} />
          <input placeholder="Description" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ marginRight: 8, padding: 8 }} />
          <button type="submit">+ Create Project</button>
        </form>
      )}

      {projects.map(p => (
        <div key={p._id} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 12 }}>
          <strong>{p.name}</strong>
          <p style={{ color: '#666', margin: '4px 0' }}>{p.description}</p>
          <small>Created by: {p.createdBy?.name}</small>
          {user?.role === 'admin' && (
            <button onClick={() => handleDelete(p._id)} style={{ float: 'right', color: 'red' }}>
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}