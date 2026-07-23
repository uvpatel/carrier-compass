"use client";

import { Interview } from "@/types";
import { normalizeTechName } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Calendar, CheckCircle2, PlayCircle, Star, Trash2 } from "lucide-react";
import { getFeedbackByInterviewId } from "@/lib/store";
import { useEffect, useState } from "react";

interface InterviewCardProps {
  interview: Interview;
  onDelete?: (id: string) => void;
}

export function InterviewCard({ interview, onDelete }: InterviewCardProps) {
  const [feedbackScore, setFeedbackScore] = useState<number | null>(null);

  useEffect(() => {
    const fb = getFeedbackByInterviewId(interview.id);
    if (fb) {
      setFeedbackScore(fb.totalScore);
    }
  }, [interview.id]);

  const levelColor =
    interview.level === "Senior"
      ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
      : interview.level === "Lead"
      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
      : interview.level === "Mid-Level"
      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";

  return (
    <div className="card-interview flex-1 min-w-[320px] max-w-[400px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${levelColor}`}
          >
            {interview.level}
          </span>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/5 text-[#d6e0ff] border border-white/10">
            {interview.type}
          </span>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(interview.id)}
            className="text-white/40 hover:text-red-400 transition-colors p-1"
            title="Delete Interview"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
          {interview.role}
        </h3>

        <div className="flex items-center gap-2 text-xs text-[#d6e0ff]/70">
          <Calendar size={14} className="text-[#cac5fe]" />
          <span>
            {new Date(interview.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>•</span>
          <span>{interview.questions.length} Questions</span>
        </div>
      </div>

      {/* Tech Stack Icons */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-[#d6e0ff]/50 font-semibold">
          Tech Stack
        </p>
        <div className="flex flex-wrap gap-2.5 items-center">
          {interview.techstack.map((tech, idx) => {
            const normalized = normalizeTechName(tech);
            const logoUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${normalized}/${normalized}-original.svg`;

            return (
              <div
                key={idx}
                className="group relative flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#cac5fe]/40 transition-colors"
              >
                <Image
                  src={logoUrl}
                  alt={tech}
                  width={22}
                  height={22}
                  onError={(e) => {
                    // Fallback image handling
                    (e.target as HTMLElement).setAttribute("src", "/tech.svg");
                  }}
                  className="object-contain size-5"
                />
                <span className="tech-tooltip">{tech}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score / Status Banner */}
      {interview.finalized && feedbackScore !== null ? (
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#cac5fe]/10 border border-[#cac5fe]/20">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-[#cac5fe] fill-[#cac5fe]" />
            <span className="text-sm font-semibold text-[#d6e0ff]">Score</span>
          </div>
          <span className="text-lg font-bold text-[#cac5fe]">
            {feedbackScore} <span className="text-xs text-white/50">/ 100</span>
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-[#d6e0ff]/60">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span>Ready for practice</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {interview.finalized ? (
          <>
            <Link
              href={`/interview/${interview.id}/feedback`}
              className="btn-secondary text-xs flex-1 text-center py-2.5"
            >
              View Feedback
            </Link>
            <Link
              href={`/interview/${interview.id}`}
              className="btn-primary text-xs flex-1 text-center py-2.5"
            >
              Retake
            </Link>
          </>
        ) : (
          <Link
            href={`/interview/${interview.id}`}
            className="btn-primary w-full text-center py-3 flex items-center justify-center gap-2"
          >
            <PlayCircle size={18} />
            Start Interview
          </Link>
        )}
      </div>
    </div>
  );
}
