"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getInterviewById, saveFeedback } from "@/lib/store";
import { generateInterviewFeedback } from "@/lib/actions/general.action";
import { Interview } from "@/types";
import { Navbar } from "@/components/Navbar";
import { Mic, MicOff, Volume2, Bot, Send, Loader2, Sparkles, AlertCircle } from "lucide-react";

export default function InterviewRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const interviewId = resolvedParams.id;
  const router = useRouter();

  const [interview, setInterview] = useState<Interview | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCalling, setIsCalling] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [userSpeechText, setUserSpeechText] = useState("");
  const [transcript, setTranscript] = useState<{ role: string; content: string }[]>([]);
  const [generatingFeedback, setGeneratingFeedback] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const data = getInterviewById(interviewId);
    if (data) {
      setInterview(data);
    }
  }, [interviewId]);

  // Speech synthesis helper
  const speakText = (text: string, onEnd?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      onEnd?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Start voice interview session
  const startCall = () => {
    if (!interview) return;
    setIsCalling(true);

    const firstQuestion = interview.questions[0];
    const initialTranscript = [
      {
        role: "interviewer",
        content: `Welcome to your ${interview.role} mock interview! Let's begin. Question 1: ${firstQuestion}`,
      },
    ];
    setTranscript(initialTranscript);
    speakText(`Welcome to your ${interview.role} mock interview! Let's begin. ${firstQuestion}`, () => {
      startListening();
    });
  };

  // Speech recognition helper
  const startListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let currentText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setUserSpeechText(currentText);
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition notice:", err);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn("Speech recognition error:", err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
  };

  // Submit current response and advance
  const handleSendResponse = () => {
    if (!userSpeechText.trim() && !isSpeaking) return;

    const answer = userSpeechText.trim() || "Candidate responded clearly.";
    const updatedTranscript = [
      ...transcript,
      { role: "user", content: answer },
    ];

    setUserSpeechText("");
    stopListening();

    const nextIndex = currentQuestionIndex + 1;
    if (interview && nextIndex < interview.questions.length) {
      setCurrentQuestionIndex(nextIndex);
      const nextQ = interview.questions[nextIndex];

      const newTranscript = [
        ...updatedTranscript,
        { role: "interviewer", content: `Question ${nextIndex + 1}: ${nextQ}` },
      ];
      setTranscript(newTranscript);

      speakText(`Question ${nextIndex + 1}: ${nextQ}`, () => {
        if (isMicOn) startListening();
      });
    } else {
      // Last question completed
      setTranscript(updatedTranscript);
      finishInterview(updatedTranscript);
    }
  };

  const finishInterview = async (finalTranscript = transcript) => {
    if (!interview) return;
    stopListening();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setGeneratingFeedback(true);

    try {
      const feedbackObj = await generateInterviewFeedback({
        interview,
        transcript: finalTranscript,
      });

      saveFeedback(feedbackObj);
      router.push(`/interview/${interview.id}/feedback`);
    } catch (err) {
      console.error("Failed to generate feedback:", err);
    } finally {
      setGeneratingFeedback(false);
    }
  };

  if (!interview) {
    return (
      <div className="min-h-screen bg-[#020408] text-white flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-center space-y-4">
          <AlertCircle size={32} className="text-red-400 mx-auto" />
          <p className="text-[#d6e0ff]">Interview session not found.</p>
        </div>
      </div>
    );
  }

  const currentQ = interview.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#020408] text-white flex flex-col font-sans">
      <Navbar />

      <main className="root-layout flex-1 space-y-8 max-w-6xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#cac5fe]/10 text-[#cac5fe] text-xs font-semibold border border-[#cac5fe]/30">
                {interview.level} • {interview.type}
              </span>
              <span className="text-xs text-[#d6e0ff]/60">
                Question {currentQuestionIndex + 1} of {interview.questions.length}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mt-1">
              {interview.role} Interview
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {!isCalling ? (
              <button onClick={startCall} className="btn-call">
                Start Interview Call
              </button>
            ) : (
              <button
                onClick={() => finishInterview()}
                disabled={generatingFeedback}
                className="btn-disconnect flex items-center gap-2"
              >
                {generatingFeedback ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Analyzing...
                  </>
                ) : (
                  "End & Finish"
                )}
              </button>
            )}
          </div>
        </div>

        {/* Call View Container */}
        <div className="call-view">
          {/* AI Voice Interviewer Card */}
          <div className="card-interviewer">
            <div className="avatar">
              {isSpeaking && <span className="animate-speak" />}
              <Bot size={56} className="text-[#020408] relative z-10" />
            </div>

            <div className="text-center space-y-1 mt-4">
              <h3 className="text-xl font-bold text-[#dddfff]">AI Voice Assistant</h3>
              <p className="text-xs text-[#d6e0ff]/70 flex items-center justify-center gap-1.5">
                {isSpeaking ? (
                  <>
                    <Volume2 size={14} className="text-[#cac5fe] animate-bounce" />
                    Speaking question...
                  </>
                ) : isCalling ? (
                  <>
                    <Mic size={14} className="text-emerald-400 animate-pulse" />
                    Listening to candidate...
                  </>
                ) : (
                  "Ready to start session"
                )}
              </p>
            </div>
          </div>

          {/* Current Question Card */}
          <div className="card-border">
            <div className="card-content">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cac5fe]/10 text-[#cac5fe] text-xs font-semibold mb-2">
                <Sparkles size={14} />
                Current Question
              </div>

              <p className="text-center text-lg font-medium text-white px-4 leading-relaxed">
                "{currentQ}"
              </p>

              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {interview.techstack.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs rounded-full bg-white/5 text-[#d6e0ff] border border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Transcript & Input Box */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Live Conversation</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsMicOn(!isMicOn);
                  if (isMicOn) stopListening();
                  else if (isCalling) startListening();
                }}
                className={`p-2 rounded-full border transition-colors ${
                  isMicOn
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }`}
                title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
              >
                {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
              </button>
            </div>
          </div>

          {/* Transcript Feed */}
          <div className="rounded-2xl dark-gradient border border-white/10 p-6 min-h-[200px] max-h-[320px] overflow-y-auto space-y-4">
            {transcript.length > 0 ? (
              transcript.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <span className="text-xs text-[#d6e0ff]/50 mb-1 capitalize">
                    {msg.role}
                  </span>
                  <div
                    className={`max-w-xl rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#cac5fe] text-[#020408] font-medium"
                        : "bg-[#27282f] text-white border border-white/10"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-center text-xs text-[#d6e0ff]/50 py-12">
                Click "Start Interview Call" to begin the voice session.
              </div>
            )}
          </div>

          {/* Text Response / Voice Text Confirmation Input */}
          {isCalling && (
            <div className="flex gap-3 pt-2">
              <input
                type="text"
                value={userSpeechText}
                onChange={(e) => setUserSpeechText(e.target.value)}
                placeholder="Speak into your mic or type your response here..."
                onKeyDown={(e) => e.key === "Enter" && handleSendResponse()}
                className="flex-1 rounded-full bg-[#27282f] px-6 py-3.5 text-sm text-white border border-white/10 outline-none focus:border-[#cac5fe]"
              />
              <button
                onClick={handleSendResponse}
                className="btn-primary py-3.5 px-6 text-sm flex items-center gap-2"
              >
                <span>Submit Response</span>
                <Send size={16} />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
