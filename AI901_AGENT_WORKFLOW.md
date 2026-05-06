# AI-901 Course Build Agent Workflow

## Goal

Build a structured AI-901 course with lesson plans and original question banks that reinforce learner knowledge and prepare newcomers for the Microsoft AI-901 exam.

## Source Policy

Use official Microsoft Learn pages as the source of truth.

Primary exam page:

- [Exam AI-901: Microsoft Azure AI Fundamentals (beta)](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/?WT.mc_id=studentamb_165290)

Self-paced learning paths from the exam page:

- [AI concepts for developers and technology professionals](https://learn.microsoft.com/en-us/training/paths/ai-concepts/)
- [Develop generative AI apps in Azure](https://learn.microsoft.com/en-us/training/paths/develop-generative-ai-apps/)

When a Microsoft Learn module offers video and text, use the text page. Do not base lesson plans or question banks on video-only content.

## Build Order

Follow the order in `AI901_SOURCE_MANIFEST.md`.

1. Complete every unit in a module before moving to the next module.
2. Complete every module in the first learning path before moving to the second learning path.
3. For each unit, create a lesson plan and question bank before advancing.
4. Track completion in the manifest so work can resume without guessing.

## Repository Mapping

Each Microsoft Learn module maps to a repository module folder.

```text
Learning Path 1 Module 1 -> Module1/
Learning Path 1 Module 2 -> Module2/
Learning Path 1 Module 3 -> Module3/
Learning Path 1 Module 4 -> Module4/
Learning Path 1 Module 5 -> Module5/
Learning Path 1 Module 6 -> Module6/
Learning Path 2 Module 1 -> Module7/
Learning Path 2 Module 2 -> Module8/
Learning Path 2 Module 3 -> Module9/
Learning Path 2 Module 4 -> Module10/
Learning Path 2 Module 5 -> Module11/
Learning Path 2 Module 6 -> Module12/
```

Use explicit unit files:

```text
Module#/unit#_lesson_plan.md
Module#/unit#_question_bank.md
```

## Unit Creation Workflow

For each unit:

1. Open the unit link from `AI901_SOURCE_MANIFEST.md`.
2. Use the text content as the source.
3. Create `unit#_lesson_plan.md`.
4. Create `unit#_question_bank.md`.
5. Include the Microsoft Learn source link near the top of the lesson plan.
6. Keep wording original; do not copy long passages from Microsoft Learn.
7. Create questions that reinforce the concept and test scenario recognition.
8. Verify the new files exist and have the expected headings.
9. Update `AI901_SOURCE_MANIFEST.md` status for the unit.

## Lesson Plan Requirements

Use the structure from `AGENTS.md`:

- Unit Overview
- Learning Objectives
- Key Terms
- Lesson Flow
- Suggested Activities
- Checks for Understanding
- Assessment
- Teaching Notes
- Estimated Duration
- Materials

Lesson plans should be useful for a new instructor and clear for a learner studying independently.

## Question Bank Requirements

Use the structure from `AGENTS.md`.

Default target:

- 20 to 25 original questions per unit.
- Four choices for multiple-choice questions.
- A mix of direct recall, comparison, process, and scenario questions.
- True-or-false questions only when they reinforce core facts.
- Answer and rationale for every question.

For thin units such as introductions and summaries, create fewer questions only if the source does not support 20 meaningful questions. Do not pad with repetitive or low-value questions.

## Assessment and Exercise Units

Do not copy Microsoft Learn module assessment questions.

For Microsoft Learn exercise units:

- Create a lesson plan that explains the purpose of the exercise.
- Create an original question bank that reinforces what the exercise is meant to practice.

For Microsoft Learn assessment units:

- Create an original assessment-prep question bank based on the module's prior instructional units.
- Do not reproduce Microsoft Learn assessment content.

For summary units:

- Create a concise review lesson plan.
- Create cumulative review questions for the module.

## Verification Workflow

After each unit:

```powershell
Get-ChildItem -Force .\Module#
Get-Content -Path .\Module#\unit#_lesson_plan.md -TotalCount 20
Get-Content -Path .\Module#\unit#_question_bank.md -TotalCount 20
```

After each module:

```powershell
Get-ChildItem -Recurse -Force .\Module#
Select-String -Path .\Module#\unit*_question_bank.md -Pattern '^### [0-9]+\.'
Select-String -Path .\Module#\unit*_question_bank.md -Pattern '^\*\*Answer:\*\*|^\*\*Rationale:\*\*'
```

## Current Build Position

Current position after this workflow was updated:

- Learning Path 1 complete: Modules 1 through 6 created
- Learning Path 2 complete: Modules 7 through 12 created
- All tracked Microsoft Learn units currently have lesson plans and question banks

