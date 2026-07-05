import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import ChaiBrewer from "./components/ChaiBrewer";
import SystemArchitect from "./components/SystemArchitect";
import { Users, Coffee, Cpu } from "lucide-react";

export default function App() {
  const [activePersona, setActivePersona] = useState("hitesh");
  const [chatHistory, setChatHistory] = useState({
    hitesh: [],
    piyush: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ai_tech_mentor_chat_history_v1");
      if (saved) {
        setChatHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
  }, []);

  // Save chat history to localStorage when changed
  const saveChatHistory = (newHistory) => {
    setChatHistory(newHistory);
    try {
      localStorage.setItem("ai_tech_mentor_chat_history_v1", JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed to save chat history", e);
    }
  };

  const handleSendMessage = async (text) => {
    const userMessage = {
      id: String(Date.now()),
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    // Update state immediately with user message
    const updatedHistory = {
      ...chatHistory,
      [activePersona]: [...(chatHistory[activePersona] || []), userMessage],
    };
    saveChatHistory(updatedHistory);
    setIsGenerating(true);
    setError(null);

    try {
      // Send message thread to server (preserving full chat context)
      const messageThread = updatedHistory[activePersona].map((msg) => ({
        sender: msg.sender,
        text: msg.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          persona: activePersona,
          messages: messageThread,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate response from educator.");
      }

      const data = await response.json();
      
      const modelMessage = {
        id: String(Date.now() + 1),
        sender: "model",
        text: data.text,
        timestamp: new Date().toISOString(),
      };

      // Update state with model response
      const updatedHistoryWithResponse = {
        ...chatHistory,
        [activePersona]: [...updatedHistory[activePersona], modelMessage],
      };
      saveChatHistory(updatedHistoryWithResponse);

    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearChat = () => {
    const confirmed = window.confirm(
      `Are you sure you want to clear your conversation history with ${
        activePersona === "hitesh" ? "Hitesh Choudhary" : "Piyush Garg"
      }?`
    );
    if (!confirmed) return;

    const clearedHistory = {
      ...chatHistory,
      [activePersona]: [],
    };
    saveChatHistory(clearedHistory);
    setError(null);
  };

  const activeChat = chatHistory[activePersona] || [];

  return (
    <div id="app-root-container" className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#0f172a] text-slate-100 relative font-sans">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* 1. Left Sidebar: Persona Selection & Reference Links */}
      <Sidebar
        activePersona={activePersona}
        setActivePersona={setActivePersona}
        onClearChat={handleClearChat}
        chatLength={activeChat.length}
      />

      {/* 2. Main Area: Split into Chat (Center) and Interactive Sandbox (Right) */}
      <div className="flex-1 flex flex-col xl:flex-row h-full overflow-hidden z-10">
        
        {/* Chat Workspace (Left or Full depending on screen size) */}
        <ChatArea
          personaId={activePersona}
          messages={activeChat}
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
          error={error}
        />

        {/* Interactive Pedagogical Widget Panel (Right Sidebar on Desktop) */}
        <div className="w-full xl:w-96 bg-white/5 backdrop-blur-xl border-t xl:border-t-0 xl:border-l border-white/10 p-5 overflow-y-auto h-auto xl:h-full flex-shrink-0 flex flex-col gap-5">
          {/* Section Title */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Active Vibe & Labs
            </span>
            <div className="flex items-center gap-1.5 text-slate-200">
              {activePersona === "hitesh" ? (
                <>
                  <Coffee className="w-4 h-4 text-amber-400 animate-pulse" />
                  <h3 className="font-sans font-bold text-sm text-white">Hitesh's Tea Station</h3>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <h3 className="font-sans font-bold text-sm text-white">Piyush's Cloud Lab</h3>
                </>
              )}
            </div>
          </div>

          {/* Interactive Widget display */}
          <div className="flex-1">
            {activePersona === "hitesh" ? (
              <ChaiBrewer />
            ) : (
              <SystemArchitect />
            )}
          </div>


        </div>
      </div>
    </div>
  );
}
