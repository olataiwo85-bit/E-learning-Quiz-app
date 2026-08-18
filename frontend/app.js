const API_URL = "http://localhost:5000/api/quizzes";

// DOM Elements
const quizGrid = document.getElementById("quiz-grid");
const quizListSection = document.getElementById("quiz-list-section");
const quizView = document.getElementById("quiz-view");
const activeQuizTitle = document.getElementById("active-quiz-title");
const questionsContainer = document.getElementById("questions-container");
const submitBtn = document.getElementById("submit-btn");
const backBtn = document.getElementById("back-btn");
const resultView = document.getElementById("result-view");
const scoreDisplay = document.getElementById("score-display");
const homeBtn = document.getElementById("home-btn");
const timerDisplay = document.getElementById("timer-display");

// State Variables
let currentQuizId = null;
let userAnswers = {};
let currentQuestions = [];
let timerInterval = null;
const TIME_PER_QUIZ = 120; // 2 minutes

// Load Quizzes on startup
async function fetchQuizzes() {
  try {
    const res = await fetch(API_URL);
    const quizzes = await res.json();

    quizGrid.innerHTML = "";
    quizzes.forEach((quiz) => {
      const card = document.createElement("div");
      card.className = "quiz-card";
      card.innerHTML = `<h3>${quiz.title}</h3><button onclick="startQuiz(${quiz.id}, '${quiz.title}')">Start Quiz</button>`;
      quizGrid.appendChild(card);
    });
  } catch (error) {
    quizGrid.innerHTML =
      '<p style="color:red;">Failed to load quizzes. Ensure backend server is running on port 5000.</p>';
  }
}

// Start Quiz & Timer
async function startQuiz(quizId, title) {
  currentQuizId = quizId;
  userAnswers = {};
  activeQuizTitle.innerText = title;

  try {
    const res = await fetch(`${API_URL}/${quizId}/questions`);
    currentQuestions = await res.json();

    questionsContainer.innerHTML = "";
    currentQuestions.forEach((q, index) => {
      const qBlock = document.createElement("div");
      qBlock.className = "question-block";
      qBlock.innerHTML = `
                <h4>${index + 1}. ${q.question_text}</h4>
                <div class="options-group" id="q-${q.id}">
                    ${q.options
                      .map(
                        (opt, optIndex) => `
                        <button class="option-btn" onclick="selectOption(${q.id}, ${optIndex}, this)">${opt}</button>
                    `,
                      )
                      .join("")}
                </div>
            `;
      questionsContainer.appendChild(qBlock);
    });

    quizListSection.classList.add("hidden");
    resultView.classList.add("hidden");
    quizView.classList.remove("hidden");
    submitBtn.classList.remove("hidden");

    startCountdown();
  } catch (error) {
    alert("Failed to load questions.");
  }
}

// Timer Logic
function startCountdown() {
  let timeLeft = TIME_PER_QUIZ;
  timerDisplay.classList.remove("warning");
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    timerDisplay.innerText = `⏱️ ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (timeLeft <= 30) {
      timerDisplay.classList.add("warning");
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Time is up! Submitting your quiz automatically.");
      submitQuiz();
    }
    timeLeft--;
  }, 1000);
}

// Handle Option Selection
window.selectOption = function (questionId, optionIndex, btnElement) {
  userAnswers[questionId] = optionIndex;

  // Highlight selected option
  const siblings = btnElement.parentElement.children;
  for (let btn of siblings) {
    btn.style.backgroundColor = "";
    btn.style.color = "";
  }
  btnElement.style.backgroundColor = "#1e40af";
  btnElement.style.color = "white";
};

// Grade the Quiz
function submitQuiz() {
  clearInterval(timerInterval); // Stop the clock

  let score = 0;
  currentQuestions.forEach((q) => {
    if (userAnswers[q.id] === q.correct_answer) {
      score++;
    }
  });

  const percentage = Math.round((score / currentQuestions.length) * 100);
  scoreDisplay.innerText = `${percentage}%`;
  document.getElementById("feedback-message").innerText =
    `You scored ${score} out of ${currentQuestions.length}.`;

  quizView.classList.add("hidden");
  resultView.classList.remove("hidden");
}

// Event Listeners
submitBtn.addEventListener("click", submitQuiz);

backBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  quizView.classList.add("hidden");
  quizListSection.classList.remove("hidden");
});

homeBtn.addEventListener("click", () => {
  resultView.classList.add("hidden");
  quizListSection.classList.remove("hidden");
});

// Init
fetchQuizzes();
