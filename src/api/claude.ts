const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export async function callClaude(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
  
  if (!apiKey) {
    throw new Error('VITE_CLAUDE_API_KEY is not set in environment variables');
  }

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

