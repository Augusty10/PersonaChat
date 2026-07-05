import React, { useState, useEffect, useRef } from "react";
import { Terminal, Cpu, Database, Server, HardDrive, Wifi, Sparkles, Shield, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function SystemArchitect() {
  const [deployCount, setDeployCount] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [cachingEnabled, setCachingEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("diagram");
  const [logs, setLogs] = useState([]);
  const [activeNode, setActiveNode] = useState("Client");
  const [requestStats, setRequestStats] = useState({ hits: 14, misses: 3, total: 17 });
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [currentLatency, setCurrentLatency] = useState(null);
  
  const terminalEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("ai_tech_mentor_deploy_count");
    if (saved) {
      setDeployCount(parseInt(saved, 10));
    } else {
      setDeployCount(12);
    }

    setLogs([
      { id: "1", text: "System Initialized.", type: "info", time: "10:44:02" },
      { id: "2", text: "Nginx API Gateway listening on port 80", type: "info", time: "10:44:03" },
      { id: "3", text: "Connected to PostgreSQL database at port 5432", type: "success", time: "10:44:03" },
      { id: "4", text: "Redis Server running on port 6379", type: "success", time: "10:44:04" },
      { id: "5", text: "Type 'docker ps' or run requests to monitor...", type: "info", time: "10:44:05" }
    ]);
  }, []);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const addLog = (text, type = "info") => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setLogs((prev) => [...prev, { id: String(Date.now() + Math.random()), text, type, time: timeStr }]);
  };

  const handleDeploy = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setActiveTab("logs");

    addLog("docker build -t pg-app-node:v2.5 .", "cmd");
    
    setTimeout(() => {
      addLog("Step 1/4 : FROM node:18-alpine", "info");
    }, 400);

    setTimeout(() => {
      addLog("Step 2/4 : WORKDIR /usr/src/app", "info");
      addLog("Step 3/4 : COPY package*.json ./ && RUN npm ci --omit=dev", "info");
    }, 900);

    setTimeout(() => {
      addLog("Step 4/4 : COPY . . && EXPOSE 3000 && CMD ['node', 'server.js']", "info");
      addLog("Successfully built image pg-app-node:v2.5", "success");
      addLog("docker run -d --name pg-server-container -p 3000:3000 --network pg-net pg-app-node:v2.5", "cmd");
    }, 1600);

    setTimeout(() => {
      const newCount = deployCount + 1;
      setDeployCount(newCount);
      localStorage.setItem("ai_tech_mentor_deploy_count", String(newCount));
      addLog("Container sprouted successfully on Port 3000!", "success");
      addLog("Health check passed. Response time: 4ms.", "success");
      setIsDeploying(false);
    }, 2400);
  };

  const handleTestRequest = () => {
    if (isSendingRequest) return;
    setIsSendingRequest(true);
    setCurrentLatency(null);

    const hit = cachingEnabled && Math.random() > 0.15; // 85% hit chance if enabled
    const latency = hit ? 2 : Math.floor(Math.random() * 45) + 60; // 2ms vs 60-105ms

    addLog(`GET /api/v1/users/profile - Originating from Client`, "cmd");

    setTimeout(() => {
      addLog("Routing through Nginx API Gateway...", "info");
    }, 200);

    setTimeout(() => {
      addLog("Express Server processing route handler...", "info");
    }, 450);

    setTimeout(() => {
      if (cachingEnabled) {
        if (hit) {
          addLog("Redis Cache HIT! Key 'user:profile' found.", "success");
          setRequestStats((prev) => ({ ...prev, hits: prev.hits + 1, total: prev.total + 1 }));
        } else {
          addLog("Redis Cache MISS! Fetching from PostgreSQL DB...", "error");
          addLog("Executing query: SELECT * FROM users WHERE id = $1 LIMIT 1;", "info");
          addLog("Writing back to Redis cache...", "success");
          setRequestStats((prev) => ({ ...prev, misses: prev.misses + 1, total: prev.total + 1 }));
        }
      } else {
        addLog("Caching disabled. Fetching from PostgreSQL DB directly...", "info");
        addLog("Executing query: SELECT * FROM users WHERE id = $1 LIMIT 1;", "info");
        setRequestStats((prev) => ({ ...prev, misses: prev.misses + 1, total: prev.total + 1 }));
      }
    }, 800);

    setTimeout(() => {
      addLog(`Response sent. Status: 200 OK. Latency: ${latency}ms`, hit ? "success" : "info");
      setCurrentLatency(latency);
      setIsSendingRequest(false);
    }, 1200);
  };

  const resetStats = () => {
    setRequestStats({ hits: 0, misses: 0, total: 0 });
    addLog("Request counters reset.", "info");
  };

  return (
    <div id="system-architect-widget" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 text-slate-200 shadow-xl h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-cyan-500/15 rounded-xl text-cyan-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h4 className="font-sans font-semibold text-white text-sm">System Architect Canvas</h4>
              <p className="text-xs text-slate-400 font-mono">Production scalability simulator</p>
            </div>
          </div>
          <div className="flex items-center gap-1 p-1 bg-black/20 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab("diagram")}
              className={`px-2.5 py-1 rounded-lg text-xs transition font-mono ${
                activeTab === "diagram" ? "bg-white/10 text-cyan-400 font-bold border border-white/5" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Blueprint
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-2.5 py-1 rounded-lg text-xs transition font-mono ${
                activeTab === "logs" ? "bg-white/10 text-cyan-400 font-bold border border-white/5" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Terminal
            </button>
          </div>
        </div>

        {/* Caching Switch & Send request */}
        <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-xl border border-white/10 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Redis Cache:</span>
            <button
              onClick={() => {
                setCachingEnabled(!cachingEnabled);
                addLog(`Redis Cache switched ${!cachingEnabled ? "ON" : "OFF"}.`, "info");
              }}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                cachingEnabled ? "bg-cyan-500" : "bg-white/10"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                  cachingEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {currentLatency !== null && (
              <span className={`font-mono text-[11px] ${currentLatency < 10 ? "text-green-400" : "text-amber-400"}`}>
                {currentLatency}ms
              </span>
            )}
            <button
              onClick={handleTestRequest}
              disabled={isSendingRequest || isDeploying}
              className="bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-lg transition disabled:opacity-50 font-sans font-medium text-xs"
            >
              {isSendingRequest ? "Sending..." : "Test Latency"}
            </button>
          </div>
        </div>

        {/* Blueprint Visual Screen */}
        {activeTab === "diagram" ? (
          <div className="relative border border-white/10 rounded-2xl p-3 bg-black/20 h-56 flex flex-col justify-between overflow-hidden">
            {/* Request Dot Animation */}
            {isSendingRequest && (
              <motion.div
                initial={{ x: 10, y: 30 }}
                animate={{
                  x: [10, 85, 145, cachingEnabled ? 210 : 145, !cachingEnabled ? 210 : 145, 85, 10],
                  y: [30, 30, 30, cachingEnabled ? -35 : 30, !cachingEnabled ? 90 : 30, 30, 30]
                }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] z-20"
              />
            )}

            {/* Grid layout of nodes */}
            <div className="grid grid-cols-3 gap-y-12 gap-x-2 relative mt-4">
              {/* Row 1 - Redis Caching Server */}
              <div className="col-start-3 text-center">
                <button
                  onClick={() => setActiveNode("Redis")}
                  className={`mx-auto w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                    activeNode === "Redis" ? "border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.2)]" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                  } ${cachingEnabled ? "opacity-100" : "opacity-40"}`}
                  title="Redis Cache Key-Value Store"
                >
                  <Cpu className="w-5 h-5" />
                </button>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Redis Cache</div>
              </div>

              {/* Connecting lines - background drawings */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-white/5 stroke-[1.5] fill-none -z-10 overflow-visible">
                {/* Client to Gateway */}
                <line x1="45" y1="20" x2="105" y2="20" />
                {/* Gateway to Node app */}
                <line x1="145" y1="20" x2="205" y2="20" />
                {/* Node App to Redis (diagonal up) */}
                <path d="M 220 10 L 220 -20 L 245 -20" />
                {/* Node App to Postgres (diagonal down) */}
                <path d="M 220 30 L 220 60 L 245 60" />
              </svg>

              {/* Row 2 - Flow line */}
              {/* Client */}
              <div className="text-center">
                <button
                  onClick={() => setActiveNode("Client")}
                  className={`mx-auto w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                    activeNode === "Client" ? "border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.2)]" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <Wifi className="w-5 h-5" />
                </button>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Client</div>
              </div>

              {/* API Gateway Nginx */}
              <div className="text-center">
                <button
                  onClick={() => setActiveNode("Gateway")}
                  className={`mx-auto w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                    activeNode === "Gateway" ? "border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.2)]" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                  }`}
                  title="Nginx Reverse Proxy & Gateway"
                >
                  <Shield className="w-5 h-5" />
                </button>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">API Gateway</div>
              </div>

              {/* Node.js Express Server */}
              <div className="text-center">
                <button
                  onClick={() => setActiveNode("Server")}
                  className={`mx-auto w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                    activeNode === "Server" ? "border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.2)]" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                  }`}
                  title="Dockerized Node.js Express Server"
                >
                  <Server className="w-5 h-5 animate-pulse" />
                </button>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Node.js Server</div>
              </div>

              {/* Row 3 - PostgreSQL database */}
              <div className="col-start-3 text-center -mt-4">
                <button
                  onClick={() => setActiveNode("Database")}
                  className={`mx-auto w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                    activeNode === "Database" ? "border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.2)]" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                  }`}
                  title="PostgreSQL Relational DB"
                >
                  <Database className="w-5 h-5" />
                </button>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">PostgreSQL DB</div>
              </div>
            </div>

            {/* Info panel for selected node */}
            <div className="bg-black/20 p-2 border-t border-white/10 rounded-b-2xl text-[11px] text-slate-300 flex items-center justify-between">
              <div>
                <span className="font-mono text-cyan-400 font-bold uppercase">{activeNode}: </span>
                <span>
                  {activeNode === "Client" && "React Browser sending HTTP / WS queries."}
                  {activeNode === "Gateway" && "Nginx reverse proxy & rate limiter on port 80."}
                  {activeNode === "Server" && "Express.js running in a clustered Docker container."}
                  {activeNode === "Redis" && "In-memory cache database for caching SQL queries."}
                  {activeNode === "Database" && "Durable PostgreSQL store holding relational user schemas."}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Logs Panel */
          <div className="border border-white/10 rounded-2xl p-3 bg-black/30 h-56 font-mono text-[10px] leading-relaxed overflow-y-auto flex flex-col justify-between">
            <div>
              {logs.map((log) => (
                <div key={log.id} className="mb-1 flex items-start gap-1">
                  <span className="text-slate-600">[{log.time}]</span>
                  {log.type === "cmd" && <span className="text-cyan-400 font-bold">$</span>}
                  <span
                    className={
                      log.type === "success"
                        ? "text-green-400"
                        : log.type === "error"
                        ? "text-red-400 font-medium"
                        : log.type === "cmd"
                        ? "text-slate-200"
                        : "text-slate-400"
                    }
                  >
                    {log.text}
                  </span>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>
        )}

        {/* Real-time counters */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-black/20 p-2 rounded-xl border border-white/10">
            <div className="text-[10px] text-slate-500 font-mono">CACHE HITS</div>
            <div className="text-sm font-sans font-bold text-green-400">{requestStats.hits}</div>
          </div>
          <div className="bg-black/20 p-2 rounded-xl border border-white/10">
            <div className="text-[10px] text-slate-500 font-mono">DB QUERIES</div>
            <div className="text-sm font-sans font-bold text-amber-500">{requestStats.misses}</div>
          </div>
          <div className="bg-black/20 p-2 rounded-xl border border-white/10 relative">
            <button
              onClick={resetStats}
              title="Reset metrics"
              className="absolute right-1.5 top-1.5 text-slate-500 hover:text-slate-300"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
            <div className="text-[10px] text-slate-500 font-mono">HIT RATE</div>
            <div className="text-sm font-sans font-bold text-cyan-400">
              {requestStats.total > 0 ? Math.round((requestStats.hits / requestStats.total) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Dock Deploy Button */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
        <div className="text-xs">
          <span className="text-slate-400">Deployed Containers:</span>
          <span className="font-mono text-cyan-400 font-bold ml-1.5">{deployCount}</span>
        </div>
        <button
          onClick={handleDeploy}
          disabled={isDeploying || isSendingRequest}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-sans font-semibold transition ${
            isDeploying 
              ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/10" 
              : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg active:translate-y-0.5"
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          {isDeploying ? "Deploying..." : "Deploy to Docker 🐳"}
        </button>
      </div>
    </div>
  );
}
