# Module 6: Introduction to AI-Powered Information Extraction Concepts

## Unit 4: Field Extraction and Mapping

### Source

Microsoft Learn: [Field extraction and mapping](https://learn.microsoft.com/en-us/training/modules/introduction-information-extraction/4-form-extraction)

### Unit Overview

This unit explains how OCR output becomes structured business data. Learners explore field detection, mapping, normalization, validation, and integration with downstream systems.

### Learning Objectives

- Define field extraction.
- Explain how OCR output is ingested.
- Compare template-based, machine learning, and generative AI extraction.
- Describe field mapping and association.
- Explain normalization, validation, and integration.

### Key Terms

| Term | Definition |
| --- | --- |
| Field extraction | Mapping OCR text to meaningful business fields. |
| Candidate value | A possible extracted field value. |
| Template-based extraction | Rule-based extraction using known layouts or labels. |
| Prompt-based extraction | Using an LLM with document text and schema instructions. |
| Data normalization | Converting values to consistent formats. |
| Cross-field validation | Checking relationships between extracted fields. |

### Lesson Flow

#### 1. OCR Output Ingestion

Explain that field extraction uses raw text, position metadata, confidence scores, and layout information.

#### 2. Field Detection

Compare templates, machine learning, and generative AI approaches.

#### 3. Field Mapping

Explain key-value pairing, proximity analysis, NER, table recognition, and row-column association.

#### 4. Normalization and Validation

Explain standardized dates, currency, units, required fields, ranges, and cross-field checks.

#### 5. Integration

Explain mapping fields to database schemas, API payloads, message queues, and business rules.

### Suggested Activities

- Learners map receipt OCR text to a schema.
- Learners identify validation checks for invoice totals.

### Checks for Understanding

1. How does field extraction differ from OCR?
2. When are templates useful?
3. How can generative AI help extraction?
4. Why is normalization important?

### Assessment

Use `unit4_question_bank.md`.

### Teaching Notes

This is the central unit for distinguishing "read text" from "understand field meaning."

### Estimated Duration

60 to 75 minutes

### Materials

- Microsoft Learn Unit 4 text page

