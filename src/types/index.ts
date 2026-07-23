export interface Interview {
  id: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  level: string;
  questions: string[];
  finalized: boolean;
  createdAt: string;
  cover?: string;
}

export interface CategoryScore {
  name: string;
  score: number;
  comment: string;
}

export interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  createdAt: string;
  finalAssessment: string;
  categoryScores: CategoryScore[];
  strengths: string[];
  areasForImprovement: string[];
  transcript?: { role: string; content: string }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CreateInterviewParams {
  role: string;
  type: string;
  techstack: string[];
  level: string;
  amount: number;
}
