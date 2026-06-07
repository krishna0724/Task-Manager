const express = require('express');
const { readTasks, writeTasks } = require('../utils/storage');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.get('/', (req, res) => {
  const tasks = readTasks();
  tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(tasks);
});

router.post('/', (req, res) => {
  const { title, description, dueDate } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const tasks = readTasks();
  const newTask = {
    id: uuidv4(),
    title,
    description: description || '',
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, completed } = req.body;
  const tasks = readTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  tasks[idx] = {
    ...tasks[idx],
    title: title !== undefined ? title : tasks[idx].title,
    description: description !== undefined ? description : tasks[idx].description,
    dueDate: dueDate !== undefined ? dueDate : tasks[idx].dueDate,
    completed: completed !== undefined ? completed : tasks[idx].completed,
  };
  writeTasks(tasks);
  res.json(tasks[idx]);
});

router.patch('/:id/toggle', (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  tasks[idx].completed = !tasks[idx].completed;
  writeTasks(tasks);
  res.json(tasks[idx]);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  let tasks = readTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = tasks.splice(idx, 1)[0];
  writeTasks(tasks);
  res.json(removed);
});

module.exports = router;
