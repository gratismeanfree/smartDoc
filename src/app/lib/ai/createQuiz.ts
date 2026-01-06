import OpenAI from "openai";

const openai = new OpenAI();

function cleanOpenAIJsonResponse(text: string) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function createQuiz(
  difficulty: string,
  count: number,
  content: string
) {
  const res = await openai.responses.create({
    model: "gpt-4o-mini",
    input: `
Create a ${difficulty} quiz with ${count} questions from the text below.

Rules:
- 4 options per question
- correctIndex must be only from 0 to 3
- explanations must come from the text
- RETURN ONLY VALID JSON

{
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "correctIndex": 0,
      "explanation": ""
    }
  ]
}

TEXT:
${content}
`
  });

  const cleaned = cleanOpenAIJsonResponse(res.output_text);
  return JSON.parse(cleaned);
}
