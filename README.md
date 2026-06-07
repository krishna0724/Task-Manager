# Studio Graphene Task Manager

A simple full-stack task manager built with React on the frontend and Node.js + Express on the backend. This project demonstrates a clean separation between `/client` and `/server`, REST API usage, JSON file storage, and basic CRUD operations.

## Live Demo
- No live deployment available yet.

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Storage: JSON file (`server/tasks.json`)
- Styling: Plain CSS
- UUID generation: `uuid`

## How to Run Locally
1. Clone the repository.
2. Open two terminals.

### Start the server
```bash
cd server
npm install
npm start
```
The backend will run on `http://localhost:4000`.

### Start the frontend
```bash
cd client
npm install
npm run dev
```
The frontend will run on the Vite URL shown in the terminal (usually `http://localhost:5173`).

## API Documentation
### Get all tasks
- Method: `GET`
- Path: `/api/tasks`
- Response: `200 OK`
- Body: `[{ id, title, description, dueDate, completed, createdAt }, ...]`

### Create a new task
- Method: `POST`
- Path: `/api/tasks`
- Body:
  ```json
  {
    "title": "Task title",
    "description": "Task description",
    "dueDate": "2026-06-07"
  }
  ```
- Response: `201 Created`
- Body: created task object

### Update a task
- Method: `PUT`
- Path: `/api/tasks/:id`
- Body:
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "dueDate": "2026-06-08",
    "completed": true
  }
  ```
- Response: `200 OK`
- Body: updated task object

### Delete a task
- Method: `DELETE`
- Path: `/api/tasks/:id`
- Response: `200 OK`
- Body: deleted task object

## Project Structure
```
/client
  index.html
  package.json
  src/
    App.jsx
    main.jsx
    styles.css
/server
  index.js
  package.json
  routes/
    tasks.js
  utils/
    storage.js
  tasks.json
README.md
```

## What Works
- Add tasks with title, description, and due date
- Edit tasks inline
- Toggle completion
- Delete tasks with confirmation
- Search by title
- Filter tasks by All / Active / Completed
- Overdue styling for past due dates

## Notes / Next Steps
- I have not deployed the app yet.
- Next step would be a live deployment with frontend on Vercel / Netlify and backend on Railway / Render.
- I would also improve validation and add a small test suite for backend routes.
- If I had more time, I would add user authentication and persistent database storage.
