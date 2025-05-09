//openai.ts
import axios from 'axios';

const OPENAI_API_KEY = 'apikey';

export const sendMessageToOpenAI = async (message: string) => {
  try {
    const response = await axios.post(
      'link',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    return reply;
  } catch (error) {
    console.error('Erro OpenAI API:', error);
    return 'An error occurred.';
  }
};
