# 🧠 Task Manager API

A secure and scalable backend API for managing tasks, subtasks, and task dependencies — built using Node.js, Express, and MongoDB.

> Developed as part of my journey to become a confident backend developer. Now live and open for review.

---

## 🚀 Live Deployment

🔗 API: [Task Manager API on Render](https://task-manager-api-s30d.onrender.com)  
📂 GitHub: [github.com/Kenechukwu-val/task-manager-api](https://github.com/Kenechukwu-val/task-manager-api)

---

## ✨ Features

- ✅ User registration and login (JWT-based auth)
- 🔐 Protected CRUD operations (user-based access)
- 🗂️ Tasks include:
  - Title, description, status (`todo`, `in-progress`, `done`)
  - Priority (`low`, `medium`, `high`) and due dates
  - Subtasks (other task documents linked as dependencies)
- 🔄 **Circular dependency prevention middleware**
- ❌ Cannot mark a task as `done` unless all subtasks are complete
- 🗑️ **Recursive deletion** — when a task is deleted, all its subtasks are also deleted
- 📊 Task filtering by status and priority
- 💥 Clean and consistent error handling

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT)
- **Testing:** Postman
- **Deployment:** Render

---

## 📁 Project Structure

```
task-manager-api/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── config/
├── .env
└── server.js
```

---

## 📮 API Endpoints

> All protected routes require a valid Bearer Token in `Authorization` header.

### 🔐 Authentication

```http
POST   /api/users/register    # Register a new user
POST   /api/users/login       # Login user and return JWT
GET    /api/users/profile     # Get current user profile (protected)
```

### 📌 Tasks

```http
POST   /api/tasks             # Create a task
GET    /api/tasks             # Get all tasks for current user
GET    /api/tasks/:id         # Get a specific task
PUT    /api/tasks/:id         # Update a task (with guard logic)
DELETE /api/tasks/:id         # Delete a task + its subtasks
```

---

## 🧪 Sample Flow

1. **Create Task A** (parent task)
2. **Create Task B and Task C**, then assign them as subtasks of A
3. Try to mark Task A as `"done"` — ❌ Blocked if B or C is incomplete
4. Mark B and C as `"done"` → ✅ Now you can mark Task A as `"done"`
5. Delete Task A → 🗑️ Task B and Task C are also deleted

---

## 📦 Environment Setup

1. Create `.env` file in the root directory:

```env
PORT=3500
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

2. Install dependencies:

```bash
npm install
```

3. Run in development:

```bash
npm run dev
```

---

## 🧑‍💻 Developer Notes

- Subtasks are stored as `ObjectId` references to other tasks
- Circular subtasks are **blocked** via middleware
- Middleware prevents marking a task as `"done"` if subtasks aren't
- Recursive deletion logic ensures subtasks don't become orphans
- Clean controller separation, with asyncHandler to manage errors

---

## 🌍 Deployment

- App is live on Render
- Uses persistent MongoDB Atlas database
- Auto-sleeps after inactivity to conserve resources (Render free plan)

---

## 📢 Connect with Me

- 🔗 [LinkedIn – Kenechukwu Nwafor](https://www.linkedin.com/in/kenechukwu-nwafor-361533163)
- 🐙 [GitHub – Kenechukwu-val](https://github.com/Kenechukwu-val)

---

## 📌 License

MIT — Free to use, modify, and distribute.

---

> 💬 Feedback is welcome! Open an issue or reach out on LinkedIn.
