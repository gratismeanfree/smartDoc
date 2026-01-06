"use client"
import { useChat } from "@ai-sdk/react";
import { useState, useEffect, FormEvent } from "react";
import { DefaultChatTransport } from "ai";

export default function ChatTest() {
  const [input, setInput] = useState("");

  // ✅ Minimal mock transport for testing
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/mock-chat",
    }),
  });

  // 🔹 Debug messages
  useEffect(() => {
    console.log("💬 Messages updated:", messages);
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    console.log("➡ Sending:", input);
    await sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Mini Chat Test</h2>

      <div className="border p-2 mb-4 h-60 overflow-y-auto">
        {messages.map((m) => (
          <div key={m.id} className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-1" disabled={status === "streaming"}>
          Send
        </button>
      </form>
    </div>
  );
}
