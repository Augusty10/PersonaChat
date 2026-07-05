import React, { useState, useEffect } from "react";
import { Coffee, RotateCcw, Flame, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const HITESH_CHAI_QUOTES = [
  "Hanji ! Ginger Chai bilkul tayyar hai. Ab chalo coding par focus karte hain! ☕",
  "Pehle ek sip chai, phir is array traversal logic ko bohot simply samajhte hain.",
  "Simple si baat hai: Code ek baar me perfect nahi hota , par humari mehnat aur chai humesha mast honi chahiye!",
  "Samajh aaya? Chalo, thodi chai piyo aur ab thoda sa code khud likh kar dekhna. Tabhi asli confidence aayega!",
  "Bugs ki chinta bilkul  mat karo , bugs hi to hume asli coder banate hain. Cheers! ☕",
  "Ek cup chai, thoda sa code, aur dosto kya chahiye life me? Mehnat karte raho!",
  "Javascript hoisting samajhne ke liye ek sip chai compulsory hai ! ",
  "Sabar rakho dosto, system design ho ya React, thodi si thand rakho aur chai pijiye ,  jaldbazi mat karo."
];

export default function ChaiBrewer() {
  const [chaiCount, setChaiCount] = useState(0);
  const [isBrewing, setIsBrewing] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [heatLevel, setHeatLevel] = useState(2); // 1: Low, 2: Medium, 3: High

  useEffect(() => {
    const saved = localStorage.getItem("ai_tech_mentor_chai_count");
    if (saved) {
      setChaiCount(parseInt(saved, 10));
    } else {
      // Seed initial
      setChaiCount(8);
    }
    // Random initial quote
    setCurrentQuote("Kya chal raha hai dosto? Main hoon Hitesh. Ek cup chai lijiye aur chaliye thoda sa code likhte hain! ☕");
  }, []);

  const handleBrew = () => {
    if (isBrewing) return;
    setIsBrewing(true);

    // Simulate brewing time based on heat level
    const brewTime = heatLevel === 3 ? 1200 : heatLevel === 2 ? 1800 : 2500;

    setTimeout(() => {
      setIsBrewing(false);
      const newCount = chaiCount + 1;
      setChaiCount(newCount);
      localStorage.setItem("ai_tech_mentor_chai_count", String(newCount));
      
      // Select random quote
      const randIdx = Math.floor(Math.random() * HITESH_CHAI_QUOTES.length);
      setCurrentQuote(HITESH_CHAI_QUOTES[randIdx]);
    }, brewTime);
  };

  const resetCounter = () => {
    setChaiCount(0);
    localStorage.setItem("ai_tech_mentor_chai_count", "0");
  };

  return (
    <div id="chai-brewer-widget" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 text-slate-200 shadow-xl h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/15 rounded-xl text-amber-400">
              <Coffee className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h4 className="font-sans font-semibold text-white text-sm">Chai aur Code Stall</h4>
              <p className="text-xs text-slate-400 font-mono">Brewing tea keeps logic flowing</p>
            </div>
          </div>
          <button 
            onClick={resetCounter}
            title="Reset tea counter"
            className="text-slate-500 hover:text-slate-300 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Chai Stats */}
        <div className="bg-black/20 border border-white/10 rounded-2xl p-3.5 mb-4 text-center">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">Total Chai Shared</div>
          <div className="text-3xl font-sans font-bold text-amber-400 tracking-tight mt-1 flex items-center justify-center gap-1.5">
            {chaiCount} <span className="text-xs font-normal text-slate-400 font-mono">cups</span>
          </div>
        </div>

        {/* Heat Settings */}
        <div className="flex items-center justify-between text-xs mb-4">
          <span className="text-slate-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Stove Heat:
          </span>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((level) => (
              <button
                key={level}
                onClick={() => setHeatLevel(level)}
                disabled={isBrewing}
                className={`px-2.5 py-0.5 rounded-lg transition text-[11px] ${
                  heatLevel === level 
                    ? "bg-amber-500 text-slate-950 font-semibold shadow-md" 
                    : "bg-white/5 text-slate-400 hover:bg-white/10 disabled:opacity-50 border border-white/5"
                }`}
              >
                {level === 1 ? "Slow" : level === 2 ? "Medium" : "Fast 🔥"}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Cup & Steam */}
        <div className="relative h-28 bg-black/10 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden mb-4">
          <AnimatePresence>
            {isBrewing && (
              <div className="absolute inset-0 bg-amber-500/5 animate-pulse flex items-center justify-center">
                <span className="text-xs text-amber-400/80 font-mono animate-bounce flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" /> Boiling Ginger & Tea Leaves...
                </span>
              </div>
            )}
          </AnimatePresence>

          <div className="relative flex flex-col items-center">
            {/* Steam Animation */}
            <div className="flex gap-1 mb-1 justify-center h-8">
              <motion.div 
                animate={isBrewing ? { y: [-3, -15], opacity: [0, 1, 0] } : { y: [-2, -8], opacity: [0, 0.4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-1 h-6 bg-slate-400/30 rounded-full"
              />
              <motion.div 
                animate={isBrewing ? { y: [-2, -18], opacity: [0, 1, 0] } : { y: [-1, -10], opacity: [0, 0.5, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.3, ease: "easeInOut" }}
                className="w-1 h-6 bg-slate-400/40 rounded-full"
              />
              <motion.div 
                animate={isBrewing ? { y: [-3, -14], opacity: [0, 1, 0] } : { y: [-2, -7], opacity: [0, 0.3, 0] }}
                transition={{ repeat: Infinity, duration: 1.7, delay: 0.1, ease: "easeInOut" }}
                className="w-1 h-6 bg-slate-400/30 rounded-full"
              />
            </div>

            {/* Cup */}
            <div className="relative w-14 h-11 bg-amber-600 rounded-b-xl border-t border-amber-400 flex items-center justify-center shadow-lg">
              {/* Cup Handle */}
              <div className="absolute -right-3 top-1.5 w-4 h-6 border-2 border-l-0 border-amber-600 rounded-r-full" />
              {/* Tea Liquid inside */}
              <motion.div 
                animate={isBrewing ? { scaleY: [0.3, 1, 0.8] } : {}}
                transition={{ duration: 1.5 }}
                className="absolute inset-x-1 bottom-1 top-2 bg-amber-900 rounded-b-lg origin-bottom opacity-90"
              />
              <span className="relative text-[9px] font-mono font-bold text-slate-950 uppercase tracking-tight">CHAI</span>
            </div>
            {/* Plate */}
            <div className="w-20 h-1.5 bg-slate-600 rounded-full mt-1 border-b border-slate-700" />
          </div>
        </div>
      </div>

      {/* Quote display / Encouragement */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-xs leading-relaxed text-slate-300">
        <p className="font-mono text-[10px] text-amber-400 font-bold mb-1 uppercase tracking-wider">Hitesh says:</p>
        <p className="italic">"{currentQuote}"</p>
      </div>

      <button
        onClick={handleBrew}
        disabled={isBrewing}
        className={`w-full mt-4 py-3 px-4 rounded-2xl text-sm font-sans font-medium transition duration-200 flex items-center justify-center gap-2 shadow-lg ${
          isBrewing 
            ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/10"
            : "bg-amber-500 hover:bg-amber-400 text-slate-950 active:translate-y-0.5 hover:shadow-amber-500/10"
        }`}
      >
        <Coffee className={`w-4 h-4 ${isBrewing ? "animate-spin" : ""}`} />
        {isBrewing ? "Brewing Tea..." : "Brew Another Cup of Chai!"}
      </button>
    </div>
  );
}
