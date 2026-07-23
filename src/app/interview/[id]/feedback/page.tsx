"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Feedback, Interview } from "@/types";
import { getFeedbackByInterviewId, getInterviewById } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { AlertCircle } from "lucide-react";

export default function InterviewFeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    const intData = getInterviewById(id);
    if (intData) setInterview(intData);

    const fbData = getFeedbackByInterviewId(id);
    if (fbData) setFeedback(fbData);
  }, [id]);

  if (!interview || !feedback) {
    return (
      <div className="min-h-screen bg-[#020408] text-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-center space-y-4">
          <AlertCircle size={32} className="text-amber-400 mx-auto" />
          <div>
            <p className="text-[#d6e0ff] text-lg font-semibold">
              Feedback Not Yet Available
            </p>
            <p className="text-sm text-[#d6e0ff]/60 mt-1">
              Complete the interview session first to generate detailed AI feedback.
            </p>
            <Link
              href={`/interview/${id}`}
              className="btn-primary mt-4 inline-block text-sm py-2.5 px-6"
            >
              Start Interview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = feedback.createdAt
    ? new Date(feedback.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-[#020408] text-white flex flex-col font-sans">
      <Navbar />

      <main className="root-layout flex-1 py-8">
        <section className="section-feedback">
          <div className="flex flex-row justify-center text-center">
            <h1 className="text-4xl font-semibold text-white">
              Feedback on the Interview -{" "}
              <span className="capitalize text-[#cac5fe]">{interview.role}</span> Interview
            </h1>
          </div>

          <div className="flex flex-row justify-center">
            <div className="flex flex-row gap-5 items-center bg-white/5 border border-white/10 px-6 py-3 rounded-full">
              <div className="flex flex-row gap-2 items-center">
                <Image src="/star.svg" width={22} height={22} alt="star" />
                <p className="text-[#d6e0ff]">
                  Overall Impression:{" "}
                  <span className="text-[#cac5fe] font-bold text-xl">
                    {feedback.totalScore}
                  </span>
                  /100
                </p>
              </div>

              <div className="flex flex-row gap-2 items-center">
                <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
                <p className="text-[#d6e0ff]">{formattedDate}</p>
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          <div className="p-6 rounded-2xl dark-gradient border border-white/10">
            <p className="text-base text-[#d6e0ff] leading-relaxed">
              {feedback.finalAssessment}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white">Breakdown of the Interview:</h2>
            <div className="space-y-4">
              {feedback.categoryScores?.map((category, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-[#27282f]/60 border border-white/10 space-y-1.5"
                >
                  <p className="font-bold text-white text-lg">
                    {index + 1}. {category.name} (
                    <span className="text-[#cac5fe]">{category.score}</span>/100)
                  </p>
                  <p className="text-sm text-[#d6e0ff]/80">{category.comment}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 p-6 rounded-2xl dark-gradient border border-emerald-500/20">
            <h3 className="text-xl font-bold text-emerald-400">Strengths</h3>
            <ul className="space-y-2">
              {feedback.strengths?.map((strength, index) => (
                <li key={index} className="text-[#d6e0ff] text-base">
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 p-6 rounded-2xl dark-gradient border border-amber-500/20">
            <h3 className="text-xl font-bold text-amber-400">Areas for Improvement</h3>
            <ul className="space-y-2">
              {feedback.areasForImprovement?.map((area, index) => (
                <li key={index} className="text-[#d6e0ff] text-base">
                  {area}
                </li>
              ))}
            </ul>
          </div>

          <div className="buttons pt-4">
            <Link
              href="/"
              className="btn-secondary flex-1 py-3.5 text-center justify-center"
            >
              <span className="text-sm font-semibold text-[#cac5fe]">
                Back to dashboard
              </span>
            </Link>

            <Link
              href={`/interview/${id}`}
              className="btn-primary flex-1 py-3.5 text-center justify-center"
            >
              <span className="text-sm font-semibold text-[#020408]">
                Retake Interview
              </span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
