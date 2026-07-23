import { dummyInterviews } from "@/constants";
import { Feedback, Interview } from "@/types";

const INTERVIEWS_KEY = "prepwise_interviews";
const FEEDBACK_KEY = "prepwise_feedbacks";

const initialFeedbacks: Feedback[] = [
  {
    id: "fb_1",
    interviewId: "1",
    totalScore: 88,
    createdAt: "2024-03-15T10:30:00Z",
    finalAssessment:
      "The candidate displayed strong core knowledge of React fundamentals, hooks lifecycle, and state propagation. Communication was articulate and concise. Work on deepening knowledge of Next.js hydration boundaries for full score.",
    categoryScores: [
      {
        name: "Communication Skills",
        score: 92,
        comment: "Excellent clarity and structured explanations when detailing state vs props.",
      },
      {
        name: "Technical Knowledge",
        score: 86,
        comment: "Solid grasp of Virtual DOM reconciliation and Tailwind CSS v4 custom theme tokens.",
      },
      {
        name: "Problem-Solving",
        score: 85,
        comment: "Logical approach when reasoning about async state updates and error boundaries.",
      },
      {
        name: "Cultural & Role Fit",
        score: 90,
        comment: "High enthusiasm and great alignment with modern frontend engineering standards.",
      },
      {
        name: "Confidence & Clarity",
        score: 87,
        comment: "Paced responses well without trailing off during complex explanations.",
      },
    ],
    strengths: [
      "Deep understanding of React rendering lifecycle and hook optimization",
      "Clear, articulate technical communication",
      "Strong familiarity with TypeScript types and Tailwind CSS styling patterns",
    ],
    areasForImprovement: [
      "Elaborate more on server vs client component boundaries in Next.js",
      "Include edge-case handling strategy when answering async state questions",
    ],
    transcript: [
      { role: "interviewer", content: "Welcome! Let's start with your first question: What is React and how does the Virtual DOM work?" },
      { role: "user", content: "React is a JavaScript library for building user interfaces. The Virtual DOM is a lightweight in-memory representation of the real DOM. When state changes, React creates a new Virtual DOM tree and diffs it with the previous one to calculate minimal DOM updates." },
      { role: "interviewer", content: "Great explanation. How do state and props differ?" },
      { role: "user", content: "Props are read-only data passed down from parent components, while state is internal component data that can change over time." },
    ],
  },
];

export const getStoredInterviews = (): Interview[] => {
  if (typeof window === "undefined") return dummyInterviews;
  try {
    const data = localStorage.getItem(INTERVIEWS_KEY);
    if (!data) {
      localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(dummyInterviews));
      return dummyInterviews;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading interviews from storage:", err);
    return dummyInterviews;
  }
};

export const getInterviewById = (id: string): Interview | undefined => {
  const interviews = getStoredInterviews();
  return interviews.find((item) => item.id === id);
};

export const saveInterview = (interview: Interview): void => {
  if (typeof window === "undefined") return;
  try {
    const interviews = getStoredInterviews();
    const existingIndex = interviews.findIndex((i) => i.id === interview.id);
    let updated: Interview[];
    if (existingIndex >= 0) {
      updated = [...interviews];
      updated[existingIndex] = interview;
    } else {
      updated = [interview, ...interviews];
    }
    localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Error saving interview to storage:", err);
  }
};

export const deleteInterview = (id: string): void => {
  if (typeof window === "undefined") return;
  try {
    const interviews = getStoredInterviews();
    const updated = interviews.filter((item) => item.id !== id);
    localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Error deleting interview from storage:", err);
  }
};

export const getStoredFeedbacks = (): Feedback[] => {
  if (typeof window === "undefined") return initialFeedbacks;
  try {
    const data = localStorage.getItem(FEEDBACK_KEY);
    if (!data) {
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(initialFeedbacks));
      return initialFeedbacks;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading feedback from storage:", err);
    return initialFeedbacks;
  }
};

export const getFeedbackByInterviewId = (interviewId: string): Feedback | undefined => {
  const feedbacks = getStoredFeedbacks();
  return feedbacks.find((fb) => fb.interviewId === interviewId);
};

export const saveFeedback = (feedback: Feedback): void => {
  if (typeof window === "undefined") return;
  try {
    const feedbacks = getStoredFeedbacks();
    const index = feedbacks.findIndex((f) => f.interviewId === feedback.interviewId);
    let updated: Feedback[];
    if (index >= 0) {
      updated = [...feedbacks];
      updated[index] = feedback;
    } else {
      updated = [feedback, ...feedbacks];
    }
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
    
    // Also mark the corresponding interview as finalized
    const interview = getInterviewById(feedback.interviewId);
    if (interview) {
      saveInterview({ ...interview, finalized: true });
    }
  } catch (err) {
    console.error("Error saving feedback to storage:", err);
  }
};
