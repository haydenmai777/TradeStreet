import { Company, NewsEvent } from '../types/market';

/**
 * Calculate new price based on:
 * - Random drift (normal distribution)
 * - Sentiment impact from recent news
 * - Volatility weight
 */
export function calculateNewPrice(
  currentPrice: number,
  company: Company,
  recentNews: NewsEvent[],
  timeDelta: number = 1 // seconds since last update
): number {
  // Base random drift (normal distribution, mean 0)
  const drift = (Math.random() - 0.5) * 0.02 * Math.max(1, timeDelta); // ±1% max drift per tick, scaled by timeDelta
  
  // Calculate sentiment impact from recent news (last 60 seconds)
  const now = Date.now();
  const recentNewsForCompany = recentNews.filter(
    (n) => n.ticker === company.ticker && now - n.timestamp < 60000
  );
  
  let sentimentImpact = 0;
  if (recentNewsForCompany.length > 0) {
    const totalImpact = recentNewsForCompany.reduce(
      (sum, news) => sum + news.sentiment * news.magnitude,
      0
    );
    // Sentiment impact scales with volatility
    sentimentImpact = totalImpact * company.volatility * 0.05; // Max 5% impact
  }
  
  // Volatility multiplier (higher volatility = larger price swings)
  const volatilityMultiplier = 1 + company.volatility * 0.5;
  
  // Calculate price change
  const priceChangePercent = (drift + sentimentImpact) * volatilityMultiplier;
  const newPrice = currentPrice * (1 + priceChangePercent);
  
  // Ensure price doesn't go below $0.01
  return Math.max(newPrice, 0.01);
}

/**
 * Initialize price history with base price
 */
export function initializePriceHistory(
  ticker: string,
  basePrice: number
): Array<{ ticker: string; price: number; timestamp: number }> {
  const now = Date.now();
  return [
    {
      ticker,
      price: basePrice,
      timestamp: now,
    },
  ];
}

