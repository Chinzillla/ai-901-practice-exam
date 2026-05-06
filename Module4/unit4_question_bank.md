# Module 4: Introduction to AI Speech Concepts

## Unit 4 Question Bank: Speech Synthesis

These questions test understanding of the speech synthesis pipeline, including text normalization, linguistic analysis, grapheme-to-phoneme conversion, prosody generation, and waveform synthesis.

---

### 1. What is the purpose of text normalization in speech synthesis?

A. To expand abbreviations, numbers, dates, and symbols into pronounceable spoken forms.  
B. To capture sound waves from a microphone.  
C. To choose the best transcript from competing word sequences.  
D. To remove background noise from raw audio.  

**Answer:** A  
**Rationale:** Text normalization prepares raw text for pronunciation by standardizing abbreviations, numbers, dates, symbols, and context-sensitive words.

---

### 2. A system converts "Dr. Smith ordered 3 items for $25.50" into a spoken-friendly phrase. Which stage is responsible?

A. Speech rhythm planning  
B. Text normalization  
C. Vocoding  
D. Microphone recording  

**Answer:** B  
**Rationale:** Text normalization expands abbreviations, numbers, and currency into forms that can be pronounced naturally.

---

### 3. What does grapheme-to-phoneme conversion do?

A. Maps written letters to pronunciation sounds.  
B. Converts raw audio samples into feature vectors.  
C. Adds commas and periods to a transcript.  
D. Routes callers to a service department.  

**Answer:** A  
**Rationale:** Grapheme-to-phoneme conversion maps graphemes, or written characters, to phonemes, or speech sounds.

---

### 4. Why can the letters "ough" be difficult for speech synthesis systems?

A. The same written letters can have different pronunciations in different words.  
B. The letters can only be processed by speech recognition systems.  
C. The letters always indicate the same phoneme sequence.  
D. The letters must be removed during text normalization.  

**Answer:** A  
**Rationale:** Words like "though," "through," and "cough" share the letters "ough" but are pronounced differently, so G2P must account for spelling-to-sound patterns.

---

### 5. Why is prosody important in speech synthesis?

A. It maximizes the volume of every generated audio file.  
B. It translates speech into the listener's language.  
C. It controls rhythm, stress, intonation, pauses, and cadence so speech sounds natural.  
D. It captures the user's microphone signal.  

**Answer:** C  
**Rationale:** Prosody determines how words are spoken, including pitch, duration, intensity, pauses, and stress patterns.

---

### 6. Which two are elements of prosody? Choose two.

A. Pitch contours  
B. Stress patterns  
C. Background noise filtering  
D. Beam width pruning  
E. Word-level confidence scoring  

**Answer:** A, B  
**Rationale:** Prosody includes pitch, duration, intensity, pauses, and stress patterns.

---

### 7. How do modern systems commonly predict prosody?

A. Transformer models analyze context across the sentence and predict pitch, duration, and energy.  
B. A microphone samples the speaker at 16 kHz.  
C. A decoder chooses between competing text hypotheses.  
D. A profanity filter masks inappropriate words.  

**Answer:** A  
**Rationale:** Transformer-based prosody prediction uses sentence context, linguistic features, and style factors to estimate how the speech should sound.

---

### 8. What does a neural vocoder do in the speech synthesis pipeline?

A. Converts mel-spectrograms or acoustic features into raw audio waveforms.  
B. Converts analog speech into a digital signal.  
C. Predicts grammar and vocabulary for a transcript.  
D. Flags low-confidence words for human review.  

**Answer:** A  
**Rationale:** Neural vocoders generate final audio waveforms from acoustic representations such as mel-spectrograms.

---

### 9. Which three steps occur in the speech synthesis pipeline? Choose three.

A. Text normalization expands raw text into spoken forms.  
B. Linguistic analysis maps text to phonemes.  
C. Prosody generation predicts pitch, duration, and emphasis.  
D. Beam search chooses the best text transcription.  
E. Audio capture samples a microphone signal.  
F. Post-processing adds punctuation to recognized speech.  

**Answer:** A, B, C  
**Rationale:** Speech synthesis proceeds through text normalization, linguistic analysis, prosody generation, and audio waveform generation. The distractors belong to speech recognition.

---

### 10. Robotic-sounding output has correct word pronunciation but flat, unnatural cadence. Which part of the synthesis pipeline is most likely weak?

A. Prosody prediction  
B. Audio capture  
C. Beam search decoding  
D. Confidence scoring  

**Answer:** A  
**Rationale:** The unit notes that flat, monotone prosody often causes robotic-sounding speech even when phoneme pronunciation is correct.
