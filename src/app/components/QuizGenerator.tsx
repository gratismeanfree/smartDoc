"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function QuizGenerator({ documentId, onReady }) {
  const [difficulty, setDifficulty] = useState("easy");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, difficulty, count }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate quiz");
      }

      const quiz = await res.json();
      onReady(quiz);
    } catch (error) {
      console.error(error);
      alert("Error generating quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border p-6 rounded-lg max-w-md mx-auto space-y-6 bg-white shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Generate Quiz</h2>

      <div className="flex flex-col">
        <label htmlFor="difficulty" className="mb-2 font-medium text-gray-700">
          Difficulty
        </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          disabled={loading}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="count" className="mb-2 font-medium text-gray-700">
          Number of Questions
        </label>
        <input
          id="count"
          type="number"
          min={1}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          disabled={loading}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center gap-2 bg-black text-white rounded-lg py-2 hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Generating...
          </>
        ) : (
          "Generate"
        )}
      </Button>
    </form>
  );
}
