const db = require("./config/db");

const seedData = () => {
  db.exec("DELETE FROM questions; DELETE FROM quizzes;");

  const quiz1 = db
    .prepare(
      "INSERT INTO quizzes (title, subject, description) VALUES (?, ?, ?)",
    )
    .run(
      "WAEC Chemistry Practice Test",
      "Chemistry",
      "Test your knowledge on organic and inorganic chemical reactions.",
    );

  const quiz1Id = quiz1.lastInsertRowid;

  const insertQuestion = db.prepare(
    "INSERT INTO questions (quiz_id, question_text, options, correct_option) VALUES (?, ?, ?, ?)",
  );

  insertQuestion.run(
    quiz1Id,
    "What is the IUPAC name for CH3COOH?",
    JSON.stringify([
      "Methanoic acid",
      "Ethanoic acid",
      "Propanoic acid",
      "Butanoic acid",
    ]),
    1,
  );

  insertQuestion.run(
    quiz1Id,
    "Which gas turns lime water milky?",
    JSON.stringify(["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"]),
    2,
  );

  const quiz2 = db
    .prepare(
      "INSERT INTO quizzes (title, subject, description) VALUES (?, ?, ?)",
    )
    .run(
      "JAMB Mathematics Quiz",
      "Mathematics",
      "Practice basic algebra and quadratic equations.",
    );

  const quiz2Id = quiz2.lastInsertRowid;

  insertQuestion.run(
    quiz2Id,
    "Solve for x: 2x + 5 = 15",
    JSON.stringify(["x = 3", "x = 5", "x = 10", "x = 7"]),
    1,
  );

  console.log("Sample quizzes and questions seeded successfully!");
};

seedData();
