# Module 10: Develop Generative AI Apps that Use Tools

## Unit 6: Use the function tool

### Source

[Microsoft Learn unit](https://learn.microsoft.com/en-us/training/modules/use-generative-ai-tools/06-function)

### Unit Overview

This unit explains function calling, where the model requests a named function and the application runs the actual business logic before returning output to the model.

### Learning Objectives

- define function calling
- explain the application-controlled execution flow
- identify use cases for custom functions
- recognize validation and safety responsibilities

### Key Terms

| Term | Beginner-Friendly Definition |
| --- | --- |
| Function tool | A custom tool definition that lets the model request application code to run a function. |
| Function call | A structured request from the model naming a function and arguments. |
| function_call_output | The item sent back to the model containing the result of application-run logic. |
| Developer-controlled execution | The application, not the model, runs the actual business logic. |
| Input validation | Checking model-provided arguments before running code or calling systems. |

### Lesson Flow

#### 1. Pattern

- Define functions in the tools array.
- The model decides whether a function is needed and emits a structured function call.
- Application code validates inputs, runs the function, returns output, and the model completes the answer.

#### 2. Use cases

- Function calling connects to APIs, databases, workflows, utility functions, and controlled actions.

#### 3. Safety

- Keep functions focused, validate inputs, log calls, handle errors, and protect high-impact actions.

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
