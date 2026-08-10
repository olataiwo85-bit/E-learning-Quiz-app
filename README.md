# EduNaija - E-Learning Quiz Platform 🎓

EduNaija is a full-stack web application designed to bridge the educational resource gap by providing Nigerian secondary school and tertiary candidates with accessible, interactive practice tools for high-stakes examinations like **WAEC** and **JAMB**.

---

## 🌟 Features

- **Dynamic Quiz Selection:** Fetch and display available practice subjects directly from the server.
- **Interactive Testing Environment:** Real-time option selection with clear visual feedback.
- **Automated Scoring System:** Instant answer evaluation and score calculation processed securely on the backend.
- **Results Dashboard:** Comprehensive final score display with options to retry or switch subjects.
- **Clean & Responsive UI:** Optimized for both desktop and mobile viewing.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla ES6+)
- **Backend:** Node.js, Express.js
- **Database / Data Management:** Node-based REST API with JSON/MongoDB persistence
- **Development Tools:** VS Code, Live Server, Nodemon

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine:

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your system.

### 1. Clone the Repository

```bash
git clone [https://github.com/YOUR-USERNAME/e-learning-quiz-app.git](https://github.com/YOUR-USERNAME/e-learning-quiz-app.git)
cd e-learning-quiz-app
```

### 2. Set Up and Start the Backend

```bash
cd backend
npm install
npm start
# or: npx nodemon server.js
```

The server will run on `http://localhost:5000`.

### 3. Start the Frontend

1. Open the project folder in **VS Code**.
2. Navigate to `frontend/index.html`.
3. Right-click `index.html` and select **Open with Live Server** (or open the file directly in your browser).

---

## 📡 API Endpoints

| Method | Endpoint                     | Description                                       |
| :----- | :--------------------------- | :------------------------------------------------ |
| `GET`  | `/api/quizzes`               | Fetches all available quiz subjects               |
| `GET`  | `/api/quizzes/:id/questions` | Retrieves questions for a specific quiz           |
| `POST` | `/api/quizzes/:id/submit`    | Evaluates submitted answers and returns the score |

---

## 🎥 Project Demo

\_(Replace this line with the link to your 2-3 minute demo)
