"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MindmapView from "./MindmapRenderer";
import QuizSection from "./QuizSection";
import { SummaryRenderer } from "./SummaryRenderer";

type Tab = "summary" | "mindmap" | "quiz";
interface DocumentWorkspaceProps {
  doc: {
    id: string;
    summary: string | null;
    mindmap: string | null;
  };
}
export default function DocumentWorkspace({ doc }: DocumentWorkspaceProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1️⃣ Read tab from URL
  const tabFromUrl = searchParams.get("tab") as Tab | null;

  // 2️⃣ Initialize state from URL (fallback to summary)
  const [active, setActive] = useState<Tab>(tabFromUrl ?? "summary");

  const [quiz, setQuiz] = useState(null);
  const [quizLoaded, setQuizLoaded] = useState(false);

  // 3️⃣ Keep state in sync if user navigates with back/forward
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== active) {
      setActive(tabFromUrl);
    }
  }, [tabFromUrl]);

  // 4️⃣ Centralized tab switcher (state + URL)
  function setTab(tab: Tab) {
    setActive(tab);
    router.replace(`?tab=${tab}`, { scroll: false });
  }

  const navItem = (key: Tab, label: string) => {
    const isActive = active === key;

    return (
      <button
        onClick={() => setTab(key)}
        className={`
          w-full text-left px-4 py-2 rounded-lg transition-all
          ${
            isActive
              ? "bg-gradient-to-r from-blue-100 to-purple-100 text-gray-900 font-medium shadow-sm"
              : "hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 text-gray-600"
          }
        `}
      >
        {label}
      </button>
    );
  };

  // Quiz loading
  useEffect(() => {
    async function loadQuiz() {
      const res = await fetch(`/api/quizzes?documentId=${doc.id}`);
      const data = await res.json();
      if (data) setQuiz(data);
      setQuizLoaded(true);
    }
    loadQuiz();
  }, [doc.id]);

  return (
    <div className="flex min-h-[70vh] gap-8 mt-1.5">
      {/* Sidebar */}
      <aside className="w-56 border-r pr-4 space-y-2">
        {navItem("summary", "📄 Summary")}
        {navItem("mindmap", "🗺 Mind map")}
        {navItem("quiz", "🧠 Quiz")}
      </aside>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Summary */}
          <section
            className={`transition-opacity duration-300 ${
              active === "summary"
                ? "block opacity-100 border p-3 rounded"
                : "hidden opacity-0"
            }`}
          >
            <h2 className="font-bold text-xl mb-2">Summary</h2>
            <SummaryRenderer markdown={doc.summary} />
          </section>

          {/* Mindmap */}
          <section
            className={`transition-opacity duration-300 ${
              active === "mindmap" ? "block opacity-100" : "hidden opacity-0"
            }`}
          >
            <MindmapView mindmap={doc.mindmap} />
          </section>

          {/* Quiz */}
          <section
            className={`transition-opacity duration-300 ${
              active === "quiz" ? "block opacity-100" : "hidden opacity-0"
            }`}
          >
            {!quizLoaded && <p>Loading quiz...</p>}
            {quizLoaded && (
              <QuizSection
                documentId={doc.id}
                quiz={quiz}
                setQuiz={setQuiz}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
