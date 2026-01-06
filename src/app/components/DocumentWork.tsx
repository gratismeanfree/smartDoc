"use client"
import React, { useState } from "react"
import ReactMarkDown from "react-markdown"
import QuizSection from "./QuizSection"
import MindmapView from "./MindmapView"
import Mermaid from "./Mermaid"
export default function DocumentWorkspace({doc}) {
  const [activeSection, setActiveSection]= useState("summary")
  return (
    <div className="flex gap-6">
      <aside className="border-r space-y-2 w-48">
        <button className={`px-4 py-2 rounded text-left w-full ${activeSection==="summary" ? "bg-blue-600 text-white" : "hover:bg-blue-100"}`}
        onClick={()=>setActiveSection("summary")}
        >
          Summary
        </button>
        <button
          className={`w-full text-left px-4 py-2 rounded ${
            activeSection === "mindmap" ? "bg-blue-600 text-white" : "hover:bg-blue-100"
          }`}
          onClick={() => setActiveSection("mindmap")}
        >
          📁 Mind Map
        </button>
        <button
          className={`w-full text-left px-4 py-2 rounded ${
            activeSection === "quiz" ? "bg-blue-600 text-white" : "hover:bg-blue-100"
          }`}
          onClick={() => setActiveSection("quiz")}
        >
          📁 Quiz
        </button>

      </aside>
      <main className="flex-1 p-4 border rounded">
        {activeSection==="summary"&&(
          <ReactMarkDown>{doc.summary ??"There is an error. Refresh the page"}</ReactMarkDown>
        )}
        {activeSection==="mindmap" &&(
          doc.mindmap ? (
            <MindmapView mermaid={doc.mindmap}></MindmapView>
          ) : <p>There is an error, no mindmap found</p>
          
        )}
        {activeSection==="quiz" && <QuizSection documentId={doc.id}>
          </QuizSection>}
      </main>

    </div>
  )

}