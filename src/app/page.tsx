"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { InterviewCard } from "@/components/InterviewCard";
import { CreateInterviewModal } from "@/components/CreateInterviewModal";
import { deleteInterview, getStoredInterviews } from "@/lib/store";
import { Interview } from "@/types";
import { Sparkles, Search, SlidersHorizontal, Mic, BarChart3, Bot } from "lucide-react";

export default function Home() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    setInterviews(getStoredInterviews());
  }, []);

  const handleDelete = (id: string) => {
    deleteInterview(id);
    setInterviews(getStoredInterviews());
  };

  const filteredInterviews = interviews.filter((item) => {
    const matchesSearch =
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.techstack.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (selectedFilter === "completed") {
      return matchesSearch && item.finalized;
    }
    if (selectedFilter === "pending") {
      return matchesSearch && !item.finalized;
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#020408] text-white flex flex-col font-sans">
      <Navbar />

      <main className="root-layout flex-1 space-y-12">
        {/* Call to Action Banner */}
        <section className="card-cta relative overflow-hidden">
          <div className="space-y-4 max-w-2xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cac5fe]/10 border border-[#cac5fe]/30 text-[#cac5fe] text-xs font-semibold">
              <Sparkles size={14} />
              <span>Powered by Vapi AI & Gemini Pro</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Master Your Next <span className="text-[#cac5fe]">Tech Interview</span>
            </h1>
            <p className="text-base text-[#d6e0ff]/80 leading-relaxed">
              Experience real-time interactive AI voice interviews tailored to your exact tech stack, experience level, and role requirements.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary text-base py-3.5 px-8 flex items-center gap-2 shadow-lg shadow-[#cac5fe]/20 hover:scale-105 transition-transform"
              >
                <Mic size={18} />
                Create New Mock Interview
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center max-sm:w-full">
            <div className="relative size-44 rounded-full blue-gradient-dark border-2 border-[#cac5fe]/30 flex items-center justify-center p-4 shadow-2xl">
              <Bot size={72} className="text-[#cac5fe] animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-[#cac5fe]/40 animate-ping opacity-25" />
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl dark-gradient border border-white/10 space-y-3">
            <div className="size-10 rounded-xl bg-[#cac5fe]/10 flex items-center justify-center text-[#cac5fe]">
              <Mic size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Voice Agent Dialogue</h3>
            <p className="text-sm text-[#d6e0ff]/70">
              Interactive voice conversations with speech recognition and natural AI audio output.
            </p>
          </div>

          <div className="p-6 rounded-2xl dark-gradient border border-white/10 space-y-3">
            <div className="size-10 rounded-xl bg-[#cac5fe]/10 flex items-center justify-center text-[#cac5fe]">
              <Sparkles size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Gemini Question Engine</h3>
            <p className="text-sm text-[#d6e0ff]/70">
              Generates role-specific questions across React, Next.js, Python, Node, and System Design.
            </p>
          </div>

          <div className="p-6 rounded-2xl dark-gradient border border-white/10 space-y-3">
            <div className="size-10 rounded-xl bg-[#cac5fe]/10 flex items-center justify-center text-[#cac5fe]">
              <BarChart3 size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">5-Category Evaluation</h3>
            <p className="text-sm text-[#d6e0ff]/70">
              Receive granular feedback on Communication, Technical Depth, Problem Solving, and Fit.
            </p>
          </div>
        </section>

        {/* Mock Interviews List Header & Filter */}
        <section id="interviews" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-white">Your Mock Interviews</h2>
              <p className="text-sm text-[#d6e0ff]/70">
                Track and practice your generated interview sessions.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={16} className="absolute left-3.5 top-3.5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search role or tech..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full bg-[#27282f] pl-10 pr-4 py-2 text-sm text-white border border-white/10 outline-none focus:border-[#cac5fe]"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#27282f] p-1 rounded-full border border-white/10">
                <SlidersHorizontal size={14} className="ml-3 text-white/40" />
                <button
                  onClick={() => setSelectedFilter("all")}
                  className={`px-3 py-1 text-xs rounded-full font-semibold transition-colors ${
                    selectedFilter === "all"
                      ? "bg-[#cac5fe] text-[#020408]"
                      : "text-[#d6e0ff] hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter("pending")}
                  className={`px-3 py-1 text-xs rounded-full font-semibold transition-colors ${
                    selectedFilter === "pending"
                      ? "bg-[#cac5fe] text-[#020408]"
                      : "text-[#d6e0ff] hover:text-white"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setSelectedFilter("completed")}
                  className={`px-3 py-1 text-xs rounded-full font-semibold transition-colors ${
                    selectedFilter === "completed"
                      ? "bg-[#cac5fe] text-[#020408]"
                      : "text-[#d6e0ff] hover:text-white"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>

          {/* Grid */}
          {filteredInterviews.length > 0 ? (
            <div className="interviews-section">
              {filteredInterviews.map((item) => (
                <InterviewCard
                  key={item.id}
                  interview={item}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl dark-gradient border border-white/10 space-y-4">
              <p className="text-lg text-[#d6e0ff]">No mock interviews found matching your criteria.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary py-2.5 px-6 text-sm"
              >
                + Create Your First Interview
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-[#d6e0ff]/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Prepwise. Built with Next.js, Vapi AI, and Google Gemini.</p>
          <div className="flex gap-6">
            <a href="https://jsmastery.pro/next15" target="_blank" rel="noreferrer" className="hover:text-[#cac5fe]">
              JavaScript Mastery
            </a>
            <a href="https://vapi.ai" target="_blank" rel="noreferrer" className="hover:text-[#cac5fe]">
              Vapi Voice AI
            </a>
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <CreateInterviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
