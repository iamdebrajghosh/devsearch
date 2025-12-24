# DevSearch 🚀

**DevSearch** is a full‑stack, AI‑assisted job discovery and career guidance platform designed for **software engineering freshers**.

It simulates how modern **ATS systems**, **job portals**, and **career advisors** work — combining **rule‑based matching** with **AI‑powered guidance**.

> ⚠️ This project is intentionally designed to show **engineering thinking**, not just CRUD skills.

---

## ✨ Key Features

### 🔐 Authentication & Security

* User registration & login
* Password hashing with bcrypt
* JWT authentication (access + refresh tokens)
* Protected routes

### 📄 Resume Processing

* Resume upload (PDF & DOCX)
* File validation (type + size)
* Secure file storage
* Resume text extraction

### 🧠 Skill Intelligence

* Rule‑based skill dictionary
* Resume skill extraction
* Duplicate & false‑positive handling

### 💼 Job Matching Engine

* Mock job dataset (realistic roles)
* Skill‑based scoring system
* Required vs optional skill weighting
* Match percentage normalization
* Ranked job results

### 🤖 AI Career Guidance

* AI‑generated role recommendations
* Missing skill identification
* Personalized 30‑day learning roadmap
* AI used **only where logic ends** (not for matching)

### ⚛️ Frontend Application

* React‑based UI
* Login & Register pages
* Resume upload UI
* Job match visualization
* AI recommendations display
* Protected routing

---

## 🏗️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT (jsonwebtoken)
* Multer (file uploads)
* pdf‑parse, mammoth (resume parsing)

### Frontend

* React
* React Router
* Axios

### AI

* OpenAI / GPT API (career guidance only)

---

## 📂 Project Structure

```
devsearch/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── uploads/
│   ├── .env.example
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/<your-username>/devsearch.git
cd devsearch
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Start backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```
http://localhost:3000
```

Backend runs at:

```
http://localhost:5000
```

---

## 🧪 Core APIs Overview

| Feature            | Endpoint                  |
| ------------------ | ------------------------- |
| Auth Register      | POST `/api/auth/register` |
| Auth Login         | POST `/api/auth/login`    |
| Resume Upload      | POST `/api/resume/upload` |
| Extracted Skills   | GET `/api/resume/skills`  |
| Job Matching       | GET `/api/jobs/match`     |
| AI Recommendations | POST `/api/ai/recommend`  |

---

## 🎯 Design Philosophy

* **Rule‑based logic first** (predictable, explainable)
* **AI only for guidance**, not decisions
* Backend‑heavy architecture (ATS‑style)
* Minimal UI, maximum clarity

This mirrors real production systems.

---

## 📈 Future Improvements

* Replace mock jobs with real job APIs
* Advanced NLP for skill extraction
* Role‑based dashboards
* Resume scoring visualization
* Cloud storage for resumes

---

## 👨‍💻 Author

**Akash Ghosh**
MCA Graduate (2024) | Software Engineering Fresher
Focused on backend systems, full‑stack development & applied AI

---

## ⭐ Final Note

This project is built as a **learning‑by‑building journey**, not a tutorial copy.

If you are a recruiter or interviewer — feel free to explore commits day‑by‑day.

🚀 *DevSearch shows how I think as an engineer.*
