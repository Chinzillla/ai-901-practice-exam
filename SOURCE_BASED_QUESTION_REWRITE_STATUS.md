# Source-Based Question Rewrite Status

This tracker exists because final question banks should be based on the actual Microsoft Learn text pages, not on generic term-definition generation.

## Policy

- Counted instructional units only.
- Exclude introductions, exercises, summaries, module assessments, and knowledge checks.
- Prefer 10 strong questions per counted unit.
- Include a mix of single-answer, choose-two, and choose-three items where the source supports it.
- Keep questions scoped to the unit text page.
- Avoid generic filler such as "choose the advanced-sounding option."
- Use paraphrased exam-style stems and answer choices. Do not use source-text sentence extraction as final question wording.

## Current Status

| Module | Unit | Status | Notes |
| --- | ---: | --- | --- |
| All counted modules | All counted units | DONE | 47 units rewritten with profile-authored, paraphrased questions using `scripts/rewrite-real-question-banks.mjs`; introductions, exercises, summaries, module assessments, and knowledge checks remain excluded from practice counts. |
| 4 | 2 | DONE | Hand-authored from Microsoft Learn speech-enabled solutions text. |
| 4 | 3 | DONE | Hand-authored from Microsoft Learn speech recognition text. |
| 4 | 4 | DONE | Hand-authored from Microsoft Learn speech synthesis text. |

The old generic rewrite script was removed. Future bulk updates should use the real-question profile compiler and then spot-check the affected banks before rebuilding `public/questions.json`.
