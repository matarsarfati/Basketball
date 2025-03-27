// utils/openai.js
export async function fetchOpenAIResponse(message) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant for a basketball tracking app.' },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim();
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return 'Sorry, I couldn’t fetch a response.';
  }
}