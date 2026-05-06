# Module 9: Develop a Generative AI Chat App with Microsoft Foundry

## Unit 4: Generate responses with the Responses API

### Source

[Microsoft Learn unit](https://learn.microsoft.com/en-us/training/modules/foundry-sdk/04-responses-api)

### Unit Overview

Learners study the Responses API as the recommended pattern for many new generative AI apps, including stateful multi-turn response generation.

### Learning Objectives

- describe the Responses API purpose
- identify common response properties
- explain previous_response_id
- recognize streaming and async options

### Key Terms

| Term | Beginner-Friendly Definition |
| --- | --- |
| Responses API | An OpenAI-compatible API for generating model responses, including support for stateful workflows. |
| previous_response_id | A value used to link a new request to earlier response context. |
| output_text | A convenient property for reading generated text from a response. |
| Streaming | Returning partial output as it is generated. |
| Async client | A client pattern that supports non-blocking calls. |

### Lesson Flow

#### 1. Core call

- Developers call responses.create with input, model or deployment details, instructions, and generation parameters.
- The response can include output text, status, usage, and an identifier.

#### 2. Conversation state

- previous_response_id can connect turns without the app manually resending every message.
- The context window still matters because prompts, history, tools, and retrieved data consume context.

#### 3. Output handling

- Streaming improves perceived responsiveness for long answers.
- Async patterns help apps scale without blocking.

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
