"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User } from "lucide-react";

interface Message { role: "user" | "assistant"; text: string; }
interface Props {
  columns: string[];
  dataSummary: string;
  rowCount: number;
}

const SUGGESTIONS = [
  "What are the key trends in this dataset?",
  "Which values are the highest?",
  "Give me a summary of this data.",
  "Any anomalies or outliers I should know about?",
];

export default function AIChat({ columns, dataSummary, rowCount }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: `Hi! I've analyzed your dataset (${rowCount} rows, ${columns.length} columns). Ask me anything about it — trends, comparisons, summaries, or anomalies.` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(q?: string) {
    const question = q ?? input.trim();
    if (!question || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: question }]);
    setLoading(true);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, dataSummary, columns, rowCount }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.answer ?? data.error ?? "Sorry, something went wrong." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Network error. Please try again." }]);
    } finally { setLoading(false); }
  }

  return (
    <div className="card flex flex-col h-[500px]">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-brand-600/20 flex items-center justify-center">
          <Sparkles size={16} className="text-brand-400" />
        </div>
        <div>
          <p className="font-semibold text-sm">AI Data Analyst</p>
          <p className="text-xs text-gray-500">Powered by Claude</p>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 animate-msg ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs
              ${m.role === "assistant" ? "bg-brand-600/30 text-brand-400" : "bg-gray-700 text-gray-300"}`}>
              {m.role === "assistant" ? <Sparkles size={12} /> : <User size={12} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
              ${m.role === "assistant"
                ? "bg-gray-800 text-gray-200 rounded-tl-sm"
                : "bg-brand-600 text-white rounded-tr-sm"}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 animate-msg">
            <div className="w-7 h-7 rounded-full bg-brand-600/30 flex items-center justify-center">
              <Sparkles size={12} className="text-brand-400" />
            </div>
            <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 my-3">
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => send(s)}
              className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full px-3 py-1.5 text-gray-400 hover:text-gray-200 transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* input */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-800">
        <input
          className="input text-sm"
          placeholder="Ask about your data..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          disabled={loading}
        />
        <button onClick={() => send()} disabled={!input.trim() || loading}
          className="btn-primary flex items-center gap-1.5 px-3 flex-shrink-0">
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
