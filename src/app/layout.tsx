import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Prepwise | AI Voice Job Interview Preparation Platform",
    template: "%s | Prepwise",
  },
  description:
    "Prepare for technical and behavioral job interviews with real-time AI voice agents powered by Vapi and Google Gemini. Practice role-specific questions and receive instant granular performance feedback.",
  keywords: [
    "AI Mock Interview",
    "Job Interview Preparation",
    "Voice AI Interviewer",
    "Vapi AI",
    "Google Gemini",
    "Technical Interview Practice",
    "Behavioral Interview Questions",
    "Software Engineer Mock Interview",
    "React Interview Prep",
    "Next.js Developer Interview",
  ],
  authors: [{ name: "Prepwise Team" }],
  creator: "Prepwise",
  publisher: "Prepwise",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Prepwise | AI Voice Job Interview Preparation Platform",
    description:
      "Practice job interviews hands-free with real-time AI voice agents. Instant feedback on Communication, Technical Knowledge, Problem Solving, and Fit.",
    siteName: "Prepwise",
    images: [
      {
        url: "/logo.svg",
        width: 800,
        height: 800,
        alt: "Prepwise AI Voice Mock Interview Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prepwise | AI Voice Job Interview Preparation Platform",
    description:
      "Practice job interviews hands-free with real-time AI voice agents. Receive instant 5-category feedback on your performance.",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#020408] text-white">
        {children}
      </body>
    </html>
  );
}
