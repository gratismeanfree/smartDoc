"use client";
import { useState } from "react";
import QuizGenerator from "./QuizGenerator";
import QuizDisplay from "./QuizDisplay";

export default function QuizSection ({
  documentId,quiz,setQuiz
}:{
  documentId:string,
  quiz:any,
  setQuiz: (q:any) => void
}) {
  return <div>
  {!quiz && (
    <QuizGenerator documentId={documentId}
    onReady={setQuiz}/>
  )}
  {quiz && <QuizDisplay quiz={quiz} />}
</div>
}
/**
 * 
 * export default function QuizSection({ documentId }) {
  const [quiz, setQuiz] = useState(null);

  return (
    <div>
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

 */
