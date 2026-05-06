import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputPath = path.join(root, "public", "questions.json");

const examGuide = {
  lastVerified: "2026-05-05",
  sourceUrl: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-901",
  skillsMeasuredAsOf: "2026-04-15",
  blueprint: [
    {
      key: "concepts",
      name: "Identify AI concepts and responsibilities",
      officialRange: "40-45%",
      mockExamCount: 26,
      mockExamPercent: "43.3%",
    },
    {
      key: "foundry",
      name: "Implement AI solutions by using Microsoft Foundry",
      officialRange: "55-60%",
      mockExamCount: 34,
      mockExamPercent: "56.7%",
    },
  ],
};

const learningPaths = [
  {
    number: 1,
    name: "AI Concepts for Developers and Technology Professionals",
    modules: [1, 2, 3, 4, 5, 6],
  },
  {
    number: 2,
    name: "Develop Generative AI Apps in Azure",
    modules: [7, 8, 9, 10, 11, 12],
  },
];

function learningPathForModule(moduleNumber) {
  return learningPaths.find((learningPath) => learningPath.modules.includes(moduleNumber));
}

function isCountedUnitTitle(unitName) {
  const normalized = unitName.trim().toLowerCase();
  return !(
    normalized === "introduction" ||
    normalized === "introduction to ai" ||
    normalized === "summary" ||
    normalized.startsWith("exercise -") ||
    normalized === "module assessment" ||
    normalized === "module assessment prep" ||
    normalized === "knowledge check"
  );
}

function classifyQuestion(moduleNumber) {
  const conceptModules = new Set([1, 2, 3, 4, 5, 6, 12]);
  const skillAreas = {
    1: "AI concepts, workloads, and responsible AI foundations",
    2: "Generative and agentic AI concepts",
    3: "Text analysis and natural language processing",
    4: "Speech recognition and speech synthesis concepts",
    5: "Computer vision and image generation concepts",
    6: "Information extraction concepts",
    7: "Foundry planning, tools, and SDK readiness",
    8: "Foundry model selection, deployment, and evaluation",
    9: "Foundry SDK chat application development",
    10: "Generative AI apps that use tools",
    11: "Foundry model optimization strategies",
    12: "Responsible AI principles and risk management",
  };

  const key = conceptModules.has(moduleNumber) ? "concepts" : "foundry";
  const domain = examGuide.blueprint.find((item) => item.key === key);

  return {
    learningPathNumber: learningPathForModule(moduleNumber)?.number,
    learningPathName: learningPathForModule(moduleNumber)?.name,
    examDomain: key,
    examDomainName: domain.name,
    examDomainOfficialRange: domain.officialRange,
    skillArea: skillAreas[moduleNumber] ?? "AI-901 course objective",
  };
}

function listQuestionBankFiles() {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^Module\d+$/.test(entry.name))
    .sort((a, b) => Number(a.name.replace("Module", "")) - Number(b.name.replace("Module", "")))
    .flatMap((moduleDir) => {
      const modulePath = path.join(root, moduleDir.name);
      return fs
        .readdirSync(modulePath, { withFileTypes: true })
        .filter((entry) => entry.isFile() && /^unit\d+_question_bank\.md$/i.test(entry.name))
        .sort((a, b) => Number(a.name.match(/^unit(\d+)_/i)[1]) - Number(b.name.match(/^unit(\d+)_/i)[1]))
        .map((entry) => path.join(modulePath, entry.name));
    });
}

function normalizeLine(value) {
  return value.replace(/\r/g, "").trim();
}

function parseOptions(block) {
  const options = [];
  const optionRegex = /^([A-F])\.\s+(.+?)(?:\s{2,})?$/gm;
  let match;

  while ((match = optionRegex.exec(block)) !== null) {
    options.push({
      label: match[1],
      text: normalizeLine(match[2]),
    });
  }

  return options;
}

function parseQuestionBlock(block, context) {
  const questionMatch = block.match(/^###\s+(\d+)\.\s+(.+?)\n/m);
  const answerMatch = block.match(/\*\*Answer:\*\*\s*([A-F](?:\s*,\s*[A-F])*)/i);
  const rationaleMatch = block.match(/\*\*Rationale:\*\*\s*([\s\S]+?)\s*$/i);

  if (!questionMatch || !answerMatch || !rationaleMatch) {
    return null;
  }

  const options = parseOptions(block);
  const answers = answerMatch[1]
    .toUpperCase()
    .split(",")
    .map((answer) => answer.trim())
    .filter(Boolean);
  const correctOptions = answers.map((answer) => options.find((option) => option.label === answer)).filter(Boolean);

  if (correctOptions.length !== answers.length || options.length < 2) {
    return null;
  }

  return {
    id: `m${context.moduleNumber}-u${context.unitNumber}-q${questionMatch[1]}`,
    moduleNumber: context.moduleNumber,
    moduleName: context.moduleName,
    unitNumber: context.unitNumber,
    unitName: context.unitName,
    isCountedUnit: isCountedUnitTitle(context.unitName),
    sourceFile: context.relativePath,
    questionNumber: Number(questionMatch[1]),
    question: normalizeLine(questionMatch[2]),
    options,
    answer: answers[0],
    answers,
    isMultiSelect: answers.length > 1,
    correctAnswer: correctOptions.map((option) => option.text).join("; "),
    correctAnswers: correctOptions.map((option) => option.text),
    rationale: normalizeLine(rationaleMatch[1]),
    ...classifyQuestion(context.moduleNumber),
  };
}

function parseQuestionBank(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const moduleMatch = text.match(/^#\s+Module\s+(\d+):\s+(.+)$/m);
  const unitMatch = text.match(/^##\s+Unit\s+(\d+)\s+Question Bank:\s+(.+)$/m);

  if (!moduleMatch || !unitMatch) {
    throw new Error(`Unable to parse module/unit headings in ${filePath}`);
  }

  const context = {
    moduleNumber: Number(moduleMatch[1]),
    moduleName: normalizeLine(moduleMatch[2]),
    unitNumber: Number(unitMatch[1]),
    unitName: normalizeLine(unitMatch[2]),
    relativePath: path.relative(root, filePath).replaceAll(path.sep, "/"),
  };

  return text
    .split(/\n---\n/g)
    .map((block) => parseQuestionBlock(block, context))
    .filter(Boolean);
}

const files = listQuestionBankFiles();
const questions = files.flatMap(parseQuestionBank);
const summary = {
  generatedAt: new Date().toISOString(),
  source: "Markdown question banks in Module*/unit*_question_bank.md",
  examGuide,
  learningPaths,
  sourceFileCount: files.length,
  questionCount: questions.length,
  countedQuestionCount: questions.filter((question) => question.isCountedUnit).length,
  excludedQuestionCount: questions.filter((question) => !question.isCountedUnit).length,
  moduleCounts: Object.fromEntries(
    [...new Set(questions.map((question) => question.moduleNumber))]
      .sort((a, b) => a - b)
      .map((moduleNumber) => [
        `Module${moduleNumber}`,
        questions.filter((question) => question.moduleNumber === moduleNumber).length,
      ]),
  ),
  domainCounts: Object.fromEntries(
    examGuide.blueprint.map((domain) => [
      domain.key,
      questions.filter((question) => question.examDomain === domain.key && question.isCountedUnit).length,
    ]),
  ),
};

if (questions.length < 60) {
  throw new Error(`Need at least 60 questions to generate a mock exam. Found ${questions.length}.`);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify({ summary, questions }, null, 2));

console.log(`Wrote ${questions.length} questions from ${files.length} banks to ${path.relative(root, outputPath)}.`);
