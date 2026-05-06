# Module 4: Introduction to AI Speech Concepts

## Unit 3 Question Bank: Speech Recognition

These questions test understanding of the speech recognition pipeline, including audio capture, MFCC feature extraction, acoustic modeling, language modeling, decoding, and post-processing.

---

### 1. What activity happens during the pre-processing stage of speech recognition?

A. The final transcript is capitalized and punctuated.  
B. Feature vectors are extracted from the audio waveform for modeling.  
C. The text is converted into spoken audio.  
D. The decoder selects the final word sequence.  

**Answer:** B  
**Rationale:** Pre-processing transforms raw audio into compact feature vectors, commonly using MFCCs, so later models can recognize speech patterns.

---

### 2. What are phonemes?

A. Artifacts removed from the audio signal during filtering.  
B. The smallest units of sound that distinguish words.  
C. AI models that generate audio waveforms.  
D. Formatting rules that add punctuation to transcripts.  

**Answer:** B  
**Rationale:** Acoustic models predict phonemes, the smallest sound units in spoken language.

---

### 3. Why is audio sampled during the audio capture stage?

A. To convert analog sound waves into a digital signal that can be processed.  
B. To add punctuation and capitalization to the final text.  
C. To convert written text into speech.  
D. To train a custom vocabulary after transcription is complete.  

**Answer:** A  
**Rationale:** Speech recognition begins by converting sound waves captured by a microphone into digital numeric samples.

---

### 4. Which two factors can reduce speech recognition accuracy before modeling even begins? Choose two.

A. Poor microphone quality  
B. Background noise  
C. Correct punctuation restoration  
D. A well-trained language model  
E. Clear audio capture  

**Answer:** A, B  
**Rationale:** Background noise, microphone quality, and distance from the speaker affect downstream recognition accuracy.

---

### 5. What is the purpose of MFCC feature extraction?

A. To convert a transcript into a natural-sounding voice.  
B. To summarize the spectral shape of short audio frames in a compact numeric form.  
C. To choose between multiple grammatically valid word sequences.  
D. To mask profanity in the final transcript.  

**Answer:** B  
**Rationale:** MFCCs represent audio frames as feature vectors that capture speech characteristics without storing every raw sample.

---

### 6. During acoustic modeling, what does the model predict from audio feature vectors?

A. Phoneme probabilities for each moment in time  
B. The final formatted transcript with punctuation  
C. The user's preferred speaking style  
D. The written form of dates and currency  

**Answer:** A  
**Rationale:** Acoustic modeling uses features such as MFCC vectors to predict likely phonemes over time.

---

### 7. Why is language modeling needed after acoustic modeling?

A. Phoneme predictions alone may be ambiguous, so vocabulary and grammar help choose likely word sequences.  
B. Language modeling samples analog audio at 16 kHz.  
C. Language modeling removes hums and clicks from the input signal.  
D. Language modeling converts normalized text into audio.  

**Answer:** A  
**Rationale:** Language models use vocabulary, grammar, context, and domain patterns to resolve ambiguous sound sequences such as "their" and "there."

---

### 8. What does beam search do during decoding?

A. It keeps a shortlist of likely partial transcriptions and prunes weaker paths.  
B. It expands abbreviations such as "Dr." into "Doctor."  
C. It converts speech audio into mel-spectrograms.  
D. It adds background noise to test model reliability.  

**Answer:** A  
**Rationale:** Beam search evaluates many possible word sequences while keeping only the strongest candidate paths.

---

### 9. Which three are common post-processing tasks in speech recognition? Choose three.

A. Adding punctuation  
B. Formatting spoken numbers as digits  
C. Flagging low-confidence words  
D. Sampling analog audio thousands of times per second  
E. Predicting phoneme probabilities  
F. Converting phonemes into an audio waveform  

**Answer:** A, B, C  
**Rationale:** Post-processing cleans raw decoded text with punctuation, number formatting, inverse text normalization, profanity filtering, and confidence scoring.

---

### 10. A medical transcription app returns the wrong specialized terms even though the audio is clear. Which stage is most likely to need improvement?

A. Language modeling with domain-specific vocabulary  
B. Audio capture with a higher music-quality sampling rate  
C. Text-to-speech vocoding  
D. Visual object detection  

**Answer:** A  
**Rationale:** Domain adaptation in language modeling improves recognition of specialized terminology such as medical or legal vocabulary.
