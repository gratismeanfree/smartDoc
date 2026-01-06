"use client"
import { useEffect } from "react";
import { DefaultChatTransport } from "ai";

export default function ChatDebug() {
  useEffect(() => {
    const testTransport = async () => {
      const transport = new DefaultChatTransport({ api: "/api/chat" });
      const rawResponse = await transport.sendMessages({ text: "whatever" });
      console.log("Raw transport response:", rawResponse);
    };

    testTransport();
  }, []);

  return null; // nothing rendered
}
