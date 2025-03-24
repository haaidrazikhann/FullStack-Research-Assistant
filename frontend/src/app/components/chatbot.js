"use client";
import React, { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    try {
      const response = await fetch("http://127.0.0.1:8000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();
      setMessages([...messages, userMessage, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }

    setInput("");
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 dark:bg-zinc-900">
      <div className="w-full max-w-3xl h-full max-h-[90vh] flex flex-col bg-white dark:bg-zinc-800 shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b dark:border-zinc-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Chatbot Assistant</h2>
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Online</span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.sender === "user"
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-zinc-500 text-white"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Field */}
        <div className="p-3 border-t dark:border-zinc-700 flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg dark:bg-zinc-700 dark:text-white dark:border-zinc-600 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg transition duration-300 ease-in-out text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
