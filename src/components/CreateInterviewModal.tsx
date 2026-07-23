"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles, Plus, Loader2 } from "lucide-react";
import { levelOptions, techOptions, typeOptions } from "@/constants";
import { saveInterview } from "@/lib/store";
import { Interview } from "@/types";

interface CreateInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateInterviewModal({
  isOpen,
  onClose,
}: CreateInterviewModalProps) {
  const router = useRouter();
  const [role, setRole] = useState("Frontend Engineer");
  const [level, setLevel] = useState("Mid-Level");
  const [type, setType] = useState("Technical");
  const [selectedTech, setSelectedTech] = useState<string[]>([
    "React",
    "TypeScript",
    "Next.js",
  ]);
  const [customTech, setCustomTech] = useState("");
  const [amount, setAmount] = useState(4);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const toggleTech = (tech: string) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter((t) => t !== tech));
    } else {
      setSelectedTech([...selectedTech, tech]);
    }
  };

  const handleAddCustomTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTech.trim() && !selectedTech.includes(customTech.trim())) {
      setSelectedTech([...selectedTech, customTech.trim()]);
      setCustomTech("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim() || selectedTech.length === 0) return;

    setLoading(true);

    try {
      // Call API route to generate AI questions
      const res = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          level,
          type,
          techstack: selectedTech,
          amount,
        }),
      });

      const data = await res.json();
      const questions: string[] = data.questions || [];

      const newInterview: Interview = {
        id: `int_${Date.now()}`,
        userId: "user1",
        role: role.trim(),
        level,
        type,
        techstack: selectedTech,
        questions:
          questions.length > 0
            ? questions
            : [
                `Walk me through your experience with ${selectedTech.join(", ")}.`,
                `How do you handle performance optimization and scalability in ${role} projects?`,
                `Describe a challenging problem you solved using ${selectedTech[0]}.`,
              ],
        finalized: false,
        createdAt: new Date().toISOString(),
      };

      saveInterview(newInterview);
      onClose();
      router.push(`/interview/${newInterview.id}`);
    } catch (err) {
      console.error("Failed to create interview:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl dark-gradient border border-white/10 p-8 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2.5 rounded-2xl bg-[#cac5fe]/10 border border-[#cac5fe]/20 text-[#cac5fe]">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Create AI Interview</h2>
            <p className="text-sm text-[#d6e0ff]/70">
              Generate custom mock interview questions using AI voice agents.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#d6e0ff]">
              Target Job Role
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Full Stack Developer, DevOps Engineer"
              className="w-full rounded-2xl bg-[#27282f] px-5 py-3 text-white border border-white/10 focus:border-[#cac5fe] outline-none"
            />
          </div>

          {/* Level & Type */}
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#d6e0ff]">
                Experience Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full rounded-2xl bg-[#27282f] px-4 py-3 text-white border border-white/10 focus:border-[#cac5fe] outline-none"
              >
                {levelOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#27282f]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#d6e0ff]">
                Question Focus
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-2xl bg-[#27282f] px-4 py-3 text-white border border-white/10 focus:border-[#cac5fe] outline-none"
              >
                {typeOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#27282f]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#d6e0ff]">
              Tech Stack & Frameworks
            </label>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
              {techOptions.map((tech) => {
                const isSelected = selectedTech.includes(tech);
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-[#cac5fe] text-[#020408] border-[#cac5fe]"
                        : "bg-[#27282f] text-[#d6e0ff] border-white/10 hover:border-white/30"
                    }`}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={customTech}
                onChange={(e) => setCustomTech(e.target.value)}
                placeholder="Add custom tech..."
                className="flex-1 rounded-xl bg-[#27282f] px-4 py-2 text-xs text-white border border-white/10 outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomTech}
                className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-[#d6e0ff]">
              <span>Number of Questions</span>
              <span className="font-bold text-[#cac5fe]">{amount}</span>
            </div>
            <input
              type="range"
              min={3}
              max={10}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-[#cac5fe] cursor-pointer"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || selectedTech.length === 0}
            className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Generating Interview with AI...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Interview
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
