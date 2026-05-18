import "./styles.css";

const EXAM_SIZE = 60;
const EXAM_BLUEPRINT = [
  {
    key: "concepts",
    label: "Identify AI concepts and responsibilities",
    count: 26,
    range: "40-45%",
  },
  {
    key: "foundry",
    label: "Implement AI solutions by using Microsoft Foundry",
    count: 34,
    range: "55-60%",
  },
];

const DEFAULT_LIMITS = {
  unit: 10,
  module: 40,
  learningPath: 60,
  weighted: 60,
};

const HISTORY_KEY = "ai901.examHistory.v1";
const PROGRESS_KEY = "ai901.unitProgress.v1";
const DRAFT_KEY = "ai901.activeExam.v1";
const STORAGE_TEST_KEY = "ai901.storageTest";
const HISTORY_LIMIT = 200;

const app = document.querySelector("#app");

let dataset = null;
let questionById = new Map();
let mode = "setup";
let currentScope = { type: "weighted", id: "weighted", title: "Official weighted mock exam" };
let exam = [];
let selectedAnswers = {};
let submitted = false;
let examHistory = [];
let unitProgress = {};
let savedDraft = null;
let activeAttemptId = null;

function practiceQuestions() {
  return dataset.questions.filter((question) => question.isCountedUnit);
}

function getBrowserStorage() {
  try {
    window.localStorage.setItem(STORAGE_TEST_KEY, "1");
    window.localStorage.removeItem(STORAGE_TEST_KEY);
    return window.localStorage;
  } catch {
    return null;
  }
}

