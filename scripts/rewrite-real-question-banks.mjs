import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "AI901_SOURCE_MANIFEST.md");
const preserveManual = new Set(["4-2", "4-3", "4-4"]);
const labels = "ABCDEF".split("");

function clean(text) {
  return String(text).replace(/\s+/g, " ").trim();
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

function parseManifest() {
  const lines = fs.readFileSync(manifestPath, "utf8").split(/\r?\n/);
  let moduleNumber = null;
  let moduleName = null;
  const modules = new Map();
  const units = [];

  for (const line of lines) {
    const moduleMatch = line.match(/^### Module (\d+): (.+)$/);
    if (moduleMatch) {
      moduleNumber = Number(moduleMatch[1]);
      moduleName = moduleMatch[2].trim();
      modules.set(moduleNumber, moduleName);
    }

    const rowMatch = line.match(/^\| (\d+) \| DONE \| ([^|]+) \| (https:\/\/[^|]+) \|/);
    if (rowMatch && moduleNumber && isCountedTitle(rowMatch[2])) {
      units.push({
        id: `${moduleNumber}-${Number(rowMatch[1])}`,
        moduleNumber,
        moduleName,
        unitNumber: Number(rowMatch[1]),
        title: rowMatch[2].trim(),
      });
    }
  }

  return { units, modules };
}

const globalDistractors = [
  "Choose a model based on popularity instead of task fit.",
  "Rely on one successful trial instead of broader evaluation.",
  "Use a visual analysis capability when the input is only text.",
  "Handle sensitive data without the required access controls.",
  "Leave the model without clear task instructions.",
  "Use a rule-based workflow when model reasoning is required.",
  "Assume the model can complete the task without any relevant input.",
  "Select a capability that matches the tool name but not the input type.",
  "Use a speech feature when the scenario requires document understanding.",
  "Use a vision feature when the scenario requires language analysis.",
  "Treat every AI workload as if it returns the same type of output.",
  "Choose the most complex approach before trying the simpler fit.",
  "Ignore whether the input is text, speech, image, document, or code.",
  "Rely on unsupported guesses instead of configured data or tools.",
  "Use private data without access controls or user protection.",
  "Assume deployment automatically proves the solution is responsible.",
  "Replace all evaluation with a single successful manual test.",
  "Choose a capability that analyzes images when the task requires generated text.",
  "Choose a capability that generates text when the task requires reading scanned text.",
  "Use a tool that performs actions when the scenario only asks for classification.",
  "Use a retrieval feature when the problem is poor prompt structure.",
  "Use fine-tuning when the problem is missing current source content.",
  "Use prompt wording to replace authentication and authorization.",
  "Choose a model without checking whether it supports the input type.",
];

function polishChoice(text) {
  return clean(text)
    .replace(/ for this scenario(?: for this scenario)*/gi, "")
    .replace(/ as described in this unit/gi, "")
    .replace(/Changing screen brightness automatically/gi, "Classifying existing content instead of generating new content")
    .replace(/Changing screen brightness only/gi, "Changing a display setting instead of using an AI tool")
    .replace(/Changing monitor brightness/gi, "Changing a display setting instead of testing a model")
    .replace(/Screen brightness settings/gi, "Display settings rather than extracted content")
    .replace(/Screen brightness/gi, "Display settings")
    .replace(/Keyboard layouts only/gi, "Form layout metadata only")
    .replace(/Keyboard layer/gi, "Deployment management layer")
    .replace(/Office furniture layer/gi, "Project organization layer")
    .replace(/Monitor brightness layer/gi, "Monitoring dashboard layer")
    .replace(/Keyboard color/gi, "Portal navigation setting")
    .replace(/Keyboard shortcuts/gi, "Developer productivity shortcuts")
    .replace(/Keyboard shortcut/gi, "Developer productivity shortcut")
    .replace(/Keyboard replacement/gi, "Device input setting")
    .replace(/Keyboard brand/gi, "Client device detail")
    .replace(/Physical keyboard size/gi, "Client device setting")
    .replace(/desktop wallpaper/gi, "portal home page")
    .replace(/Local wallpaper path/gi, "local file path unrelated to the endpoint")
    .replace(/Set a portal home page/gi, "Select a model documentation page")
    .replace(/Select the capability based on the interface color instead of the requirement\./gi, "Select a capability that matches the tool name but not the input type.")
    .replace(/Manual spreadsheet formatting/gi, "Spreadsheet formatting without model analysis")
    .replace(/Monitor calibration/gi, "Display calibration")
    .replace(/Monitor refresh rate/gi, "Display refresh setting")
    .replace(/Monitor size/gi, "Client display size")
    .replace(/Mouse speed/gi, "Client input setting")
    .replace(/Poster background color/gi, "Visual design preference")
    .replace(/Portal color/gi, "Portal navigation setting")
    .replace(/Random UI colors/gi, "Unrelated interface settings")
    .replace(/Only the button color/gi, "Only the tool name without a schema")
    .replace(/Only the color of generated text/gi, "Only the visual style of output")
    .replace(/What color is the portal header\?/gi, "Which portal page was opened first?")
    .replace(/a process for changing the visual theme of the development portal/gi, "a configuration task for the interface rather than the AI behavior")
    .replace(/a manual-only activity that does not use an AI model/gi, "a rule-based process that does not use model reasoning")
    .replace(/a security shortcut that removes the need for access controls/gi, "an access-control setting rather than the concept being defined")
    .replace(/Choose a model only because it has the largest name recognition\./gi, "Choose a model based on popularity instead of task fit.")
    .replace(/Skip testing because AI outputs are always deterministic\./gi, "Rely on one successful trial instead of broader evaluation.")
    .replace(/Use a manual-only process with no AI capability involved\./gi, "Use a rule-based workflow when model reasoning is required.");
}

function duplicateSafeAnswer(answer, usedOptions) {
  const raw = polishChoice(answer);
  if (!usedOptions?.has(raw.toLowerCase())) return raw;

  const variants = {
    "rag": ["Retrieval augmented generation", "Grounding answers with retrieved content"],
    "fine-tuning": ["Model adaptation with training examples", "Training-based model adaptation"],
    "prompt engineering": ["Instruction and example refinement", "Prompt refinement"],
    "object detection": ["Visual object localization", "Detecting and locating objects"],
    "image generation": ["Generating images from prompts", "Prompt-based image creation"],
    "language detection": ["Detecting document language", "Identifying the language used in text"],
    "speech synthesis": ["Text-to-speech generation", "Generating spoken audio from text"],
    "speech translation": ["Spoken-language translation", "Translating spoken input"],
    "field extraction": ["Extracting named fields", "Identifying specific field values"],
    "field mapping": ["Mapping values to output fields", "Assigning extracted values to fields"],
    "confidence score": ["Extraction certainty score", "System confidence indicator"],
    "ocr": ["Optical character recognition", "Reading text from visual content"],
    "tokens": ["Text units processed by the model", "Units of text used for model processing"],
    "embeddings": ["Vector representations of meaning", "Numeric meaning representations"],
    "semantic similarity": ["Meaning-based comparison", "Comparing text by meaning"],
    "feature maps": ["Maps of detected visual features", "Visual feature response maps"],
    "filters": ["Learned pattern detectors", "Small matrices for visual pattern detection"],
    "structured data": ["Organized fields and records", "Data arranged as defined fields"],
    "generative ai": ["Content generation from prompts", "AI-generated content"],
    "model catalog": ["Available model selection list", "Place to find selectable models"],
    "playground": ["Portal testing workspace", "Interactive model testing area"],
    "content understanding": ["Multimodal content extraction", "Understanding content to extract data"],
    "system prompt": ["Behavior-setting instruction", "Instruction that sets role and boundaries"],
    "user prompt": ["User-submitted task request", "The user's task instruction"],
    "prompt": ["Input instruction to the model", "Natural language request to the model"],
    "language model": ["Model trained to generate language", "Model that predicts language sequences"],
    "fairness": ["Avoiding unfair treatment across groups", "Checking for uneven outcomes across groups"],
    "image classification": ["Assigning an overall image label", "Labeling the main content of an image"],
    "pixels": ["Individual image data points", "Small units that make up an image"],
    "resolution": ["Image detail measured by pixel dimensions", "Pixel dimensions of an image"],
    "latency": ["Response time from request to result", "Time taken to return a response"],
    "endpoint": ["Callable service address", "Network address for a deployed service"],
    "training examples": ["Examples used to adapt behavior", "Sample inputs and outputs used for training"],
    "model layer": ["Model-level mitigation", "Model selection or adaptation layer"],
    "user experience layer": ["User-facing safeguards", "Interface and review safeguards"],
  };

  const fallbackParaphrases = [];
  const transformations = [
    [/^the natural language input that starts the model's response$/i, "a user's instruction or question that starts model generation"],
    [/^the trained model that predicts meaningful language based on patterns learned from large data$/i, "a model that generates language from learned text patterns"],
    [/^a generative AI application that can reason, use instructions, and call tools to act$/i, "an AI app that follows instructions, reasons, and uses tools"],
    [/^ai that creates (.+)$/i, "AI systems that create $1"],
    [/^ai techniques that help software (.+)$/i, "language AI methods that help software $1"],
    [/^the network address an app uses to call (.+)$/i, "a callable network address for $1"],
    [/^the task request or question submitted by the user$/i, "a request or question sent by the user"],
    [/^the system guidance that defines (.+)$/i, "instructions that define $1"],
    [/^a capability the agent can call to (.+)$/i, "an agent-callable capability that can $1"],
    [/^a place to discover and select (.+)$/i, "a catalog for discovering and choosing $1"],
    [/^a workspace for organizing (.+)$/i, "a workspace that organizes $1"],
    [/^a small matrix used to (.+)$/i, "a small matrix that helps $1"],
    [/^a numeric representation that captures (.+)$/i, "a vector-style representation of $1"],
    [/^a neural network design that uses (.+)$/i, "a neural architecture that uses $1"],
    [/^a chunk of text (.+)$/i, "a text unit $1"],
    [/^a word, word part, punctuation mark, or other text unit (.+)$/i, "a token-sized text unit $1"],
    [/^using (.+)$/i, "use of $1"],
    [/^identifying (.+)$/i, "finding $1"],
    [/^detecting (.+)$/i, "finding $1"],
    [/^recognizing (.+)$/i, "reading or identifying $1"],
    [/^converting (.+) into (.+)$/i, "turning $1 into $2"],
    [/^classifying (.+)$/i, "assigning categories to $1"],
    [/^assigning (.+)$/i, "labeling by $1"],
    [/^finding (.+)$/i, "locating $1"],
    [/^protecting (.+)$/i, "keeping $1 protected"],
    [/^ensuring (.+)$/i, "making sure $1"],
    [/^improving (.+)$/i, "making $1 better"],
    [/^measuring (.+)$/i, "assessing $1"],
    [/^training or configuring (.+)$/i, "adapting or configuring $1"],
    [/^adapting (.+)$/i, "changing $1"],
    [/^instructions that define (.+)$/i, "guidance that defines $1"],
    [/^standardizing text (.+)$/i, "normalizing text $1"],
    [/^representing text by (.+)$/i, "using word-based features for $1"],
    [/^scoring terms higher (.+)$/i, "ranking terms higher $1"],
    [/^numeric values that represent (.+)$/i, "numbers that encode $1"],
    [/^numeric output that shows (.+)$/i, "feature responses showing $1"],
    [/^visual direction such as (.+)$/i, "style guidance such as $1"],
    [/^content such as (.+)$/i, "unstructured material such as $1"],
    [/^organized values such as (.+)$/i, "structured values such as $1"],
    [/^reading machine-printed (.+)$/i, "recognizing printed $1"],
    [/^connecting extracted values to (.+)$/i, "mapping extracted values to $1"],
    [/^training models from data (.+)$/i, "learning from data $1"],
    [/^tools for analyzing (.+)$/i, "vision capabilities for analyzing $1"],
    [/^tools for speech recognition, synthesis, and related speech scenarios$/i, "speech capabilities for recognition and synthesis"],
    [/^authentication material used to (.+)$/i, "credentials used to $1"],
    [/^making system behavior and limitations (.+)$/i, "making limitations and behavior $1"],
    [/^checking that an AI system (.+)$/i, "evaluating whether an AI system $1"],
    [/^documentation that summarizes (.+)$/i, "model documentation summarizing $1"],
    [/^settings such as (.+)$/i, "configuration values such as $1"],
    [/^examples used to assess (.+)$/i, "test examples for assessing $1"],
    [/^revising prompts and settings (.+)$/i, "iteratively changing prompts and settings $1"],
    [/^instructions that shape (.+)$/i, "conversation guidance that shapes $1"],
    [/^uploading, processing, or producing files (.+)$/i, "working with files $1"],
    [/^running generated code (.+)$/i, "executing generated code $1"],
    [/^information that may have changed (.+)$/i, "current information that may not be in $1"],
    [/^structured values the model provides (.+)$/i, "arguments supplied by the model $1"],
    [/^sample inputs and outputs (.+)$/i, "few-shot examples $1"],
    [/^specific task guidance (.+)$/i, "explicit task instructions $1"],
    [/^trusted context provided (.+)$/i, "grounding context provided $1"],
    [/^reliable response style or decisions (.+)$/i, "consistent response behavior $1"],
    [/^sample inputs and desired outputs (.+)$/i, "training examples $1"],
    [/^people affected by or responsible for (.+)$/i, "stakeholders affected by or responsible for $1"],
    [/^how different groups may be (.+)$/i, "potential ways groups may be $1"],
    [/^examples used to evaluate (.+)$/i, "test cases used to evaluate $1"],
    [/^platform controls such as (.+)$/i, "safety controls such as $1"],
    [/^choosing or adapting (.+)$/i, "selecting or adapting $1"],
    [/^tracking solution behavior, quality, and risk signals (.+)$/i, "monitoring behavior, quality, and risk signals $1"],
  ];
  for (const [pattern, replacement] of transformations) {
    if (pattern.test(raw)) fallbackParaphrases.push(raw.replace(pattern, replacement));
  }
  if (/^[A-Za-z][A-Za-z0-9 ._/-]{1,40}$/.test(raw)) {
    fallbackParaphrases.push(
      `${raw} capability`,
      `${raw} technique`,
      `${raw} metric`,
      `${raw} component`,
      `${raw} concept`,
      `${raw} approach`,
    );
  }
  if (/^(a|an|the) /i.test(raw)) {
    fallbackParaphrases.push(raw.replace(/^(a|an|the) /i, ""));
  }

  const candidates = [...(variants[raw.toLowerCase()] ?? []), ...fallbackParaphrases];
  for (const candidate of candidates) {
    const polished = polishChoice(candidate);
    if (!usedOptions.has(polished.toLowerCase())) return polished;
  }

  // Reusing a precise answer is better than marking it with a giveaway phrase.
  return raw;
}

function optionSet(correct, distractors, index, optionCount = 4, avoidOptions = new Set()) {
  const seen = new Set();
  const normalizedCorrect = correct.map(polishChoice);
  const options = [];
  for (const text of normalizedCorrect) {
    const key = text.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      options.push({ text, correct: true });
    }
  }
  for (const text of [...distractors, ...globalDistractors].map(polishChoice)) {
    const key = text.toLowerCase();
    const overlapsCorrect = normalizedCorrect.some((answer) => {
      const a = answer.toLowerCase();
      const b = text.toLowerCase();
      return a !== b && (a.includes(b) || b.includes(a));
    });
    if (text && !seen.has(key) && !avoidOptions.has(key) && !overlapsCorrect && options.length < optionCount) {
      seen.add(key);
      options.push({ text, correct: false });
    }
  }
  const shift = index % options.length;
  const rotated = options.slice(shift).concat(options.slice(0, shift));
  return {
    answers: rotated.map((option, optionIndex) => (option.correct ? labels[optionIndex] : null)).filter(Boolean),
    markdown: rotated.map((option, optionIndex) => `${labels[optionIndex]}. ${option.text}  `).join("\n"),
    displayed: rotated.map((option) => option.text),
  };
}

function question(index, stem, correct, distractors, rationale, optionCount = 4, usedOptions = null) {
  const adjustedCorrect = (Array.isArray(correct) ? correct : [correct]).map((answer) => {
    return usedOptions ? duplicateSafeAnswer(answer, usedOptions) : polishChoice(answer);
  });
  const options = optionSet(adjustedCorrect, distractors, index, optionCount, usedOptions ?? new Set());
  if (usedOptions) {
    for (const text of options.displayed) usedOptions.add(text.toLowerCase());
  }
  return `### ${index}. ${stem}

${options.markdown}

**Answer:** ${options.answers.join(", ")}  
**Rationale:** ${rationale}
`;
}

function commonDistractors(profile, exclude = []) {
  const excluded = new Set(exclude.map((item) => item.toLowerCase()));
  return [
    ...profile.concepts.map((concept) => concept.term),
    ...profile.concepts.map((concept) => concept.meaning),
    ...(profile.extraDistractors ?? []),
    ...globalDistractors,
  ].filter((item) => item && !excluded.has(item.toLowerCase()));
}

function termDistractors(profile, exclude = []) {
  const excluded = new Set(exclude.map((item) => item.toLowerCase()));
  return [
    ...profile.concepts.map((concept) => concept.term),
    ...(profile.termDistractors ?? []),
    "Prompt engineering",
    "Object detection",
    "Speech synthesis",
    "Information extraction",
    "Model evaluation",
  ].filter((item) => item && !excluded.has(item.toLowerCase()));
}

function meaningDistractors(profile, exclude = []) {
  const excluded = new Set(exclude.map((item) => item.toLowerCase()));
  return [
    ...profile.concepts.map((concept) => concept.meaning),
    ...(profile.meaningDistractors ?? []),
    "a configuration task for the interface rather than the AI behavior",
    "a rule-based process that does not use model reasoning",
    "an access-control setting rather than the concept being defined",
  ].filter((item) => item && !excluded.has(item.toLowerCase()));
}

function generatedQuestions(profile) {
  const qs = [];
  const c = profile.concepts;
  const s = profile.scenarios;
  const answerPool = [
    ...profile.scenarios.map((scenario) => scenario.answer),
    profile.contrast.answer,
    profile.process.answer,
    ...profile.chooseTwo.correct,
    ...profile.chooseThree.correct,
    ...profile.concepts.map((concept) => concept.meaning),
  ].map(polishChoice);
  const otherAnswers = (current) => {
    const currentAnswers = new Set((Array.isArray(current) ? current : [current]).map((answer) => polishChoice(answer).toLowerCase()));
    return answerPool.filter((answer) => !currentAnswers.has(answer.toLowerCase()));
  };
  const exclude = (current) => [
    ...(Array.isArray(current) ? current : [current]),
    ...otherAnswers(current),
  ];
  const common = (exclude = []) => commonDistractors(profile, exclude);
  const usedOptions = new Set();
  const make = (index, stem, correct, distractors, rationale, optionCount = 4) =>
    question(index, stem, correct, distractors, rationale, optionCount, usedOptions);

  qs.push(make(
    1,
    s[0].stem,
    s[0].answer,
    termDistractors(profile, [s[0].answer]),
    s[0].rationale ?? `The requirement matches the unit capability named in the correct option.`,
  ));

  qs.push(make(
    2,
    `What is the main purpose of "${c[0].term}"?`,
    c[0].meaning,
    meaningDistractors(profile, [c[0].meaning]),
    `"${c[0].term}" is a core idea in this unit, and the correct option paraphrases its role.`,
  ));

  qs.push(make(
    3,
    s[1].stem,
    s[1].answer,
    termDistractors(profile, [s[1].answer]),
    s[1].rationale ?? "The correct option is the unit concept that best fits the stated requirement.",
  ));

  qs.push(make(
    4,
    profile.contrast.stem,
    profile.contrast.answer,
    [...profile.contrast.distractors, ...common(exclude(profile.contrast.answer))],
    profile.contrast.rationale,
  ));

  qs.push(make(
    5,
    `What should a learner remember about "${c[1].term}"?`,
    c[1].meaning,
    meaningDistractors(profile, [c[1].meaning]),
    `"${c[1].term}" is tested by recognizing its purpose, not by memorizing wording from the page.`,
  ));

  qs.push(make(
    6,
    profile.process.stem,
    profile.process.answer,
    [...profile.process.distractors, ...common(exclude(profile.process.answer))],
    profile.process.rationale,
  ));

  qs.push(make(
    7,
    profile.chooseTwo.stem,
    profile.chooseTwo.correct,
    [...profile.chooseTwo.distractors, ...common(exclude(profile.chooseTwo.correct))],
    profile.chooseTwo.rationale,
    5,
  ));

  qs.push(make(
    8,
    s[2].stem,
    s[2].answer,
    termDistractors(profile, [s[2].answer]),
    s[2].rationale ?? "The scenario points to the unit capability described by the correct option.",
  ));

  qs.push(make(
    9,
    profile.chooseThree.stem,
    profile.chooseThree.correct,
    [...profile.chooseThree.distractors, ...common(exclude(profile.chooseThree.correct))],
    profile.chooseThree.rationale,
    6,
  ));

  qs.push(make(
    10,
    `Which description best matches "${c[2].term}"?`,
    c[2].meaning,
    meaningDistractors(profile, [c[2].meaning]),
    `The correct answer paraphrases how the unit explains "${c[2].term}".`,
  ));

  return qs;
}

const profiles = {
  "1-2": {
    title: "Generative AI and agents",
    concepts: [
      { term: "generative AI", meaning: "AI that creates new content such as text, images, code, or video from a prompt" },
      { term: "prompt", meaning: "the natural language input that starts the model's response" },
      { term: "language model", meaning: "the trained model that predicts meaningful language based on patterns learned from large data" },
      { term: "AI agent", meaning: "a generative AI application that can reason, use instructions, and call tools to act" },
    ],
    scenarios: [
      { stem: "A history website lets visitors ask questions and receive original conversational answers. Which AI workload is being used?", answer: "Generative AI chat" },
      { stem: "A local device needs a focused model for a narrow task with lower deployment overhead. Which model type is the better fit?", answer: "A small language model (SLM)" },
      { stem: "An assistant must look up information and send an email after deciding what action is needed. What makes this more than a simple chatbot?", answer: "It is using agent tools to take action" },
    ],
    contrast: {
      stem: "What is the main difference between an LLM and an SLM in this unit?",
      answer: "LLMs are larger and more general; SLMs are smaller and better for focused local scenarios.",
      distractors: ["SLMs are used only for images, while LLMs are used only for speech.", "LLMs cannot understand prompts, while SLMs can.", "SLMs always require more data and cost more to run."],
      rationale: "The unit distinguishes model sizes by scale, generality, cost, and deployment fit.",
    },
    process: {
      stem: "How does a generative AI app begin producing a response?",
      answer: "The user submits a prompt, and the language model uses it to generate a meaningful output.",
      distractors: ["The app waits for a human author to write every reply.", "The model searches only for an exact paragraph to copy.", "The agent ignores instructions and only calls action tools."],
      rationale: "Prompt-driven generation is the basic interaction pattern described in the unit.",
    },
    chooseTwo: {
      stem: "Which two elements are key parts of an AI agent? Choose two.",
      correct: ["Instructions that define the agent's role and behavior", "Tools that let the agent access information or perform actions"],
      distractors: ["A camera feed for every request", "A fixed list of hand-written answers", "A rule that prevents the agent from using context"],
      rationale: "The unit identifies a model, instructions, and tools as core agent elements.",
    },
    chooseThree: {
      stem: "Which three scenarios are common uses of generative AI or agents? Choose three.",
      correct: ["Creating conversational bots", "Drafting new documents or content", "Summarizing complex documents"],
      distractors: ["Replacing all privacy review", "Guaranteeing every answer is factual", "Changing screen brightness automatically"],
      rationale: "The unit lists chatbots, assistants, content creation, translation, and summarization as common scenarios.",
    },
  },
  "1-3": {
    title: "Text and natural language",
    concepts: [
      { term: "natural language processing", meaning: "AI techniques that help software analyze, interpret, and work with human language" },
      { term: "language detection", meaning: "identifying the language or languages used in a document" },
      { term: "sentiment analysis", meaning: "classifying text as positive, negative, or neutral" },
      { term: "PII redaction", meaning: "finding and removing private information such as names, addresses, and phone numbers" },
    ],
    scenarios: [
      { stem: "A company wants to know whether product reviews are positive, negative, or neutral. Which capability should it use?", answer: "Sentiment analysis" },
      { stem: "Before routing documents to language-specific workflows, an app must identify whether each file is written in English, Spanish, or French. What should it use?", answer: "Language detection" },
      { stem: "A team needs to share call transcripts without exposing customer names or phone numbers. Which NLP technique fits?", answer: "PII detection and redaction" },
    ],
    contrast: {
      stem: "How does key-term extraction differ from entity detection?",
      answer: "Key-term extraction finds important phrases; entity detection finds specific things like people, places, and organizations.",
      distractors: ["Key-term extraction translates audio, while entity detection generates images.", "Entity detection is only used for sentiment scores.", "Both techniques only count how many characters are in the text."],
      rationale: "The unit separates important phrases from named entities and specialized PII detection.",
    },
    process: {
      stem: "Why is summarization useful in text analysis?",
      answer: "It reduces long text while preserving the main points.",
      distractors: ["It converts every document into an image.", "It removes the need to classify or review text.", "It detects microphone quality."],
      rationale: "Summarization is described as reducing text volume while keeping the main ideas.",
    },
    chooseTwo: {
      stem: "Which two are common text analysis techniques? Choose two.",
      correct: ["Entity detection", "Key-term extraction"],
      distractors: ["Speech waveform generation", "Object localization", "Image inpainting"],
      rationale: "The unit lists entity detection and key-term extraction as NLP text analysis techniques.",
    },
    chooseThree: {
      stem: "Which three tasks are NLP text analysis scenarios from this unit? Choose three.",
      correct: ["Analyzing meeting transcripts for key subjects", "Evaluating social media sentiment", "Redacting private data before sharing"],
      distractors: ["Detecting objects in photos", "Synthesizing a voice from text", "Deploying a virtual network"],
      rationale: "These are direct application areas for NLP text analysis in the unit.",
    },
  },
  "1-4": {
    title: "Speech",
    concepts: [
      { term: "speech recognition", meaning: "converting spoken audio into text" },
      { term: "speech synthesis", meaning: "converting text into spoken audio" },
      { term: "speech translation", meaning: "recognizing speech in one language and producing translated output" },
      { term: "voice-enabled assistant", meaning: "an app that uses speech input or output to create a conversational experience" },
    ],
    scenarios: [
      { stem: "A meeting app creates written transcripts while people talk. Which capability is required?", answer: "Speech recognition" },
      { stem: "A navigation app reads directions aloud to a driver. Which capability is being used?", answer: "Speech synthesis" },
      { stem: "A traveler speaks English and the app outputs the same message in Japanese. What capability is involved?", answer: "Speech translation" },
    ],
    contrast: {
      stem: "What is the difference between speech recognition and speech synthesis?",
      answer: "Recognition turns audio into text; synthesis turns text into audio.",
      distractors: ["Recognition creates images, while synthesis extracts tables.", "Recognition is only for translation, while synthesis is only for security.", "Both only detect whether text is positive or negative."],
      rationale: "The unit distinguishes speech-to-text from text-to-speech.",
    },
    process: {
      stem: "Why are speech capabilities useful in accessibility scenarios?",
      answer: "They let users interact through spoken input or audio output when text or screens are difficult to use.",
      distractors: ["They remove the need for privacy review.", "They guarantee all translations are legally certified.", "They replace every visual interface with image generation."],
      rationale: "Speech supports more natural and accessible interaction patterns.",
    },
    chooseTwo: {
      stem: "Which two are examples of speech-enabled solutions? Choose two.",
      correct: ["Dictating notes into an app", "Having a system read text aloud"],
      distractors: ["Detecting faces in a photo", "Extracting fields from a form", "Classifying a review as negative"],
      rationale: "Dictation uses recognition, and read-aloud uses synthesis.",
    },
    chooseThree: {
      stem: "Which three concerns matter when designing a speech solution? Choose three.",
      correct: ["Audio quality", "Language support", "Latency for real-time conversations"],
      distractors: ["Image resolution", "Bounding box labels", "Database table indexes only"],
      rationale: "Speech systems depend on audio conditions, supported languages, and response timing.",
    },
  },
  "1-5": {
    title: "Computer vision",
    concepts: [
      { term: "computer vision", meaning: "AI that interprets information in images and video" },
      { term: "image classification", meaning: "assigning a label to an image based on its main content" },
      { term: "object detection", meaning: "finding objects in an image and locating them with regions or boxes" },
      { term: "image generation", meaning: "creating new images from prompts or other inputs" },
    ],
    scenarios: [
      { stem: "An app must identify whether a photo contains a receipt, a license, or a passport. Which task is this?", answer: "Image classification" },
      { stem: "A warehouse camera must count each visible package and mark where each one appears. Which capability is needed?", answer: "Object detection" },
      { stem: "A designer enters a text prompt and receives a new product concept image. Which capability is being used?", answer: "Image generation" },
    ],
    contrast: {
      stem: "How does object detection differ from image classification?",
      answer: "Detection identifies and locates objects; classification assigns an overall label.",
      distractors: ["Detection summarizes text, while classification translates speech.", "Classification always creates new images.", "Both techniques only redact personal information."],
      rationale: "The unit separates whole-image labeling from locating individual objects.",
    },
    process: {
      stem: "Why do computer vision systems process images as numerical data?",
      answer: "Models need pixel values and visual features they can analyze mathematically.",
      distractors: ["Only text data can be used by AI models.", "Numerical data prevents model testing.", "It turns every image into speech output."],
      rationale: "Vision models work with numeric image representations and learned visual features.",
    },
    chooseTwo: {
      stem: "Which two are computer vision tasks? Choose two.",
      correct: ["Detecting objects in images", "Classifying an image by content"],
      distractors: ["Extracting sentiment from a review", "Synthesizing a spoken response", "Choosing an email subject line"],
      rationale: "Both correct answers require interpreting visual input.",
    },
    chooseThree: {
      stem: "Which three capabilities belong to computer vision scenarios? Choose three.",
      correct: ["Image analysis", "Object detection", "Image generation"],
      distractors: ["Speech recognition", "Language detection", "Calendar scheduling"],
      rationale: "The unit frames vision around analyzing, detecting, and generating visual content.",
    },
  },
  "1-6": {
    title: "Information extraction",
    concepts: [
      { term: "information extraction", meaning: "using AI to pull structured information from unstructured or semi-structured content" },
      { term: "OCR", meaning: "recognizing printed or handwritten text in images or scanned documents" },
      { term: "field extraction", meaning: "finding specific values such as dates, totals, names, or invoice numbers" },
      { term: "content understanding", meaning: "analyzing documents, images, audio, or video to extract useful data" },
    ],
    scenarios: [
      { stem: "A finance team wants invoice numbers, vendor names, and totals from scanned invoices. Which workload applies?", answer: "Information extraction from documents" },
      { stem: "A system must read text from photos of signs before analysis. Which capability is needed first?", answer: "OCR" },
      { stem: "A business wants structured values from forms that have different layouts. Which capability should it choose?", answer: "Field extraction" },
    ],
    contrast: {
      stem: "How is OCR different from field extraction?",
      answer: "OCR reads text from visual content; field extraction identifies specific values and maps them to fields.",
      distractors: ["OCR generates voices, while field extraction detects sentiment.", "Field extraction only creates images.", "Both are only used for chat prompts."],
      rationale: "The unit separates recognizing text from identifying meaningful structured values.",
    },
    process: {
      stem: "Why is information extraction useful for business workflows?",
      answer: "It turns content such as forms or documents into structured data that applications can use.",
      distractors: ["It makes all data private automatically.", "It replaces the need to define what fields matter.", "It only changes the color of scanned pages."],
      rationale: "The value is moving from raw content to usable structured information.",
    },
    chooseTwo: {
      stem: "Which two are examples of extracted fields? Choose two.",
      correct: ["Invoice total", "Customer address"],
      distractors: ["Monitor refresh rate", "Voice pitch only", "Image background color preference"],
      rationale: "Totals and addresses are structured values that can be extracted from documents.",
    },
    chooseThree: {
      stem: "Which three content types can information extraction apply to in this course? Choose three.",
      correct: ["Documents", "Images", "Audio or video"],
      distractors: ["Network firewall rules only", "Form layout metadata only", "Display settings rather than extracted content"],
      rationale: "The unit frames extraction across documents and broader multimodal content.",
    },
  },
  "1-7": {
    title: "Responsible AI",
    concepts: [
      { term: "fairness", meaning: "designing AI systems to avoid unfair treatment of people or groups" },
      { term: "reliability and safety", meaning: "ensuring AI behaves dependably and does not create unreasonable harm" },
      { term: "privacy and security", meaning: "protecting data and controlling access throughout the AI solution" },
      { term: "accountability", meaning: "making people responsible for AI decisions, oversight, and governance" },
    ],
    scenarios: [
      { stem: "A loan-screening AI performs worse for one demographic group than another. Which responsible AI principle is most relevant?", answer: "Fairness" },
      { stem: "A healthcare assistant must avoid unsafe recommendations and be tested before use. Which principle is central?", answer: "Reliability and safety" },
      { stem: "A company needs clear owners for monitoring and responding to AI issues. Which principle applies?", answer: "Accountability" },
    ],
    contrast: {
      stem: "How do transparency and accountability work together?",
      answer: "Transparency explains how the system works; accountability assigns responsibility for its use and outcomes.",
      distractors: ["Transparency hides model behavior, while accountability removes human review.", "Both mean the model is always correct.", "Accountability only applies to image generation."],
      rationale: "Responsible AI includes both understandable systems and human governance.",
    },
    process: {
      stem: "Why should privacy and security be considered early in an AI solution?",
      answer: "AI systems may process sensitive data that must be protected by design.",
      distractors: ["Privacy only matters after deployment.", "Security is unrelated to AI workloads.", "Sensitive data improves every model automatically."],
      rationale: "The unit includes privacy and security as core responsible AI considerations.",
    },
    chooseTwo: {
      stem: "Which two practices support responsible AI? Choose two.",
      correct: ["Testing for harmful or biased outcomes", "Keeping humans accountable for AI use"],
      distractors: ["Ignoring user impact after launch", "Using hidden data without permission", "Assuming larger models are automatically fair"],
      rationale: "Responsible AI requires evaluation, oversight, and governance.",
    },
    chooseThree: {
      stem: "Which three are responsible AI principles covered by the course? Choose three.",
      correct: ["Fairness", "Transparency", "Inclusiveness"],
      distractors: ["Maximum token count", "Image resolution", "Database normalization"],
      rationale: "Fairness, transparency, and inclusiveness are part of the responsible AI principles.",
    },
  },
};

Object.assign(profiles, {
  "2-2": {
    title: "Large language models (LLMs)",
    concepts: [
      { term: "large language model", meaning: "a model trained on large text collections to predict and generate language" },
      { term: "token", meaning: "a chunk of text the model processes, such as a word part or symbol" },
      { term: "transformer architecture", meaning: "a neural network design that uses attention to learn relationships in language" },
      { term: "completion", meaning: "the generated continuation or response the model produces from input" },
    ],
    scenarios: [
      { stem: "A developer needs a model to draft an answer from a natural language prompt. Which model type is most relevant?", answer: "A large language model" },
      { stem: "A learner asks why an LLM can generate a likely next phrase. What concept explains this behavior?", answer: "It predicts language patterns learned during training" },
      { stem: "A prompt is broken into smaller pieces before model processing. What are those pieces called?", answer: "Tokens" },
    ],
    contrast: {
      stem: "What distinguishes model training from inference?",
      answer: "Training learns patterns from data; inference uses the trained model to generate output.",
      distractors: ["Training only formats UI controls, while inference scans paper forms.", "Inference changes all model weights for every user request.", "Training is only used for text-to-speech voices."],
      rationale: "The unit explains that trained models are later used to respond to prompts.",
    },
    process: {
      stem: "Why does model size matter when selecting an LLM?",
      answer: "Larger models may handle broader tasks but can require more cost and resources.",
      distractors: ["Model size determines only the color of the portal icon.", "Smaller models always outperform larger models on every task.", "Size is unrelated to cost or deployment choices."],
      rationale: "AI-901 expects learners to reason about capability and deployment tradeoffs.",
    },
    chooseTwo: {
      stem: "Which two statements describe LLM behavior? Choose two.",
      correct: ["They generate text based on learned language patterns", "They use prompts as input for responses"],
      distractors: ["They require a camera for every request", "They only work with handwritten forms", "They guarantee factual answers without grounding"],
      rationale: "LLMs are prompt-driven language generators, but they still need responsible use and validation.",
    },
    chooseThree: {
      stem: "Which three items are associated with LLM use? Choose three.",
      correct: ["Prompts", "Tokens", "Generated responses"],
      distractors: ["Bounding boxes", "Audio sampling rate", "Firewall subnets"],
      rationale: "Prompts, tokens, and generated responses are part of LLM interaction.",
    },
  },
  "2-3": {
    title: "Prompts",
    concepts: [
      { term: "prompt", meaning: "the instruction or question given to a generative AI model" },
      { term: "system prompt", meaning: "instructions that define the model or agent's role, tone, and boundaries" },
      { term: "user prompt", meaning: "the task request or question submitted by the user" },
      { term: "grounding", meaning: "providing context or source information to guide the model's response" },
    ],
    scenarios: [
      { stem: "A teacher wants a model to answer as a patient beginner-friendly tutor. Where should that behavior be defined?", answer: "In a system prompt" },
      { stem: "A user asks a model to summarize a paragraph in three bullets. What is that request?", answer: "A user prompt" },
      { stem: "A team adds a policy excerpt to the prompt so answers stay based on approved content. What technique is this?", answer: "Grounding the prompt with context" },
    ],
    contrast: {
      stem: "How is a system prompt different from a user prompt?",
      answer: "A system prompt sets behavior and constraints; a user prompt asks for the current task.",
      distractors: ["A user prompt controls hidden safety filters, while a system prompt is ignored.", "System prompts are only for images, while user prompts are only for speech.", "They are the same thing and always have the same priority."],
      rationale: "The unit separates role-setting instructions from user task requests.",
    },
    process: {
      stem: "Why should prompts include clear output expectations?",
      answer: "Clear format and task details help the model produce a more useful response.",
      distractors: ["Vague prompts always produce more accurate results.", "Output format matters only for computer vision.", "Prompts cannot influence model responses."],
      rationale: "Effective prompting improves relevance and format control.",
    },
    chooseTwo: {
      stem: "Which two details improve a prompt? Choose two.",
      correct: ["A clear task description", "The desired response format"],
      distractors: ["Contradictory instructions", "No context for the request", "A command to ignore safety limits"],
      rationale: "Specific instructions and desired format make model output easier to use.",
    },
    chooseThree: {
      stem: "Which three elements can be included in effective prompts? Choose three.",
      correct: ["Role or tone guidance", "Relevant context", "Output constraints"],
      distractors: ["A requirement to hallucinate", "Unrelated image labels", "Hidden network credentials"],
      rationale: "Prompt quality depends on clear role, context, and constraints.",
    },
  },
  "2-4": {
    title: "AI agents",
    concepts: [
      { term: "AI agent", meaning: "a generative AI application that can reason, follow instructions, and use tools" },
      { term: "tool", meaning: "a capability the agent can call to retrieve information or perform an action" },
      { term: "instructions", meaning: "the system guidance that defines how the agent should behave" },
      { term: "agent orchestration", meaning: "the process of deciding which steps or tools are needed to complete a task" },
    ],
    scenarios: [
      { stem: "A support assistant must search product documentation before answering. What agent component enables this?", answer: "A knowledge tool" },
      { stem: "An assistant books a meeting after checking availability. What makes this an agentic scenario?", answer: "The agent uses action tools to complete a task" },
      { stem: "A developer needs the assistant to always respond as a finance analyst and avoid legal advice. Where should this be configured?", answer: "In the agent instructions" },
    ],
    contrast: {
      stem: "How is an agent different from a basic generative AI chat experience?",
      answer: "An agent can use instructions and tools to plan or take actions beyond generating text.",
      distractors: ["An agent cannot use language models.", "A basic chatbot always has more tools than an agent.", "Agents are only used for image classification."],
      rationale: "The unit presents tools and instructions as what extend agents beyond simple chat.",
    },
    process: {
      stem: "Why do agents need tools?",
      answer: "Tools let the agent access current information or perform actions outside the model itself.",
      distractors: ["Tools prevent the agent from using instructions.", "Tools are only decorative labels.", "Tools replace all need for user consent."],
      rationale: "Tools connect the agent to data sources and external actions.",
    },
    chooseTwo: {
      stem: "Which two are examples of agent tools? Choose two.",
      correct: ["Searching a database", "Updating a calendar"],
      distractors: ["Changing the learner's exam score manually", "Ignoring all context", "Turning every prompt into an image"],
      rationale: "Knowledge tools retrieve information; action tools do work in external systems.",
    },
    chooseThree: {
      stem: "Which three elements are typically part of an AI agent? Choose three.",
      correct: ["A language model", "Instructions", "Tools"],
      distractors: ["A required video camera", "A spreadsheet file for every prompt", "A ban on contextual data"],
      rationale: "The unit identifies model, instructions, and tools as the core agent structure.",
    },
  },
  "3-2": {
    title: "Tokenization",
    concepts: [
      { term: "tokenization", meaning: "breaking text into smaller units that can be processed by language systems" },
      { term: "token", meaning: "a word, word part, punctuation mark, or other text unit used for analysis" },
      { term: "normalization", meaning: "standardizing text so equivalent words or forms can be analyzed consistently" },
      { term: "stop words", meaning: "very common words that may be removed when they add little analytical value" },
    ],
    scenarios: [
      { stem: "An NLP pipeline splits a sentence into words and punctuation before analysis. Which step is this?", answer: "Tokenization" },
      { stem: "A text analysis workflow treats 'Run,' 'run,' and 'running' more consistently. Which idea is involved?", answer: "Text normalization" },
      { stem: "A search index removes words such as 'the' and 'and' to focus on meaningful terms. What are those words called?", answer: "Stop words" },
    ],
    contrast: {
      stem: "How does tokenization differ from semantic understanding?",
      answer: "Tokenization prepares text units; semantic understanding interprets meaning and relationships.",
      distractors: ["Tokenization creates audio output, while semantics scans images.", "They are identical names for object detection.", "Semantic understanding only counts punctuation."],
      rationale: "Tokenization is an early preparation step, while semantic models deal with meaning.",
    },
    process: {
      stem: "Why is tokenization important before statistical text analysis?",
      answer: "It creates the units that can be counted, compared, or modeled.",
      distractors: ["It guarantees sentiment is always positive.", "It replaces the need for language models.", "It converts text into a camera image."],
      rationale: "Statistical NLP techniques depend on well-defined tokens.",
    },
    chooseTwo: {
      stem: "Which two actions can be part of preparing text for NLP analysis? Choose two.",
      correct: ["Splitting text into tokens", "Normalizing words or casing"],
      distractors: ["Generating a synthetic voice", "Detecting objects in an image", "Deploying a model endpoint"],
      rationale: "Tokenization and normalization prepare text for analysis.",
    },
    chooseThree: {
      stem: "Which three items can affect token-based text analysis? Choose three.",
      correct: ["Punctuation", "Word casing", "Common stop words"],
      distractors: ["Camera lens size", "Speaker volume", "Image bounding boxes"],
      rationale: "These text features affect how tokens are prepared and analyzed.",
    },
  },
  "3-3": {
    title: "Statistical text analysis",
    concepts: [
      { term: "frequency analysis", meaning: "counting token occurrences to infer common topics or themes" },
      { term: "TF-IDF", meaning: "scoring terms higher when they are frequent in one document but uncommon across many documents" },
      { term: "bag-of-words", meaning: "representing text by word counts or occurrences without preserving grammar or word order" },
      { term: "TextRank", meaning: "ranking words or sentences by graph relationships to identify important content" },
    ],
    scenarios: [
      { stem: "A team wants to identify the most common terms in one support article. Which technique fits best?", answer: "Frequency analysis" },
      { stem: "A search system should highlight terms that are distinctive to one document, not common everywhere. What should it use?", answer: "TF-IDF scoring" },
      { stem: "A classifier represents each email as word occurrence features to detect spam. Which approach is being used?", answer: "Bag-of-words features" },
    ],
    contrast: {
      stem: "Why can simple frequency analysis be weaker than TF-IDF across many documents?",
      answer: "Frequency alone can overvalue common words; TF-IDF highlights terms that are distinctive in a collection.",
      distractors: ["TF-IDF only works for speech audio.", "Frequency analysis creates images while TF-IDF creates video.", "Both ignore how often words appear."],
      rationale: "The unit contrasts raw counts with term importance across a corpus.",
    },
    process: {
      stem: "What is the purpose of a bag-of-words representation?",
      answer: "To turn text into numeric word features that a model can use.",
      distractors: ["To preserve exact sentence grammar for voice synthesis.", "To locate objects inside an image.", "To remove all tokens before analysis."],
      rationale: "Bag-of-words is a feature extraction technique for text.",
    },
    chooseTwo: {
      stem: "Which two techniques are statistical text analysis methods? Choose two.",
      correct: ["TF-IDF", "TextRank"],
      distractors: ["Speech synthesis", "Object detection", "Face cropping"],
      rationale: "TF-IDF and TextRank are statistical approaches discussed in the unit.",
    },
    chooseThree: {
      stem: "Which three ideas belong to statistical text analysis? Choose three.",
      correct: ["Counting token frequency", "Comparing term importance across documents", "Representing text as word features"],
      distractors: ["Sampling microphone input", "Generating image pixels", "Mapping invoice fields"],
      rationale: "These are core statistical methods for analyzing text.",
    },
  },
  "3-4": {
    title: "Semantic language models",
    concepts: [
      { term: "semantic language model", meaning: "a model that represents meaning and relationships in language, not just word counts" },
      { term: "embedding", meaning: "a numeric representation that captures semantic meaning for text or tokens" },
      { term: "semantic similarity", meaning: "measuring how close pieces of text are in meaning" },
      { term: "transformer model", meaning: "a model architecture that uses attention to understand context across text" },
    ],
    scenarios: [
      { stem: "A search feature should return articles that mean the same thing as the query even when the words differ. What should it use?", answer: "Semantic similarity with embeddings" },
      { stem: "A model needs to represent sentences as vectors so related meanings are close together. What is being created?", answer: "Embeddings" },
      { stem: "A language model weighs relationships between words across a sentence to understand context. Which architecture supports this?", answer: "A transformer model" },
    ],
    contrast: {
      stem: "How do semantic models improve on simple word-count techniques?",
      answer: "They capture meaning and context instead of relying only on token frequency.",
      distractors: ["They ignore all relationships between words.", "They work only with scanned images.", "They remove the need for prompts and data."],
      rationale: "The unit contrasts semantic understanding with statistical token counts.",
    },
    process: {
      stem: "Why are embeddings useful for semantic search?",
      answer: "They let systems compare the meaning of queries and documents numerically.",
      distractors: ["They convert text into spoken audio.", "They always store the original document as an image.", "They replace all security controls."],
      rationale: "Embeddings support similarity comparisons in vector space.",
    },
    chooseTwo: {
      stem: "Which two tasks benefit from semantic language models? Choose two.",
      correct: ["Finding text with similar meaning", "Understanding context in a sentence"],
      distractors: ["Detecting faces in a photo", "Measuring microphone distance", "Cropping a receipt image"],
      rationale: "Semantic models are used for meaning and context in language.",
    },
    chooseThree: {
      stem: "Which three concepts are tied to semantic language modeling? Choose three.",
      correct: ["Embeddings", "Context", "Semantic similarity"],
      distractors: ["Image filters", "Audio waveform capture", "Invoice table totals only"],
      rationale: "These concepts are central to representing and comparing meaning.",
    },
  },
});

function writeBank(unit, profile) {
  const moduleName = unit.moduleName;
  const questions = generatedQuestions(profile);
  const filePath = path.join(root, `Module${unit.moduleNumber}`, `unit${unit.unitNumber}_question_bank.md`);
  const output = `# Module ${unit.moduleNumber}: ${moduleName}

## Unit ${unit.unitNumber} Question Bank: ${unit.title}

These questions are authored from the unit's Microsoft Learn concepts and rewritten as exam-style practice items. Answer choices are intentionally paraphrased instead of copied from the lesson text.

---

${questions.join("\n---\n\n")}
`;
  fs.writeFileSync(filePath, output, "utf8");
}

Object.assign(profiles, {
  "12-2": {
    title: "Plan a responsible generative AI solution",
    concepts: [
      { term: "responsible AI planning", meaning: "identifying intended use, users, risks, and controls before building" },
      { term: "intended use", meaning: "the approved purpose and context for the AI solution" },
      { term: "stakeholders", meaning: "people affected by or responsible for the AI system" },
      { term: "risk mitigation", meaning: "planned controls that reduce possible harms from the solution" },
    ],
    scenarios: [
      { stem: "A team defines who will use an AI assistant and what tasks it should not handle. What planning concept is this?", answer: "Intended use and scope" },
      { stem: "A product owner, legal reviewer, developer, and support lead all review potential AI impacts. What group are they part of?", answer: "Stakeholders" },
      { stem: "A team decides to require human review for high-impact outputs before deployment. What kind of planning is this?", answer: "Risk mitigation" },
    ],
    contrast: {
      stem: "Why should responsible AI planning happen before implementation?",
      answer: "Early planning helps identify risks, users, constraints, and controls before design choices are locked in.",
      distractors: ["Planning only matters after users report harm.", "Planning replaces all testing.", "Planning is unrelated to generative AI."],
      rationale: "The unit frames responsibility as part of solution planning.",
    },
    process: {
      stem: "What should a team clarify when defining intended use?",
      answer: "What the solution is for, who will use it, and where it should not be used.",
      distractors: ["Only the response wording, without defining allowed use.", "A deployment setting that does not address user impact.", "A rule that no stakeholder can review it."],
      rationale: "Intended use sets boundaries for responsible design.",
    },
    chooseTwo: {
      stem: "Which two activities belong in responsible AI planning? Choose two.",
      correct: ["Identify affected users", "Define acceptable use boundaries"],
      distractors: ["Ignore potential harms", "Remove all human ownership", "Publish secrets in prompts"],
      rationale: "Planning includes user impact and use boundaries.",
    },
    chooseThree: {
      stem: "Which three items should be considered when planning a responsible solution? Choose three.",
      correct: ["Intended users", "Possible harms", "Mitigation controls"],
      distractors: ["Random model names", "Monitor resolution", "Unrelated file colors"],
      rationale: "Responsible planning connects users, risks, and controls.",
    },
  },
  "12-3": {
    title: "Map potential harms",
    concepts: [
      { term: "harm mapping", meaning: "identifying ways an AI solution could negatively affect people or organizations" },
      { term: "stakeholder impact", meaning: "how different groups may be helped or harmed by the solution" },
      { term: "misuse", meaning: "using the system in a way that was not intended and may cause harm" },
      { term: "harm category", meaning: "a grouped type of risk such as safety, fairness, privacy, or misinformation" },
    ],
    scenarios: [
      { stem: "A team lists how an AI tutor could mislead students, exclude learners, or expose data. What activity is this?", answer: "Mapping potential harms" },
      { stem: "A team considers how different user groups could be affected by an AI assistant. Which concept applies?", answer: "Stakeholder impact" },
      { stem: "Users might ask a model to generate prohibited advice outside the approved purpose. What risk is this?", answer: "Misuse" },
    ],
    contrast: {
      stem: "How is mapping harms different from mitigating harms?",
      answer: "Mapping identifies possible harms; mitigation applies controls to reduce them.",
      distractors: ["Mapping deploys the model endpoint.", "Mitigation only writes documentation.", "They are the same step and require no review."],
      rationale: "The responsible AI process separates identifying risks from reducing them.",
    },
    process: {
      stem: "Why should harm mapping include multiple stakeholders?",
      answer: "Different people may see different risks, impacts, and misuse paths.",
      distractors: ["Only developers can identify user impact.", "Stakeholder input prevents all testing.", "Harms are identical for every group."],
      rationale: "Broader review improves risk identification.",
    },
    chooseTwo: {
      stem: "Which two questions help map potential harms? Choose two.",
      correct: ["Who could be affected by the system?", "How could the system be misused?"],
      distractors: ["What color is the portal header?", "Can we skip monitoring?", "How can we hide limitations?"],
      rationale: "Harm mapping looks at affected groups and misuse.",
    },
    chooseThree: {
      stem: "Which three harm areas should teams consider? Choose three.",
      correct: ["Fairness", "Privacy", "Safety"],
      distractors: ["Portal navigation setting", "Window position", "File extension style only"],
      rationale: "Responsible AI harm mapping includes fairness, privacy, safety, and related risks.",
    },
  },
  "12-4": {
    title: "Measure potential harms",
    concepts: [
      { term: "harm measurement", meaning: "testing and evaluating how often or severely potential harms appear" },
      { term: "baseline", meaning: "an initial measurement used for comparison after changes" },
      { term: "test dataset", meaning: "examples used to evaluate risky or unwanted model behavior" },
      { term: "evaluation metric", meaning: "a defined measure for judging harm, quality, or safety" },
    ],
    scenarios: [
      { stem: "A team runs risky prompts against a model and records how often unsafe answers appear. What are they doing?", answer: "Measuring potential harms" },
      { stem: "Before adding safeguards, a team records the current unsafe-response rate. What is that first measurement?", answer: "Baseline" },
      { stem: "A set of example prompts is used to test for harmful content. What is it?", answer: "Test dataset" },
    ],
    contrast: {
      stem: "Why is measurement needed after mapping harms?",
      answer: "Measurement shows how often or severely identified risks occur so improvements can be compared.",
      distractors: ["Mapping harms automatically fixes them.", "Measurement is only for billing.", "Measurement prevents the use of test data."],
      rationale: "The unit moves from identifying harms to quantifying them.",
    },
    process: {
      stem: "Why define evaluation metrics before comparing mitigations?",
      answer: "Metrics create a consistent way to judge whether risk has been reduced.",
      distractors: ["Metrics should change randomly during testing.", "Metrics only affect UI colors.", "Mitigations cannot be compared."],
      rationale: "Consistent measurement supports responsible iteration.",
    },
    chooseTwo: {
      stem: "Which two items support harm measurement? Choose two.",
      correct: ["Baseline results", "Evaluation metrics"],
      distractors: ["Unrelated interface preference", "Hidden credentials in prompts", "Ignoring test failures"],
      rationale: "A baseline and metrics allow teams to compare risk before and after changes.",
    },
    chooseThree: {
      stem: "Which three practices belong in measuring potential harms? Choose three.",
      correct: ["Use representative test prompts", "Record harmful output rates", "Compare results over time"],
      distractors: ["Delete failed tests", "Assume no harm is possible", "Avoid stakeholder review"],
      rationale: "Measurement requires examples, results, and comparison.",
    },
  },
  "12-5": {
    title: "Mitigate potential harms",
    concepts: [
      { term: "mitigation", meaning: "applying controls that reduce identified AI risks" },
      { term: "model layer", meaning: "choosing or adapting the model to better fit the intended use" },
      { term: "safety system layer", meaning: "platform controls such as filters and safeguards that reduce harmful outputs" },
      { term: "user experience layer", meaning: "interface choices, disclosures, and human review that guide safe use" },
    ],
    scenarios: [
      { stem: "A team adds content filters after measuring harmful responses. What are they doing?", answer: "Applying mitigation controls" },
      { stem: "A solution uses a smaller task-specific model instead of a broad model to reduce irrelevant outputs. Which layer is involved?", answer: "Model layer" },
      { stem: "An app warns users that AI output should be reviewed before use. Which mitigation layer is involved?", answer: "User experience layer" },
    ],
    contrast: {
      stem: "How is mitigation different from measurement?",
      answer: "Measurement evaluates harm; mitigation changes the solution to reduce harm.",
      distractors: ["Mitigation only counts test cases.", "Measurement applies content filters.", "Both steps mean skipping retesting."],
      rationale: "The responsible AI workflow measures risk and then applies controls.",
    },
    process: {
      stem: "Why should a solution be retested after mitigation?",
      answer: "Retesting verifies whether the controls actually reduced the measured harm.",
      distractors: ["Retesting removes all need for controls.", "Mitigations always work perfectly the first time.", "Retesting is only for image classification."],
      rationale: "The unit describes mitigation as iterative with measurement.",
    },
    chooseTwo: {
      stem: "Which two are mitigation examples? Choose two.",
      correct: ["Apply content filters", "Add grounding with trusted data"],
      distractors: ["Ignore unsafe outputs", "Remove all user guidance", "Disable testing logs"],
      rationale: "Safety filters and grounding are concrete harm-reduction controls.",
    },
    chooseThree: {
      stem: "Which three layers can include harm mitigations? Choose three.",
      correct: ["Model layer", "Safety system layer", "User experience layer"],
      distractors: ["Deployment management layer", "Project organization layer", "Monitoring dashboard layer"],
      rationale: "The unit describes layered mitigations across the model, safety systems, prompts/grounding, and user experience.",
    },
  },
  "12-6": {
    title: "Manage a responsible generative AI solution",
    concepts: [
      { term: "responsible operations", meaning: "monitoring and governing an AI solution after deployment" },
      { term: "monitoring", meaning: "tracking solution behavior, quality, and risk signals over time" },
      { term: "incident response", meaning: "the process for handling harmful or unexpected AI behavior" },
      { term: "continuous improvement", meaning: "updating controls and practices as risks, usage, and requirements change" },
    ],
    scenarios: [
      { stem: "After release, a team reviews logs and user feedback for unsafe model behavior. What activity is this?", answer: "Monitoring" },
      { stem: "A harmful output is reported and the team follows a defined escalation plan. What process is being used?", answer: "Incident response" },
      { stem: "A team updates prompts and filters as new risk patterns appear. What operating practice is this?", answer: "Continuous improvement" },
    ],
    contrast: {
      stem: "Why does responsible AI continue after deployment?",
      answer: "Real use can reveal new risks, quality issues, and needed changes.",
      distractors: ["Deployment proves the model is permanently safe.", "Monitoring is only for billing totals.", "Responsible AI ends when the model endpoint is created."],
      rationale: "The unit treats responsible management as ongoing.",
    },
    process: {
      stem: "What should a team do when monitoring reveals a new harmful pattern?",
      answer: "Investigate, apply appropriate mitigations, and verify the change.",
      distractors: ["Ignore the pattern until the next course update.", "Delete all feedback.", "Disable user communication."],
      rationale: "Responsible operation requires responding to issues.",
    },
    chooseTwo: {
      stem: "Which two activities belong to responsible solution management? Choose two.",
      correct: ["Review user feedback", "Update safeguards when risks change"],
      distractors: ["Stop monitoring after launch", "Hide known issues", "Remove accountability"],
      rationale: "Ongoing management includes feedback and control updates.",
    },
    chooseThree: {
      stem: "Which three practices support responsible AI operations? Choose three.",
      correct: ["Monitor outputs", "Respond to incidents", "Improve controls over time"],
      distractors: ["Assume no misuse can happen", "Avoid logs and review", "Bypass privacy requirements"],
      rationale: "Responsible operation is a lifecycle practice.",
    },
  },
});

Object.assign(profiles, {
  "10-2": {
    title: "What are tools?",
    concepts: [
      { term: "tool", meaning: "an external capability a model can use to retrieve information or perform a task" },
      { term: "tool call", meaning: "the model's request to use a configured tool during a response" },
      { term: "knowledge tool", meaning: "a tool that retrieves information from sources such as search or files" },
      { term: "action tool", meaning: "a tool that performs an operation such as calling a function or updating a system" },
    ],
    scenarios: [
      { stem: "A model needs current information that was not in its training data. What should the app provide?", answer: "A knowledge tool" },
      { stem: "A model decides to call a configured function to get order status. What is this interaction?", answer: "A tool call" },
      { stem: "An assistant creates a ticket in another system after confirming details. What kind of tool is being used?", answer: "An action tool" },
    ],
    contrast: {
      stem: "Why are tools useful with generative AI models?",
      answer: "They let models use external information or actions instead of relying only on generated text.",
      distractors: ["Tools stop models from using prompts.", "Tools are only visual icons in the portal.", "Tools remove all need for validation."],
      rationale: "The unit introduces tools as model extensions.",
    },
    process: {
      stem: "What should a developer define when exposing a function as a tool?",
      answer: "Clear tool purpose, input parameters, and expected output.",
      distractors: ["Only the button color.", "A random endpoint with no schema.", "A ban on all model instructions."],
      rationale: "Tools need clear definitions so the model can use them correctly.",
    },
    chooseTwo: {
      stem: "Which two are examples of tool use? Choose two.",
      correct: ["Searching external information", "Calling a function to complete a task"],
      distractors: ["Ignoring user intent", "Guessing data without sources", "Changing screen brightness only"],
      rationale: "Tools support information retrieval and actions.",
    },
    chooseThree: {
      stem: "Which three tool-related concepts should learners recognize? Choose three.",
      correct: ["Tool definition", "Tool call", "Tool result"],
      distractors: ["Image resolution only", "Phoneme cadence", "Keyboard shortcut"],
      rationale: "Tool workflows involve defining tools, calling them, and using returned results.",
    },
  },
  "10-3": {
    title: "Use the code_interpreter tool",
    concepts: [
      { term: "code_interpreter", meaning: "a tool that lets the model write and run Python code in a sandbox" },
      { term: "sandboxed execution", meaning: "running generated code in an isolated environment" },
      { term: "file handling", meaning: "uploading, processing, or producing files during code-based work" },
      { term: "data analysis", meaning: "using code to calculate, transform, or analyze data" },
    ],
    scenarios: [
      { stem: "A user asks a model to calculate statistics from a CSV file and return a chart. Which tool is most appropriate?", answer: "code_interpreter" },
      { stem: "The model writes Python to solve a math task and checks the result. What capability is being used?", answer: "Dynamic code execution" },
      { stem: "A model processes an uploaded JSON file and returns a transformed file. Which capability matters?", answer: "File handling" },
    ],
    contrast: {
      stem: "How does code_interpreter improve answers for calculations?",
      answer: "The model can run code and use actual computed results instead of only reasoning in text.",
      distractors: ["It prevents the model from using Python.", "It only searches the web.", "It is used only for speech synthesis."],
      rationale: "The unit frames code execution as a way to perform real computation.",
    },
    process: {
      stem: "Why should prompts for code_interpreter describe the data and desired output clearly?",
      answer: "Clear instructions help the model write the right code and return the expected result.",
      distractors: ["The tool ignores all prompts.", "Vague data descriptions always improve code.", "Output format cannot be influenced."],
      rationale: "The unit includes best practices for specific instructions.",
    },
    chooseTwo: {
      stem: "Which two tasks fit code_interpreter? Choose two.",
      correct: ["Analyze a spreadsheet", "Run Python calculations"],
      distractors: ["Fetch current web news", "Search a private document index", "Synthesize speech audio"],
      rationale: "code_interpreter is for Python execution, data analysis, and file processing.",
    },
    chooseThree: {
      stem: "Which three capabilities are associated with code_interpreter? Choose three.",
      correct: ["Dynamic Python execution", "Data transformation", "File processing"],
      distractors: ["Live web search", "Document retrieval only", "Voice generation"],
      rationale: "The unit focuses on Python runtime capabilities.",
    },
  },
  "10-4": {
    title: "Use the web_search tool",
    concepts: [
      { term: "web_search", meaning: "a tool for retrieving current information from the web" },
      { term: "fresh information", meaning: "information that may have changed after a model was trained" },
      { term: "source grounding", meaning: "using retrieved sources to support generated answers" },
      { term: "search query", meaning: "the question or keywords sent to the search tool" },
    ],
    scenarios: [
      { stem: "A user asks for the latest product release date. Which tool should the model use?", answer: "web_search" },
      { stem: "A model needs information that may have changed this week. What is the main reason to use web search?", answer: "To retrieve fresh information" },
      { stem: "An answer should cite or reflect retrieved web pages instead of relying only on memory. What practice is this?", answer: "Grounding with web sources" },
    ],
    contrast: {
      stem: "When is web_search a better fit than file_search?",
      answer: "Use web_search for public current web information; use file_search for indexed private files.",
      distractors: ["web_search is only for Python code.", "file_search is used for live news.", "Both tools ignore retrieved content."],
      rationale: "The unit distinguishes web retrieval from file-based retrieval.",
    },
    process: {
      stem: "Why should a model form a clear search query?",
      answer: "A focused query helps retrieve relevant information for the user's request.",
      distractors: ["Search tools work best with empty queries.", "Queries only affect image generation.", "Clear queries prevent source use."],
      rationale: "Search quality depends on the query and retrieved sources.",
    },
    chooseTwo: {
      stem: "Which two requests are good candidates for web_search? Choose two.",
      correct: ["Find current documentation details", "Check recent public information"],
      distractors: ["Analyze an uploaded CSV with Python", "Search a private file index", "Convert text to speech"],
      rationale: "web_search is for current public web retrieval.",
    },
    chooseThree: {
      stem: "Which three practices support useful web_search answers? Choose three.",
      correct: ["Search for current information", "Use relevant retrieved sources", "Answer the user's specific question"],
      distractors: ["Invent unsupported facts", "Ignore source freshness", "Use unrelated private files"],
      rationale: "Good web-search responses are focused, current, and grounded.",
    },
  },
  "10-5": {
    title: "Use the file_search tool",
    concepts: [
      { term: "file_search", meaning: "a tool for retrieving relevant content from uploaded or indexed files" },
      { term: "vector store", meaning: "an index that supports semantic retrieval over file content" },
      { term: "retrieval", meaning: "finding relevant passages or documents for a model request" },
      { term: "grounded answer", meaning: "a response based on retrieved file content" },
    ],
    scenarios: [
      { stem: "An assistant must answer questions from a company's uploaded policy PDFs. Which tool should it use?", answer: "file_search" },
      { stem: "A developer indexes documents so the model can retrieve relevant passages later. What is being prepared?", answer: "A vector store or searchable file index" },
      { stem: "A model answers using specific content found in uploaded files. What kind of answer is this?", answer: "A grounded answer" },
    ],
    contrast: {
      stem: "How is file_search different from web_search?",
      answer: "file_search retrieves from provided files; web_search retrieves from the public web.",
      distractors: ["file_search only runs Python.", "web_search only searches uploaded PDFs.", "Both tools create audio output."],
      rationale: "The unit distinguishes retrieval sources.",
    },
    process: {
      stem: "Why are files indexed before retrieval?",
      answer: "Indexing makes file content searchable for relevant passages.",
      distractors: ["Indexing deletes all document text.", "Indexing is only for speech audio.", "Indexing removes the need for prompts."],
      rationale: "file_search depends on searchable file content.",
    },
    chooseTwo: {
      stem: "Which two tasks fit file_search? Choose two.",
      correct: ["Answer questions from uploaded documents", "Retrieve relevant passages from indexed files"],
      distractors: ["Get breaking public news", "Run Python calculations", "Generate a voice waveform"],
      rationale: "file_search is a retrieval tool for provided files.",
    },
    chooseThree: {
      stem: "Which three concepts belong to file_search? Choose three.",
      correct: ["Uploaded files", "Vector store", "Relevant passages"],
      distractors: ["Live web headlines", "Audio phonemes", "Image style prompts"],
      rationale: "The unit centers on file indexing and retrieval.",
    },
  },
  "10-6": {
    title: "Use the function tool",
    concepts: [
      { term: "function tool", meaning: "a tool definition that lets a model request application-defined code or operations" },
      { term: "function schema", meaning: "the name, description, and parameters that tell the model how to call a function" },
      { term: "function arguments", meaning: "structured values the model provides when requesting a function call" },
      { term: "function result", meaning: "the data returned by application code after the function runs" },
    ],
    scenarios: [
      { stem: "A model needs to check order status by calling application code. Which tool type fits?", answer: "Function tool" },
      { stem: "A developer defines required parameters such as orderId and customerEmail. What is being defined?", answer: "Function schema" },
      { stem: "The model supplies orderId: 12345 when requesting a tool call. What are these values?", answer: "Function arguments" },
    ],
    contrast: {
      stem: "How is a function tool different from code_interpreter?",
      answer: "A function tool calls developer-defined app logic; code_interpreter runs model-generated Python in a sandbox.",
      distractors: ["Function tools only retrieve web pages.", "code_interpreter requires developer-defined business functions.", "Both tools are only for OCR."],
      rationale: "The unit separates app-defined function calls from sandboxed Python execution.",
    },
    process: {
      stem: "Why should function schemas be clear?",
      answer: "The model needs accurate names, descriptions, and parameters to call the right function.",
      distractors: ["Schemas should hide all parameters from the model.", "Unclear schemas improve tool selection.", "Schemas only change response color."],
      rationale: "Clear schemas help the model choose and call functions correctly.",
    },
    chooseTwo: {
      stem: "Which two items belong in a function tool definition? Choose two.",
      correct: ["Function description", "Parameter schema"],
      distractors: ["Image brightness", "Voice pitch", "Unrelated web headline"],
      rationale: "The model needs to know what the function does and what arguments it requires.",
    },
    chooseThree: {
      stem: "Which three steps are part of a function tool workflow? Choose three.",
      correct: ["Define the function", "Receive model-proposed arguments", "Return the function result to the model"],
      distractors: ["Let the model access secrets directly", "Ignore argument validation", "Assume no application code is needed"],
      rationale: "Function tools connect model reasoning with application-controlled execution.",
    },
  },
  "11-2": {
    title: "Optimize model output with prompt engineering",
    concepts: [
      { term: "prompt engineering", meaning: "designing prompts to improve the usefulness, structure, and relevance of model output" },
      { term: "clear instructions", meaning: "specific task guidance that reduces ambiguity" },
      { term: "few-shot examples", meaning: "sample inputs and outputs that demonstrate the desired pattern" },
      { term: "output format", meaning: "the requested structure, such as bullets, JSON, or a table" },
    ],
    scenarios: [
      { stem: "A model gives long unfocused answers, so a developer asks for exactly three bullets. What technique is being used?", answer: "Prompt engineering" },
      { stem: "A prompt includes two sample classifications before asking the model to classify a new case. What is this?", answer: "Few-shot prompting" },
      { stem: "An app needs model output as JSON so code can parse it. What should the prompt specify?", answer: "Output format" },
    ],
    contrast: {
      stem: "Why try prompt engineering before fine-tuning for many issues?",
      answer: "Prompt changes are faster and cheaper when the issue is instruction or format related.",
      distractors: ["Prompt engineering requires retraining model weights.", "Fine-tuning is always required for every wording change.", "Prompts cannot influence output format."],
      rationale: "The unit presents prompt engineering as a practical first optimization strategy.",
    },
    process: {
      stem: "Why are examples useful in a prompt?",
      answer: "They show the model the desired pattern for similar outputs.",
      distractors: ["Examples prevent the model from answering.", "Examples are only used for image pixels.", "Examples remove the need to describe the task."],
      rationale: "Few-shot examples guide response style and structure.",
    },
    chooseTwo: {
      stem: "Which two prompt changes can improve output quality? Choose two.",
      correct: ["Specify the audience", "Define the response format"],
      distractors: ["Make instructions contradictory", "Omit the task", "Ask the model to ignore all context"],
      rationale: "Audience and format help produce more useful responses.",
    },
    chooseThree: {
      stem: "Which three are prompt engineering techniques? Choose three.",
      correct: ["Clear task instructions", "Few-shot examples", "Output constraints"],
      distractors: ["Changing model weights", "Indexing private files only", "Sampling microphone input"],
      rationale: "Prompt engineering works through instructions, examples, and constraints.",
    },
  },
  "11-3": {
    title: "Ground your model with Retrieval Augmented Generation",
    concepts: [
      { term: "retrieval augmented generation", meaning: "retrieving relevant source content and adding it to the prompt for grounded generation" },
      { term: "grounding data", meaning: "trusted context provided to help the model answer accurately" },
      { term: "retriever", meaning: "the component that finds relevant documents or passages" },
      { term: "grounded response", meaning: "an answer based on retrieved information rather than model memory alone" },
    ],
    scenarios: [
      { stem: "A chatbot must answer from current company policy documents. Which optimization strategy fits?", answer: "Retrieval augmented generation (RAG)" },
      { stem: "A system searches a knowledge base before generating an answer. What component performs the search?", answer: "Retriever" },
      { stem: "A model includes relevant policy excerpts in the prompt before answering. What are those excerpts?", answer: "Grounding data" },
    ],
    contrast: {
      stem: "How does RAG differ from fine-tuning?",
      answer: "RAG supplies external context at request time; fine-tuning changes model behavior through additional training.",
      distractors: ["RAG always changes model weights.", "Fine-tuning only searches documents.", "Both strategies are only for speech synthesis."],
      rationale: "The unit compares optimization strategies by how they improve responses.",
    },
    process: {
      stem: "Why can RAG reduce unsupported answers?",
      answer: "The model receives relevant trusted content to use when generating the response.",
      distractors: ["RAG prevents all prompts.", "RAG removes the need for source data.", "RAG is only a UI design pattern."],
      rationale: "Grounding helps responses stay tied to known information.",
    },
    chooseTwo: {
      stem: "Which two components are part of a RAG pattern? Choose two.",
      correct: ["A retrieval source", "A prompt that includes retrieved context"],
      distractors: ["A required audio microphone", "A generated image style", "No document content"],
      rationale: "RAG combines retrieval with generation.",
    },
    chooseThree: {
      stem: "Which three scenarios are good fits for RAG? Choose three.",
      correct: ["Answers from product documentation", "Responses based on policy files", "Knowledge-base question answering"],
      distractors: ["Changing model weights for tone only", "Generating a voice waveform", "Detecting image edges"],
      rationale: "RAG is useful when answers should be grounded in specific sources.",
    },
  },
  "11-4": {
    title: "Fine-tune a model for consistent behavior",
    concepts: [
      { term: "fine-tuning", meaning: "additional training that adapts a model toward a specific behavior or task" },
      { term: "training examples", meaning: "sample inputs and desired outputs used to teach the model a pattern" },
      { term: "consistent behavior", meaning: "reliable response style or decisions across similar requests" },
      { term: "base model", meaning: "the original model before task-specific adaptation" },
    ],
    scenarios: [
      { stem: "A company needs a model to follow a specialized response style across thousands of similar prompts. Which strategy may help?", answer: "Fine-tuning" },
      { stem: "A team prepares pairs of sample prompts and ideal answers for model adaptation. What are these?", answer: "Training examples" },
      { stem: "A model already performs well generally but needs more consistent domain-specific formatting. What is being adapted?", answer: "The base model's behavior" },
    ],
    contrast: {
      stem: "When is fine-tuning a better fit than prompt engineering alone?",
      answer: "When many examples are needed to make behavior consistent across repeated task patterns.",
      distractors: ["When the problem is only missing current facts.", "When no training examples are available.", "When a simple output-format instruction is enough."],
      rationale: "Fine-tuning is heavier than prompting and is used for consistent task behavior.",
    },
    process: {
      stem: "Why does fine-tuning require high-quality examples?",
      answer: "The model learns from the patterns shown in the training data.",
      distractors: ["Examples are ignored during fine-tuning.", "Low-quality examples always improve output.", "Fine-tuning only changes endpoint names."],
      rationale: "Training data quality directly affects adapted behavior.",
    },
    chooseTwo: {
      stem: "Which two are reasons to consider fine-tuning? Choose two.",
      correct: ["Consistent response format across many cases", "Specialized task behavior from examples"],
      distractors: ["Need for live public information", "One-time wording change", "No available examples"],
      rationale: "Fine-tuning is for repeated patterns and specialized behavior.",
    },
    chooseThree: {
      stem: "Which three items matter in a fine-tuning workflow? Choose three.",
      correct: ["Base model", "Training examples", "Evaluation after tuning"],
      distractors: ["Ignoring data quality", "Skipping validation", "Using only image brightness settings"],
      rationale: "Fine-tuning adapts a base model using examples and needs evaluation.",
    },
  },
  "11-5": {
    title: "Compare and combine optimization strategies",
    concepts: [
      { term: "prompt engineering", meaning: "improving responses by changing instructions and examples" },
      { term: "RAG", meaning: "improving factual grounding by retrieving relevant source content" },
      { term: "fine-tuning", meaning: "adapting model behavior with additional training examples" },
      { term: "combined strategy", meaning: "using multiple optimization approaches together when one is not enough" },
    ],
    scenarios: [
      { stem: "A response has the right facts but the wrong format. Which strategy should usually be tried first?", answer: "Prompt engineering" },
      { stem: "A model needs answers from frequently updated support documents. Which strategy fits best?", answer: "RAG" },
      { stem: "A model needs stable domain-specific behavior across many repeated cases. Which strategy may be appropriate?", answer: "Fine-tuning" },
    ],
    contrast: {
      stem: "How should teams choose among prompting, RAG, and fine-tuning?",
      answer: "Match the strategy to the problem: instructions, missing knowledge, or consistent learned behavior.",
      distractors: ["Always fine-tune before trying prompts.", "Use RAG only to change response tone.", "Use prompting to update private documents automatically."],
      rationale: "The unit teaches comparing strategies by problem type.",
    },
    process: {
      stem: "Why might a solution combine RAG with prompt engineering?",
      answer: "RAG supplies trusted context, while prompting controls how the answer should be produced.",
      distractors: ["The two strategies cancel each other out.", "Prompting prevents retrieved content from being used.", "RAG changes model weights automatically."],
      rationale: "Optimization strategies can complement each other.",
    },
    chooseTwo: {
      stem: "Which two problems are good fits for prompt engineering? Choose two.",
      correct: ["The response needs a different format", "The model needs clearer task instructions"],
      distractors: ["The answer requires current private documents", "The model needs behavior learned from many examples", "The endpoint is missing credentials"],
      rationale: "Prompting handles instruction, structure, and format issues.",
    },
    chooseThree: {
      stem: "Which three optimization strategies are compared in this unit? Choose three.",
      correct: ["Prompt engineering", "RAG", "Fine-tuning"],
      distractors: ["OCR page rotation", "Speech sampling", "Object tracking only"],
      rationale: "These are the main generative AI optimization approaches in the unit.",
    },
  },
});

Object.assign(profiles, {
  "8-2": {
    title: "Explore the model catalog",
    concepts: [
      { term: "model catalog", meaning: "a place to browse available models and compare their capabilities" },
      { term: "model card", meaning: "documentation that summarizes a model's purpose, limits, and usage details" },
      { term: "model capability", meaning: "the type of task a model is designed to perform" },
      { term: "model selection", meaning: "choosing a model based on task fit, performance, cost, and constraints" },
    ],
    scenarios: [
      { stem: "A developer wants to find models that can handle text generation, vision, or embeddings. Where should they start?", answer: "The model catalog" },
      { stem: "A team wants to understand a model's intended use and limitations before deployment. What should they review?", answer: "The model card" },
      { stem: "A solution needs image understanding, but the selected model only supports text. What selection issue occurred?", answer: "The model capability does not match the task" },
    ],
    contrast: {
      stem: "Why should learners not pick a model only because it is popular?",
      answer: "The best model depends on the workload, constraints, quality needs, and deployment requirements.",
      distractors: ["Popularity guarantees the lowest cost.", "Popular models never need evaluation.", "All catalog models have identical capabilities."],
      rationale: "The unit emphasizes matching model choice to solution needs.",
    },
    process: {
      stem: "What is the purpose of exploring model details before deployment?",
      answer: "To verify that the model supports the required task and usage conditions.",
      distractors: ["To avoid testing prompts later.", "To change project navigation settings.", "To bypass responsible AI requirements."],
      rationale: "Catalog exploration informs model selection.",
    },
    chooseTwo: {
      stem: "Which two details help compare models in a catalog? Choose two.",
      correct: ["Supported capabilities", "Model limitations"],
      distractors: ["Project display preference", "Client device detail", "Learner's exam history"],
      rationale: "Capabilities and limitations guide model selection.",
    },
    chooseThree: {
      stem: "Which three factors matter when selecting a model? Choose three.",
      correct: ["Task fit", "Performance needs", "Cost or deployment constraints"],
      distractors: ["Alphabetical order only", "Ignoring model documentation", "Using the largest model every time"],
      rationale: "Model selection balances fit, quality, and practical constraints.",
    },
  },
  "8-3": {
    title: "Select models using benchmarks",
    concepts: [
      { term: "benchmark", meaning: "a standardized way to compare model performance on known tasks" },
      { term: "accuracy metric", meaning: "a score that reflects how well a model performs for a measured task" },
      { term: "latency", meaning: "the time a model takes to return a response" },
      { term: "throughput", meaning: "the amount of work a model can handle over time" },
    ],
    scenarios: [
      { stem: "A team compares models using published scores on a reasoning task. What are they using?", answer: "Benchmarks" },
      { stem: "A chatbot must respond quickly during live conversations. Which benchmark dimension matters most?", answer: "Latency" },
      { stem: "A batch system must process many requests per minute. Which measure is most relevant?", answer: "Throughput" },
    ],
    contrast: {
      stem: "Why are benchmark scores not the only factor in model selection?",
      answer: "A model also needs to match the real task, cost, latency, and deployment requirements.",
      distractors: ["Benchmarks prove a model is safe for every use.", "Benchmark scores replace testing with your own prompts.", "A higher score always means lower cost."],
      rationale: "The unit positions benchmarks as useful evidence, not the entire decision.",
    },
    process: {
      stem: "How should a developer use benchmark results?",
      answer: "Use them to shortlist models, then validate with the solution's own scenarios.",
      distractors: ["Use them to avoid all evaluation.", "Choose the slowest model when accuracy is irrelevant.", "Ignore the actual workload."],
      rationale: "Benchmarks guide selection but should be combined with scenario testing.",
    },
    chooseTwo: {
      stem: "Which two are useful benchmark considerations? Choose two.",
      correct: ["Task-specific quality", "Response time"],
      distractors: ["Portal navigation setting", "File name length", "Client input setting"],
      rationale: "Quality and latency are practical model comparison dimensions.",
    },
    chooseThree: {
      stem: "Which three factors should be balanced when selecting a model using benchmarks? Choose three.",
      correct: ["Accuracy", "Latency", "Cost"],
      distractors: ["Model name length", "Ignoring test data", "Random selection"],
      rationale: "Model choice usually balances quality, speed, and cost.",
    },
  },
  "8-4": {
    title: "Deploy models to endpoints",
    concepts: [
      { term: "deployment", meaning: "making a selected model available for application use" },
      { term: "endpoint", meaning: "the URL or service target an app calls to use a deployed model" },
      { term: "configuration", meaning: "settings such as model choice, capacity, or access details for a deployment" },
      { term: "authentication", meaning: "verifying that callers are allowed to use the deployed endpoint" },
    ],
    scenarios: [
      { stem: "A model has been selected and must be made callable by an app. What is the next step?", answer: "Deploy the model to an endpoint" },
      { stem: "A client app needs the address for sending model requests. What value does it need?", answer: "The endpoint" },
      { stem: "A developer controls which applications can call a deployed model. Which concern is this?", answer: "Authentication and access control" },
    ],
    contrast: {
      stem: "How is selecting a model different from deploying it?",
      answer: "Selection chooses the model; deployment makes it available for calls from apps.",
      distractors: ["Deployment only reads documentation.", "Selection automatically creates every endpoint.", "They are unrelated to application integration."],
      rationale: "The unit separates choosing models from creating usable deployments.",
    },
    process: {
      stem: "Why does endpoint configuration matter?",
      answer: "It affects how apps access the model and how the deployment supports expected workload.",
      distractors: ["Configuration only changes font color.", "Configuration prevents authentication.", "All deployments have identical behavior."],
      rationale: "Deployment settings influence access and runtime behavior.",
    },
    chooseTwo: {
      stem: "Which two items does an app commonly need to call a deployed model? Choose two.",
      correct: ["Endpoint URL", "Credential or access token"],
      distractors: ["Monitor size", "Image caption only", "Local wallpaper path"],
      rationale: "Application calls require a target endpoint and authorized access.",
    },
    chooseThree: {
      stem: "Which three activities are part of model deployment work? Choose three.",
      correct: ["Choose deployment settings", "Create or select an endpoint", "Test calls against the deployment"],
      distractors: ["Ignore access control", "Assume no monitoring is needed", "Manually type every response"],
      rationale: "Deployment includes configuration, endpoint access, and testing.",
    },
  },
  "8-5": {
    title: "Evaluate model performance",
    concepts: [
      { term: "evaluation", meaning: "measuring how well a model performs for intended tasks" },
      { term: "test data", meaning: "examples used to assess model behavior and output quality" },
      { term: "quality metric", meaning: "a measurement that reflects how useful or correct model output is" },
      { term: "safety evaluation", meaning: "checking whether a model produces harmful, unsafe, or inappropriate outputs" },
    ],
    scenarios: [
      { stem: "A team tests a model with realistic prompts before releasing it. What activity is this?", answer: "Model evaluation" },
      { stem: "A model is checked for harmful responses before production use. Which evaluation area is involved?", answer: "Safety evaluation" },
      { stem: "A developer compares expected answers with generated answers to judge quality. What is being measured?", answer: "Output quality" },
    ],
    contrast: {
      stem: "Why should evaluation use examples that match the real solution?",
      answer: "Realistic examples reveal whether the model performs well for the intended workload.",
      distractors: ["Unrelated examples always prove production readiness.", "Evaluation is only needed for image models.", "A model catalog score replaces all testing."],
      rationale: "Evaluation should reflect actual use cases.",
    },
    process: {
      stem: "What should happen if evaluation reveals weak or unsafe outputs?",
      answer: "Adjust prompts, model choice, grounding, or safeguards and test again.",
      distractors: ["Release immediately without changes.", "Delete all evaluation records.", "Assume users will not notice problems."],
      rationale: "Evaluation informs iteration and risk reduction.",
    },
    chooseTwo: {
      stem: "Which two are reasons to evaluate a model? Choose two.",
      correct: ["Check task performance", "Identify safety risks"],
      distractors: ["Avoid user requirements", "Guarantee no future monitoring", "Hide model limitations"],
      rationale: "Evaluation supports quality and risk assessment.",
    },
    chooseThree: {
      stem: "Which three inputs can support useful model evaluation? Choose three.",
      correct: ["Representative prompts", "Expected outcomes", "Quality or safety criteria"],
      distractors: ["Random UI colors", "Unrelated network names", "Ignored test results"],
      rationale: "Good evaluation needs realistic cases and criteria.",
    },
  },
  "9-2": {
    title: "Explore with the model playground",
    concepts: [
      { term: "model playground", meaning: "an interactive portal experience for testing prompts and model responses" },
      { term: "system message", meaning: "instructions that shape assistant behavior across the conversation" },
      { term: "prompt iteration", meaning: "revising prompts and settings based on observed responses" },
      { term: "parameters", meaning: "settings that influence model response style or behavior" },
    ],
    scenarios: [
      { stem: "A developer wants to test model responses before writing code. Which Foundry feature should they use?", answer: "The model playground" },
      { stem: "The assistant should always answer as a concise travel advisor. Where should that behavior be set?", answer: "System message" },
      { stem: "A response is too vague, so the developer revises the prompt and tries again. What practice is this?", answer: "Prompt iteration" },
    ],
    contrast: {
      stem: "How does playground testing help before SDK development?",
      answer: "It lets developers quickly test prompts and behavior before implementing code.",
      distractors: ["It replaces deployment security.", "It is only for OCR forms.", "It prevents developers from evaluating responses."],
      rationale: "The playground is an interactive experimentation tool.",
    },
    process: {
      stem: "Why adjust parameters in the playground?",
      answer: "Parameters can change response style, variability, or output behavior.",
      distractors: ["Parameters only change the browser window size.", "Parameters disable all prompts.", "Parameters are unrelated to response behavior."],
      rationale: "The unit introduces interactive testing of prompts and settings.",
    },
    chooseTwo: {
      stem: "Which two activities fit the model playground? Choose two.",
      correct: ["Try a prompt", "Inspect a model response"],
      distractors: ["Manually send invoices", "Change hardware cables", "Skip model selection"],
      rationale: "The playground supports interactive model testing.",
    },
    chooseThree: {
      stem: "Which three items can a developer experiment with in a playground workflow? Choose three.",
      correct: ["User prompts", "System instructions", "Model settings"],
      distractors: ["Client device setting", "Unrelated calendar alarms", "Hidden billing passwords"],
      rationale: "Playground work involves prompts, instructions, and settings.",
    },
  },
  "9-3": {
    title: "Choose an endpoint and SDK",
    concepts: [
      { term: "endpoint", meaning: "the target address for calling a deployed model" },
      { term: "SDK", meaning: "a library that simplifies calls to AI services from code" },
      { term: "API", meaning: "a programming interface for sending requests and receiving responses" },
      { term: "client", meaning: "application code configured to communicate with an endpoint" },
    ],
    scenarios: [
      { stem: "A JavaScript app needs to call a deployed model in Foundry. What two things must the developer choose?", answer: "An endpoint and a compatible SDK or API" },
      { stem: "A Python developer wants helper classes for requests instead of raw HTTP calls. What should they use?", answer: "An SDK" },
      { stem: "An app sends prompts to a specific deployed model URL. What is the URL called?", answer: "Endpoint" },
    ],
    contrast: {
      stem: "Why choose an SDK instead of hand-coding every HTTP request?",
      answer: "An SDK simplifies authentication, request construction, and response handling.",
      distractors: ["SDKs remove all need for endpoints.", "SDKs only work for image cropping.", "SDKs make model evaluation unnecessary."],
      rationale: "SDKs are developer tools for integrating services into apps.",
    },
    process: {
      stem: "What should a client app be configured with before sending requests?",
      answer: "Endpoint information and credentials for the deployed model or service.",
      distractors: ["Only a screenshot of the model card.", "A handwritten transcript.", "No authentication details at all."],
      rationale: "Client applications need service access configuration.",
    },
    chooseTwo: {
      stem: "Which two items are needed for most SDK-based model calls? Choose two.",
      correct: ["Endpoint", "Credential"],
      distractors: ["Image filter kernel", "Speech phoneme table", "Portal navigation setting"],
      rationale: "The app needs a target and authorized access.",
    },
    chooseThree: {
      stem: "Which three steps belong in a lightweight client app workflow? Choose three.",
      correct: ["Create a client", "Send a prompt or request", "Read the model response"],
      distractors: ["Ignore errors forever", "Publish secrets in source control", "Use only manual copy and paste"],
      rationale: "A client app configures access, sends requests, and handles responses.",
    },
  },
  "9-4": {
    title: "Generate responses with the Responses API",
    concepts: [
      { term: "Responses API", meaning: "an API for sending model input and receiving generated responses" },
      { term: "input", meaning: "the prompt or content provided to the model request" },
      { term: "output", meaning: "the generated result returned by the model" },
      { term: "tool support", meaning: "the ability for a model request to use configured tools when available" },
    ],
    scenarios: [
      { stem: "A developer sends a prompt and receives generated text through a modern model API. Which API concept is central?", answer: "Responses API request and output" },
      { stem: "The app passes the user's question to the model. What part of the request is this?", answer: "Input" },
      { stem: "The app reads the generated answer returned by the model. What is this?", answer: "Output" },
    ],
    contrast: {
      stem: "What is the practical role of the Responses API in a chat app?",
      answer: "It provides a structured way for code to send prompts and handle generated results.",
      distractors: ["It only stores image files.", "It replaces every need for model deployment.", "It is used only for manual portal testing."],
      rationale: "The unit focuses on calling a model from application code.",
    },
    process: {
      stem: "Why should application code inspect the model response object?",
      answer: "The generated answer and related details must be extracted from the returned response.",
      distractors: ["The response object never contains output.", "Inspecting responses disables authentication.", "The model answer is always printed by the portal only."],
      rationale: "Client code must parse and use the response.",
    },
    chooseTwo: {
      stem: "Which two items are part of a basic Responses API interaction? Choose two.",
      correct: ["Send model input", "Read generated output"],
      distractors: ["Scan a paper form by default", "Record microphone audio only", "Change monitor resolution"],
      rationale: "The core request-response pattern is input to output.",
    },
    chooseThree: {
      stem: "Which three concerns matter when building a lightweight Responses API client? Choose three.",
      correct: ["Configure the client", "Provide input", "Handle the returned output"],
      distractors: ["Ignore credentials", "Assume no errors can occur", "Use unrelated vision labels"],
      rationale: "A working client needs configuration, request input, and response handling.",
    },
  },
  "9-5": {
    title: "Generate responses with the ChatCompletions API",
    concepts: [
      { term: "ChatCompletions API", meaning: "an API pattern that uses conversation messages to generate chat responses" },
      { term: "system message", meaning: "a message that sets assistant behavior or role" },
      { term: "user message", meaning: "a message containing the user's request" },
      { term: "assistant message", meaning: "a generated response or prior assistant turn in the conversation" },
    ],
    scenarios: [
      { stem: "A chat app sends a list of system, user, and assistant messages to generate the next reply. Which API style is this?", answer: "ChatCompletions API" },
      { stem: "A developer wants the assistant to behave as a helpful math tutor throughout a conversation. Which message type should set that role?", answer: "System message" },
      { stem: "A user's latest question is added to the conversation history. Which message type is it?", answer: "User message" },
    ],
    contrast: {
      stem: "What makes the ChatCompletions pattern conversation-oriented?",
      answer: "It sends role-based messages that represent the conversation context.",
      distractors: ["It never includes user input.", "It only accepts image pixels.", "It cannot use system instructions."],
      rationale: "The unit presents chat completions as role-message based.",
    },
    process: {
      stem: "Why include conversation history in a chat completion request?",
      answer: "History gives the model context for the next response.",
      distractors: ["History prevents the model from answering.", "History is only used for OCR.", "History changes the endpoint URL automatically."],
      rationale: "Chat models use prior messages as conversational context.",
    },
    chooseTwo: {
      stem: "Which two message roles are commonly used in chat completions? Choose two.",
      correct: ["System", "User"],
      distractors: ["Pixel", "Invoice", "Endpoint"],
      rationale: "System and user are core roles in chat message arrays.",
    },
    chooseThree: {
      stem: "Which three items are part of a chat-completions request design? Choose three.",
      correct: ["System behavior instruction", "User request", "Conversation context"],
      distractors: ["Camera aperture", "PII redaction by default", "Monitor refresh rate"],
      rationale: "Role instructions, current request, and context shape chat responses.",
    },
  },
});

Object.assign(profiles, {
  "7-2": {
    title: "What is AI?",
    concepts: [
      { term: "artificial intelligence", meaning: "software capability that imitates human-like perception, reasoning, or decision support" },
      { term: "machine learning", meaning: "training models from data so they can make predictions or classifications" },
      { term: "generative AI", meaning: "AI that creates new content in response to prompts" },
      { term: "AI workload", meaning: "a category of AI solution such as language, speech, vision, or extraction" },
    ],
    scenarios: [
      { stem: "A system predicts whether a customer will renew based on historical records. Which AI approach is involved?", answer: "Machine learning prediction" },
      { stem: "A user asks a model to draft a support email from bullet points. Which AI category fits?", answer: "Generative AI" },
      { stem: "A developer must choose between text analysis, speech, vision, and extraction capabilities. What are these categories?", answer: "AI workloads" },
    ],
    contrast: {
      stem: "How is generative AI different from predictive machine learning?",
      answer: "Generative AI creates new content; predictive ML estimates labels or values from data.",
      distractors: ["Predictive ML only creates images.", "Generative AI cannot use prompts.", "They are unrelated to Azure AI solutions."],
      rationale: "The unit introduces common AI categories and how they differ.",
    },
    process: {
      stem: "Why should a developer identify the AI workload before building?",
      answer: "The workload determines which model, tool, or service best matches the requirement.",
      distractors: ["Every workload uses the same implementation.", "Workload selection only changes the billing currency.", "The workload has no effect on design choices."],
      rationale: "AI-901 scenarios often test matching requirements to the correct workload.",
    },
    chooseTwo: {
      stem: "Which two are examples of AI workloads? Choose two.",
      correct: ["Computer vision", "Natural language processing"],
      distractors: ["Spreadsheet formatting without model analysis", "Device input setting", "Display calibration"],
      rationale: "Vision and language are common AI workload categories.",
    },
    chooseThree: {
      stem: "Which three capabilities can AI solutions provide? Choose three.",
      correct: ["Analyze language", "Interpret images", "Generate content"],
      distractors: ["Guarantee ethical outcomes automatically", "Remove all need for testing", "Bypass security controls"],
      rationale: "The unit frames AI around practical capabilities, while responsible controls remain necessary.",
    },
  },
  "7-3": {
    title: "Microsoft Foundry",
    concepts: [
      { term: "Microsoft Foundry", meaning: "a platform for building, deploying, and managing AI apps and models" },
      { term: "project", meaning: "a workspace for organizing AI development assets and collaboration" },
      { term: "model catalog", meaning: "a place to discover and select available AI models" },
      { term: "playground", meaning: "an interactive area to test prompts and model behavior" },
    ],
    scenarios: [
      { stem: "A team wants one place to explore models, test prompts, and prepare an AI app. Which platform is the focus?", answer: "Microsoft Foundry" },
      { stem: "A developer needs to compare available models before deployment. Where should they start?", answer: "The model catalog" },
      { stem: "A learner wants to try prompts in the portal before writing code. Which Foundry feature fits?", answer: "The playground" },
    ],
    contrast: {
      stem: "How does the model catalog differ from the playground?",
      answer: "The catalog helps select models; the playground helps test model interactions.",
      distractors: ["The catalog manages deployed endpoint traffic, while the playground stores firewall rules.", "The playground is only for billing.", "Both features are unrelated to model development."],
      rationale: "The unit introduces Foundry areas for model discovery and experimentation.",
    },
    process: {
      stem: "Why organize work in a Foundry project?",
      answer: "Projects group the resources and assets needed to build an AI solution.",
      distractors: ["Projects prevent model deployment.", "Projects are only used for OCR images.", "Projects replace all testing."],
      rationale: "Foundry projects provide structure for development work.",
    },
    chooseTwo: {
      stem: "Which two activities are supported in Microsoft Foundry? Choose two.",
      correct: ["Exploring models", "Testing prompts"],
      distractors: ["Manually grading exams", "Changing monitor brightness", "Replacing privacy review"],
      rationale: "Model exploration and prompt testing are Foundry development activities.",
    },
    chooseThree: {
      stem: "Which three Foundry concepts should learners recognize? Choose three.",
      correct: ["Projects", "Model catalog", "Playground"],
      distractors: ["Phone dial tone", "Spreadsheet cell color only", "Image compression ratio"],
      rationale: "These are central parts of the Foundry workflow introduced in the unit.",
    },
  },
  "7-4": {
    title: "Foundry Tools",
    concepts: [
      { term: "Foundry Tools", meaning: "Azure AI capabilities available for adding specialized functions to AI apps" },
      { term: "Azure Speech", meaning: "tools for speech recognition, synthesis, and related speech scenarios" },
      { term: "Azure AI Vision", meaning: "tools for analyzing images and visual content" },
      { term: "Content Understanding", meaning: "tools for extracting information from documents and multimodal content" },
    ],
    scenarios: [
      { stem: "A solution needs to transcribe spoken prompts. Which Foundry Tool area applies?", answer: "Azure Speech" },
      { stem: "A solution must analyze uploaded photos for visual content. Which tool area fits?", answer: "Azure AI Vision" },
      { stem: "A solution extracts fields from documents and forms. Which tool area is most relevant?", answer: "Content Understanding" },
    ],
    contrast: {
      stem: "How should a developer choose among Foundry Tools?",
      answer: "Match the tool to the input type and task, such as speech, vision, text, or extraction.",
      distractors: ["Choose the first tool alphabetically.", "Use Speech for every image and document task.", "Avoid tools when a solution needs external capabilities."],
      rationale: "The unit groups tools by the type of AI capability they provide.",
    },
    process: {
      stem: "Why might a generative AI app use a Foundry Tool?",
      answer: "A tool adds a specialized capability that the base model alone may not provide.",
      distractors: ["Tools prevent the app from using models.", "Tools are only for changing project navigation settings.", "Tools remove the need for authentication."],
      rationale: "Tools extend apps with services such as speech, vision, and extraction.",
    },
    chooseTwo: {
      stem: "Which two are Foundry Tool scenarios? Choose two.",
      correct: ["Build speech-enabled apps", "Extract information from forms"],
      distractors: ["Select a model documentation page", "Skip all model evaluation", "Manually resize browser windows"],
      rationale: "Speech and extraction are covered Foundry Tool scenarios.",
    },
    chooseThree: {
      stem: "Which three capabilities are represented by Foundry Tools? Choose three.",
      correct: ["Speech", "Vision", "Information extraction"],
      distractors: ["Project asset tracking", "Client device control", "Manual grading only"],
      rationale: "Foundry Tools provide specialized Azure AI capabilities.",
    },
  },
  "7-5": {
    title: "Developer tools and SDKs",
    concepts: [
      { term: "SDK", meaning: "a software development kit that helps code interact with a service" },
      { term: "endpoint", meaning: "the network address an app uses to call a deployed model or service" },
      { term: "key or credential", meaning: "authentication material used to securely access Azure AI resources" },
      { term: "client application", meaning: "code that sends requests to an AI service and handles responses" },
    ],
    scenarios: [
      { stem: "A Python app needs to call a deployed AI model from code. What should the developer use?", answer: "A supported SDK or API client" },
      { stem: "An app must know where to send requests for a deployed model. What configuration value is needed?", answer: "The endpoint" },
      { stem: "A developer must prevent unauthorized access to an AI resource. What must be handled securely?", answer: "Credentials or keys" },
    ],
    contrast: {
      stem: "How does using the portal differ from using an SDK?",
      answer: "The portal supports interactive setup and testing; an SDK lets application code call the service.",
      distractors: ["SDKs are only for drawing images.", "The portal cannot be used for AI work.", "They both remove the need for credentials."],
      rationale: "The unit distinguishes no-code/portal interaction from code-based integration.",
    },
    process: {
      stem: "Why should credentials not be hard-coded into source files?",
      answer: "They could be exposed and used to access protected resources.",
      distractors: ["Credentials only affect font size.", "Hard-coding keys improves security.", "AI services never require authentication."],
      rationale: "Secure credential handling is a core developer concern.",
    },
    chooseTwo: {
      stem: "Which two values are commonly needed by a client app that calls an AI service? Choose two.",
      correct: ["Endpoint", "Credential"],
      distractors: ["Client display size", "Client input setting", "Visual design preference"],
      rationale: "Apps need where to call and how to authenticate.",
    },
    chooseThree: {
      stem: "Which three activities are part of developing with AI SDKs? Choose three.",
      correct: ["Install the package", "Configure service access", "Handle model responses"],
      distractors: ["Ignore errors", "Publish secrets in code", "Use only screenshots as configuration"],
      rationale: "SDK use involves dependencies, access configuration, and response handling.",
    },
  },
  "7-6": {
    title: "Responsible AI",
    concepts: [
      { term: "responsible AI", meaning: "building AI systems with fairness, safety, privacy, transparency, inclusiveness, and accountability" },
      { term: "fairness", meaning: "checking that an AI system does not unfairly advantage or disadvantage groups" },
      { term: "transparency", meaning: "making system behavior and limitations understandable to stakeholders" },
      { term: "human oversight", meaning: "keeping people involved in reviewing and governing AI behavior" },
    ],
    scenarios: [
      { stem: "A team tests whether an AI assistant gives lower-quality answers to users from a particular group. Which principle is involved?", answer: "Fairness" },
      { stem: "A product page explains that AI answers may be incomplete and should be reviewed. Which principle is supported?", answer: "Transparency" },
      { stem: "A company assigns owners to monitor AI issues after launch. Which responsible practice is this?", answer: "Human accountability and oversight" },
    ],
    contrast: {
      stem: "How does responsible AI affect development work?",
      answer: "It adds design, testing, monitoring, and governance practices around the AI capability.",
      distractors: ["It only applies after an app is retired.", "It means the model never needs evaluation.", "It applies only to image generation."],
      rationale: "Responsible AI is part of planning, building, and operating solutions.",
    },
    process: {
      stem: "Why should responsible AI be considered before deployment?",
      answer: "Risks are easier to reduce when they are identified during design and testing.",
      distractors: ["Risks cannot be detected until users complain.", "Responsible AI prevents all model use.", "It is only a marketing activity."],
      rationale: "The unit stresses responsible planning, not only reaction after release.",
    },
    chooseTwo: {
      stem: "Which two actions support responsible AI development? Choose two.",
      correct: ["Test for harmful behavior", "Document model limitations"],
      distractors: ["Hide known risks", "Ignore user feedback", "Remove access controls"],
      rationale: "Evaluation and transparency reduce risk.",
    },
    chooseThree: {
      stem: "Which three responsible AI ideas are relevant to Azure AI solutions? Choose three.",
      correct: ["Fairness", "Privacy and security", "Accountability"],
      distractors: ["Display resolution", "Developer productivity shortcuts", "Image file name length"],
      rationale: "These are responsible AI principles learners should recognize.",
    },
  },
});

Object.assign(profiles, {
  "5-2": {
    title: "Computer vision tasks and techniques",
    concepts: [
      { term: "image classification", meaning: "assigning one or more labels that describe an image" },
      { term: "object detection", meaning: "identifying objects and their locations in an image" },
      { term: "semantic segmentation", meaning: "classifying pixels into categories or regions" },
      { term: "optical character recognition", meaning: "extracting readable text from images" },
    ],
    scenarios: [
      { stem: "A mobile app must decide whether a picture shows a cat, dog, or bird. Which task should it use?", answer: "Image classification" },
      { stem: "A security system must draw boxes around people and vehicles in camera images. Which task fits?", answer: "Object detection" },
      { stem: "A road analysis system must label each pixel as lane, vehicle, sidewalk, or sky. Which technique fits best?", answer: "Semantic segmentation" },
    ],
    contrast: {
      stem: "What is the key difference between object detection and semantic segmentation?",
      answer: "Object detection locates objects with regions; segmentation classifies pixels into areas.",
      distractors: ["Detection reads text, while segmentation translates speech.", "Segmentation only creates new images from prompts.", "Both techniques only classify a whole image."],
      rationale: "The unit distinguishes locating objects from assigning pixel-level categories.",
    },
    process: {
      stem: "Why does a vision task need the right technique selected up front?",
      answer: "Different business goals require different outputs, such as labels, locations, text, or pixel regions.",
      distractors: ["All vision techniques return the same output.", "Choosing a technique only changes model packaging.", "Vision tasks never depend on the input image."],
      rationale: "AI-901 questions often ask learners to match a requirement to the correct vision task.",
    },
    chooseTwo: {
      stem: "Which two tasks identify visual content without generating a new image? Choose two.",
      correct: ["Image classification", "Object detection"],
      distractors: ["Prompt-based image generation", "Speech synthesis", "Text sentiment analysis"],
      rationale: "Classification and detection analyze existing images.",
    },
    chooseThree: {
      stem: "Which three outputs can computer vision techniques produce? Choose three.",
      correct: ["Image labels", "Object locations", "Extracted text"],
      distractors: ["Spoken voice cadence", "Calendar invites", "Prompt token limits only"],
      rationale: "Vision tasks can classify, locate, and read visual content.",
    },
  },
  "5-3": {
    title: "Images and image processing",
    concepts: [
      { term: "pixel", meaning: "the smallest addressable element in a digital image" },
      { term: "resolution", meaning: "the number of pixels used to represent an image" },
      { term: "color channel", meaning: "numeric values that represent color components such as red, green, and blue" },
      { term: "image filter", meaning: "a transformation applied to pixels to highlight or change image features" },
    ],
    scenarios: [
      { stem: "An image is represented as a grid of tiny numeric color values. What are those tiny elements called?", answer: "Pixels" },
      { stem: "A model struggles because the images are too small to show important details. What image property is most relevant?", answer: "Resolution" },
      { stem: "A preprocessing step highlights edges before visual analysis. What technique is being used?", answer: "An image filter" },
    ],
    contrast: {
      stem: "How is a grayscale image different from an RGB color image?",
      answer: "A grayscale image uses intensity values; an RGB image uses separate color channels.",
      distractors: ["A grayscale image is speech data, while RGB is text data.", "RGB images cannot be represented numerically.", "Grayscale images always contain more channels than RGB images."],
      rationale: "The unit explains images as numeric pixel data, including color channels.",
    },
    process: {
      stem: "Why do AI systems treat images as arrays of numbers?",
      answer: "Models analyze pixel values and derived features mathematically.",
      distractors: ["Models can only read handwritten notes.", "Numbers prevent image preprocessing.", "It converts every image into an email."],
      rationale: "Computer vision depends on numeric image representation.",
    },
    chooseTwo: {
      stem: "Which two properties affect digital image data? Choose two.",
      correct: ["Pixel values", "Resolution"],
      distractors: ["Email priority", "Voice pitch", "Calendar timezone only"],
      rationale: "Pixel values and resolution are core image characteristics.",
    },
    chooseThree: {
      stem: "Which three concepts belong to image processing? Choose three.",
      correct: ["Pixels", "Color channels", "Filters"],
      distractors: ["Phonemes", "Sentiment labels", "Meeting invitations"],
      rationale: "These are visual data and preprocessing concepts.",
    },
  },
  "5-4": {
    title: "Convolutional neural networks",
    concepts: [
      { term: "convolutional neural network", meaning: "a deep learning model architecture commonly used for computer vision tasks" },
      { term: "filter", meaning: "a small matrix used to detect visual patterns such as edges or textures" },
      { term: "feature map", meaning: "numeric output that shows where a learned visual feature appears" },
      { term: "label prediction", meaning: "the model's predicted class for an image" },
    ],
    scenarios: [
      { stem: "A fruit classifier learns visual patterns from labeled images and predicts apple, banana, or orange. Which architecture fits?", answer: "A convolutional neural network" },
      { stem: "A CNN layer detects edges and textures before classification. What is applied to the image?", answer: "Filters" },
      { stem: "After filters run, the network produces numeric arrays showing detected visual patterns. What are these called?", answer: "Feature maps" },
    ],
    contrast: {
      stem: "How do filters and fully connected layers serve different roles in a CNN?",
      answer: "Filters extract visual features; later layers use those features to predict a label.",
      distractors: ["Filters translate text, while fully connected layers record audio.", "Fully connected layers are only used to crop images.", "Filters remove the need for training data."],
      rationale: "CNNs use feature extraction before classification.",
    },
    process: {
      stem: "Why are labeled images needed when training an image classifier?",
      answer: "They let the model compare predictions with known classes and adjust its weights.",
      distractors: ["They prevent the model from learning visual features.", "They are only needed for speech recognition.", "They replace the need for numeric image data."],
      rationale: "Training uses known labels to learn correct predictions.",
    },
    chooseTwo: {
      stem: "Which two items are part of CNN image classification? Choose two.",
      correct: ["Feature extraction with filters", "Prediction of an image label"],
      distractors: ["Speech-to-text decoding", "PII redaction from transcripts", "Calendar automation"],
      rationale: "CNNs extract image features and use them for classification.",
    },
    chooseThree: {
      stem: "Which three concepts are associated with CNNs? Choose three.",
      correct: ["Filters", "Feature maps", "Training with labeled images"],
      distractors: ["Prompt grounding", "Prosody generation", "Language detection"],
      rationale: "These are core parts of CNN-based computer vision.",
    },
  },
  "5-5": {
    title: "Vision transformers and multimodal models",
    concepts: [
      { term: "vision transformer", meaning: "a vision model that uses transformer-style attention over image patches" },
      { term: "image patch", meaning: "a small region of an image processed as part of a transformer input" },
      { term: "multimodal model", meaning: "a model that can work with more than one input type, such as text and images" },
      { term: "visual question answering", meaning: "answering natural language questions about image content" },
    ],
    scenarios: [
      { stem: "A model answers a text question about what is shown in a photo. Which capability is being used?", answer: "Visual question answering with a multimodal model" },
      { stem: "An image model analyzes small regions of an image using attention rather than only convolution filters. What model type is this?", answer: "A vision transformer" },
      { stem: "A user provides both an image and a written instruction in one prompt. What type of model is needed?", answer: "A multimodal model" },
    ],
    contrast: {
      stem: "How does a multimodal model differ from a text-only language model?",
      answer: "A multimodal model can reason over inputs such as images as well as text.",
      distractors: ["A multimodal model cannot process prompts.", "Text-only models always locate objects in photos.", "Multimodal means the model is smaller than every SLM."],
      rationale: "The unit introduces models that combine visual and language understanding.",
    },
    process: {
      stem: "Why do vision transformers divide images into patches?",
      answer: "Patches let transformer attention process visual regions as input units.",
      distractors: ["Patches convert speech into tokens.", "Patches remove all visual information.", "Patches are only used to store passwords."],
      rationale: "Patch-based processing is central to vision transformer design.",
    },
    chooseTwo: {
      stem: "Which two tasks are natural fits for multimodal models? Choose two.",
      correct: ["Describing an uploaded image", "Answering a question about a chart"],
      distractors: ["Sampling microphone audio only", "Updating a firewall rule", "Counting tokens without context"],
      rationale: "Multimodal models combine visual input with language prompts.",
    },
    chooseThree: {
      stem: "Which three ideas are tied to modern vision models in this unit? Choose three.",
      correct: ["Attention over image regions", "Text-and-image prompts", "Visual question answering"],
      distractors: ["Invoice tax filing", "Speech prosody", "PII redaction only"],
      rationale: "The unit covers transformers and multimodal vision-language tasks.",
    },
  },
  "5-6": {
    title: "Image generation",
    concepts: [
      { term: "image generation", meaning: "creating new visual output from a prompt or other input" },
      { term: "prompt", meaning: "the text instruction that describes the desired image" },
      { term: "style", meaning: "visual direction such as realistic, diagrammatic, or illustrated" },
      { term: "iteration", meaning: "refining prompts or outputs until the image better matches the goal" },
    ],
    scenarios: [
      { stem: "A marketing team types a description and receives a new product background image. Which capability is used?", answer: "Generative image creation" },
      { stem: "A designer changes the wording to make an image more realistic and less cartoon-like. What is being refined?", answer: "The image prompt" },
      { stem: "A learner asks for a diagram-style image instead of a photo-style image. Which prompt detail is most relevant?", answer: "The requested visual style" },
    ],
    contrast: {
      stem: "How is image generation different from image classification?",
      answer: "Generation creates new images; classification labels existing images.",
      distractors: ["Generation only extracts text from receipts.", "Classification creates new pixels from prompts.", "Both are speech synthesis tasks."],
      rationale: "The unit separates creating visual content from analyzing existing images.",
    },
    process: {
      stem: "Why are prompt details important for image generation?",
      answer: "They guide subject, style, composition, and other visual properties of the output.",
      distractors: ["Prompts are ignored by image models.", "Prompt details only affect audio volume.", "Prompts remove the need to review generated content."],
      rationale: "Generated images depend heavily on prompt specificity.",
    },
    chooseTwo: {
      stem: "Which two prompt details can guide an image-generation model? Choose two.",
      correct: ["The subject to show", "The desired visual style"],
      distractors: ["A speech sampling rate", "A database primary key", "A sentiment score"],
      rationale: "Subject and style are common prompt controls for image output.",
    },
    chooseThree: {
      stem: "Which three practices support better generated image results? Choose three.",
      correct: ["Describe the main subject", "Specify style or format", "Iterate when the output misses the goal"],
      distractors: ["Assume the first output is final", "Use only hidden system settings", "Ignore responsible AI review"],
      rationale: "Clear prompting and iteration improve generated visual outputs.",
    },
  },
  "6-2": {
    title: "Overview of information extraction",
    concepts: [
      { term: "information extraction", meaning: "turning content into structured data that can be searched, stored, or automated" },
      { term: "structured data", meaning: "organized values such as fields, labels, or records" },
      { term: "unstructured content", meaning: "content such as documents, images, audio, or video without fixed fields" },
      { term: "content understanding", meaning: "AI analysis that identifies useful information in varied content types" },
    ],
    scenarios: [
      { stem: "A company receives many scanned claims and wants key values entered into a system automatically. Which workload is this?", answer: "Information extraction" },
      { stem: "A contract is a long PDF with clauses, dates, and parties. What kind of source content is it before extraction?", answer: "Unstructured or semi-structured content" },
      { stem: "A pipeline creates records from documents so downstream apps can filter and report on them. What is the desired output?", answer: "Structured data" },
    ],
    contrast: {
      stem: "How is information extraction different from simple document storage?",
      answer: "Extraction identifies usable values; storage only keeps the file.",
      distractors: ["Extraction only changes file names.", "Storage always understands every field automatically.", "Extraction is used only for speech synthesis."],
      rationale: "The unit focuses on turning content into actionable data.",
    },
    process: {
      stem: "Why is a schema or expected field list useful in extraction?",
      answer: "It defines what information the solution should find and return.",
      distractors: ["It prevents the system from reading text.", "It is only used to generate images.", "It removes the need to validate outputs."],
      rationale: "Extraction depends on knowing which fields or data points matter.",
    },
    chooseTwo: {
      stem: "Which two are common information extraction targets? Choose two.",
      correct: ["Document fields", "Text in images"],
      distractors: ["Screen brightness", "Mouse speed", "Audio volume preference only"],
      rationale: "Document values and image text are common extraction targets.",
    },
    chooseThree: {
      stem: "Which three benefits can information extraction provide? Choose three.",
      correct: ["Reduced manual data entry", "Searchable structured records", "Automation from document content"],
      distractors: ["Guaranteed perfect results without review", "Automatic model fairness", "Visual style generation"],
      rationale: "Extraction makes content usable in workflows, but validation still matters.",
    },
  },
  "6-3": {
    title: "Optical character recognition (OCR)",
    concepts: [
      { term: "OCR", meaning: "detecting and reading text from images or scanned documents" },
      { term: "printed text recognition", meaning: "reading machine-printed characters from visual content" },
      { term: "handwriting recognition", meaning: "recognizing handwritten characters or words" },
      { term: "text location", meaning: "identifying where recognized text appears in an image" },
    ],
    scenarios: [
      { stem: "A system needs to read text from photos of street signs. Which capability is required?", answer: "OCR" },
      { stem: "A document processor extracts words and their positions from a scanned page. What OCR output is useful here?", answer: "Recognized text with locations" },
      { stem: "A claims app reads handwritten notes on a form. Which OCR challenge applies?", answer: "Handwriting recognition" },
    ],
    contrast: {
      stem: "How is OCR different from general object detection?",
      answer: "OCR reads text characters; object detection identifies and locates visual objects.",
      distractors: ["OCR creates voices, while object detection summarizes text.", "Object detection only works on PDFs.", "OCR is the same as sentiment analysis."],
      rationale: "OCR is specialized for visual text extraction.",
    },
    process: {
      stem: "Why can image quality affect OCR results?",
      answer: "Blur, skew, low contrast, or poor resolution can make characters harder to recognize.",
      distractors: ["Image quality never affects text recognition.", "OCR requires audio quality instead.", "Low contrast always improves OCR accuracy."],
      rationale: "OCR depends on readable visual text.",
    },
    chooseTwo: {
      stem: "Which two inputs are suitable for OCR? Choose two.",
      correct: ["A scanned invoice", "A photo of a sign"],
      distractors: ["A spoken phone call only", "A sentiment label", "A calendar invitation with no image"],
      rationale: "OCR works on visual content that contains text.",
    },
    chooseThree: {
      stem: "Which three factors can affect OCR quality? Choose three.",
      correct: ["Image resolution", "Text clarity", "Page orientation"],
      distractors: ["Voice cadence", "Prompt temperature only", "Chat history length"],
      rationale: "Readable, well-oriented images support better OCR.",
    },
  },
  "6-4": {
    title: "Field extraction and mapping",
    concepts: [
      { term: "field extraction", meaning: "identifying specific named values in content" },
      { term: "field mapping", meaning: "connecting extracted values to expected output fields" },
      { term: "custom extraction", meaning: "training or configuring extraction for fields that are specific to a business form" },
      { term: "confidence score", meaning: "an indicator of how certain the system is about an extracted value" },
    ],
    scenarios: [
      { stem: "An invoice solution must return vendor name, invoice date, and total as separate values. Which capability is needed?", answer: "Field extraction" },
      { stem: "A system assigns the text '05/06/2026' to the InvoiceDate property in an output record. What is this?", answer: "Field mapping" },
      { stem: "A human reviewer checks low-confidence extracted totals before submission. What value triggered review?", answer: "Confidence score" },
    ],
    contrast: {
      stem: "How is field extraction different from OCR?",
      answer: "OCR reads text; field extraction identifies which text is the specific value a workflow needs.",
      distractors: ["Field extraction generates synthetic voices.", "OCR maps every value to a schema automatically.", "They both only classify image labels."],
      rationale: "The unit separates reading text from mapping meaningful fields.",
    },
    process: {
      stem: "Why is mapping important after extracting fields?",
      answer: "It lets applications store each value in the correct business field.",
      distractors: ["It removes the need to know the document type.", "It converts documents into spoken prompts.", "It hides all extracted data from users."],
      rationale: "Extraction becomes useful when values are mapped to structured outputs.",
    },
    chooseTwo: {
      stem: "Which two examples are document fields? Choose two.",
      correct: ["Purchase order number", "Due date"],
      distractors: ["Camera shutter speed", "Voice pitch", "Prompt creativity setting"],
      rationale: "Business documents often contain identifiers and dates that can be extracted.",
    },
    chooseThree: {
      stem: "Which three practices support reliable field extraction? Choose three.",
      correct: ["Define expected fields", "Review low-confidence values", "Validate mapped output"],
      distractors: ["Ignore form layout", "Treat every document as an image-generation prompt", "Remove all labels before testing"],
      rationale: "Good extraction depends on clear fields, confidence-aware review, and validation.",
    },
  },
});

const { units } = parseManifest();
const requested = new Set(process.argv.slice(2));
const targetUnits = units
  .filter((unit) => !preserveManual.has(unit.id))
  .filter((unit) => requested.size === 0 || requested.has(unit.id));

const missing = targetUnits.filter((unit) => !profiles[unit.id]);
if (missing.length) {
  console.error("Missing real-question profiles:");
  for (const unit of missing) console.error(`- ${unit.id} ${unit.title}`);
  process.exit(1);
}

for (const unit of targetUnits) {
  writeBank(unit, profiles[unit.id]);
  console.log(`Wrote Module ${unit.moduleNumber} Unit ${unit.unitNumber}: ${unit.title}`);
}

console.log(`Real-question rewrite complete for ${targetUnits.length} units. Preserved ${preserveManual.size} hand-authored units.`);
