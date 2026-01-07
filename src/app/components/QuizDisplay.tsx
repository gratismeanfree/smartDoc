"use client"
import { useState } from "react";
import { Check, X } from "lucide-react";

// Add type definition
interface QuizDisplayProps {
  quiz: {
    id: string;
    quizJson: {
      questions: Array<{
        question: string;
        options: string[];
        correctIndex: number;
        explanation: string;
      }>;
    };
  };
}

export default function QuizDisplay({ quiz }: QuizDisplayProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const questions = quiz.quizJson.questions;

  function handleChange(qIndex: number, optionIndex: number) {
    setAnswers(prev => ({
      ...prev,
      [qIndex]: optionIndex
    }));
  }

  async function handleSubmit() {
    const totalQuestions = questions.length;
    const score = questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
      0
    );

    // Save attempt to backend
    await fetch("/api/quiz-attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizId: quiz.id,
        score,
        totalQuestions,
        answers
      }),
    });

    setSubmitted(true);
  }

  return (
    <div className="space-y-4">
      {submitted && (
        <div className="p-4 rounded-lg bg-gray-100 text-lg font-semibold">
          Score: {questions.reduce(
            (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
            0
          )} / {questions.length} correct
        </div>
      )}

      <div className="border p-3 rounded">
        <h2 className="text-xl font-bold mb-2">Quiz</h2>
        {questions.map((q, i) => (
          <div key={i} className="mb-4">
            <p className="font-semibold"><span>{i+1}. </span>{q.question}</p>
            <div className="space-y-2">
              {q.options.map((o, j) => {
                const selected = answers[i] === j;
                const isCorrect = q.correctIndex === j;
                const isWrong = submitted && selected && !isCorrect;

                return (
                  <label
                    key={j}
                    className={`flex items-center gap-2 cursor-pointer ${
                      submitted && isCorrect
                        ? "text-green-600"
                        : isWrong
                        ? "text-red-400"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${i}`} // Fixed: was missing quotes
                      disabled={submitted}
                      checked={selected}
                      value={j}
                      onChange={() => handleChange(i, j)}
                    />
                    <span>{o}</span>
                    {submitted && isCorrect && <Check className="ml-2 text-green-600" size={20} strokeWidth={2.5} />}
                    {isWrong && <X className="ml-2 text-red-600" size={20} strokeWidth={2.5} />}
                  </label>
                );
              })}
            </div>
            {submitted && (
              <div>
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}

        {!submitted && (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-900 text-white rounded"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}