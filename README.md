# Task Manager with Role-Based Access Control (RBAC)

A full-stack Task Management System built with **Node.js**, **Express**, **SQLite**, and a **React** frontend.  
The app supports user registration, login, role-based task access, and CRUD operations on tasks.

---

## Features

- User registration and login with JWT authentication and bcrypt password hashing
- Normal users can create, view, update, and delete only their own tasks
- Admin users can view all tasks and delete any task
- REST API backend with Express.js and SQLite
- React frontend with protected routes and role-based access control (RBAC)
- Input validation using Joi
- Optional Tailwind CSS for styling

---

## Project Structure

```
task-manager-rbac/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── README.md
└── .gitignore
```

---

## Setup Instructions

### Prerequisites

- Node.js v18 or above (v20 LTS recommended)  
- npm (comes with Node.js)  
- SQLite command-line tools or a GUI for database inspection

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with:

```
PORT=5000
JWT_SECRET=your_very_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

### Frontend Setup

Open a new terminal window and run:

```bash
cd frontend
npm install
npm run dev
```

### Tailwind CSS Setup (Optional)

Inside `frontend`:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js` content paths and import Tailwind directives in your CSS file as needed.

---

## Usage

- Register users and log in to receive JWT tokens.  
- Normal users can manage their own tasks.  
- To make a user an admin, update the role in the database (via SQLite CLI or GUI):

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@gmail.com';
```

Then log out and log in again for role changes to take effect.

---

## API Endpoints

| Method | Endpoint           | Access | Description                                 |
|--------|--------------------|--------|---------------------------------------------|
| POST   | /api/auth/register | Public | Register user                               |
| POST   | /api/auth/login    | Public | User login                                  |
| GET    | /api/auth/me       | Auth   | Get current user info                       |
| GET    | /api/tasks         | Auth   | Admin: all tasks, User: own tasks           |
| GET    | /api/tasks/:id     | Auth   | Get single task                             |
| POST   | /api/tasks         | Auth   | Create new task                             |
| PUT    | /api/tasks/:id     | Auth   | Update task                                 |
| DELETE | /api/tasks/:id     | Auth   | Delete task                                 |

---

## Security

- Passwords hashed with bcryptjs  
- JWT tokens for stateless authentication  
- Role-based access enforced on both backend and frontend  
- Input validation with Joi  
- Parameterized SQL queries to prevent SQL injection

---

## Technologies Used

- Node.js, Express.js, SQLite3  
- React (with Vite), React Router, Axios  
- bcryptjs, jsonwebtoken, cors, dotenv, joi  
- Tailwind CSS (optional)
