import React from "react";
import { PERSONA_DATA } from "../utils/personaData";
import { Trash2, Youtube, Globe, ExternalLink, HelpCircle, Code, Twitter } from "lucide-react";

export default function Sidebar({
  activePersona,
  setActivePersona,
  onClearChat,
  chatLength,
}) {
  const personas = Object.values(PERSONA_DATA);

  return (
    <div id="app-sidebar" className="bg-white/5 backdrop-blur-xl border-r border-white/10 w-full md:w-80 flex flex-col h-full flex-shrink-0 text-slate-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div>
          <h1 className="font-sans font-extrabold tracking-tight text-xl leading-tight">
            <span className="text-orange-500">Chai</span> <span className="text-blue-500">Persona</span>
          </h1>
          <p className="text-xs text-slate-400">Conversations with community leaders</p>
        </div>
      </div>

      {/* Select Persona Title */}
      <div className="px-5 pt-5 pb-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
          Choose Your Instructor
        </span>
      </div>

      {/* Educator List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2.5">
        {personas.map((p) => {
          const isActive = activePersona === p.id;
          const isHitesh = p.id === "hitesh";

          return (
            <button
              key={p.id}
              onClick={() => setActivePersona(p.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                isActive
                  ? isHitesh
                    ? "bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.06)]"
                    : "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.06)]"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              {/* Highlight bar */}
              {isActive && (
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isHitesh ? "bg-amber-500" : "bg-cyan-500"
                  }`}
                />
              )}

              {/* Persona Metadata */}
              <div className="flex items-start gap-3">
                {/* Visual Avatar Placeholder */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shadow-inner flex-shrink-0 ${
                    isHitesh
                      ? "bg-gradient-to-br from-amber-600/80 to-yellow-800 text-amber-100"
                      : "bg-gradient-to-br from-cyan-600/80 to-blue-800 text-cyan-100"
                  }`}
                >
                  {p.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-sans font-semibold text-sm text-slate-200 group-hover:text-slate-100 transition truncate">
                    {p.name}
                  </h3>
                  <p className={`text-[11px] font-medium truncate ${isHitesh ? "text-amber-400" : "text-cyan-400"}`}>
                    {p.vibe}
                  </p>
                </div>
              </div>

              {/* Small description */}
              <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                {p.description}
              </p>

              {/* Social URLs / Reference Website */}
              <div className="flex items-center gap-2.5 mt-3.5 pt-2.5 border-t border-white/10 text-xs text-slate-400">
                <a
                  href={p.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 hover:text-red-400 transition"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>Channel</span>
                </a>
                <span className="text-slate-600">•</span>
                <a
                  href={p.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 hover:text-sky-400 transition"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>{p.twitterHandle}</span>
                </a>
                <span className="text-slate-600">•</span>
                <a
                  href={p.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 hover:text-slate-200 transition"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Portfolio</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </button>
          );
        })}
      </div>



      {/* Actions footer */}
      <div className="p-4 border-t border-white/10 bg-black/20 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {chatLength} {chatLength === 1 ? "message" : "messages"} loaded
        </div>
        {chatLength > 0 && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-red-400 transition bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-xl font-sans font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        )}
      </div>
    </div>
  );
}
