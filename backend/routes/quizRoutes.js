const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 1. Get all quizzes
router.get("/", (req, res) => {
  try {
    const quizzes = db
      .prepare("SELECT * FROM quizzes ORDER BY created_at DESC")
      .all();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// 2. Get questions for a specific quiz
router.get("/:id/questions", (req, res) => {
  try {
    const questions = db
      .prepare(
        "SELECT id, quiz_id, question_text, options FROM questions WHERE quiz_id = ?",
      )
      .all(req.params.id);

    const formattedQuestions = questions.map((q) => ({
      ...q,
      options: JSON.parse(q.options),
    }));

    res.json(formattedQuestions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// 3. Submit quiz answers & compute score
router.post("/:id/submit", (req, res) => {
  const { userId, answers } = req.body;
  const quizId = req.params.id;

  try {
    const questions = db
      .prepare("SELECT id, correct_option FROM questions WHERE quiz_id = ?")
      .all(quizId);

    let score = 0;
    questions.forEach((q) => {
      if (
        answers &&
        answers[q.id] !== undefined &&
        answers[q.id] === q.correct_option
      ) {
        score += 1;
      }
    });

    if (userId) {
      db.prepare(
        "INSERT INTO results (user_id, quiz_id, score, total_questions) VALUES (?, ?, ?, ?)",
      ).run(userId, quizId, score, questions.length);
    }

    res.json({
      score,
      totalQuestions: questions.length,
      percentage:
        questions.length > 0
          ? ((score / questions.length) * 100).toFixed(1)
          : 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit quiz" });
  }
});

module.exports = router;
