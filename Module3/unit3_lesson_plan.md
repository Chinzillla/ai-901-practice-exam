# Module 3: Introduction to Natural Language Processing Concepts

## Unit 3: Statistical Text Analysis

### Source

Microsoft Learn: [Statistical text analysis](https://learn.microsoft.com/en-us/training/modules/introduction-language/3-statistical-techniques)

### Unit Overview

This unit introduces statistical techniques for inferring meaning from tokenized text. Learners explore frequency analysis, TF-IDF, bag-of-words machine learning, Naive Bayes classification, sentiment analysis, and TextRank summarization.

### Learning Objectives

By the end of this unit, learners should be able to:

- Explain frequency analysis.
- Describe why TF-IDF helps compare documents.
- Define bag-of-words representation.
- Recognize Naive Bayes as a classification technique.
- Explain extractive summarization with TextRank.
- Distinguish extractive and abstractive summarization.

### Key Terms

| Term | Definition |
| --- | --- |
| Frequency analysis | Counting token occurrences to infer important topics. |
| TF-IDF | A scoring technique that highlights terms frequent in one document but less common across the corpus. |
| Bag-of-words | A representation of text based on word frequencies or occurrences, ignoring grammar and word order. |
| Naive Bayes | A probabilistic classification technique that can use word frequencies as features. |
| TextRank | A graph-based algorithm used for tasks such as extractive summarization and keyword extraction. |
| Extractive summarization | Creating a summary by selecting sentences from the original text. |
| Abstractive summarization | Creating new language to summarize the source content. |

### Lesson Flow

#### 1. Frequency Analysis

Explain that counting normalized tokens can reveal document topics, especially for a single document.

#### 2. TF-IDF

Explain that TF-IDF helps identify terms that are important to one document but not common across all documents.

#### 3. Bag-of-Words and Classification

Explain bag-of-words as a feature representation for machine learning classifiers such as Naive Bayes. Use spam filtering and sentiment analysis as examples.

#### 4. TextRank

Explain TextRank as a graph-based method where important sentences are connected to other important sentences. It can support extractive summarization.

#### 5. Extractive vs. Abstractive Summaries

Clarify that extractive summaries reuse original sentences, while abstractive summaries generate new wording.

### Suggested Activities

#### Activity 1: Count Terms

Learners count frequent words in a short paragraph and infer the topic.

#### Activity 2: TF-IDF Reasoning

Learners identify which terms distinguish two similar documents.

#### Activity 3: Summary Type

Learners classify summaries as extractive or abstractive.

### Checks for Understanding

1. What does frequency analysis count?
2. Why is TF-IDF useful across multiple documents?
3. What does bag-of-words ignore?
4. What is TextRank used for?
5. How do extractive and abstractive summaries differ?

### Assessment

Use the accompanying `unit3_question_bank.md` file to assess learner understanding.

### Teaching Notes

- Keep formulas conceptual unless learners need more depth.
- Focus on when each technique is useful.
- Reinforce that older statistical techniques still explain many NLP foundations.

### Estimated Duration

60 to 75 minutes

### Materials

- Microsoft Learn Unit 3 text page
- Short sample documents
- Module 3 Unit 3 question bank

