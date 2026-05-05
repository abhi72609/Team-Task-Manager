import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Projects() {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    deadline: "",
    status: "Not Started"
  });

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    await API.post("/projects", form);

    setForm({
      name: "",
      description: "",
      startDate: "",
      deadline: "",
      status: "Not Started"
    });

    fetchProjects();
  };

  const handleStatusChange = async (id, status) => {
    await API.put(`/projects/${id}`, { status });
    fetchProjects();
  };

  return (
    <div className="projects-container">
      <h2>Project Management</h2>

      {user?.role === "admin" && (
        <form onSubmit={handleCreate} className="project-form">
          <input
            placeholder="Project Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            type="date"
            value={form.startDate}
            onChange={(e) =>
              setForm({ ...form, startDate: e.target.value })
            }
          />

          <input
            type="date"
            value={form.deadline}
            onChange={(e) =>
              setForm({ ...form, deadline: e.target.value })
            }
          />

          <button type="submit">
            Create Project
          </button>
        </form>
      )}

      {projects.map((project) => {
        const isOverdue =
          new Date(project.deadline) < new Date() &&
          project.status !== "Completed";

        return (
          <div className="project-card" key={project._id}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>

            <p>
              <strong>Start:</strong> {project.startDate?.slice(0,10)}
            </p>

            <p>
              <strong>Deadline:</strong> {project.deadline?.slice(0,10)}
            </p>

            {isOverdue && (
              <p style={{ color: "red" }}>
                Overdue Project
              </p>
            )}

            <select
              value={project.status}
              onChange={(e) =>
                handleStatusChange(project._id, e.target.value)
              }
            >
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
        );
      })}
    </div>
  );
}






// import { useEffect, useState } from 'react';
// import API from '../api/axios';
// import { useAuth } from '../context/AuthContext';

// export default function Projects() {
//   const { user } = useAuth();
//   const [projects, setProjects] = useState([]);
//   const [form, setForm] = useState({ name: '', description: '' });

//   const fetchProjects = () => API.get('/projects').then(r => setProjects(r.data));

//   useEffect(() => { fetchProjects(); }, []);

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     await API.post('/projects', form);
//     setForm({ name: '', description: '' });
//     fetchProjects();
//   };

//   const handleDelete = async (id) => {
//     await API.delete(`/projects/${id}`);
//     fetchProjects();
//   };

//   return (
//     <div style={{ padding: 24 }}>
//       <h2>Projects</h2>

//       {user?.role === 'admin' && (
//         <form onSubmit={handleCreate} style={{ marginBottom: 24 }}>
//           <input placeholder="Project name" value={form.name}
//             onChange={e => setForm({ ...form, name: e.target.value })}
//             style={{ marginRight: 8, padding: 8 }} />
//           <input placeholder="Description" value={form.description}
//             onChange={e => setForm({ ...form, description: e.target.value })}
//             style={{ marginRight: 8, padding: 8 }} />
//           <button type="submit">+ Create Project</button>
//         </form>
//       )}

//       {projects.map(p => (
//         <div key={p._id} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 12 }}>
//           <strong>{p.name}</strong>
//           <p style={{ color: '#666', margin: '4px 0' }}>{p.description}</p>
//           <small>Created by: {p.createdBy?.name}</small>
//           {user?.role === 'admin' && (
//             <button onClick={() => handleDelete(p._id)} style={{ float: 'right', color: 'red' }}>
//               Delete
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }