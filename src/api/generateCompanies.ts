import { Company } from '../types/market';
import { callClaude } from './claude';

const SECTORS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Energy',
  'Consumer Goods',
  'Industrial',
  'Real Estate',
  'Telecommunications',
];

export async function generateCompanies(count: number = 8): Promise<Company[]> {
  const prompt = `Generate ${count} fictional companies for a synthetic stock market. 
For each company, provide:
- ticker: A 2-4 letter stock symbol (e.g., "TECH", "MEDI", "FINX")
- name: Full company name
- sector: One of: ${SECTORS.join(', ')}
- risk: A number between 0 and 1 (0 = low risk, 1 = high risk)
- volatility: A number between 0 and 1 (0 = stable, 1 = highly volatile)
- basePrice: A realistic stock price between $10 and $500
- description: A 1-2 sentence description of what the company does

Return ONLY a valid JSON array of objects with these exact fields. No markdown, no code blocks, just the JSON array.

Example format:
[
  {
    "ticker": "TECH",
    "name": "TechNova Systems",
    "sector": "Technology",
    "risk": 0.6,
    "volatility": 0.7,
    "basePrice": 125.50,
    "description": "A leading provider of cloud infrastructure solutions."
  }
]`;

  try {
    const response = await callClaude(prompt);
    // Extract JSON from response (handle markdown code blocks if present)
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in Claude response');
    }
    const companies: Company[] = JSON.parse(jsonMatch[0]);
    
    // Validate and ensure we have the right number
    if (!Array.isArray(companies) || companies.length === 0) {
      throw new Error('Invalid companies array from Claude');
    }
    
    return companies.slice(0, count);
  } catch (error) {
    console.error('Error generating companies:', error);
    // Fallback to default companies if API fails
    return getDefaultCompanies().slice(0, count);
  }
}

function getDefaultCompanies(): Company[] {
  return [
    {
      ticker: 'TECH',
      name: 'TechNova Systems',
      sector: 'Technology',
      risk: 0.6,
      volatility: 0.7,
      basePrice: 125.50,
      description: 'A leading provider of cloud infrastructure solutions.',
    },
    {
      ticker: 'MEDI',
      name: 'MediCore Pharmaceuticals',
      sector: 'Healthcare',
      risk: 0.5,
      volatility: 0.6,
      basePrice: 87.25,
      description: 'Develops innovative treatments for rare diseases.',
    },
    {
      ticker: 'FINX',
      name: 'FinTech Global',
      sector: 'Finance',
      risk: 0.7,
      volatility: 0.8,
      basePrice: 45.80,
      description: 'Digital banking and payment solutions platform.',
    },
    {
      ticker: 'ENER',
      name: 'SolarFlux Energy',
      sector: 'Energy',
      risk: 0.6,
      volatility: 0.75,
      basePrice: 32.15,
      description: 'Renewable energy infrastructure and solar panel manufacturing.',
    },
    {
      ticker: 'CONS',
      name: 'ConsumerMax Retail',
      sector: 'Consumer Goods',
      risk: 0.4,
      volatility: 0.5,
      basePrice: 156.90,
      description: 'Global retail chain specializing in consumer electronics.',
    },
    {
      ticker: 'INDU',
      name: 'Industrial Dynamics',
      sector: 'Industrial',
      risk: 0.5,
      volatility: 0.55,
      basePrice: 78.40,
      description: 'Manufacturing automation and industrial equipment.',
    },
    {
      ticker: 'REAL',
      name: 'Metro Realty Group',
      sector: 'Real Estate',
      risk: 0.5,
      volatility: 0.6,
      basePrice: 92.75,
      description: 'Commercial and residential real estate development.',
    },
    {
      ticker: 'TELX',
      name: 'TeleConnect Networks',
      sector: 'Telecommunications',
      risk: 0.4,
      volatility: 0.5,
      basePrice: 68.30,
      description: '5G network infrastructure and telecommunications services.',
    },
  ];
}

