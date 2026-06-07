import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:4000/api/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editError, setEditError] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const sortedTasks = data.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  }

  async function addTask(event) {
    event.preventDefault();
    
    if (!title.trim()) {
      setErrorMsg('Task title is required.');
      return;
    }
    
    if (!dueDate) {
      setErrorMsg('Due date is required.');
      return;
    }
    
    setErrorMsg('');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description, dueDate })
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setDueDate('');
        loadTasks();
      }
    } catch (error) {
      setErrorMsg('Could not add task.');
      console.error('Error adding task:', error);
    }
  }

  async function toggleTaskDone(task) {
    try {
      await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async function deleteTask(id) {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  function startEdit(task) {
    setEditingTaskId(task.id);
    setEditTitle(task.title || '');
    setEditDescription(task.description || '');
    setEditDueDate(task.dueDate || '');
    setEditError('');
  }

  function cancelEdit() {
    setEditingTaskId(null);
    setEditError('');
  }

  async function saveEdit(event) {
    event.preventDefault();
    if (!editTitle.trim()) {
      setEditError('Title is required.');
      return;
    }

    try {
      await fetch(`${API_URL}/${editingTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle.trim(), description: editDescription, dueDate: editDueDate })
      });
      setEditingTaskId(null);
      loadTasks();
    } catch (error) {
      setEditError('Could not save the task.');
      console.error('Error saving task:', error);
    }
  }

  function isOverdue(due, completed) {
    if (!due || completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDay = new Date(due);
    dueDay.setHours(0, 0, 0, 0);
    return dueDay < today;
  }

  const filteredTasks = tasks.filter((task) => {
    const matchSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'Active') return matchSearch && !task.completed;
    if (filter === 'Completed') return matchSearch && task.completed;
    return matchSearch;
  });

  const activeCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <h1>Task Manager</h1>
          <p>Simple task list with save, edit, and filter.</p>
        </div>

        <form onSubmit={addTask} className="task-form">
          {errorMsg && (
            <div className="error-text">⚠️ {errorMsg}</div>
          )}
          
          <div className="field">
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>

          <div className="field">
            <label>Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
            />
          </div>

          <div className="field">
            <label>Due date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <button type="submit" className="button primary">
            Add Task
          </button>
        </form>

        <div className="toolbar">
          <input
            className="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks"
          />

          <div className="toolbar-row">
            <div className="filters">
              {['All', 'Active', 'Completed'].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`button small ${filter === type ? 'active' : ''}`}
                  onClick={() => setFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="stats">
              <span>Active: {activeCount}</span>
              <span>Completed: {completedCount}</span>
            </div>
          </div>
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              {tasks.length === 0 ? 'No tasks yet. Add one above.' : 'No matching tasks.'}
            </div>
          ) : (
            filteredTasks.map((task) => {
              const overdue = isOverdue(task.dueDate, task.completed);
              return (
                <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}>
                  <div className="task-left-section">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskDone(task)}
                    />

                    <div className="task-text-content">
                      {editingTaskId === task.id ? (
                        <form onSubmit={saveEdit} className="edit-form">
                          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                          <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                          <input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
                          {editError && <div className="error-text">{editError}</div>}
                        </form>
                      ) : (
                        <>
                          <div className="task-title">{task.title}</div>
                          {task.description && <div className="task-description">{task.description}</div>}
                          {task.dueDate && (
                            <div className={`task-due ${overdue ? 'overdue-text' : ''}`}>
                              Due: {task.dueDate} {overdue ? '(Overdue)' : ''}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="task-actions">
                    {editingTaskId === task.id ? (
                      <>
                        <button type="button" className="button small" onClick={cancelEdit}>
                          Cancel
                        </button>
                        <button type="button" className="button primary small" onClick={saveEdit}>
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" className="button small" onClick={() => startEdit(task)}>
                          Edit
                        </button>
                        <button type="button" className="button danger small" onClick={() => deleteTask(task.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
