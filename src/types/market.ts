export interface Company {
  ticker: string;
  name: string;
  sector: string;
  risk: number; // 0-1
  volatility: number; // 0-1
  basePrice: number;
  description: string;
}

export interface NewsEvent {
  ticker: string;
  headline: string;
  body: string;
  sentiment: number; // -1 to +1
  magnitude: number; // 0 to 1
  timestamp: number;
}

export interface PricePoint {
  ticker: string;
  price: number;
  timestamp: number;
}

export interface Position {
  ticker: string;
  shares: number;
  averagePrice: number;
}

export interface Portfolio {
  cash: number;
  positions: Position[];
}

export interface MarketState {
  companies: Company[];
  prices: Record<string, number>; // ticker -> current price
  priceHistory: Record<string, PricePoint[]>; // ticker -> price history
  news: NewsEvent[];
  portfolio: Portfolio;
}

