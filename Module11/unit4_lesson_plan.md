# Module 11: Optimize Generative AI Model Performance with Microsoft Foundry

## Unit 4: Fine-tune a model for consistent behavior

### Source

[Microsoft Learn unit](https://learn.microsoft.com/en-us/training/modules/optimize-generative-ai-model-performance/4-fine-tune-model)

### Unit Overview

This unit explains when fine-tuning is useful, how it specializes a pretrained model, the role of LoRA, fine-tuning approaches, training data, and trade-offs.

### Learning Objectives

- define fine-tuning
- identify when fine-tuning is appropriate
- compare SFT, RFT, and DPO
- describe training data requirements
- recognize fine-tuning risks and costs

### Key Terms

| Term | Beginner-Friendly Definition |
| --- | --- |
| Fine-tuning | Further training a pretrained model on task-specific examples. |
| LoRA | Low-Rank Adaptation, a technique that updates a smaller subset of parameters efficiently. |
| Supervised fine-tuning | Training with labeled prompt-response examples. |
| Reinforcement fine-tuning | Improving behavior through iterative feedback from a grader. |
| Direct Preference Optimization | Aligning outputs using preferred and non-preferred response pairs. |
| JSONL | A JSON Lines file format often used for training examples. |

### Lesson Flow

#### 1. When to consider

- Use fine-tuning when prompt engineering does not achieve consistent style, format, tool usage, or behavior.
- Start with a baseline evaluation before fine-tuning.

#### 2. Techniques

- SFT works for clear prompt-response patterns.
- RFT can support complex dynamic tasks.
- DPO aligns responses to human preferences.

#### 3. Costs and risks

- Fine-tuning requires high-quality data, training cost, hosting cost, maintenance, and drift monitoring.

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
