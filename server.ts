import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not set with a valid token. Please configure this key in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse payload up to 10MB (in case of large copy-pastes/sessions)
  app.use(express.json({ limit: "10mb" }));

  // API Check Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Check if API Key is configured
  app.get("/api/config-status", (req, res) => {
    const key = process.env.GEMINI_API_KEY;
    const isConfigured = !!key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "";
    res.json({ isConfigured });
  });

  // AI Reviewer Study Guide Generation Endpoint
  app.post("/api/generate-guide", async (req, res) => {
    try {
      const { lessonPlanMarkdown, level = "elementary school level", examName = "General Exam" } = req.body;

      if (!lessonPlanMarkdown || lessonPlanMarkdown.trim() === "") {
        return res.status(400).json({ error: "Lesson plan raw markdown content is required." });
      }

      const ai = getAiClient();

      const systemInstruction = `You are a world-class collegiate/university study guide creator designed for undergraduate students.
Your task is to take highly advanced, complex undergraduate-level material from lesson plans or textbook syllabi (e.g., Computer Science, Biochemistry, Quantum Physics, Advanced Economics) and distill them into an essential, high-yield exam reviewer.

RULES:
1. Exact Terms: Every key concept/word must match the exact term in the lesson plan or collegiate material word-for-word. Do not alter spellings, equations, or formal names.
2. Source Meaning: For every key concept, include the exact definition, meaning, or closest explanatory wording from the PDF/source material. Preserve source wording as closely as possible and do not turn this field into an analogy.
3. High-Impact Mnemonics: Provide a highly memorable memory aid, clever wordplay, acronym, visualization, or association to help the undergraduate student instantly recall this complex term or formula under high exam stress.
3. Accessible Clarity: Explain the core mechanism of the collegiate concept utilizing crystal-clear, straightforward analogies that are accessible to anyone, including adult learners whose highest educational background is elementary school. Avoid overly dense academic jargon, but maintain a respectful, mature tone—never childish, and never treat the user as a kid.
5. Real-World Application: Add one relatable day-to-day real-world example explaining this concept in a common household, workplace, or physical context.
6. Create a practice quiz with 3 to 5 multiple-choice questions testing these collegiate terms in a standard exam simulator manner.`;

      const prompt = `Review this undergraduate lesson plan for the upcoming college exam "${examName}". Create an ultra-clear collegiate review sheet adjusted for "${level}".

Here is the lesson plan text extracted from the PDF:
---
${lessonPlanMarkdown}
---

Generate the reviewer in JSON format conforming exactly to the response schema. Make sure undergraduate-level concepts are listed exactly as written in the text. For sourceMeaning, use the exact meaning or closest definition from the PDF/source text. For elementaryExplanation, make the explanation extremely digestible and clear.`;

      // Define schema for JSON output
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "The overarching professional title of the reviewer, e.g. 'CS 101: Big O Notation Core Review'",
          },
          concepts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                exactWord: {
                  type: Type.STRING,
                  description: "The precise keyword, concept name, vocabulary word, or historical fact from the lesson plan.",
                },
                sourceMeaning: {
                  type: Type.STRING,
                  description: "The exact definition, meaning, or closest explanatory wording for this term from the PDF/source material. Preserve source wording as closely as possible. Do not use an analogy here.",
                },
                mnemonic: {
                  type: Type.STRING,
                  description: "A clever, catchy mnemonic device or memory trigger for quick exam recall.",
                },
                elementaryExplanation: {
                  type: Type.STRING,
                  description: "The explanation of this concept in accessible, clear, non-academic language using simple real-world analogies.",
                },
                example: {
                  type: Type.STRING,
                  description: "An easy everyday example that adults can relate to in a household or workplace context.",
                },
              },
              required: ["exactWord", "sourceMeaning", "mnemonic", "elementaryExplanation", "example"],
            },
            description: "Array of extracted lesson keywords and helper details.",
          },
          summary: {
            type: Type.STRING,
            description: "A solid, encouraging 2-sentence summary recap for simple wrap-up.",
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: {
                  type: Type.STRING,
                  description: "A multiple-choice question testing one of the extracted concepts.",
                },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly four standard college prep-level choices.",
                },
                answer: {
                  type: Type.STRING,
                  description: "The exact matching text of the correct option from the options list.",
                },
                explanation: {
                  type: Type.STRING,
                  description: "A clear and simple explanation of why this answer is correct using relatable analogies.",
                },
              },
              required: ["question", "options", "answer", "explanation"],
            },
            description: "A short assessment quiz of 3-5 multiple-choice questions.",
          },
        },
        required: ["title", "concepts", "summary", "quiz"],
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.7,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from the Gemini AI model.");
      }

      // Parse and return the generated JSON
      const parsedData = JSON.parse(responseText);
      return res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini Guide Generation Error:", error);
      return res.status(500).json({
        error: error.message || "An unexpected error occurred while generating the study reviewer.",
      });
    }
  });

  // Handle static assets & routing depending on Environment
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA Route fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server startup crash:", err);
});
