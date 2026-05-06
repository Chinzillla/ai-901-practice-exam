# Module 4: Introduction to AI Speech Concepts

## Unit 3: Speech Recognition

### Source

Microsoft Learn: [Speech recognition](https://learn.microsoft.com/en-us/training/modules/introduction-ai-speech/3-speech-recognition)

### Unit Overview

This unit explains the speech recognition pipeline that converts spoken language into written text. Learners review audio capture, preprocessing and feature extraction, acoustic modeling, language modeling, decoding, and post-processing.

### Learning Objectives

By the end of this unit, learners should be able to:

- Define speech recognition and speech-to-text.
- Identify the major stages in the speech recognition pipeline.
- Explain why audio quality affects accuracy.
- Describe MFCC features at a high level.
- Define phonemes.
- Explain the role of language modeling and decoding.
- Recognize common post-processing tasks.

### Key Terms

| Term | Definition |
| --- | --- |
| Speech recognition | Converting spoken audio into written text. |
| Audio capture | Converting sound waves into a digital signal. |
| Feature vector | A compact numeric representation of audio characteristics. |
| MFCC | A common technique for extracting speech features from audio. |
| Phoneme | The smallest unit of sound that distinguishes words. |
| Acoustic model | A model that relates audio features to phonemes. |
| Language model | A model that applies vocabulary, grammar, and context to predict word sequences. |
| Decoding | Selecting the most likely text transcription. |
| Post-processing | Formatting and cleaning transcription output. |

### Lesson Flow

#### 1. Audio Capture

Explain that microphones convert sound waves into digital samples. Audio quality, noise, microphone quality, and speaker distance affect recognition.

#### 2. Preprocessing and MFCC Features

Explain that raw audio is transformed into compact feature vectors. MFCCs summarize speech characteristics for modeling.

#### 3. Acoustic Modeling

Define phonemes and explain that acoustic models predict likely phonemes from audio features.

#### 4. Language Modeling

Explain that language models resolve ambiguity by applying vocabulary, grammar, common patterns, and domain terminology.

#### 5. Decoding

Explain that decoding chooses the best text hypothesis from many possible word sequences.

#### 6. Post-Processing

Review capitalization, punctuation, number formatting, profanity filtering, inverse text normalization, timestamps, and confidence scoring.

### Suggested Activities

#### Activity 1: Pipeline Ordering

Learners put recognition stages in order.

#### Activity 2: Diagnose Accuracy Problems

Learners identify whether a problem is likely caused by audio quality, language ambiguity, or post-processing.

### Checks for Understanding

1. What is speech recognition?
2. What are phonemes?
3. Why does preprocessing extract feature vectors?
4. How does a language model help transcription?
5. What does post-processing do?

### Assessment

Use the accompanying `unit3_question_bank.md` file to assess learner understanding.

### Teaching Notes

- Keep MFCC and transformer details high level.
- Emphasize the full pipeline rather than one magic step.

### Estimated Duration

60 to 75 minutes

### Materials

- Microsoft Learn Unit 3 text page
- Pipeline diagram or whiteboard
- Module 4 Unit 3 question bank

