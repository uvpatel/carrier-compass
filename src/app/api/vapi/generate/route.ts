import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, level, techstack, type, amount } = body;

    const techString = Array.isArray(techstack) ? techstack.join(", ") : techstack;
    const numQuestions = Number(amount) || 4;

    const prompt = `Prepare questions for a job interview.
The job role is ${role}.
The job experience level is ${level}.
The tech stack used in the job is: ${techString}.
The focus between behavioural and technical questions should lean towards: ${type}.
The amount of questions required is: ${numQuestions}.
Please return only the questions, without any additional text.
The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
Return the questions formatted like this:
["Question 1", "Question 2", "Question 3"]

Thank you! <3`;

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (apiKey) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const responseText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        
        try {
          // Extract JSON array from output
          const match = responseText.match(/\[[\s\S]*\]/);
          if (match) {
            const questions = JSON.parse(match[0]);
            if (Array.isArray(questions) && questions.length > 0) {
              return NextResponse.json({ questions });
            }
          }
        } catch {
          console.warn("Failed to parse Gemini JSON response, generating fallback.");
        }
      }
    }

    // Fallback question generation if API key is not present or API call fails
    const fallbackQuestions = generateFallbackQuestions(
      role,
      level,
      techString,
      type,
      numQuestions
    );
    return NextResponse.json({ questions: fallbackQuestions });
  } catch (error) {
    console.error("Error in generate questions route:", error);
    return NextResponse.json(
      { error: "Failed to generate interview questions" },
      { status: 500 }
    );
  }
}

function generateFallbackQuestions(
  role: string,
  level: string,
  techstack: string,
  type: string,
  count: number
): string[] {
  const techList = techstack.split(",").map((t) => t.trim()).filter(Boolean);
  const primaryTech = techList[0] || "modern software engineering";
  const secondaryTech = techList[1] || "system design";

  const pool: string[] = [
    `Can you walk me through your experience as a ${level} ${role} and how you utilize ${primaryTech} in your projects?`,
    `When designing applications with ${primaryTech} and ${secondaryTech}, how do you ensure state management and component modularity remain maintainable?`,
    `Could you describe a challenging technical bug or performance issue you encountered using ${primaryTech} and how you diagnosed it?`,
    `As a ${level} candidate, how do you handle technical disagreements or code reviews within your engineering team?`,
    `How do you approach database schema design and API performance when scaling backend services in ${role} environments?`,
    `Describe a scenario where you had to quickly learn a new technology or tool to deliver a project milestone under tight deadlines.`,
    `What security best practices do you follow when implementing authentication and data validation in ${primaryTech}?`,
    `How do you balance writing clean, testable code with shipping features quickly in a fast-paced environment?`,
  ];

  if (type.toLowerCase() === "behavioral") {
    pool.unshift(
      `Tell me about a time when you had to deal with ambiguous requirements from a product manager or stakeholder.`,
      `How do you prioritize competing tasks when working on multiple high-priority deliverables?`
    );
  }

  return pool.slice(0, count);
}
