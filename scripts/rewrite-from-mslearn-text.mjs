import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "AI901_SOURCE_MANIFEST.md");

// These banks were already hand-authored from the Microsoft Learn speech pages.
const preserveManual = new Set(["4-2", "4-3", "4-4"]);

const labels = "ABCDEF".split("");

function clean(value) {
  return String(value)
    .replace(/\r/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/Ã¢Â€Â”/g, "-")
    .replace(/Ã¢Â€Â“/g, "-")
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€“/g, "-")
    .replace(/â€”/g, "-")
    .replace(/[â€œâ€]/g, '"')
    .replace(/[â€˜â€™]/g, "'")
    .replace(/:{2,}/g, ":")
    .replace(/\s+:/g, ":")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(value) {
  return clean(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "$1")
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "$1:")
      .replace(/<[^>]+>/g, " "),
  );
}

function sentenceCase(value) {
  const text = clean(value).replace(/[.。]+$/, "");
  return text ? `${text[0].toUpperCase()}${text.slice(1)}` : text;
}

function isCountedTitle(title) {
  const normalized = title.trim().toLowerCase();
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

function isBlockedHeading(text) {
  return /^(learning objectives?|prerequisites?|resources?|summary|knowledge check|exercise|introduction)$/i.test(text);
}

function isBadFact(text, unitTitle = "") {
  const normalized = clean(text);
  if (!normalized) return true;
  if (normalized.toLowerCase() === unitTitle.toLowerCase()) return true;
  if (/^\d+\s+minutes?$/i.test(normalized)) return true;
  if (/^(tip|note|important|caution|feedback|completed|warning)\b/i.test(normalized)) return true;
  if (/see the text and images/i.test(normalized)) return true;
  if (/^(read in english|was this page helpful|need help|want to try|suggest a fix|theme|light|dark|high contrast|microsoft 20\d\d)/i.test(normalized)) return true;
  if (/^(screenshot|diagram|image of|illustration of|a diagram|the following image)/i.test(normalized)) return true;
  if (/^(the following diagram|for example, consider the following|here'?s how|the output from this code|shown in the following|the following table)/i.test(normalized)) return true;
  if (/^(for example|more importantly|the general process)/i.test(normalized)) return true;
  if (/shown in the following|returned by the model reveals|response: object/i.test(normalized)) return true;
  if (/^(this unit assumes|if you are new to|in this module|in this unit, you will|by the end of this module|by the end of this unit)/i.test(normalized)) return true;
  if (/^(select|sign in|create a|open the|go to the|return to|review the|close the)/i.test(normalized) && normalized.length < 100) return true;
  if (/learn\.microsoft\.com|microsoft learn/i.test(normalized) && normalized.length < 120) return true;
  if (/^[A-Z][A-Za-z0-9 ()/_-]+:$/.test(normalized)) return true;
  if (/include:$/i.test(normalized)) return true;
  if (/ works:$/i.test(normalized)) return true;
  if (normalized.length < 28) return true;
  return false;
}

function parseManifest() {
  const lines = fs.readFileSync(manifestPath, "utf8").split(/\r?\n/);
  let moduleNumber = null;
  const units = [];

  for (const line of lines) {
    const moduleMatch = line.match(/^### Module (\d+): (.+)$/);
    if (moduleMatch) moduleNumber = Number(moduleMatch[1]);

    const rowMatch = line.match(/^\| (\d+) \| DONE \| ([^|]+) \| (https:\/\/[^|]+) \|/);
    if (rowMatch && moduleNumber && isCountedTitle(rowMatch[2])) {
      units.push({
        moduleNumber,
        unitNumber: Number(rowMatch[1]),
        title: rowMatch[2].trim(),
        url: rowMatch[3].trim(),
      });
    }
  }

  return units;
}

async function fetchUnitItems(url) {
  const target = `${url}${url.includes("?") ? "&" : "?"}pivots=text`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  let html;
  try {
    const response = await fetch(target, { signal: controller.signal });
    if (!response.ok) throw new Error(`Failed to fetch ${target}: ${response.status}`);
    html = await response.text();
  } finally {
    clearTimeout(timeout);
  }
  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
  const main = (mainMatch ? mainMatch[0] : html)
    .replace(/<blockquote[\s\S]*?<\/blockquote>/gi, " ")
    .replace(/<pre[\s\S]*?<\/pre>/gi, " ")
    .replace(/<table[\s\S]*?<\/table>/gi, " ");
  const matches = [...main.matchAll(/<(h1|h2|h3|p|li)[^>]*>([\s\S]*?)<\/\1>/gi)];
  return matches
    .map((match) => ({ tag: match[1].toLowerCase(), text: stripHtml(match[2]) }))
    .filter((item) => item.text);
}

function buildSections(unit, items) {
  const sections = [];
  let current = { heading: unit.title, facts: [], bullets: [] };
  let skipping = false;

  for (const item of items) {
    if (item.tag === "h2" || item.tag === "h3") {
      skipping = isBlockedHeading(item.text);
      if (!skipping) {
        current = { heading: item.text, facts: [], bullets: [] };
        sections.push(current);
      }
      continue;
    }

    if (item.tag === "h1" || skipping || isBadFact(item.text, unit.title)) continue;

    const facts = item.text
      .split(/(?<=\.)\s+(?=[A-Z])/)
      .map((text) => clean(text))
      .filter((text) => !isBadFact(text, unit.title))
      .filter((text) => text.length <= 240);

    for (const fact of facts.length ? facts : [item.text]) {
      if (current.facts.length === 0 && sections.length === 0) sections.push(current);
      current.facts.push(sentenceCase(fact));
      if (item.tag === "li") current.bullets.push(sentenceCase(fact));
    }
  }

  return sections
    .map((section) => ({
      ...section,
      facts: unique(section.facts).filter((fact) => !isBadFact(fact, unit.title)),
      bullets: unique(section.bullets).filter((fact) => !isBadFact(fact, unit.title)),
    }))
    .filter((section) => section.facts.length > 0);
}

function loadModuleName(moduleNumber) {
  for (const file of ["unit1_question_bank.md", "unit2_question_bank.md", "unit1_lesson_plan.md", "unit2_lesson_plan.md"]) {
    const filePath = path.join(root, `Module${moduleNumber}`, file);
    if (fs.existsSync(filePath)) {
      const match = fs.readFileSync(filePath, "utf8").match(/^# Module \d+: (.+)$/m);
      if (match) return match[1].trim();
    }
  }
  return `Module ${moduleNumber}`;
}

function unique(values) {
  const seen = new Set();
  const result = [];
  for (const value of values.map(clean).filter(Boolean)) {
    const key = value.toLowerCase().replace(/[^\w]+/g, " ");
    if (!seen.has(key)) {
      seen.add(key);
      result.push(value);
    }
  }
  return result;
}

function shorten(text, limit = 185) {
  const cleaned = clean(text)
    .replace(/\s*\([^)]{70,}\)/g, "")
    .replace(/\s*\[[^\]]+\]/g, "")
    .replace(/\s+([,.;])/g, "$1");
  if (cleaned.length <= limit) return cleaned;
  const cut = cleaned.slice(0, limit);
  const boundary = Math.max(cut.lastIndexOf(";"), cut.lastIndexOf(","), cut.lastIndexOf(" "));
  return `${cut.slice(0, boundary > 80 ? boundary : limit).trim()}...`;
}

function extractTermDefinition(fact) {
  const text = clean(fact).replace(/\.$/, "");
  let match = text.match(/^([^:]{3,70}):\s*(.+)$/);
  if (!match) match = text.match(/^([A-Z][A-Za-z0-9 ()/.-]{2,70})\s+-\s+(.+)$/);
  if (!match) match = text.match(/^([A-Z][A-Za-z0-9 ()/.-]{2,70})\s+(?:is|are|refers to)\s+(.+)$/i);
  if (!match) return null;

  const term = clean(match[1]).replace(/:$/, "");
  const definition = clean(match[2]);
  if (term.split(/\s+/).length > 9) return null;
  if (/[()]/.test(term) || /for example|following|shown in/i.test(term)) return null;
  if (definition.length < 25) return null;
  if (/^(this|there|for example|because|when|while|the ability)$/i.test(term)) return null;
  return { term, definition: sentenceCase(definition), source: fact };
}

function allFacts(sections) {
  return unique(sections.flatMap((section) => section.facts));
}

function termDefinitions(sections) {
  return unique(sections.flatMap((section) => section.facts))
    .map(extractTermDefinition)
    .filter(Boolean);
}

function fallbackDistractors(unitTitle) {
  return [
    `It replaces the need to understand the ${unitTitle} concept before choosing a solution.`,
    "It is mainly used to resize application windows and change interface colors.",
    "It guarantees correct output without testing, review, or responsible AI controls.",
    "It is a manual-only workflow that does not use AI models or Azure capabilities.",
    "It is unrelated to the unit scenario and belongs to a different AI workload.",
  ];
}

function buildOptions(correctAnswers, distractors, number, optionCount, unitTitle) {
  const correct = unique(correctAnswers.map((answer) => shorten(answer))).slice(0, optionCount);
  const wrong = unique(distractors.map((answer) => shorten(answer)))
    .filter((answer) => !correct.includes(answer))
    .filter((answer) => answer.length >= 20)
    .slice(0, optionCount - correct.length);
  const filler = fallbackDistractors(unitTitle).filter((answer) => !correct.includes(answer) && !wrong.includes(answer));
  const options = [...correct.map((text) => ({ text, correct: true })), ...wrong.map((text) => ({ text, correct: false })), ...filler.map((text) => ({ text, correct: false }))].slice(0, optionCount);
  const shift = number % options.length;
  const rotated = options.slice(shift).concat(options.slice(0, shift));
  return {
    answers: rotated.map((item, index) => (item.correct ? labels[index] : null)).filter(Boolean),
    markdown: rotated.map((item, index) => `${labels[index]}. ${item.text}  `).join("\n"),
  };
}

function formatQuestion(number, stem, correct, distractors, rationale, optionCount, unitTitle) {
  const options = buildOptions(correct, distractors, number, optionCount, unitTitle);
  return `### ${number}. ${stem}

${options.markdown}

**Answer:** ${options.answers.join(", ")}  
**Rationale:** ${rationale}
`;
}

function makeTermQuestion(number, unit, termDef, allDefinitions, facts) {
  const distractors = [
    ...allDefinitions.filter((item) => item.term !== termDef.term).map((item) => item.definition),
    ...facts.filter((fact) => fact !== termDef.source),
  ];
  return formatQuestion(
    number,
    `In this unit, what does "${termDef.term}" mean?`,
    [termDef.definition],
    distractors,
    `The unit defines or explains "${termDef.term}" with this meaning.`,
    4,
    unit.title,
  );
}

function makeSectionQuestion(number, unit, section, facts) {
  const correct = section.facts[0];
  const distractors = facts.filter((fact) => fact !== correct && !section.facts.includes(fact));
  return formatQuestion(
    number,
    `Which statement matches the unit's explanation of "${section.heading}"?`,
    [correct],
    distractors,
    `This statement is taken from the "${section.heading}" part of the unit text.`,
    4,
    unit.title,
  );
}

function makeScenarioQuestion(number, unit, section, facts) {
  const source = section.facts.find((fact) => /\b(use|used|enables|helps|provides|allows|support|choose|select|deploy|extract|generate|analyze|identify|evaluate|mitigate|measure|manage)\b/i.test(fact)) ?? section.facts[0];
  const distractors = facts.filter((fact) => fact !== source && !section.facts.includes(fact));
  return formatQuestion(
    number,
    `A learner is applying the "${section.heading}" concept from this unit. Which point should guide their choice?`,
    [source],
    distractors,
    `The correct choice is directly supported by the unit's discussion of "${section.heading}".`,
    4,
    unit.title,
  );
}

function subjectFromFact(fact, unitTitle) {
  const text = clean(fact)
    .replace(/\([^)]{40,}\)/g, "")
    .replace(/\.$/, "");
  const beforeVerb = text.match(/^(.{8,90}?)\s+(?:is|are|uses|use|enables|enable|provides|provide|helps|help|can|must|should)\b/i)?.[1];
  const subject = beforeVerb ?? text.split(/[.;:,]/)[0];
  return shorten(subject || unitTitle, 80);
}

function makeFactQuestion(number, unit, fact, facts) {
  const text = clean(fact);
  let stem = `According to this unit, which statement is true about ${subjectFromFact(text, unit.title)}?`;
  let correct = [text];

  let match = text.match(/^Users interact with (.+?) through (.+)$/i);
  if (match) {
    stem = `How do users interact with ${shorten(match[1], 70)}?`;
    correct = [sentenceCase(`Through ${match[2]}`)];
  }

  match = text.match(/^(.+?) is based on (.+)$/i);
  if (match) {
    stem = `What is ${shorten(match[1], 80)} based on?`;
    correct = [sentenceCase(match[2])];
  }

  match = text.match(/^(.+?) uses? (.+?) to (.+)$/i);
  if (match && match[2].length < 100 && !/^the ability/i.test(match[1])) {
    stem = `What does ${shorten(match[1], 80)} use to ${shorten(match[3], 80)}?`;
    correct = [sentenceCase(match[2])];
  }

  match = text.match(/^(.+?) enables? (.+)$/i);
  if (match) {
    if (/semantic relationships/i.test(match[1])) {
      stem = "Why can generative AI models generate meaningful sequences of text?";
      correct = [sentenceCase(match[2])];
    } else {
      stem = `What does ${shorten(match[1], 80)} enable?`;
      correct = [sentenceCase(match[2])];
    }
  }

  match = text.match(/difference is based on (.+)$/i);
  if (match) {
    stem = `What distinguishes the related model types discussed in this unit?`;
    correct = [sentenceCase(match[1])];
  }

  match = text.match(/^LLMs are (.+)$/i);
  if (match) {
    stem = "How does the unit characterize large language models (LLMs)?";
    correct = [sentenceCase(match[1])];
  }

  match = text.match(/^SLMs tend to work well in (.+)$/i);
  if (match) {
    stem = "When do small language models (SLMs) tend to work well?";
    correct = [sentenceCase(match[1])];
  }

  return formatQuestion(
    number,
    stem,
    correct,
    facts.filter((item) => item !== fact),
    "The correct answer is drawn from the Microsoft Learn source text for this unit.",
    4,
    unit.title,
  );
}

function makeChooseTwo(number, unit, section, facts) {
  const source = section.bullets.length >= 2 ? section.bullets : section.facts;
  const correct = source.slice(0, 2);
  const crossSection = facts.filter((fact) => !correct.includes(fact) && !section.facts.includes(fact));
  const distractors = crossSection.length >= 3 ? crossSection : fallbackDistractors(unit.title);
  return formatQuestion(
    number,
    `Which two statements are supported by the "${section.heading}" section? Choose two.`,
    correct,
    distractors,
    `Both correct choices come from the "${section.heading}" section of the Microsoft Learn text.`,
    5,
    unit.title,
  );
}

function makeChooseThree(number, unit, sections, facts) {
  const sourceFacts = sections.flatMap((section) => (section.bullets.length ? section.bullets : section.facts));
  const source = unique(sourceFacts).slice(0, 3);
  return formatQuestion(
    number,
    `Which three details are directly supported by the ${unit.title} unit? Choose three.`,
    source,
    fallbackDistractors(unit.title),
    "The correct choices are stated in the Microsoft Learn text for this unit.",
    6,
    unit.title,
  );
}

function dedupeQuestions(markdownQuestions) {
  const seen = new Set();
  const result = [];
  for (const markdown of markdownQuestions) {
    const stem = markdown.match(/^### \d+\. (.+)$/m)?.[1] ?? markdown;
    const key = stem.toLowerCase().replace(/"[^"]+"/g, '"*"');
    if (!seen.has(key)) {
      seen.add(key);
      result.push(markdown);
    }
  }
  return result;
}

function renumber(markdownQuestions) {
  return markdownQuestions.map((markdown, index) => markdown.replace(/^### \d+\./, `### ${index + 1}.`));
}

function bestOpeningFact(unit, facts) {
  const titleWords = unit.title.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3);
  const scored = facts
    .filter((fact) => !/following diagram|for example, consider|shown in/i.test(fact))
    .map((fact) => {
      const lower = fact.toLowerCase();
      const titleScore = titleWords.reduce((total, word) => total + (lower.includes(word.replace(/s$/, "")) ? 1 : 0), 0);
      const definitionScore = /\bis\b|\bare\b|\bprovides\b|\benables\b/i.test(fact) ? 1 : 0;
      return { fact, score: titleScore + definitionScore };
    })
    .sort((a, b) => b.score - a.score);
  return scored[0]?.fact ?? facts[0] ?? `${unit.title} is the focus of this unit.`;
}

function makeQuestions(unit, sections) {
  const facts = allFacts(sections);
  const definitions = termDefinitions(sections);
  const questions = [];
  let n = 1;

  const opening = bestOpeningFact(unit, facts);
  questions.push(
    formatQuestion(
      n++,
      `Which statement best describes the focus of "${unit.title}"?`,
      [opening],
      facts.slice(1),
      "The correct choice reflects the main instructional point from the unit text.",
      4,
      unit.title,
    ),
  );

  for (const section of sections) {
    const sectionDef = section.facts.map(extractTermDefinition).find(Boolean);
    if (sectionDef) {
      questions.push(makeTermQuestion(n++, unit, sectionDef, definitions, facts));
    } else {
      questions.push(makeSectionQuestion(n++, unit, section, facts));
    }

    if (questions.length < 8 && section.facts.length >= 2) {
      questions.push(makeScenarioQuestion(n++, unit, section, facts));
    }
  }

  for (const termDef of definitions) {
    if (questions.length >= 5) break;
    questions.push(makeTermQuestion(n++, unit, termDef, definitions, facts));
  }

  for (const fact of facts) {
    if (questions.length >= 8) break;
    questions.push(makeFactQuestion(n++, unit, fact, facts));
  }

  const listSections = sections
    .filter((section) => section.bullets.length >= 2 || section.facts.length >= 2)
    .sort((a, b) => b.bullets.length - a.bullets.length);
  for (const section of listSections.slice(0, 2)) {
    if (questions.length >= 9) break;
    questions.push(makeChooseTwo(n++, unit, section, facts));
  }

  if (questions.length < 10 && facts.length >= 3) {
    questions.push(makeChooseThree(n++, unit, sections, facts));
  }

  while (questions.length < 10) {
    const section = sections[questions.length % sections.length] ?? { heading: unit.title, facts: [opening], bullets: [] };
    questions.push(makeScenarioQuestion(n++, unit, section, facts));
  }

  let finalQuestions = dedupeQuestions(questions).slice(0, 10);
  let fillAttempts = 0;
  while (finalQuestions.length < 10 && fillAttempts < 20) {
    fillAttempts += 1;
    const fact = facts[finalQuestions.length % facts.length] ?? opening;
    finalQuestions.push(
      formatQuestion(
        finalQuestions.length + 1,
        `Which statement is correct for "${unit.title}" review item ${fillAttempts}?`,
        [fact],
        [...facts.filter((item) => item !== fact), ...fallbackDistractors(unit.title)],
        "The correct answer is a detail from this unit's Microsoft Learn text.",
        4,
        unit.title,
      ),
    );
    finalQuestions = dedupeQuestions(finalQuestions);
  }

  const hasChooseTwo = finalQuestions.some((question) => /Choose two\./.test(question));
  const hasChooseThree = finalQuestions.some((question) => /Choose three\./.test(question));
  if (!hasChooseTwo && listSections[0]) finalQuestions[8] = makeChooseTwo(9, unit, listSections[0], facts);
  if (!hasChooseThree && facts.length >= 3) finalQuestions[9] = makeChooseThree(10, unit, sections, facts);

  return renumber(finalQuestions.slice(0, 10));
}

function writeBank(unit, sections) {
  const moduleName = loadModuleName(unit.moduleNumber);
  const questions = makeQuestions(unit, sections);
  const filePath = path.join(root, `Module${unit.moduleNumber}`, `unit${unit.unitNumber}_question_bank.md`);
  const output = `# Module ${unit.moduleNumber}: ${moduleName}

## Unit ${unit.unitNumber} Question Bank: ${unit.title}

These questions are built from the Microsoft Learn text page for this unit. They focus on source-specific concepts, scenario recognition, process understanding, and details learners should know for AI-901 preparation.

---

${questions.join("\n---\n\n")}
`;
  fs.writeFileSync(filePath, output, "utf8");
}

async function mapLimit(values, limit, fn) {
  const results = [];
  let next = 0;
  async function worker() {
    while (next < values.length) {
      const index = next;
      next += 1;
      results[index] = await fn(values[index]);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

const requested = new Set(process.argv.slice(2));
const units = parseManifest()
  .filter((unit) => !preserveManual.has(`${unit.moduleNumber}-${unit.unitNumber}`))
  .filter((unit) => requested.size === 0 || requested.has(`${unit.moduleNumber}-${unit.unitNumber}`));
await mapLimit(units, 6, async (unit) => {
  const sourceItems = await fetchUnitItems(unit.url);
  const sections = buildSections(unit, sourceItems);
  if (!sections.length) throw new Error(`No usable source sections for Module ${unit.moduleNumber} Unit ${unit.unitNumber}: ${unit.title}`);
  writeBank(unit, sections);
  console.log(`Rewrote Module ${unit.moduleNumber} Unit ${unit.unitNumber}: ${unit.title}`);
});

console.log(`Source-text rewrite complete for ${units.length} units. Preserved ${preserveManual.size} manual units.`);
