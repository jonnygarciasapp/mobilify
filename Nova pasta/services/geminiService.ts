import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

try {
  if (process.env.API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (e) {
  console.warn("Gemini API Key not found or invalid.");
}

export const getAITip = async (context: string, lang: string = 'en'): Promise<string> => {
  if (!genAI) {
    return lang === 'pt' 
      ? "Mantenha a consistência! Pequenos esforços diários se somam."
      : "Stay consistent! Small daily efforts compound over time.";
  }

  try {
    const prompt = lang === 'pt'
      ? `Forneça uma frase curta e motivadora sobre treinamento de mobilidade relacionado a: ${context}. Mantenha abaixo de 20 palavras. Responda em Português do Brasil.`
      : `Provide a single, short, motivating sentence about mobility training related to: ${context}. Keep it under 20 words.`;

    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text?.trim() || (lang === 'pt' ? "Movimento é vida. Continue se mexendo!" : "Motion is lotion. Keep moving!");
  } catch (error) {
    console.error("Failed to fetch AI tip", error);
    return lang === 'pt' ? "Mobilidade é a chave para a longevidade." : "Mobility is the key to longevity.";
  }
};

export const getDetailedExerciseAdvice = async (exerciseName: string, lang: string = 'en'): Promise<string> => {
    if (!genAI) {
      return lang === 'pt' 
        ? "Concentre-se em movimentos controlados e respiração profunda."
        : "Focus on controlled movements and deep breathing for maximum benefit.";
    }

    try {
        const prompt = lang === 'pt'
          ? `Explique por que '${exerciseName}' é benéfico para o corpo em 2 frases. Foque na biomecânica. Responda em Português.`
          : `Explain why '${exerciseName}' is beneficial for the body in 2 sentences. Focus on biomechanics.`;

        const response = await genAI.models.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt,
        });
        return response.text?.trim() || "";
    } catch (error) {
        return lang === 'pt' ? "Foque na forma e não na intensidade." : "Focus on form over intensity.";
    }
}