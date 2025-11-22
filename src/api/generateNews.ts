import { NewsEvent, Company } from '../types/market';
import { callClaude } from './claude';

export async function generateNews(
  companies: Company[],
  count: number = 2
): Promise<NewsEvent[]> {
  const companyList = companies
    .map((c) => `${c.ticker} (${c.name} - ${c.sector})`)
    .join(', ');

  const prompt = `Generate ${count} realistic news events for these companies: ${companyList}

For each news event, provide:
- ticker: The stock ticker symbol of the affected company
- headline: A compelling news headline (max 80 characters)
- body: A 1-2 sentence news story explaining the event
- sentiment: A number between -1 and +1 (-1 = very negative, 0 = neutral, +1 = very positive)
- magnitude: A number between 0 and 1 (0 = minor impact, 1 = major impact)

Make the news realistic and varied. Include both positive and negative events. 
Consider company-specific factors like sector trends, earnings, product launches, regulatory changes, etc.

Return ONLY a valid JSON array of objects with these exact fields. No markdown, no code blocks, just the JSON array.

Example format:
[
  {
    "ticker": "TECH",
    "headline": "TechNova Reports Record Q4 Earnings",
    "body": "The company exceeded analyst expectations with revenue growth of 35% year-over-year.",
    "sentiment": 0.8,
    "magnitude": 0.7
  }
]`;

  try {
    const response = await callClaude(prompt);
    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in Claude response');
    }
    const news: Omit<NewsEvent, 'timestamp'>[] = JSON.parse(jsonMatch[0]);
    
    // Add timestamps and validate
    const now = Date.now();
    return news
      .filter((n) => companies.some((c) => c.ticker === n.ticker))
      .slice(0, count)
      .map((n) => ({
        ...n,
        timestamp: now,
      }));
  } catch (error) {
    console.error('Error generating news:', error);
    // Return empty array if API fails - market will continue without news
    return [];
  }
}

