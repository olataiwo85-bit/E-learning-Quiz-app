const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get all quizzes
app.get("/api/quizzes", (req, res) => {
  db.all(`SELECT * FROM quizzes`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get questions for a specific quiz
app.get("/api/quizzes/:id/questions", (req, res) => {
  const quizId = req.params.id;
  db.all(`SELECT * FROM questions WHERE quiz_id = ?`, [quizId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Parse the stringified options back into an array before sending to frontend
    const formattedRows = rows.map((row) => ({
      ...row,
      options: JSON.parse(row.options),
    }));

    res.json(formattedRows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
