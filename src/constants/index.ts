import { Interview } from "@/types";

export const interviewCovers = [
  "/covers/cover1.png",
  "/covers/cover2.png",
  "/covers/cover3.png",
  "/covers/cover4.png",
];

export const mappings: Record<string, string> = {
  react: "react",
  reactjs: "react",
  next: "nextjs",
  nextjs: "nextjs",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  tailwind: "tailwindcss",
  tailwindcss: "tailwindcss",
  node: "nodejs",
  nodejs: "nodejs",
  express: "express",
  mongodb: "mongodb",
  python: "python",
  django: "django",
  fastapi: "fastapi",
  java: "java",
  go: "go",
  docker: "docker",
  aws: "amazonwebservices",
  git: "git",
  html: "html5",
  css: "css3",
  postgresql: "postgresql",
  postgres: "postgresql",
  vue: "vuejs",
  angular: "angularjs",
  graphql: "graphql",
  redux: "redux",
};

export const techOptions = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Python",
  "Django",
  "FastAPI",
  "Java",
  "Go",
  "Docker",
  "AWS",
  "GraphQL",
  "Vue",
  "Angular",
];

export const levelOptions = ["Junior", "Mid-Level", "Senior", "Lead"];

export const typeOptions = ["Technical", "Behavioral", "Mixed"];

export const dummyInterviews: Interview[] = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: [
      "What is React and how does the Virtual DOM optimize rendering?",
      "Explain the key differences between state and props in React.",
      "What are Next.js Server Components and when should you use them?",
      "How do you handle asynchronous data fetching and error boundaries in modern React?"
    ],
    finalized: true,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "MongoDB", "React"],
    level: "Senior",
    questions: [
      "How do you architect a high-throughput REST API using Node.js and Express?",
      "Explain database indexing strategies in MongoDB for high performance.",
      "Describe how you handle authentication and session management securely across microservices."
    ],
    finalized: false,
    createdAt: "2024-03-14T15:30:00Z",
  },
  {
    id: "3",
    userId: "user1",
    role: "AI & Backend Engineer",
    type: "Technical",
    techstack: ["Python", "FastAPI", "PostgreSQL", "Docker"],
    level: "Mid-Level",
    questions: [
      "How do async handlers in FastAPI compare to synchronous WSGI frameworks like Flask?",
      "What steps do you take to optimize SQL queries in PostgreSQL under high load?",
      "Explain how containerization with Docker simplifies multi-stage CI/CD pipelines."
    ],
    finalized: false,
    createdAt: "2024-03-12T09:15:00Z",
  }
];
