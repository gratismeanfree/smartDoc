"use client";
import { useEffect, useState } from "react";
import QuizGenerator from "./QuizGenerator";
import QuizDisplay from "./QuizDisplay";

// Add type definition
interface DocumentQuizSectionProps {
  documentId: string;
}

export default function DocumentQuizSection({ documentId }: DocumentQuizSectionProps) {
  const [quiz, setQuiz] = useState<any>(null); // You can make this more specific if you want
  const [loading, setLoading] = useState(true);

  // Fetch existing quiz ONCE
  useEffect(() => {
    async function loadQuiz() {
      const res = await fetch(`/api/quizzes/${documentId}`); // Fixed: was missing backticks
      const data = await res.json();
      setQuiz(data);
      setLoading(false);
    }
    loadQuiz();
  }, [documentId]);

  if (loading) return <p>Loading quiz…</p>;

  return (
    <div className="space-y-4">
      {!quiz && (
        <QuizGenerator
          documentId={documentId}
          onReady={setQuiz}
        />
      )}
      {quiz && <QuizDisplay quiz={quiz} />}
    </div>
  );
}