function readStorage(key, fallback) {
  const storage = getBrowserStorage();
  if (!storage) return fallback;

  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  const storage = getBrowserStorage();
  if (!storage) return false;

  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function removeStorage(key) {
  const storage = getBrowserStorage();
  if (!storage) return;
  storage.removeItem(key);
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function unitProgressKey(moduleNumber, unitNumber) {
  return `m${moduleNumber}-u${unitNumber}`;
}

function getUnitCompletion(moduleNumber, unitNumber) {
  return unitProgress[unitProgressKey(moduleNumber, unitNumber)];
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getLearningPaths() {
  return dataset.summary.learningPaths.map((learningPath) => ({
    ...learningPath,
    questionCount: practiceQuestions().filter((question) => question.learningPathNumber === learningPath.number).length,
  }));
}

function getModules() {
  return uniqueBy(practiceQuestions(), (question) => question.moduleNumber)
    .sort((a, b) => a.moduleNumber - b.moduleNumber)
    .map((question) => ({
      number: question.moduleNumber,
      name: question.moduleName,
      learningPathNumber: question.learningPathNumber,
      questionCount: practiceQuestions().filter((item) => item.moduleNumber === question.moduleNumber).length,
    }));
}

function getUnits() {
  return uniqueBy(practiceQuestions(), (question) => `${question.moduleNumber}-${question.unitNumber}`)
    .sort((a, b) => a.moduleNumber - b.moduleNumber || a.unitNumber - b.unitNumber)
    .map((question) => ({
      id: `m${question.moduleNumber}-u${question.unitNumber}`,
      moduleNumber: question.moduleNumber,
      moduleName: question.moduleName,
      unitNumber: question.unitNumber,
      unitName: question.unitName,
      learningPathNumber: question.learningPathNumber,
      questionCount: practiceQuestions().filter(
        (item) => item.moduleNumber === question.moduleNumber && item.unitNumber === question.unitNumber,
      ).length,
    }));
}

function getPoolForScope(scope) {
  if (scope.type === "weighted") {
    return practiceQuestions();
  }

  if (scope.type === "learningPath") {
    return practiceQuestions().filter((question) => question.learningPathNumber === scope.learningPathNumber);
  }

  if (scope.type === "module") {
    return practiceQuestions().filter((question) => question.moduleNumber === scope.moduleNumber);
  }

  if (scope.type === "unit") {
    return practiceQuestions().filter(
      (question) => question.moduleNumber === scope.moduleNumber && question.unitNumber === scope.unitNumber,
    );
  }

  return [];
}

function prepareQuestions(questions) {
  return questions.map((question, index) => ({
    ...question,
    examNumber: index + 1,
    options: shuffle(question.options).map((option, optionIndex) => ({
      ...option,
      displayLabel: String.fromCharCode(65 + optionIndex),
    })),
  }));
}

function createWeightedExam() {
  const selected = [];
  const used = new Set();

  for (const domain of EXAM_BLUEPRINT) {
    const pool = practiceQuestions().filter((question) => question.examDomain === domain.key);
    for (const question of shuffle(pool).slice(0, domain.count)) {
      selected.push(question);
      used.add(question.id);
    }
  }

  if (selected.length < EXAM_SIZE) {
    const remaining = practiceQuestions().filter((question) => !used.has(question.id));
    selected.push(...shuffle(remaining).slice(0, EXAM_SIZE - selected.length));
  }

  return shuffle(selected).slice(0, EXAM_SIZE);
}

function startExam(scope = currentScope, requestedLimit) {
  currentScope = scope;
  const pool = scope.type === "weighted" ? createWeightedExam() : shuffle(getPoolForScope(scope));
  const fallbackLimit = DEFAULT_LIMITS[scope.type] ?? 20;
  const limit = Math.min(Number(requestedLimit || fallbackLimit), pool.length);
  exam = prepareQuestions(pool.slice(0, limit));
  selectedAnswers = {};
  submitted = false;
  activeAttemptId = null;
  mode = "exam";
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getScore() {
  return exam.reduce((score, question) => {
    return score + (isQuestionCorrect(question) ? 1 : 0);
  }, 0);
}

function getAnsweredCount() {
  return exam.filter((question) => isQuestionAnswered(question)).length;
}

function getSelectedAnswerCount(answers) {
  return Object.values(answers ?? {}).filter((answer) => (Array.isArray(answer) ? answer.length > 0 : Boolean(answer)))
    .length;
}

function answerList(question) {
  return question.answers ?? [question.answer];
}

function selectedList(question) {
  const selected = selectedAnswers[question.id];
  if (Array.isArray(selected)) return selected;
  return selected ? [selected] : [];
}

function sameAnswerSet(left, right) {
  return left.length === right.length && left.every((item) => right.includes(item));
}

function isQuestionAnswered(question) {
  return selectedList(question).length > 0;
}

function isQuestionCorrect(question) {
  return sameAnswerSet(selectedList(question), answerList(question));
}

function storageQuestionSnapshot(question) {
  return {
    id: question.id,
    examNumber: question.examNumber,
    optionOrder: question.options.map((option) => option.label),
    selectedAnswer: selectedAnswers[question.id],
    isCorrect: isQuestionCorrect(question),
  };
}

function hydrateStoredQuestion(storedQuestion) {
  if (storedQuestion.question && Array.isArray(storedQuestion.options)) {
    return {
      ...storedQuestion,
      options: storedQuestion.options.map((option, index) => ({
        ...option,
        displayLabel: option.displayLabel ?? String.fromCharCode(65 + index),
      })),
    };
  }

  const source = questionById.get(storedQuestion.id);
  if (!source) return null;

  const requestedOrder = Array.isArray(storedQuestion.optionOrder)
    ? storedQuestion.optionOrder
    : source.options.map((option) => option.label);
  const orderedLabels = [
    ...requestedOrder,
    ...source.options.map((option) => option.label).filter((label) => !requestedOrder.includes(label)),
  ];
  const options = orderedLabels
    .map((label, index) => {
      const option = source.options.find((item) => item.label === label);
      return option
        ? {
            ...option,
            displayLabel: String.fromCharCode(65 + index),
          }
        : null;
    })
    .filter(Boolean);

  return {
    ...source,
    examNumber: storedQuestion.examNumber,
    options,
    selectedAnswer: storedQuestion.selectedAnswer,
    isCorrect: storedQuestion.isCorrect,
  };
}

function compactExamQuestions() {
  return exam.map(storageQuestionSnapshot);
}

function compactStoredAttempt(attempt) {
  if (!Array.isArray(attempt.questions)) return attempt;

  return {
    ...attempt,
    questions: attempt.questions
      .map((question) => ({
        id: question.id,
        examNumber: question.examNumber,
        optionOrder: question.optionOrder ?? question.options?.map((option) => option.label) ?? [],
        selectedAnswer: question.selectedAnswer,
        isCorrect: question.isCorrect,
      }))
      .filter((question) => question.id),
  };
}

function persistExamHistory() {
  let nextHistory = examHistory.slice(0, HISTORY_LIMIT);
  while (nextHistory.length > 0 && !writeStorage(HISTORY_KEY, nextHistory)) {
    nextHistory = nextHistory.slice(0, Math.max(0, nextHistory.length - 10));
  }
  examHistory = nextHistory;
}

function loadSavedDraft() {
  const draft = readStorage(DRAFT_KEY, null);
  if (!draft || !draft.scope || !Array.isArray(draft.questions)) return null;

  const draftExam = draft.questions.map(hydrateStoredQuestion).filter(Boolean);
  if (draftExam.length !== draft.questions.length || draftExam.length === 0) {
    removeStorage(DRAFT_KEY);
    return null;
  }

  return {
    scope: draft.scope,
    exam: draftExam,
    selectedAnswers: draft.selectedAnswers ?? {},
    savedAt: draft.savedAt,
  };
}

function saveDraft() {
  if (mode !== "exam" || submitted || exam.length === 0) return;

  const draft = {
    savedAt: new Date().toISOString(),
    scope: { ...currentScope },
    questions: compactExamQuestions(),
    selectedAnswers,
  };
  if (writeStorage(DRAFT_KEY, draft)) {
    savedDraft = {
      ...draft,
      exam,
    };
  }
}

function clearDraft() {
  removeStorage(DRAFT_KEY);
  savedDraft = null;
}

function saveExamAttempt() {
  const score = getScore();
  const total = exam.length;
  const submittedAt = new Date().toISOString();
  const attempt = {
    id: `attempt-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    submittedAt,
    scope: { ...currentScope },
    score,
    total,
    percent: Math.round((score / total) * 100),
    questions: compactExamQuestions(),
  };

  examHistory = [attempt, ...examHistory].slice(0, HISTORY_LIMIT);
  persistExamHistory();

  if (currentScope.type === "unit" && score === total) {
    const key = unitProgressKey(currentScope.moduleNumber, currentScope.unitNumber);
    unitProgress[key] = {
      moduleNumber: currentScope.moduleNumber,
      unitNumber: currentScope.unitNumber,
      title: currentScope.title,
      completedAt: unitProgress[key]?.completedAt ?? submittedAt,
      lastPerfectAt: submittedAt,
      attemptsToPerfect: examHistory.filter((item) => item.scope?.id === currentScope.id).length,
    };
    writeStorage(PROGRESS_KEY, unitProgress);
  }

  return attempt.id;
}

function submitExam() {
  submitted = true;
  activeAttemptId = saveExamAttempt();
  clearDraft();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openAttempt(attemptId) {
  const attempt = examHistory.find((item) => item.id === attemptId);
  if (!attempt) return;
  const attemptQuestions = attempt.questions.map(hydrateStoredQuestion).filter(Boolean);
  if (attemptQuestions.length === 0) return;

  activeAttemptId = attempt.id;
  currentScope = {
    ...attempt.scope,
    title: `Review: ${attempt.scope.title}`,
    reviewTitle: attempt.scope.title,
  };
  exam = attemptQuestions.map((question) => ({ ...question }));
  selectedAnswers = Object.fromEntries(attemptQuestions.map((question) => [question.id, question.selectedAnswer]));
  submitted = true;
  mode = "review";
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resumeSavedDraft() {
  if (!savedDraft) return;
  currentScope = savedDraft.scope;
  exam = savedDraft.exam.map((question) => ({ ...question }));
  selectedAnswers = { ...savedDraft.selectedAnswers };
  submitted = false;
  activeAttemptId = null;
  mode = "exam";
  saveDraft();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function discardSavedDraft() {
  clearDraft();
  render();
}

function moduleDistribution() {
  const counts = new Map();
  for (const question of exam) {
    counts.set(question.moduleNumber, (counts.get(question.moduleNumber) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => a[0] - b[0]);
}

function domainDistribution() {
  if (currentScope.type === "weighted") {
    return EXAM_BLUEPRINT.map((domain) => ({
      ...domain,
      actual: exam.filter((question) => question.examDomain === domain.key).length,
    }));
  }

  const counts = new Map();
  for (const question of exam) {
    counts.set(question.examDomainName, (counts.get(question.examDomainName) ?? 0) + 1);
  }

  return [...counts.entries()].map(([label, actual]) => ({ label, range: "scope sample", actual }));
}

function renderTopbar(title, subtitle, actions = "") {
  return `
    <header class="topbar">
      <div>
        <p class="eyebrow">AI-901 Practice</p>
        <h1>${title}</h1>
        ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ""}
      </div>
      <div class="actions">${actions}</div>
    </header>
  `;
}

function renderSetup() {
  savedDraft = loadSavedDraft();
  const units = getUnits();
  const completedUnits = units
    .map((unit) => ({ ...unit, completion: getUnitCompletion(unit.moduleNumber, unit.unitNumber) }))
    .filter((unit) => unit.completion)
    .sort((a, b) => new Date(b.completion.lastPerfectAt) - new Date(a.completion.lastPerfectAt));

  const learningPathCards = getLearningPaths()
    .map(
      (learningPath) => `
        <article class="scope-card">
          <div>
            <p class="eyebrow">Learning Path ${learningPath.number}</p>
            <h2>${learningPath.name}</h2>
            <p>${learningPath.questionCount} questions available</p>
          </div>
          <button
            class="primary start-scope"
            type="button"
            data-type="learningPath"
            data-learning-path="${learningPath.number}"
            data-title="Learning Path ${learningPath.number}: ${learningPath.name}"
          >
            Start Path Exam
          </button>
        </article>
      `,
    )
    .join("");

  const moduleOptions = getModules()
    .map((module) => `<option value="${module.number}">Module ${module.number}: ${module.name} (${module.questionCount})</option>`)
    .join("");

  const unitOptions = getUnits()
    .map((unit) => {
      const completion = getUnitCompletion(unit.moduleNumber, unit.unitNumber);
      const status = completion ? ` - Completed ${formatDate(completion.completedAt)}` : "";
      return `<option value="${unit.moduleNumber}-${unit.unitNumber}">M${unit.moduleNumber} U${unit.unitNumber}: ${unit.unitName} (${unit.questionCount})${status}</option>`;
    })
    .join("");

  const progressItems = completedUnits.length
    ? completedUnits
        .slice(0, 10)
        .map(
          (unit) => `
            <li>
              <span>Module ${unit.moduleNumber}, Unit ${unit.unitNumber}: ${unit.unitName}</span>
              <strong>${formatDate(unit.completion.completedAt)}</strong>
            </li>
          `,
        )
        .join("")
    : `<li><span>No completed units yet</span><strong>100% required</strong></li>`;

  const historyItems = examHistory.length
    ? examHistory
        .slice(0, 12)
        .map(
          (attempt) => `
            <li class="history-item">
              <div>
                <strong>${attempt.scope.title}</strong>
                <span>${formatDate(attempt.submittedAt)} | ${attempt.score}/${attempt.total} (${attempt.percent}%)</span>
              </div>
              <button class="secondary review-attempt" type="button" data-attempt-id="${attempt.id}">Review</button>
            </li>
          `,
        )
        .join("")
    : `<li class="history-item"><div><strong>No exam attempts yet</strong><span>Submitted exams will appear here.</span></div></li>`;

  const draftPanel = savedDraft
    ? `
      <section class="hero-panel saved-draft">
        <div>
          <h2>Saved Exam</h2>
          <p>${savedDraft.scope.title} | ${getSelectedAnswerCount(savedDraft.selectedAnswers)}/${savedDraft.exam.length} answered | Saved ${formatDate(savedDraft.savedAt)}</p>
        </div>
        <div class="resume-actions">
          <button class="primary" id="resume-draft" type="button">Resume</button>
          <button class="secondary" id="discard-draft" type="button">Discard</button>
        </div>
      </section>
    `
    : "";

  return `
    ${renderTopbar(
      "Practice Exam Hub",
      "Choose a unit, module, learning path, or full AI-901 weighted mock exam.",
      "",
    )}

    <main class="hub">
      ${draftPanel}

      <section class="hero-panel">
        <div>
          <h2>Full Mock Exam</h2>
          <p>Generates 60 random questions using the official AI-901 weighting: 26 concepts and responsibilities questions, 34 Foundry implementation questions.</p>
        </div>
        <button class="primary start-scope" type="button" data-type="weighted" data-title="Official weighted mock exam">
          Start 60 Questions
        </button>
      </section>

      <section>
        <div class="section-heading">
          <h2>Learning Path Practice</h2>
          <p>Use after completing a full learning path.</p>
        </div>
        <div class="scope-grid">${learningPathCards}</div>
      </section>

      <section class="chooser-grid">
        <div class="chooser">
          <h2>Unit Practice</h2>
          <p>Use after finishing a single unit.</p>
          <select id="unit-select">${unitOptions}</select>
          <button class="secondary" id="start-unit" type="button">Start Unit Exam</button>
        </div>
        <div class="chooser">
          <h2>Module Practice</h2>
          <p>Use after finishing all units in a module.</p>
          <select id="module-select">${moduleOptions}</select>
          <button class="secondary" id="start-module" type="button">Start Module Exam</button>
        </div>
      </section>

      <section class="chooser-grid">
        <div class="chooser">
          <div class="section-heading compact">
            <h2>Unit Progress</h2>
            <p>${completedUnits.length} of ${units.length} counted units completed. A unit is completed when you score 100% on its unit exam.</p>
          </div>
          <ul class="progress-list">${progressItems}</ul>
        </div>
        <div class="chooser">
          <div class="section-heading compact">
            <h2>Exam History</h2>
            <p>${examHistory.length} submitted exams saved in this browser.</p>
          </div>
          <ul class="history-list">${historyItems}</ul>
        </div>
      </section>
    </main>
  `;
}

function renderHeader() {
  const answered = getAnsweredCount();
  const score = getScore();
  const percent = submitted ? Math.round((score / exam.length) * 100) : null;
  const sourceCount = currentScope.type === "weighted" ? practiceQuestions().length : getPoolForScope(currentScope).length;
  const reviewedAttempt = examHistory.find((attempt) => attempt.id === activeAttemptId);
  const completion = currentScope.type === "unit" ? getUnitCompletion(currentScope.moduleNumber, currentScope.unitNumber) : null;
  const subtitle =
    mode === "review"
      ? `Historical attempt${reviewedAttempt ? ` from ${formatDate(reviewedAttempt.submittedAt)}` : ""}`
      : currentScope.type === "weighted"
        ? "Official blueprint weighted mock exam"
        : "Scope-based practice exam";
  const actions =
    mode === "review"
      ? `<button class="secondary" id="back-hub" type="button">Practice Hub</button>`
      : `
        <button class="secondary" id="back-hub" type="button">Practice Hub</button>
        <button class="secondary" id="new-exam" type="button">New Questions</button>
        <button class="primary" id="submit-exam" type="button" ${answered < exam.length || submitted ? "disabled" : ""}>
          ${submitted ? "Submitted" : "Submit Exam"}
        </button>
      `;

  return `
    ${renderTopbar(
      currentScope.title,
      subtitle,
      actions,
    )}

    <section class="summary">
      <div>
        <span class="metric">${exam.length}</span>
        <span class="label">Questions</span>
      </div>
      <div>
        <span class="metric">${answered}</span>
        <span class="label">Answered</span>
      </div>
      <div>
        <span class="metric">${sourceCount}</span>
        <span class="label">Scope Pool</span>
      </div>
      <div>
        <span class="metric">${submitted ? `${score}/${exam.length}` : "-"}</span>
        <span class="label">${submitted ? `${percent}% Score` : "Score"}</span>
      </div>
    </section>
    ${
      submitted && completion
        ? `<section class="notice success">Unit completed with 100% on ${formatDate(completion.completedAt)}.</section>`
        : ""
    }
  `;
}

function renderSidebar() {
  const domains = domainDistribution()
    .map(
      (domain) => `
        <li>
          <span>${domain.label}<small>${domain.range}</small></span>
          <strong>${domain.actual}</strong>
        </li>
      `,
    )
    .join("");

  const distribution = moduleDistribution()
    .map(([moduleNumber, count]) => `<li><span>Module ${moduleNumber}</span><strong>${count}</strong></li>`)
    .join("");

  const nav = exam
    .map((question) => {
      const answered = isQuestionAnswered(question);
      const correct = isQuestionCorrect(question);
      const state = submitted ? (correct ? "correct" : "incorrect") : answered ? "answered" : "";
      return `<a class="${state}" href="#q-${question.examNumber}" aria-label="Go to question ${question.examNumber}">${question.examNumber}</a>`;
    })
    .join("");

  return `
    <aside class="sidebar">
      <section>
        <h2>Exam Map</h2>
        <div class="question-nav">${nav}</div>
      </section>
      <section>
        <h2>${currentScope.type === "weighted" ? "Exam Blueprint" : "Domain Mix"}</h2>
        <ul class="distribution blueprint">${domains}</ul>
      </section>
      <section>
        <h2>Module Mix</h2>
        <ul class="distribution">${distribution}</ul>
      </section>
      <section>
          <h2>Source</h2>
        <p>${practiceQuestions().length} counted practice questions. Introduction, exercise, and summary units are excluded.</p>
      </section>
    </aside>
  `;
}

function renderQuestion(question) {
  const selected = selectedList(question);
  const correctDisplays = question.options
    .filter((item) => answerList(question).includes(item.label))
    .map((item) => item.displayLabel)
    .join(", ");
  const optionRows = question.options
    .map((option) => {
      const checked = selected.includes(option.label) ? "checked" : "";
      const isCorrect = answerList(question).includes(option.label);
      const isSelected = selected.includes(option.label);
      const reviewClass = submitted
        ? isCorrect
          ? "correct"
          : isSelected
            ? "incorrect"
            : ""
        : "";

      return `
        <label class="option ${reviewClass}">
          <input
            type="${question.isMultiSelect ? "checkbox" : "radio"}"
            name="${question.id}"
            value="${option.label}"
            ${checked}
            ${submitted ? "disabled" : ""}
          />
          <span class="option-letter">${option.displayLabel}</span>
          <span>${option.text}</span>
        </label>
      `;
    })
    .join("");

  const result = submitted
    ? `
      <div class="rationale ${isQuestionCorrect(question) ? "correct" : "incorrect"}">
        <strong>${isQuestionCorrect(question) ? "Correct" : "Review"}</strong>
        <p>Correct answer${question.isMultiSelect ? "s" : ""}: ${correctDisplays}. ${question.correctAnswer}</p>
        <p>${question.rationale}</p>
      </div>
    `
    : "";

  return `
    <article class="question-card" id="q-${question.examNumber}">
      <div class="question-meta">
        <span>Question ${question.examNumber}</span>
        <span>Learning Path ${question.learningPathNumber} | Module ${question.moduleNumber}, Unit ${question.unitNumber}</span>
      </div>
      ${question.isMultiSelect ? `<p class="multi-tag">Choose ${answerList(question).length}</p>` : ""}
      <p class="domain-tag">${question.examDomainName} (${question.examDomainOfficialRange})</p>
      <h2>${question.question}</h2>
      <div class="options">${optionRows}</div>
      ${result}
      <p class="source-file">${question.sourceFile}</p>
    </article>
  `;
}

function renderExam() {
  return `
    ${renderHeader()}
    <main class="layout">
      ${renderSidebar()}
      <section class="questions">
        ${exam.map(renderQuestion).join("")}
      </section>
    </main>
  `;
}

function scopeFromButton(button) {
  if (button.dataset.type === "weighted") {
    return { type: "weighted", id: "weighted", title: button.dataset.title };
  }

  if (button.dataset.type === "learningPath") {
    return {
      type: "learningPath",
      id: `lp${button.dataset.learningPath}`,
      title: button.dataset.title,
      learningPathNumber: Number(button.dataset.learningPath),
    };
  }

  return currentScope;
}

function bindSetupEvents() {
  document.querySelector("#resume-draft")?.addEventListener("click", resumeSavedDraft);
  document.querySelector("#discard-draft")?.addEventListener("click", discardSavedDraft);

  document.querySelectorAll(".start-scope").forEach((button) => {
    button.addEventListener("click", () => startExam(scopeFromButton(button)));
  });

  document.querySelector("#start-module")?.addEventListener("click", () => {
    const moduleNumber = Number(document.querySelector("#module-select").value);
    const module = getModules().find((item) => item.number === moduleNumber);
    startExam({
      type: "module",
      id: `m${moduleNumber}`,
      title: `Module ${module.number}: ${module.name}`,
      moduleNumber,
    });
  });

  document.querySelector("#start-unit")?.addEventListener("click", () => {
    const [moduleNumber, unitNumber] = document.querySelector("#unit-select").value.split("-").map(Number);
    const unit = getUnits().find((item) => item.moduleNumber === moduleNumber && item.unitNumber === unitNumber);
    startExam({
      type: "unit",
      id: `m${moduleNumber}-u${unitNumber}`,
      title: `Module ${moduleNumber}, Unit ${unitNumber}: ${unit.unitName}`,
      moduleNumber,
      unitNumber,
    });
  });

  document.querySelectorAll(".review-attempt").forEach((button) => {
    button.addEventListener("click", () => openAttempt(button.dataset.attemptId));
  });
}

function bindExamEvents() {
  document.querySelector("#back-hub")?.addEventListener("click", () => {
    mode = "setup";
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelector("#new-exam")?.addEventListener("click", () => startExam(currentScope, exam.length));
  document.querySelector("#submit-exam")?.addEventListener("click", submitExam);

  document.querySelectorAll("input[type='radio']").forEach((input) => {
    input.addEventListener("change", (event) => {
      selectedAnswers[event.target.name] = event.target.value;
      saveDraft();
      render();
    });
  });

  document.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.addEventListener("change", (event) => {
      const values = selectedAnswers[event.target.name];
      const nextValues = Array.isArray(values) ? [...values] : [];
      if (event.target.checked) {
        if (!nextValues.includes(event.target.value)) nextValues.push(event.target.value);
      } else {
        const index = nextValues.indexOf(event.target.value);
        if (index >= 0) nextValues.splice(index, 1);
      }
      selectedAnswers[event.target.name] = nextValues;
      saveDraft();
      render();
    });
  });
}

function render() {
  app.innerHTML = mode === "setup" ? renderSetup() : renderExam();
  if (mode === "setup") {
    bindSetupEvents();
  } else {
    bindExamEvents();
  }
}

async function init() {
  app.innerHTML = `<div class="loading">Loading AI-901 question banks...</div>`;
  const response = await fetch(`${import.meta.env.BASE_URL}questions.json`);
  if (!response.ok) {
    throw new Error("Unable to load generated question dataset.");
  }
  dataset = await response.json();
  questionById = new Map(dataset.questions.map((question) => [question.id, question]));
  examHistory = readStorage(HISTORY_KEY, []).map(compactStoredAttempt);
  unitProgress = readStorage(PROGRESS_KEY, {});
  savedDraft = loadSavedDraft();
  persistExamHistory();
  render();
}

init().catch((error) => {
  app.innerHTML = `
    <div class="error">
      <h1>Unable to start mock exam</h1>
      <p>${error.message}</p>
      <p>Run <code>npm run generate:questions</code> and restart the Vite dev server.</p>
    </div>
  `;
});
