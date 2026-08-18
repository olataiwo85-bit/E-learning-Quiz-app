const db = require("./config/db");

db.serialize(() => {
  // Create Tables
  db.run(
    `CREATE TABLE IF NOT EXISTS quizzes (id INTEGER PRIMARY KEY, title TEXT)`,
  );
  db.run(`CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY, 
        quiz_id INTEGER, 
        question_text TEXT, 
        options TEXT, 
        correct_answer INTEGER,
        FOREIGN KEY(quiz_id) REFERENCES quizzes(id)
    )`);

  // Clear existing data to prevent duplicates
  db.run(`DELETE FROM questions`);
  db.run(`DELETE FROM quizzes`);

  // Insert Quiz Subject
  db.run(`INSERT INTO quizzes (id, title) VALUES (1, 'WAEC Chemistry')`);

  // Insert 5 Dynamic Questions
  const questions = [
    [
      1,
      "What is the atomic number of Carbon?",
      JSON.stringify(["12", "6", "14", "8"]),
      1,
    ],
    [
      1,
      "Which of the following is a noble gas?",
      JSON.stringify(["Oxygen", "Nitrogen", "Neon", "Hydrogen"]),
      2,
    ],
    [
      1,
      "What is the chemical formula for water?",
      JSON.stringify(["CO2", "H2O", "NaCl", "O2"]),
      1,
    ],
    [
      1,
      "Which element is most abundant in the Earth's atmosphere?",
      JSON.stringify(["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"]),
      2,
    ],
    [
      1,
      "What type of bond involves the sharing of electron pairs?",
      JSON.stringify(["Ionic", "Covalent", "Metallic", "Hydrogen"]),
      1,
    ],
  ];

  const stmt = db.prepare(
    `INSERT INTO questions (quiz_id, question_text, options, correct_answer) VALUES (?, ?, ?, ?)`,
  );
  questions.forEach((q) => {
    stmt.run(q, (err) => {
      if (err) console.error(err.message);
    });
  });
  stmt.finalize();

  console.log("Database seeded successfully with 5 questions!");
});
