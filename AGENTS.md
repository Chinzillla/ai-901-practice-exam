# AGENTS.md

## Purpose

This repository contains course materials for learners preparing for the Microsoft AI-901 exam. The content must help newcomers understand core AI concepts, practice exam-style reasoning, and build confidence through structured lessons and question banks.

Codex should treat this file as the canonical project instruction file. `AGENT.md` exists only as a compatibility note for people who look for the singular filename.

## Codex Compatibility

Codex uses `AGENTS.md` as project guidance. Instructions in this root file apply to the whole repository unless a more specific nested `AGENTS.md` is added inside a module folder.

If a nested `AGENTS.md` is added later, follow the closest applicable file for the content being edited. Direct user instructions in chat take precedence over this file.

Keep this file concise enough to avoid instruction truncation. If the course grows and module-specific guidance becomes large, place focused `AGENTS.md` files inside individual module folders instead of expanding this root file indefinitely.

## Course Content Principles

All course materials should be:

- Beginner-friendly for learners who may be new to AI.
- Structured enough for instructors to teach from directly.
- Aligned with AI-901-style conceptual and scenario-based assessment.
- Based primarily on the unit content provided by the user.
- Practical, clear, and free of unnecessary advanced implementation detail.

Do not turn beginner lessons into dense academic notes. Teach the idea, show a simple example, reinforce the concept, then assess it.

## Repository Structure

Use one folder per module:

```text
Module1/
Module2/
Module3/
```

Use one lesson plan and one question bank per unit:

```text
Module1/
  unit1_lesson_plan.md
  unit1_question_bank.md
  unit2_lesson_plan.md
  unit2_question_bank.md
```

For all new units, use explicit unit numbers:

```text
unit#_lesson_plan.md
unit#_question_bank.md
```

If older files use a different pattern, do not rename them unless the user asks for a cleanup pass.

## Markdown Standards

All course content must be Markdown.

Use this heading pattern:

```markdown
# Module #: Module Name

## Unit #: Unit Name

### Section Name
```

Keep text readable for newcomers:

- Prefer short paragraphs.
- Define acronyms before relying on them.
- Use tables for key terms when useful.
- Use horizontal rules between question-bank items.
- Avoid unexplained vendor or engineering details unless the source unit requires them.

## Lesson Plan Template

Each lesson plan should use this structure:

```markdown
# Module #: Module Name

## Unit #: Unit Name

### Unit Overview

### Learning Objectives

### Key Terms

### Lesson Flow

#### 1. Topic Name

#### 2. Topic Name

### Suggested Activities

### Checks for Understanding

### Assessment

### Teaching Notes

### Estimated Duration

### Materials
```

Lesson plans must include:

- A short overview explaining what the learner will study and why it matters.
- Measurable learning objectives using verbs such as define, identify, explain, describe, distinguish, recognize, compare, and choose.
- A key terms table with learner-friendly definitions.
- A lesson flow that follows the provided source content.
- Examples that are simple enough for beginners.
- Activities that require learners to apply the concept.
- Checks for understanding that an instructor can ask during or after the lesson.
- Teaching notes that highlight likely AI-901 exam angles.
- An estimated duration, usually 45 to 60 minutes unless the unit is unusually short or long.

## Question Bank Template

Each question bank should use this structure:

```markdown
# Module #: Module Name

## Unit # Question Bank: Unit Name

Short description of what the questions reinforce.

---

### 1. Question text?

A. Option  
B. Option  
C. Option  
D. Option  

**Answer:** B  
**Rationale:** Brief explanation of why the answer is correct.
```

Question banks must include:

- At least 20 questions per unit unless the user requests a different amount.
- Prefer 25 questions for standard units.
- A mix of multiple-choice and true-or-false questions.
- Four answer options for each multiple-choice question.
- A correct answer and rationale for every question.
- Scenario-based questions where possible.
- Clear distractors that are wrong for a defensible reason.
- Beginner-accessible wording without sacrificing exam accuracy.

Avoid:

- Ambiguous wording.
- Trick questions.
- Multiple defensible correct answers.
- "All of the above" or "none of the above" unless specifically requested.
- Long rationales that introduce off-topic concepts.

## Question Design Principles

Question banks should test understanding, not memorization alone.

Use these question types:

