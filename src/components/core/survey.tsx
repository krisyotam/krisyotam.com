/*
+------------------+----------------------------------------------------------+
| FILE             | survey.tsx                                               |
| ROLE             | Survey renderer with vertical scroll design              |
| OWNER            | Kris Yotam                                               |
| CREATED          | 2026-01-21                                               |
| UPDATED          | 2026-01-22                                               |
+------------------+----------------------------------------------------------+
| @type component                                                             |
| @path src/components/core/survey.tsx                                        |
+------------------+----------------------------------------------------------+
| SUMMARY                                                                     |
| Renders surveys vertically with smooth scroll animation on Enter key.       |
| All questions visible, Enter advances focus with scroll animation.          |
+-----------------------------------------------------------------------------+
*/

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { SurveySchema, SurveyQuestion } from "@/lib/survey-parser";

// ============================================================================
// Types
// ============================================================================

interface SurveyProps {
  schema: SurveySchema;
  onSubmit?: (data: Record<string, any>) => void;
  className?: string;
}

type Answer = string | number | boolean | string[] | File | null;

// ============================================================================
// Component
// ============================================================================

export function Survey({ schema, onSubmit, className = "" }: SurveyProps) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Inject styles on mount
  useEffect(() => {
    injectStyles();
  }, []);

  // Filter questions based on conditions
  const visibleQuestions = schema.questions.filter((q) => {
    if (!q.condition) return true;
    return evaluateCondition(q.condition, answers);
  });

  // Handle answer change
  const handleAnswer = useCallback((questionId: string, value: Answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  }, []);

  // Validate a single question
  const validateQuestion = useCallback((question: SurveyQuestion): string | null => {
    const answer = answers[question.id];

    if (question.required) {
      if (answer === undefined || answer === null || answer === "") {
        return "This field is required";
      }
      if (Array.isArray(answer) && answer.length === 0) {
        return "Please select at least one option";
      }
    }

    if (question.type === "checkbox" && Array.isArray(answer)) {
      if (question.min_select && answer.length < question.min_select) {
        return `Please select at least ${question.min_select} options`;
      }
      if (question.max_select && answer.length > question.max_select) {
        return `Please select at most ${question.max_select} options`;
      }
    }

    return null;
  }, [answers]);

  // Scroll to question with animation
  const scrollToQuestion = useCallback((index: number) => {
    const el = questionRefs.current[index];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add highlight animation
      el.classList.add("survey-question-highlight");
      setTimeout(() => el.classList.remove("survey-question-highlight"), 600);
    }
  }, []);

  // Go to next question
  const goNext = useCallback(() => {
    const currentQuestion = visibleQuestions[currentIndex];
    if (currentQuestion) {
      const error = validateQuestion(currentQuestion);
      if (error) {
        setErrors((prev) => ({ ...prev, [currentQuestion.id]: error }));
        return;
      }
    }

    if (currentIndex < visibleQuestions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollToQuestion(nextIndex);
    }
  }, [currentIndex, visibleQuestions, validateQuestion, scrollToQuestion]);

  // Submit survey
  const handleSubmit = useCallback(async () => {
    // Validate all questions
    const newErrors: Record<string, string> = {};
    let firstErrorIndex = -1;

    visibleQuestions.forEach((q, idx) => {
      const error = validateQuestion(q);
      if (error) {
        newErrors[q.id] = error;
        if (firstErrorIndex === -1) firstErrorIndex = idx;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (firstErrorIndex >= 0) {
        setCurrentIndex(firstErrorIndex);
        scrollToQuestion(firstErrorIndex);
      }
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(answers);
      }
      setSubmitted(true);
    } catch (e) {
      console.error("Survey submission failed:", e);
    }
  }, [answers, onSubmit, validateQuestion, visibleQuestions, scrollToQuestion]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        const currentQuestion = visibleQuestions[currentIndex];
        // Don't trigger on textarea
        if (currentQuestion?.type === "textarea") return;

        e.preventDefault();

        if (currentIndex === visibleQuestions.length - 1) {
          handleSubmit();
        } else {
          goNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, handleSubmit, currentIndex, visibleQuestions]);

  // Success screen
  if (submitted) {
    return (
      <div className={`survey-container ${className}`}>
        <div className="survey-success">
          <div className="survey-success-icon">&#10003;</div>
          <h2>Thank you!</h2>
          <p>Your response has been recorded.</p>
        </div>
      </div>
    );
  }

  // No questions
  if (visibleQuestions.length === 0) {
    return (
      <div className={`survey-container ${className}`}>
        <p className="survey-empty">No questions available.</p>
      </div>
    );
  }

  return (
    <div className={`survey-container ${className}`}>
      {/* Progress bar */}
      <div className="survey-progress">
        <div
          className="survey-progress-fill"
          style={{ width: `${((currentIndex + 1) / visibleQuestions.length) * 100}%` }}
        />
      </div>

      {/* Questions */}
      <div className="survey-questions">
        {visibleQuestions.map((question, idx) => (
          <div
            key={question.id}
            ref={(el) => { questionRefs.current[idx] = el; }}
            className={`survey-question ${idx === currentIndex ? "active" : ""} ${idx < currentIndex ? "completed" : ""}`}
            onClick={() => setCurrentIndex(idx)}
          >
            <div className="survey-question-number">{idx + 1}</div>
            <div className="survey-question-content">
              <label className="survey-label">
                {question.label}
                {question.required && <span className="survey-required">*</span>}
              </label>

              {question.description && (
                <p className="survey-description">{question.description}</p>
              )}

              <div className="survey-input">
                <QuestionInput
                  question={question}
                  value={answers[question.id]}
                  onChange={(value) => handleAnswer(question.id, value)}
                  isFocused={idx === currentIndex}
                />
              </div>

              {errors[question.id] && (
                <p className="survey-error">{errors[question.id]}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit button */}
      <div className="survey-footer">
        <button
          type="button"
          onClick={handleSubmit}
          className="survey-submit"
        >
          Submit
        </button>
        <span className="survey-hint">
          Press <kbd>Enter</kbd> to continue
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Question Input Component
// ============================================================================

interface QuestionInputProps {
  question: SurveyQuestion;
  value: Answer;
  onChange: (value: Answer) => void;
  isFocused: boolean;
}

function QuestionInput({ question, value, onChange, isFocused }: QuestionInputProps) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isFocused && inputRef.current && question.type !== "radio" && question.type !== "checkbox" && question.type !== "select" && question.type !== "boolean" && question.type !== "scale" && question.type !== "rating" && question.type !== "ranking" && question.type !== "matrix") {
      inputRef.current.focus();
    }
  }, [isFocused, question.type]);

  switch (question.type) {
    case "text":
    case "email":
    case "url":
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={question.type}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className="survey-text-input"
        />
      );

    case "textarea":
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          rows={question.rows || 4}
          className="survey-textarea"
        />
      );

    case "number":
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="number"
          value={value !== undefined && value !== null ? String(value) : ""}
          onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
          min={question.min}
          max={question.max}
          step={question.step || 1}
          placeholder={question.placeholder}
          className="survey-text-input"
        />
      );

    case "radio":
    case "select":
      return (
        <div className="survey-options">
          {question.options?.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`survey-option ${value === opt ? "selected" : ""}`}
            >
              <span className="survey-option-radio" />
              {opt}
            </button>
          ))}
        </div>
      );

    case "checkbox":
      const selected = (value as string[]) || [];
      return (
        <div className="survey-options">
          {question.options?.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                if (selected.includes(opt)) {
                  onChange(selected.filter((s) => s !== opt));
                } else {
                  onChange([...selected, opt]);
                }
              }}
              className={`survey-option ${selected.includes(opt) ? "selected" : ""}`}
            >
              <span className="survey-option-checkbox">{selected.includes(opt) && "✓"}</span>
              {opt}
            </button>
          ))}
        </div>
      );

    case "boolean":
      return (
        <div className="survey-options survey-options-row">
          <button
            type="button"
            onClick={() => onChange(true)}
            className={`survey-option ${value === true ? "selected" : ""}`}
          >
            {question.true_label || "Yes"}
          </button>
          <button
            type="button"
            onClick={() => onChange(false)}
            className={`survey-option ${value === false ? "selected" : ""}`}
          >
            {question.false_label || "No"}
          </button>
        </div>
      );

    case "scale":
      const min = question.min || 1;
      const max = question.max || 5;
      const scaleOptions = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      return (
        <div className="survey-scale">
          {question.labels?.[min] && (
            <span className="survey-scale-label">{question.labels[min]}</span>
          )}
          <div className="survey-scale-options">
            {scaleOptions.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                className={`survey-scale-btn ${value === n ? "selected" : ""}`}
              >
                {n}
              </button>
            ))}
          </div>
          {question.labels?.[max] && (
            <span className="survey-scale-label">{question.labels[max]}</span>
          )}
        </div>
      );

    case "rating":
      const maxRating = question.max || 5;
      const ratingValue = (value as number) || 0;
      return (
        <div className="survey-rating">
          {Array.from({ length: maxRating }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`survey-rating-btn ${n <= ratingValue ? "filled" : ""}`}
            >
              ★
            </button>
          ))}
        </div>
      );

    case "date":
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="date"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          min={question.min as unknown as string}
          max={question.max as unknown as string}
          className="survey-text-input"
        />
      );

    case "time":
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="time"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="survey-text-input"
        />
      );

    case "file":
    case "image":
      return (
        <div className="survey-file">
          <input
            type="file"
            accept={question.accept}
            onChange={(e) => onChange(e.target.files?.[0] || null)}
            className="survey-file-input"
            id={`file-${question.id}`}
          />
          <label htmlFor={`file-${question.id}`} className="survey-file-label">
            {value ? (value as File).name : "Choose file..."}
          </label>
        </div>
      );

    case "ranking":
      const items = (value as string[]) || question.options || [];
      return (
        <div className="survey-ranking">
          {items.map((item, idx) => (
            <div key={item} className="survey-ranking-item">
              <span className="survey-ranking-num">{idx + 1}</span>
              <span className="survey-ranking-text">{item}</span>
              <div className="survey-ranking-controls">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => {
                    const newItems = [...items];
                    [newItems[idx - 1], newItems[idx]] = [newItems[idx], newItems[idx - 1]];
                    onChange(newItems);
                  }}
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={idx === items.length - 1}
                  onClick={() => {
                    const newItems = [...items];
                    [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
                    onChange(newItems);
                  }}
                >
                  ▼
                </button>
              </div>
            </div>
          ))}
        </div>
      );

    case "matrix":
      const matrixValue = (value as Record<string, string>) || {};
      return (
        <div className="survey-matrix">
          <div className="survey-matrix-header">
            <div className="survey-matrix-cell" />
            {question.columns?.map((col) => (
              <div key={col} className="survey-matrix-cell survey-matrix-col">
                {col}
              </div>
            ))}
          </div>
          {question.matrix_rows?.map((row) => (
            <div key={row} className="survey-matrix-row">
              <div className="survey-matrix-cell survey-matrix-row-label">{row}</div>
              {question.columns?.map((col) => (
                <div key={col} className="survey-matrix-cell">
                  <button
                    type="button"
                    onClick={() => onChange({ ...matrixValue, [row]: col })}
                    className={`survey-matrix-btn ${matrixValue[row] === col ? "selected" : ""}`}
                  >
                    {matrixValue[row] === col && "●"}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      );

    default:
      return <p>Unsupported question type: {question.type}</p>;
  }
}

// ============================================================================
// Condition Evaluator
// ============================================================================

function evaluateCondition(condition: string, answers: Record<string, Answer>): boolean {
  try {
    const match = condition.match(/^(\w+)\s*(==|!=|>|<|>=|<=|contains)\s*(.+)$/);
    if (!match) return true;

    const [, field, op, rawValue] = match;
    const answer = answers[field];

    let compareValue: any = rawValue.trim();
    if (compareValue === "true") compareValue = true;
    else if (compareValue === "false") compareValue = false;
    else if (/^['"].*['"]$/.test(compareValue)) compareValue = compareValue.slice(1, -1);
    else if (/^\d+$/.test(compareValue)) compareValue = parseInt(compareValue, 10);

    switch (op) {
      case "==": return answer === compareValue;
      case "!=": return answer !== compareValue;
      case ">": return (answer as number) > compareValue;
      case "<": return (answer as number) < compareValue;
      case ">=": return (answer as number) >= compareValue;
      case "<=": return (answer as number) <= compareValue;
      case "contains": return Array.isArray(answer) && answer.includes(compareValue);
      default: return true;
    }
  } catch {
    return true;
  }
}

// ============================================================================
// Styles
// ============================================================================

const containerStyles = `
  .survey-container {
    width: 100%;
  }

  .survey-progress {
    height: 2px;
    background: hsl(var(--border));
    margin-bottom: 2rem;
    border-radius: 1px;
    overflow: hidden;
  }

  .survey-progress-fill {
    height: 100%;
    background: hsl(var(--foreground));
    transition: width 0.3s ease;
  }

  .survey-empty {
    text-align: center;
    color: hsl(var(--muted-foreground));
    padding: 4rem 2rem;
  }
`;

const questionStyles = `
  .survey-questions {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .survey-question {
    display: flex;
    gap: 0;
    padding: 0;
    border: 1px solid hsl(var(--border));
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .survey-question.active {
    border-color: hsl(var(--foreground));
  }

  .survey-question-highlight {
    animation: highlight 0.6s ease;
  }

  @keyframes highlight {
    0%, 100% { border-color: hsl(var(--border)); }
    50% { border-color: hsl(var(--foreground)); }
  }

  .survey-question-number {
    flex-shrink: 0;
    width: 48px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 1.25rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: hsl(var(--muted-foreground));
    background: hsl(var(--muted) / 0.3);
    border-right: 1px solid hsl(var(--border));
  }

  .survey-question.active .survey-question-number {
    background: hsl(var(--foreground));
    color: hsl(var(--background));
    border-color: hsl(var(--foreground));
  }

  .survey-question.completed .survey-question-number {
    background: hsl(var(--muted) / 0.5);
    color: hsl(var(--foreground));
  }

  .survey-question-content {
    flex: 1;
    min-width: 0;
    padding: 1.25rem;
  }

  .survey-label {
    display: block;
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 0.75rem;
    color: hsl(var(--foreground));
  }

  .survey-required {
    color: hsl(var(--destructive, 0 84% 60%));
    margin-left: 0.25rem;
  }

  .survey-description {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-bottom: 0.75rem;
  }

  .survey-input {
    margin-bottom: 0.5rem;
  }

  .survey-error {
    color: hsl(var(--destructive, 0 84% 60%));
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }

  /* Text inputs */
  .survey-text-input,
  .survey-textarea {
    width: 100%;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    font-family: inherit;
    border: 1px solid hsl(var(--border));
    background: transparent;
    color: hsl(var(--foreground));
    transition: border-color 0.15s;
    border-radius: 0;
  }

  .survey-text-input:focus,
  .survey-textarea:focus {
    outline: none;
    border-color: hsl(var(--foreground));
  }

  .survey-textarea {
    resize: vertical;
    min-height: 80px;
  }

  /* Options (radio/checkbox) */
  .survey-options {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .survey-options-row {
    flex-direction: row;
    gap: 0;
  }

  .survey-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem;
    text-align: left;
    font-size: 0.875rem;
    font-family: inherit;
    border: 1px solid hsl(var(--border));
    border-bottom: none;
    background: transparent;
    color: hsl(var(--foreground));
    cursor: pointer;
    transition: background 0.15s;
  }

  .survey-options-row .survey-option {
    flex: 1;
    justify-content: center;
    border-bottom: 1px solid hsl(var(--border));
    border-right: none;
  }

  .survey-options-row .survey-option:last-child {
    border-right: 1px solid hsl(var(--border));
  }

  .survey-option:last-child {
    border-bottom: 1px solid hsl(var(--border));
  }

  .survey-option:hover {
    background: hsl(var(--muted));
  }

  .survey-option.selected {
    background: hsl(var(--foreground));
    color: hsl(var(--background));
    border-color: hsl(var(--foreground));
  }

  .survey-option.selected + .survey-option {
    border-top-color: hsl(var(--foreground));
  }

  .survey-option-radio {
    width: 14px;
    height: 14px;
    border: 1px solid currentColor;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .survey-option.selected .survey-option-radio {
    background: currentColor;
    box-shadow: inset 0 0 0 3px hsl(var(--foreground));
  }

  .survey-option-checkbox {
    width: 14px;
    height: 14px;
    border: 1px solid currentColor;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.625rem;
    flex-shrink: 0;
  }

  /* Scale */
  .survey-scale {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .survey-scale-label {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    white-space: nowrap;
  }

  .survey-scale-options {
    display: flex;
    flex: 1;
  }

  .survey-scale-btn {
    flex: 1;
    padding: 0.5rem;
    font-size: 0.875rem;
    font-family: inherit;
    border: 1px solid hsl(var(--border));
    border-right: none;
    background: transparent;
    color: hsl(var(--foreground));
    cursor: pointer;
    transition: all 0.15s;
  }

  .survey-scale-btn:last-child {
    border-right: 1px solid hsl(var(--border));
  }

  .survey-scale-btn:hover {
    background: hsl(var(--muted));
  }

  .survey-scale-btn.selected {
    background: hsl(var(--foreground));
    color: hsl(var(--background));
  }

  /* Rating */
  .survey-rating {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem 0;
  }

  .survey-rating-btn {
    padding: 0.375rem;
    font-size: 2rem;
    background: none;
    border: none;
    color: hsl(var(--border));
    cursor: pointer;
    transition: color 0.15s, transform 0.15s;
  }

  .survey-rating-btn:hover {
    color: hsl(var(--foreground));
    transform: scale(1.1);
  }

  .survey-rating-btn.filled {
    color: hsl(var(--foreground));
  }

  /* File upload */
  .survey-file {
    position: relative;
  }

  .survey-file-input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .survey-file-label {
    display: block;
    padding: 1.5rem;
    text-align: center;
    font-size: 0.875rem;
    border: 1px dashed hsl(var(--border));
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    transition: all 0.15s;
  }

  .survey-file-label:hover {
    border-color: hsl(var(--foreground));
    color: hsl(var(--foreground));
  }

  /* Ranking */
  .survey-ranking {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .survey-ranking-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    border: 1px solid hsl(var(--border));
    border-bottom: none;
  }

  .survey-ranking-item:last-child {
    border-bottom: 1px solid hsl(var(--border));
  }

  .survey-ranking-num {
    font-weight: 500;
    color: hsl(var(--muted-foreground));
    width: 20px;
  }

  .survey-ranking-text {
    flex: 1;
  }

  .survey-ranking-controls {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .survey-ranking-controls button {
    padding: 0.125rem 0.375rem;
    font-size: 0.5rem;
    background: none;
    border: 1px solid hsl(var(--border));
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    line-height: 1;
  }

  .survey-ranking-controls button:hover:not(:disabled) {
    background: hsl(var(--muted));
    color: hsl(var(--foreground));
  }

  .survey-ranking-controls button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  /* Matrix */
  .survey-matrix {
    overflow-x: auto;
    font-size: 0.75rem;
  }

  .survey-matrix-header,
  .survey-matrix-row {
    display: flex;
  }

  .survey-matrix-cell {
    flex: 1;
    min-width: 60px;
    padding: 0.375rem;
    text-align: center;
    border: 1px solid hsl(var(--border));
    border-right: none;
    border-bottom: none;
  }

  .survey-matrix-cell:last-child {
    border-right: 1px solid hsl(var(--border));
  }

  .survey-matrix-row:last-child .survey-matrix-cell {
    border-bottom: 1px solid hsl(var(--border));
  }

  .survey-matrix-row-label {
    text-align: left;
    font-weight: 500;
    min-width: 100px;
  }

  .survey-matrix-col {
    font-weight: 500;
    color: hsl(var(--muted-foreground));
  }

  .survey-matrix-btn {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid hsl(var(--border));
    background: transparent;
    cursor: pointer;
    font-size: 0.5rem;
    transition: all 0.15s;
  }

  .survey-matrix-btn:hover {
    border-color: hsl(var(--foreground));
  }

  .survey-matrix-btn.selected {
    background: hsl(var(--foreground));
    border-color: hsl(var(--foreground));
    color: hsl(var(--background));
  }
`;

const footerStyles = `
  .survey-footer {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid hsl(var(--border));
  }

  .survey-submit {
    width: 100%;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: inherit;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: hsl(var(--foreground));
    color: hsl(var(--background));
    border: none;
    border-radius: 0;
    cursor: pointer;
    position: relative;
    box-shadow:
      0 4px 0 0 hsl(var(--foreground) / 0.3),
      0 4px 8px -2px hsl(var(--foreground) / 0.2);
    transform: translateY(0);
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .survey-submit:hover {
    transform: translateY(-2px);
    box-shadow:
      0 6px 0 0 hsl(var(--foreground) / 0.3),
      0 6px 12px -2px hsl(var(--foreground) / 0.25);
  }

  .survey-submit:active {
    transform: translateY(2px);
    box-shadow:
      0 2px 0 0 hsl(var(--foreground) / 0.3),
      0 2px 4px -2px hsl(var(--foreground) / 0.2);
  }

  .survey-hint {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    text-align: right;
  }

  .survey-hint kbd {
    display: inline-block;
    padding: 0.125rem 0.375rem;
    font-size: 0.625rem;
    font-family: inherit;
    background: hsl(var(--muted));
    border: 1px solid hsl(var(--border));
    border-radius: 2px;
  }
`;

const successStyles = `
  .survey-success {
    text-align: center;
    padding: 4rem 2rem;
  }

  .survey-success-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: hsl(var(--foreground));
    color: hsl(var(--background));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin: 0 auto 1.5rem;
  }

  .survey-success h2 {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .survey-success p {
    color: hsl(var(--muted-foreground));
    font-size: 0.875rem;
  }
`;

// Dark mode overrides - use matte white instead of pure white
const darkModeStyles = `
  .dark .survey-question.active .survey-question-number {
    background: hsl(0 0% 85%);
    color: hsl(var(--background));
    border-color: hsl(0 0% 85%);
  }

  .dark .survey-option.selected {
    background: hsl(0 0% 85%);
    color: hsl(var(--background));
    border-color: hsl(0 0% 85%);
  }

  .dark .survey-option.selected + .survey-option {
    border-top-color: hsl(0 0% 85%);
  }

  .dark .survey-scale-btn.selected {
    background: hsl(0 0% 85%);
    color: hsl(var(--background));
  }

  .dark .survey-rating-btn.filled {
    color: hsl(0 0% 85%);
  }

  .dark .survey-rating-btn:hover {
    color: hsl(0 0% 85%);
  }

  .dark .survey-matrix-btn.selected {
    background: hsl(0 0% 85%);
    border-color: hsl(0 0% 85%);
    color: hsl(var(--background));
  }

  .dark .survey-submit {
    background: hsl(0 0% 85%);
    color: hsl(var(--background));
    box-shadow:
      0 4px 0 0 hsl(0 0% 60%),
      0 4px 8px -2px hsl(0 0% 0% / 0.3);
  }

  .dark .survey-submit:hover {
    box-shadow:
      0 6px 0 0 hsl(0 0% 60%),
      0 6px 12px -2px hsl(0 0% 0% / 0.35);
  }

  .dark .survey-submit:active {
    box-shadow:
      0 2px 0 0 hsl(0 0% 60%),
      0 2px 4px -2px hsl(0 0% 0% / 0.3);
  }

  .dark .survey-success-icon {
    background: hsl(0 0% 85%);
  }

  .dark .survey-text-input:focus,
  .dark .survey-textarea:focus {
    border-color: hsl(0 0% 70%);
  }

  .dark .survey-question.active {
    border-color: hsl(0 0% 70%);
  }

  .dark .survey-file-label:hover {
    border-color: hsl(0 0% 70%);
    color: hsl(0 0% 85%);
  }

  .dark .survey-option:hover {
    background: hsl(0 0% 15%);
  }

  .dark .survey-scale-btn:hover {
    background: hsl(0 0% 15%);
  }

  .dark .survey-ranking-controls button:hover:not(:disabled) {
    background: hsl(0 0% 15%);
  }

  .dark .survey-matrix-btn:hover {
    border-color: hsl(0 0% 70%);
  }
`;

// ============================================================================
// Global Style Injection (for nested components)
// ============================================================================

const allStyles = containerStyles + questionStyles + footerStyles + successStyles + darkModeStyles;

function injectStyles() {
  if (typeof document === "undefined") return;

  const styleId = "survey-global-styles";
  let styleEl = document.getElementById(styleId);

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = allStyles;
}

// ============================================================================
// Exports
// ============================================================================

export default Survey;
export type { SurveySchema, SurveyQuestion };
