import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: '', project: '', assignedTo: '', dueDate: '' });

  const fetchAll = async () => {
    const [t, p] = await Promise.all([API.get('/tasks'), API.get('/projects')]);
    setTasks(t.data);
    setProjects(p.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await API.post('/tasks', form);
    setForm({ title: '', project: '', assignedTo: '', dueDate: '' });
    fetchAll();
  };

  const handleStatusChange = async (id, status) => {
    await API.put(`/tasks/${id}`, { status });
    fetchAll();
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Tasks</h2>

      
      {user?.role === 'admin' && (
        <form onSubmit={handleCreate} style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input placeholder="Task title" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            style={{ padding: 8 }} />
          <select value={form.project} onChange={e => setForm({ ...form, project: e.target.value })}
            style={{ padding: 8 }}>
            <option value="">Select project</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <input type="date" value={form.dueDate}
            onChange={e => setForm({ ...form, dueDate: e.target.value })}
            style={{ padding: 8 }} />
          <button type="submit">+ Add Task</button>
        </form>
      )}

      {tasks.map(task => {
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
        return (
          <div key={task._id} style={{
            border: `1px solid ${isOverdue ? '#f5c6cb' : '#ddd'}`,
            background: isOverdue ? '#fff5f5' : 'white',
            padding: 16, borderRadius: 8, marginBottom: 12
          }}>
            <strong>{task.title}</strong>
            {isOverdue && <span style={{ color: 'red', marginLeft: 8 }}>⚠️ Overdue</span>}
            <p style={{ color: '#666', margin: '4px 0', fontSize: 13 }}>
              Project: {task.project?.name} | Assigned to: {task.assignedTo?.name || 'Unassigned'}
            </p>
            <select value={task.status} onChange={e => handleStatusChange(task._id, e.target.value)}
              style={{ padding: 4 }}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        );
      })}
    </div>
  );
}