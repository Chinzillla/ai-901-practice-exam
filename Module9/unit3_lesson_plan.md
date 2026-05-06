# Module 9: Develop a Generative AI Chat App with Microsoft Foundry

## Unit 3: Choose an endpoint and SDK

### Source

[Microsoft Learn unit](https://learn.microsoft.com/en-us/training/modules/foundry-sdk/03-microsoft-foundry-sdk)

### Unit Overview

This unit compares Foundry project endpoints, Azure OpenAI endpoints, the Microsoft Foundry SDK, and the OpenAI SDK. It also reinforces secure authentication choices.

### Learning Objectives

- compare Foundry SDK and OpenAI SDK use cases
- identify project and Azure OpenAI endpoint roles
- explain why Microsoft Entra ID is preferred for production
- recognize when combining SDKs is useful

### Key Terms

| Term | Beginner-Friendly Definition |
| --- | --- |
| Project endpoint | A Microsoft Foundry endpoint associated with project-level resources and capabilities. |
| Azure OpenAI endpoint | An endpoint focused on Azure OpenAI model inference and API compatibility. |
| Foundry SDK | SDK packages that expose project features such as connections, datasets, tracing, evaluations, and agents. |
| OpenAI SDK | SDK used for OpenAI-compatible model inference such as Responses and ChatCompletions. |
| Microsoft Entra ID | Microsoft's identity platform, commonly preferred for production authentication. |

### Lesson Flow

#### 1. SDK selection

- Use Foundry SDK when the app needs project-level features such as connections, tracing, evaluations, or agents.
- Use OpenAI SDK when the app mainly needs model inference with OpenAI-compatible APIs.

#### 2. Authentication

- Production apps should prefer Microsoft Entra ID where possible.
- Key-based authentication should be protected, for example with secure secret storage.

#### 3. Combined use

- Developers can combine Foundry project features with OpenAI model inference in the same app.

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
