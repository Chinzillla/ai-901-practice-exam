# Module 1: Introduction to AI Concepts

## Unit 3: Text and Natural Language

### Unit Overview

This unit introduces natural language processing (NLP) and common text analysis techniques. Learners explore how NLP helps AI systems make sense of human language, why NLP is foundational to generative AI large language models, and how specialist NLP tools can be used for predictable text analysis tasks such as language detection, classification, sentiment analysis, key-term extraction, entity detection, summarization, and PII redaction.

### Learning Objectives

By the end of this unit, learners should be able to:

- Define natural language processing.
- Explain how NLP relates to generative AI and large language models.
- Identify common text analysis capabilities.
- Describe language detection and why it is often used early in a workflow.
- Explain text classification and sentiment analysis.
- Distinguish between key-term extraction and entity detection.
- Recognize personally identifiable information and explain why PII redaction matters.
- Identify common scenarios where NLP text analysis is useful.

### Key Terms

| Term | Definition |
| --- | --- |
| Natural language processing (NLP) | AI models and techniques used to make sense of human language. |
| Text analysis | The use of NLP techniques to analyze, summarize, classify, or extract information from natural language text. |
| Language detection | Determining which language or languages a document is written in. |
| Text classification | Assigning a document or body of text to a category. |
| Sentiment analysis | A type of text classification that determines whether text is positive, negative, or neutral. |
| Key-term extraction | Identifying important words or phrases in a document. |
| Entity detection | Finding mentions of entities such as people, places, organizations, products, and dates. |
| Personally identifiable information (PII) | Private information that can identify a person, such as a name, address, or telephone number. |
| PII redaction | Detecting and removing or masking private information from text. |
| Summarization | Reducing the amount of text while preserving the main points. |

### Lesson Flow

#### 1. Introduce NLP

Begin by defining natural language processing as a broad area of AI that helps systems understand and work with human language.

Connect NLP to the previous unit on generative AI. Explain that NLP is the foundation on which generative AI large language models are built. While generative AI can create responses and content, NLP also includes focused techniques for analyzing existing text.

Key teaching point: NLP is broader than chatbots and generative AI. It includes many techniques for understanding, classifying, extracting from, and summarizing text.

#### 2. Explain Text Analysis

Describe text analysis as the use of NLP techniques to analyze natural language text. Use the computing history site example: users could summarize articles about historical events and extract names, places, and dates from the articles.

Emphasize that text analysis can help turn large amounts of unstructured language into useful information.

Key teaching point: text analysis is often used to find meaning, structure, or important details in documents, transcripts, reviews, articles, and messages.

#### 3. Specialist NLP Tools and Predictable Results

Explain that although many NLP scenarios are now handled by generative AI models, specialist NLP tools are still useful. These tools can produce predictable outputs or apply custom rules for common tasks.

Examples include:

- Classifying feedback into known categories.
- Detecting specific entity types.
- Redacting private information before data is shared.
- Running consistent sentiment analysis across many reviews.

Key teaching point: generative AI is powerful, but specialist NLP tools may be preferred when consistency, repeatability, or custom rules are important.

#### 4. Language Detection

Introduce language detection as the process of determining which language or languages appear in a document.

Explain that language detection is often the first step in a multi-stage text processing workflow because later steps may depend on knowing the language.

Example: a document may need to be routed to a Spanish-language classifier, translated, or summarized using a language-appropriate model.

#### 5. Text Classification and Sentiment Analysis

Define text classification as assigning a document or body of text to a specific category.

Introduce sentiment analysis as a common classification task that determines whether text is positive, negative, or neutral.

Examples:

- Classifying a support ticket by issue type.
- Determining whether a product review is positive or negative.
- Evaluating opinion in social media posts or news articles.

Key teaching point: sentiment analysis is a type of text classification.

#### 6. Key-Term Extraction and Entity Detection

Explain that key-term extraction identifies important words or phrases in a document.

Explain that entity detection identifies specific types of items mentioned in text, such as people, places, organizations, products, and dates.

Use a short example:

Text: "Ada Lovelace wrote notes about the Analytical Engine in London."

Possible key terms: Ada Lovelace, Analytical Engine, notes  
Possible entities: Ada Lovelace as a person, Analytical Engine as a product or technology, London as a place

Key teaching point: key terms capture important concepts, while entities identify specific named items.

#### 7. PII Detection and Redaction

Introduce personally identifiable information as private details that can identify or contact a person. Examples include names, addresses, telephone numbers, and other private details.

Explain that PII redaction is a specialized form of entity detection. It detects private information and removes or masks it before data is shared or analyzed.

Key teaching point: PII redaction supports privacy and compliance with policies and legislation.

#### 8. Summarization

Define summarization as reducing the volume of text while preserving the main points.

Discuss common examples:

- Summarizing a long article.
- Condensing meeting transcripts.
- Extracting key topics from call transcripts.
- Creating a short version of a complex document.

Key teaching point: summarization should reduce length without losing the central meaning.

#### 9. Common Text Analysis Scenarios

Review common NLP text analysis scenarios:

- Analyzing documents or transcripts to determine key subjects.
- Identifying mentions of people, places, organizations, products, and other entities.
- Evaluating sentiment and opinion in social media posts, reviews, or articles.
- Implementing predictable chatbot dialogs for frequently asked questions.
- Redacting PII before sharing or analyzing data.

### Suggested Activities

#### Activity 1: Match the Technique

Give learners short business requirements and ask them to choose the best NLP technique.

Examples:

- "Find the language of each support request." Answer: Language detection.
- "Determine whether a review is positive, negative, or neutral." Answer: Sentiment analysis.
- "Find names and phone numbers before sharing support transcripts." Answer: PII detection and redaction.
- "Shorten a meeting transcript into main points." Answer: Summarization.

#### Activity 2: Key Term or Entity

Provide a short paragraph and ask learners to identify key terms and entities.

Example paragraph:

"Grace Hopper helped develop early programming languages and worked with the Harvard Mark I computer."

Learners can identify:

- Key terms: Grace Hopper, programming languages, Harvard Mark I
- Entities: Grace Hopper as a person, Harvard Mark I as a technology or product

#### Activity 3: Privacy Review

Give learners a short sample message containing names, phone numbers, and addresses. Ask them to identify what should be redacted before the text is shared for analysis.

Example:

"Please call Jordan Smith at 555-0108 about the delivery to 42 Market Street."

Expected PII:

- Jordan Smith
- 555-0108
- 42 Market Street

### Checks for Understanding

Use these questions during or after instruction:

1. What is natural language processing?
2. How does NLP relate to generative AI and LLMs?
3. What is language detection?
4. What is text classification?
5. How is sentiment analysis related to text classification?
6. What is the difference between key-term extraction and entity detection?
7. Why is PII redaction important?
8. What does summarization do?
9. Why might a specialist NLP tool be used instead of a generative AI model?

### Assessment

Use the accompanying `unit3_question_bank.md` file to assess learner understanding. The question bank includes multiple-choice and true-or-false questions with answers and rationales.

### Teaching Notes

- Reinforce that NLP is a broad field, not a single feature.
- Connect NLP to generative AI, but make clear that NLP also includes specialist text analysis tools.
- Emphasize that sentiment analysis is a type of text classification.
- Make PII examples concrete, such as names, addresses, and telephone numbers.
- Use scenario-based questions because AI-901 often tests whether learners can choose the right AI capability for a requirement.

### Estimated Duration

45 to 60 minutes

### Materials

- Unit 2 lesson content
- Module 1 Unit 2 question bank
- Example documents, reviews, or short transcripts
- Whiteboard or shared document for classifying techniques and identifying entities
