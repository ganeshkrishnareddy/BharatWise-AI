import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ChatMessage, JobPosting, QuizQuestion } from "../types";

const MODEL_NAME = 'gemini-2.5-flash';

// Helper to safely get the AI client only when needed.
// This prevents "ReferenceError: process is not defined" crashes during page load.
const getAiClient = () => {
  let apiKey = '';
  try {
    // Safely check if process.env exists
    if (typeof process !== 'undefined' && process.env) {
      apiKey = process.env.API_KEY || '';
    }
  } catch (e) {
    console.warn("Could not access process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates a response for a general chat conversation.
 */
export const generateChatResponse = async (
  history: ChatMessage[], 
  newMessage: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: "You are BharatWise AI, an intelligent AI assistant designed to help Indian students and job seekers. You are helpful, polite, and knowledgeable about Indian education systems (CBSE, ICSE, University), competitive exams (JEE, NEET, UPSC, SSC), and the Indian job market. keep answers concise and formatted with Markdown.",
      }
    });

    const result: GenerateContentResponse = await chat.sendMessage({ message: newMessage });
    return result.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw new Error("Failed to connect to AI service.");
  }
};

/**
 * Generates structured study notes.
 */
export const generateStudyNotes = async (subject: string, topic: string, level: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Act as an expert professor. Create detailed, easy-to-understand study notes for:
      Subject: ${subject}
      Topic: ${topic}
      Target Level: ${level} (Indian Education Context).

      Structure the notes with:
      1. Introduction / Key Concepts
      2. Bulleted Explanations
      3. Important Formulas or Dates (if applicable)
      4. A "Quick Recap" summary at the end.
      5. 3 Practice Questions.
      
      Format using Markdown.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "No notes generated.";
  } catch (error) {
    console.error("Gemini Notes Error:", error);
    throw error;
  }
};

/**
 * Generates career advice.
 */
export const generateCareerAdvice = async (role: string, skills: string, experience: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      You are a top-tier career coach in India.
      A user is looking for a role as a: ${role}
      Experience Level: ${experience}
      Key Skills: ${skills}

      Please provide:
      1. A professional summary suitable for a LinkedIn profile.
      2. A 3-step actionable roadmap to land this job.
      3. A short cover letter draft.
      4. 3 Interview preparation tips specific to this role in the current Indian market.

      Format using Markdown.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "No career advice generated.";
  } catch (error) {
    console.error("Gemini Career Error:", error);
    throw error;
  }
};

/**
 * Fetches real job listings using Google Search Grounding.
 */
export const fetchJobListings = async (category: 'Govt' | 'Private' | 'Both'): Promise<JobPosting[]> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Using Google Search, find at least 10 recent and active ${category} job postings in India suitable for students or freshers.
      Focus on jobs posted in the last 7 days.
      
      Return a STRICT JSON array (do not use Markdown code blocks, just plain JSON text) containing 10 objects.
      Each object must have these exact fields:
      - id (unique string)
      - title (job role)
      - company (company or department name)
      - type (strictly 'Govt' or 'Private')
      - location (city/state)
      - salary (e.g. "₹5-8 LPA" or "₹25,000/mo", estimate if needed)
      - posted (e.g. "2 days ago")
      - tags (array of 2-3 short strings like "IT", "Bank", "Fresher")
      - applyLink (direct URL to apply or the source URL found in search)

      Ensure valid JSON syntax.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        // responseMimeType: "application/json" is NOT allowed with googleSearch tools
        // We rely on the prompt to get JSON output.
      }
    });

    let jsonText = response.text || "[]";
    // Clean up Markdown code blocks if the model adds them despite instructions
    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsed = JSON.parse(jsonText);
      return Array.isArray(parsed) ? parsed : [];
    } catch (parseError) {
      console.error("Failed to parse Job JSON:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Gemini Job Fetch Error:", error);
    return [];
  }
};

/**
 * Generates exam practice questions in JSON format.
 */
export const generateExamQuestions = async (exam: string, topic: string, difficulty: string, count: number): Promise<QuizQuestion[]> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Create a mini-mock test for the exam: ${exam}
      Focus Topic: ${topic}
      Difficulty: ${difficulty}

      Generate ${count} Multiple Choice Questions (MCQs).
      Return a JSON array where each object has:
      - id (number)
      - question (string)
      - options (array of 4 strings)
      - correctAnswerIndex (number: 0, 1, 2, or 3 corresponding to the correct option index)
      - explanation (string)
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
         responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswerIndex: { type: Type.NUMBER },
              explanation: { type: Type.STRING },
            }
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text) as QuizQuestion[];
  } catch (error) {
    console.error("Gemini Exam Error:", error);
    return [];
  }
};

// --- New AI Tool Services ---

export const generateRoadmap = async (goal: string, duration: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Create a detailed learning roadmap for: ${goal}
      Duration: ${duration}

      Provide a week-by-week or month-by-month plan.
      Include:
      - Key topics to cover
      - Recommended resources (free ones preferred)
      - Practice projects or milestones.
      
      Format as a clean Markdown list.
    `;
    const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt });
    return response.text || "No roadmap generated.";
  } catch (e) { throw e; }
};

export const generateEssay = async (topic: string, tone: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Write a comprehensive essay on: ${topic}
      Tone: ${tone}
      Length: approx 500-800 words.
      
      Structure: Introduction, Body Paragraphs, Conclusion.
      Format in Markdown.
    `;
    const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt });
    return response.text || "No essay generated.";
  } catch (e) { throw e; }
};

export const generateProject = async (techStack: string, idea: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Act as a Senior Software Architect. I need a project plan.
      Idea/Theme: ${idea}
      Tech Stack: ${techStack}

      Provide:
      1. Project Name & Description
      2. Core Features (MVP)
      3. Folder Structure
      4. Step-by-step Implementation Guide
      
      Format in Markdown.
    `;
    const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt });
    return response.text || "No project plan generated.";
  } catch (e) { throw e; }
};

export const debugCode = async (code: string, error: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `
      Fix the following code.
      Error (if any): ${error}
      
      Code:
      ${code}

      Output:
      1. The corrected code block.
      2. Explanation of what was wrong and how it was fixed.
    `;
    const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt });
    return response.text || "No debug solution generated.";
  } catch (e) { throw e; }
};

export const summarizeText = async (text: string, mode: 'summary' | 'notes'): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = mode === 'summary' 
      ? `Summarize the following text concisely in bullet points:\n\n${text}`
      : `Convert the following lecture transcript/text into structured study notes with headings and key points:\n\n${text}`;
      
    const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt });
    return response.text || "No summary generated.";
  } catch (e) { throw e; }
};