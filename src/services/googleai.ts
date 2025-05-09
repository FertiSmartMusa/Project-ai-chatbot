// googleai.ts
import axios from 'axios';

const GEMINI_API_KEY = 'apikey'; 

const ENDPOINT = 'link';

export const sendMessageToGemini = async (message: string) => {
  try {
    const response = await axios.post(
      `${ENDPOINT}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    return reply;
  } catch (error) {
    console.error('Error Gemini API:', error);
    return 'An error occurred.';
  }
};