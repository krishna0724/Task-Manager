const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'tasks.json');

function readTasks() {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data || '[]');
  } catch (e) {
    return [];
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(file, JSON.stringify(tasks, null, 2));
}

module.exports = { readTasks, writeTasks };
