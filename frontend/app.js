const API_URL = "http://localhost:5000/api/quizzes";

let currentQuizId = null;
let userAnswers = {};

const quizListSection = document.getElementById("quiz-list-section");
const quizGrid = document.getElementById("quiz-grid");
const quizView = document.getElementById("quiz-view");
const questionsContainer = document.getElementById("questions-container");
const activeQuizTitle = document.getElementById("active-quiz-title");
const submitBtn = document.getElementById("submit-btn");
const backBtn = document.getElementById("back-btn");
const resultView = document.getElementById("result-view");
const finalScore = document.getElementById("final-score");
const finalPercentage = document.getElementById("final-percentage");
const retryBtn = document.getElementById("retry-btn");

// Fetch available quizzes from backend
async function loadQuizzes() {
  try {
    const res = await fetch(API_URL);
    const quizzes = await res.json();

    quizGrid.innerHTML = "";
    quizzes.forEach((quiz) => {
      const card = document.createElement("div");
      card.className = "quiz-card";
      card.innerHTML = `
        <div class="subject">${quiz.subject}</div>
        <h3>${quiz.title}</h3>
        <p>${quiz.description || "No description provided."}</p>
        <button class="btn-primary" onclick="startQuiz(${quiz.id}, '${quiz.title}')">Start Quiz</button>
      `;
      quizGrid.appendChild(card);
    });
  } catch (error) {
    quizGrid.innerHTML =
      '<p style="color:red">Failed to load quizzes. Ensure backend server is running on port 5000.</p>';
  }
}

// Start taking a quiz
async function startQuiz(quizId, title) {
  currentQuizId = quizId;
  userAnswers = {};
  activeQuizTitle.innerText = title;

  try {
    const res = await fetch(`${API_URL}/${quizId}/questions`);
    const questions = await res.json();

    questionsContainer.innerHTML = "";
    questions.forEach((q, index) => {
      const qBlock = document.createElement("div");
      qBlock.className = "question-block";
      qBlock.innerHTML = `
        <h4>${index + 1}. ${q.question_text}</h4>
        ${q.options
          .map(
            (opt, optIndex) => `
          <button class="option-btn" onclick="selectOption(${q.id}, ${optIndex}, this)">
            ${opt}
          </button>
        `,
          )
          .join("")}
      `;
      questionsContainer.appendChild(qBlock);
    });

    quizListSection.classList.add("hidden");
    resultView.classList.add("hidden");
    quizView.classList.remove("hidden");
    submitBtn.classList.remove("hidden");
  } catch (error) {
    alert("Failed to load questions.");
  }
}

// Select an answer
function selectOption(questionId, optionIndex, btnElement) {
  userAnswers[questionId] = optionIndex;

  const parent = btnElement.parentElement;
  parent
    .querySelectorAll(".option-btn")
    .forEach((btn) => btn.classList.remove("selected"));

  btnElement.classList.add("selected");
}

// Submit answers to the server
submitBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(`${API_URL}/${currentQuizId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: userAnswers }),
    });

    const result = await res.json();

    finalScore.innerText = `${result.score} / ${result.totalQuestions}`;
    finalPercentage.innerText = `${result.percentage}% Score`;

    quizView.classList.add("hidden");
    resultView.classList.remove("hidden");
  } catch (error) {
    alert("Error submitting quiz.");
  }
});

backBtn.addEventListener("click", () => {
  quizView.classList.add("hidden");
  quizListSection.classList.remove("hidden");
});

retryBtn.addEventListener("click", () => {
  resultView.classList.add("hidden");
  quizListSection.classList.remove("hidden");
});

loadQuizzes();
