import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get('/tasks').then(res => setTasks(res.data));
  }, []);

  const todo = tasks.filter(t => t.status === 'todo').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const done = tasks.filter(t => t.status === 'done').length;

  const today = new Date();
  const overdue = tasks.filter(t => 
    t.dueDate && new Date(t.dueDate) < today && t.status !== 'done'
  ).length;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome, {user?.name} ({user?.role})</h2>
        <div>
          <button onClick={() => navigate('/projects')} style={{ marginRight: 8 }}>Projects</button>
          <button onClick={() => navigate('/tasks')} style={{ marginRight: 8 }}>Tasks</button>
          <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
      </div>

      <h3>Task Summary</h3>
      <div style={{ display: 'flex', gap: 16 }}>
        {[
          { label: 'To Do', count: todo, color: '#eee' },
          { label: 'In Progress', count: inProgress, color: '#fff3cd' },
          { label: 'Done', count: done, color: '#d4edda' },
          { label: 'Overdue', count: overdue, color: '#f8d7da' },
        ].map(({ label, count, color }) => (
          <div key={label} style={{ background: color, padding: 20, borderRadius: 8, minWidth: 120, textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 'bold' }}>{count}</div>
            <div>{label}</div>
          </div>
        ))}
      </div>

      {overdue > 0 && (
        <div style={{ marginTop: 24, background: '#f8d7da', padding: 12, borderRadius: 8 }}>
          ⚠️ You have {overdue} overdue task(s)! <button onClick={() => navigate('/tasks')}>View Tasks</button>
        </div>
      )}
    </div>
  );
}