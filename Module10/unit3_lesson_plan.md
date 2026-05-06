# Module 10: Develop Generative AI Apps that Use Tools

## Unit 3: Use the code_interpreter tool

### Source

[Microsoft Learn unit](https://learn.microsoft.com/en-us/training/modules/use-generative-ai-tools/03-code-interpreter)

### Unit Overview

Learners explore code_interpreter, which gives a model a sandboxed Python runtime for calculations, file handling, data analysis, and iterative problem solving.

### Learning Objectives

- describe code_interpreter capabilities
- identify appropriate use cases
- explain the execution flow
- recognize limitations and best practices

### Key Terms

| Term | Beginner-Friendly Definition |
| --- | --- |
| Sandbox | An isolated execution environment that restricts what code can access. |
| Dynamic Python execution | Code generated and run by the model during a conversation. |
| Data analysis | Using code to calculate, transform, or summarize data. |
| Execution result | The output or error returned to the model after code runs. |
| Timeout | A limit that stops long-running code execution. |

### Lesson Flow

#### 1. Capabilities

- The tool can run Python, process files, calculate results, use common libraries, and iterate after errors.
- It turns the model from only describing a method into testing the method.

#### 2. Process

- The request includes code_interpreter in the tools array.
- The model decides whether code is needed, writes code, receives results, and incorporates them into the response.

#### 3. Limits

- No external network access, possible library limits, memory constraints, and timeout limits apply.

### Suggested Activities

- Ask learners to summarize the unit in one sentence using beginner-friendly language.
- Give learners a short workplace scenario and have them choose the correct concept, tool, strategy, or responsibility.
- Have learners identify one exam clue word from the unit, such as current, uploaded, benchmark, grounded, fine-tuned, guardrail, or endpoint.
- Pair learners to explain why one tempting alternative is not the best answer.

### Checks for Understanding

- What problem does this unit's main concept solve?
- Which keyword in a scenario would point you toward this concept?
- What is one limitation or caution learners should remember?
- How would this concept appear in a simple AI-901-style business scenario?

### Assessment

Use the accompanying question bank to check recognition, scenario selection, vocabulary, and common misconceptions. Learners should be able to explain not only the correct answer, but why the distractors are less appropriate.

### Teaching Notes

- Keep the explanation practical and scenario-based.
- Emphasize the difference between similar concepts instead of asking learners to memorize product names only.
- Connect the unit to AI-901 readiness by asking, "What would the exam scenario be asking me to choose?"
- Reinforce that secure, responsible, and measured development choices matter in generative AI apps.

### Estimated Duration

45-60 minutes

### Materials

- Microsoft Learn source unit linked above
- Whiteboard or shared notes for key terms
- Microsoft Foundry portal access for demonstrations when available
- Accompanying unit question bank
