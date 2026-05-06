# Module 2: Introduction to Generative AI and Agents

## Unit 2: Large Language Models (LLMs)

### Source

Microsoft Learn: [Large language models (LLMs)](https://learn.microsoft.com/en-us/training/modules/fundamentals-generative-ai/3-language-models)

### Unit Overview

This unit explains large language models at a conceptual level. Learners explore prompts, completions, tokens, tokenization, embeddings, transformers, attention, and how a model predicts the next likely token in a sequence.

### Learning Objectives

By the end of this unit, learners should be able to:

- Describe the role of LLMs in generative AI.
- Explain prompts and completions.
- Define tokens and tokenization.
- Describe embeddings as vector-based representations of meaning.
- Explain the role of transformers and attention at a high level.
- Recognize how LLMs predict completions.

### Key Terms

| Term | Definition |
| --- | --- |
| Large language model (LLM) | A language model trained on large amounts of text to generate meaningful language responses. |
| Small language model (SLM) | A more compact language model often suited to focused or local scenarios. |
| Prompt | Input given to a model to start or guide a response. |
| Completion | The model's generated continuation or response. |
| Token | A unit of text, such as a word, subword, punctuation mark, or character sequence. |
| Tokenization | Breaking text into tokens and assigning identifiers to them. |
| Embedding | A vector representation that captures semantic relationships between tokens. |
| Transformer | A model architecture used by many modern language models. |
| Attention | A technique that helps a model evaluate relationships between tokens in context. |

### Lesson Flow

#### 1. LLMs and Language Relationships

Explain that LLMs learn linguistic and semantic relationships between words and phrases. These relationships help models reason over natural language and generate relevant responses.

#### 2. Prompts and Completions

Explain that LLMs generate completions from prompts. A prompt begins a sequence, and the model predicts likely continuation tokens.

#### 3. Tokenization

Explain that models work with tokens, not just whole words. Tokens may be words, subwords, punctuation, or common character sequences.

#### 4. Embeddings

Explain that tokens are represented as vectors. Embeddings encode meaning and relationships so similar concepts can be close in vector space.

#### 5. Transformers and Attention

Explain transformers at a high level. Attention helps the model determine which surrounding tokens matter most when representing or predicting a token.

#### 6. Predicting Completions

Explain that the model predicts the next most likely token, adds it to the sequence, and repeats until the response is complete.

### Suggested Activities

#### Activity 1: Predict the Next Word

Give learners sentence starters and ask which words are likely next and why.

#### Activity 2: Token Examples

Ask learners to break simple text into possible tokens, including punctuation and subwords.

#### Activity 3: Similar Meaning

Ask learners to identify words likely to have similar embeddings, such as dog and puppy.

### Checks for Understanding

1. What is an LLM?
2. What is a completion?
3. What is tokenization?
4. What are embeddings?
5. What does attention help a model do?
6. How does a model generate a response one token at a time?

### Assessment

Use the accompanying `unit2_question_bank.md` file to assess learner understanding.

### Teaching Notes

- Keep the transformer explanation high level.
- Reinforce that learners do not need to calculate embeddings or attention weights for AI-901.
- Use the predictive text analogy to keep the concept approachable.

### Estimated Duration

60 to 75 minutes

### Materials

- Microsoft Learn Unit 2 text page
- Whiteboard for token and next-word examples
- Module 2 Unit 2 question bank

