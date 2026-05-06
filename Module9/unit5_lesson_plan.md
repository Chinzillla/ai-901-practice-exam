# Module 9: Develop a Generative AI Chat App with Microsoft Foundry

## Unit 5: Generate responses with the ChatCompletions API

### Source

[Microsoft Learn unit](https://learn.microsoft.com/en-us/training/modules/foundry-sdk/05-openai-api)

### Unit Overview

This unit reviews the established ChatCompletions API pattern, where applications send message arrays and manage conversation history themselves.

### Learning Objectives

- describe the ChatCompletions message format
- compare ChatCompletions with Responses API
- explain why apps manage history manually
- identify scenarios where established compatibility matters

### Key Terms

| Term | Beginner-Friendly Definition |
| --- | --- |
| ChatCompletions API | An established API pattern that generates chat responses from a list of role-based messages. |
| Message array | A list of system, user, and assistant messages sent to the model. |
| Conversation history | Previous messages included so the model can respond with context. |
| Role | The message label, such as system, user, or assistant. |
| Compatibility | The ability to use established patterns across existing apps or platforms. |

### Lesson Flow

#### 1. Message format

- ChatCompletions uses JSON message objects with roles and content.
- The app includes the relevant history in each request.

#### 2. Comparison

- Responses API offers newer stateful patterns.
- ChatCompletions remains useful for existing applications and cross-platform compatibility.

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
