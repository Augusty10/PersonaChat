import React, { useState, useEffect, useRef } from "react";
import { PERSONA_DATA } from "../utils/personaData";
import { Send, Coffee, Terminal, AlertTriangle, Copy, Check } from "lucide-react";
import Markdown from "react-markdown";

export default function ChatArea({
  personaId,
  messages,
  onSendMessage,
  isGenerating,
  error,
}) {
  const [inputText, setInputText] = useState("");
  const [thinkingMsg, setThinkingMsg] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const activePersona = PERSONA_DATA[personaId];

  // Cycling thinking messages
  useEffect(() => {
    if (!isGenerating) return;

    let index = 0;
    const list = activePersona.thinkingMessages;
    setThinkingMsg(list[0]);

    const interval = setInterval(() => {
      index = (index + 1) % list.length;
      setThinkingMsg(list[index]);
    }, 2500);

    return () => clearInterval(interval);
  }, [isGenerating, activePersona]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    
    onSendMessage(inputText);
    setInputText("");
  };

  const handleSuggestedClick = (prompt) => {
    if (isGenerating) return;
    onSendMessage(prompt);
  };

  const handleCopyCode = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Custom renderers for markdown
  const markdownRenderers = {
    h1: ({ children }) => <h1 className="text-lg font-bold font-sans text-slate-100 mt-4 mb-2 border-b border-slate-800 pb-1">{children}</h1>,
    h2: ({ children }) => <h2 className="text-base font-bold font-sans text-slate-100 mt-3 mb-1.5">{children}</h2>,
    h3: ({ children }) => <h3 className="text-sm font-semibold font-sans text-slate-200 mt-2 mb-1">{children}</h3>,
    p: ({ children }) => <p className="text-sm text-slate-300 leading-relaxed mb-3 whitespace-pre-wrap">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-5 mb-3 text-sm text-slate-300 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 text-sm text-slate-300 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="text-sm text-slate-300">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-amber-500/50 pl-3 italic text-slate-400 text-sm my-3 bg-amber-500/5 py-1 rounded-r">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-4 border border-slate-800 rounded-lg">
        <table className="min-w-full divide-y divide-slate-800 text-xs text-slate-300">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-slate-900/80 text-slate-200 font-medium font-mono border-b border-slate-800">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-slate-800">{children}</tbody>,
    tr: ({ children }) => <tr className="hover:bg-slate-900/30 transition">{children}</tr>,
    th: ({ children }) => <th className="px-3.5 py-2.5 text-left font-semibold">{children}</th>,
    td: ({ children }) => <td className="px-3.5 py-2.5 font-mono">{children}</td>,
    code: ({ node, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      const isInline = !match;
      const codeString = String(children).replace(/\n$/, "");
      const randomId = Math.random().toString(36).substr(2, 9);

      if (isInline) {
        return (
          <code 
            className="bg-slate-950 border border-slate-800/80 px-1.5 py-0.5 rounded text-[11px] text-amber-300 font-mono font-medium"
            {...props}
          >
            {children}
          </code>
        );
      }

      const lang = match ? match[1] : "code";

      return (
        <div className="relative group my-4 border border-slate-800/80 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-slate-950 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>{lang.toUpperCase()}</span>
            <button
              onClick={() => handleCopyCode(codeString, randomId)}
              className="flex items-center gap-1 hover:text-slate-200 transition text-[10px]"
            >
              {copiedId === randomId ? (
                <>
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-green-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="bg-slate-950 p-4 overflow-x-auto text-xs text-cyan-400 font-mono leading-relaxed">
            <code className={className}>{children}</code>
          </pre>
        </div>
      );
    },
  };

  const isHitesh = activePersona.id === "hitesh";

  return (
    <div id="chat-area-container" className="flex-1 flex flex-col h-full bg-white/5 backdrop-blur-xl border-r border-white/10 relative">
      {/* Active Persona Header */}
      <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
              isHitesh
                ? "bg-gradient-to-br from-amber-500/80 to-yellow-800 text-amber-50 animate-pulse"
                : "bg-gradient-to-br from-cyan-500/80 to-blue-800 text-cyan-50 animate-pulse"
            }`}
          >
            {activePersona.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-sans font-bold text-slate-100 text-sm">
                {activePersona.name}
              </h2>
              <span
                className={`w-2 h-2 rounded-full animate-ping ${
                  isHitesh ? "bg-amber-500" : "bg-cyan-500"
                }`}
              />
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-400 italic font-mono truncate max-w-sm sm:max-w-md">
              "{activePersona.catchphrase}"
            </p>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          /* Initial Empty State */
          <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center py-8">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                isHitesh
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-cyan-500/10 text-cyan-400"
              }`}
            >
              {isHitesh ? (
                <Coffee className="w-7 h-7" />
              ) : (
                <Terminal className="w-7 h-7" />
              )}
            </div>
            <h3 className="font-sans font-bold text-lg text-slate-100 mb-2">
              Start Your Conversation with {activePersona.name}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              {activePersona.name} is ready to answer your technical questions, guide you through difficult logic, and help you grow. Tap one of the suggested prompts below to start instantly!
            </p>

            {/* Suggested Prompts Grid */}
            <div className="grid grid-cols-1 gap-2.5 w-full">
              {activePersona.suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedClick(p.prompt)}
                  className={`p-3.5 rounded-2xl border text-left text-xs font-sans transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 text-slate-200 ${
                    isHitesh
                      ? "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40"
                      : "bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/40"
                  }`}
                >
                  <p className={`font-semibold mb-1 ${isHitesh ? "text-amber-400" : "text-cyan-400"}`}>
                    {p.label}
                  </p>
                  <p className="text-slate-400 line-clamp-1">{p.prompt}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Render Active Message List */
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Sender Icon */}
                  <div
                    className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md select-none ${
                      isUser
                        ? "bg-slate-800 text-slate-300 border border-white/10"
                        : isHitesh
                        ? "bg-gradient-to-br from-amber-600 to-amber-800 text-slate-100"
                        : "bg-gradient-to-br from-cyan-600 to-cyan-800 text-slate-100"
                    }`}
                  >
                    {isUser
                      ? "ME"
                      : activePersona.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-sm border leading-relaxed ${
                      isUser
                        ? "bg-indigo-600/40 border-indigo-500/30 rounded-tr-none text-slate-100"
                        : "bg-white/10 border-white/10 rounded-tl-none text-slate-100"
                    }`}
                  >
                    {isUser ? (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed text-slate-100">
                        {msg.text}
                      </p>
                    ) : (
                      <div className="markdown-body text-slate-100">
                        <Markdown components={markdownRenderers}>
                          {msg.text}
                        </Markdown>
                      </div>
                    )}
                    <div className="mt-1.5 flex justify-end text-[9px] font-mono text-slate-400 select-none">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* AI Typing / Thinking state */}
        {isGenerating && (
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <div
              className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 animate-bounce ${
                isHitesh
                  ? "bg-amber-600 text-slate-100"
                  : "bg-cyan-600 text-slate-100"
              }`}
            >
              {activePersona.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl p-4 border rounded-tl-none flex flex-col gap-2 ${
                isHitesh
                  ? "bg-amber-500/10 border-amber-500/20"
                  : "bg-cyan-500/10 border-cyan-500/20"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isHitesh ? "bg-amber-400" : "bg-cyan-400"}`} style={{ animationDelay: "0ms" }} />
                <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isHitesh ? "bg-amber-400" : "bg-cyan-400"}`} style={{ animationDelay: "200ms" }} />
                <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isHitesh ? "bg-amber-400" : "bg-cyan-400"}`} style={{ animationDelay: "400ms" }} />
              </div>
              <p className="text-[11px] font-mono text-slate-400 italic animate-pulse">
                {thinkingMsg}
              </p>
            </div>
          </div>
        )}

        {/* Error panel */}
        {error && (
          <div className="bg-red-950/30 border border-red-500/40 p-4 rounded-xl max-w-xl mx-auto flex gap-3 text-slate-200">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h5 className="font-semibold text-red-400">Connection Interrupted</h5>
              <p className="leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Footer */}
      <div className="p-4 bg-white/5 border-t border-white/10 sticky bottom-0 z-10">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isGenerating}
            placeholder={
              isGenerating
                ? "Please wait until the answer completes..."
                : `Ask ${activePersona.name} any tech question...`
            }
            className="flex-1 bg-black/20 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 px-4 py-3.5 rounded-2xl text-sm text-white placeholder-slate-500 transition disabled:opacity-50 font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className={`px-5 py-3.5 rounded-2xl flex items-center justify-center transition shadow-lg active:translate-y-0.5 ${
              !inputText.trim() || isGenerating
                ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/10"
                : isHitesh
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/10"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/10"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="max-w-3xl mx-auto mt-3 flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>  Active</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> Secure </span>
          </div>
          <span className="text-slate-600">Press Enter to send</span>
        </div>
      </div>
    </div>
  );
}