- Definition questions: confirm learners know key terms.
- Scenario questions: ask learners to choose the best AI capability for a business requirement.
- Comparison questions: distinguish related concepts.
- Process questions: identify what happens first or why a technique is used.
- True-or-false questions: reinforce core facts quickly.

Balance difficulty:

- Easy: definitions and direct recall.
- Medium: choosing the right concept for a scenario.
- Challenging: distinguishing similar services, techniques, or use cases.

For AI-901 preparation, favor scenario prompts like:

- "A company wants to analyze customer reviews for positive or negative opinions. Which capability should it use?"
- "An organization needs to remove names and phone numbers before sharing transcripts. Which NLP technique applies?"
- "A user wants to generate a first draft of a document from a prompt. Which AI workload is being used?"

## AI-901 Teaching Style

Write for learners who are new to AI.

Use this style:

- Clear and direct.
- Practical and example-driven.
- Exam-aware without sounding like a test-prep cram sheet.
- Friendly to beginners without being vague.

Every unit should help the learner answer three questions:

- What is this concept?
- When would I use it?
- How might AI-901 test it in a scenario?

## Scope Control

Base each unit on the content supplied by the user.

It is acceptable to add:

- Simple examples.
- Instructor activities.
- Checks for understanding.
- Scenario framing.
- Short clarifications that make the concept easier to learn.

Do not add unrelated AI topics, advanced system design details, or certification objectives outside the supplied unit unless the user asks for broader coverage.

When the user asks for current exam objectives, official alignment, or the latest AI-901 scope, verify against current official Microsoft material before changing the course structure.

## Codex Tool Use

Use Codex tools deliberately to improve quality:

- Use shell commands to inspect folders, read existing Markdown, and verify generated files.
- Use `apply_patch` for manual file creation and edits.
- Use web search only when the user asks for current, official, or externally verified information, or when exam objective accuracy depends on up-to-date sources.
- Prefer official sources for exam-scope verification.
- Use document, spreadsheet, or presentation tooling only when the user asks for exports or course artifacts in those formats.
- Use browser or visual tools only when building or checking web-based course experiences.
- Use image generation only when a lesson needs custom visual assets and the user wants image output.

After creating or editing files, verify:

```powershell
Get-ChildItem -Recurse -Force
Get-Content -Path .\Module1\unit#_lesson_plan.md -TotalCount 20
Get-Content -Path .\Module1\unit#_question_bank.md -TotalCount 20
```

Adjust paths for the relevant module and unit.

## New Unit Workflow

When adding a new unit:

1. Follow `AI901_AGENT_WORKFLOW.md`.
2. Use `AI901_SOURCE_MANIFEST.md` to identify the next Microsoft Learn text unit.
3. Identify the repository module number and unit number.
4. Create or reuse the module folder.
5. Create `unit#_lesson_plan.md`.
6. Create `unit#_question_bank.md`.
7. Follow the lesson plan and question bank templates.
8. Include beginner-friendly examples and AI-901-style scenarios.
9. Verify the files exist and have the expected headings.
10. Update `AI901_SOURCE_MANIFEST.md` with the unit status.

When updating existing content:

1. Preserve previous materials unless the user asks for reorganization.
2. Keep edits focused on the requested unit or module.
3. Maintain consistent terminology across the course.
4. Do not delete prior lessons or question banks unless explicitly requested.

## Quality Checklist

Before finishing any unit, confirm:

- The lesson plan includes overview, objectives, key terms, lesson flow, activities, checks, assessment, teaching notes, duration, and materials.
- The question bank includes numbered questions, answer choices, correct answers, and rationales.
- Scenario questions are included.
- The content is clear for newcomers.
- The content reinforces AI-901 exam readiness.
- Markdown headings and formatting are consistent.
- File names follow the repository naming convention for new units.

## Current Repository Note

Module 1 now follows the explicit unit-number naming convention:

```text
Module1/unit1_lesson_plan.md
Module1/unit1_question_bank.md
Module1/unit2_lesson_plan.md
Module1/unit2_question_bank.md
Module1/unit3_lesson_plan.md
Module1/unit3_question_bank.md
```

Course traversal is tracked in:

```text
AI901_AGENT_WORKFLOW.md
AI901_SOURCE_MANIFEST.md
```
