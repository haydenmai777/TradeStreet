import { Portfolio, Position, PricePoint } from '../types/market';

const INITIAL_CASH = 100000;
const PORTFOLIO_STORAGE_KEY = 'tradestreet_portfolio';

export function getInitialPortfolio(): Portfolio {
  const stored = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid stored data, use default
    }
  }
  return {
    cash: INITIAL_CASH,
    positions: [],
  };
}

export function savePortfolio(portfolio: Portfolio): void {
  localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio));
}

export function buyStock(
  portfolio: Portfolio,
  ticker: string,
  shares: number,
  price: number
): Portfolio {
  const totalCost = shares * price;
  
  if (totalCost > portfolio.cash) {
    throw new Error('Insufficient funds');
  }
  
  const existingPosition = portfolio.positions.find((p) => p.ticker === ticker);
  
  let newPositions: Position[];
  if (existingPosition) {
    // Update existing position (calculate new average price)
    const totalShares = existingPosition.shares + shares;
    const totalCostBasis = existingPosition.averagePrice * existingPosition.shares + totalCost;
    const newAveragePrice = totalCostBasis / totalShares;
    
    newPositions = portfolio.positions.map((p) =>
      p.ticker === ticker
        ? { ticker, shares: totalShares, averagePrice: newAveragePrice }
        : p
    );
  } else {
    // New position
    newPositions = [
      ...portfolio.positions,
      { ticker, shares, averagePrice: price },
    ];
  }
  
  const newPortfolio: Portfolio = {
    cash: portfolio.cash - totalCost,
    positions: newPositions,
  };
  
  savePortfolio(newPortfolio);
  return newPortfolio;
}

export function sellStock(
  portfolio: Portfolio,
  ticker: string,
  shares: number,
  price: number
): Portfolio {
  const position = portfolio.positions.find((p) => p.ticker === ticker);
  
  if (!position || position.shares < shares) {
    throw new Error('Insufficient shares');
  }
  
  const proceeds = shares * price;
  const remainingShares = position.shares - shares;
  
  const newPositions =
    remainingShares === 0
      ? portfolio.positions.filter((p) => p.ticker !== ticker)
      : portfolio.positions.map((p) =>
          p.ticker === ticker
            ? { ...p, shares: remainingShares }
            : p
        );
  
  const newPortfolio: Portfolio = {
    cash: portfolio.cash + proceeds,
    positions: newPositions,
  };
  
  savePortfolio(newPortfolio);
  return newPortfolio;
}

export function calculatePortfolioValue(
  portfolio: Portfolio,
  prices: Record<string, number>
): number {
  const positionsValue = portfolio.positions.reduce(
    (sum, pos) => sum + (pos.shares * (prices[pos.ticker] || 0)),
    0
  );
  return portfolio.cash + positionsValue;
}

export function calculatePnL(
  portfolio: Portfolio,
  prices: Record<string, number>
): number {
  const currentValue = portfolio.positions.reduce(
    (sum, pos) => sum + (pos.shares * (prices[pos.ticker] || 0)),
    0
  );
  const costBasis = portfolio.positions.reduce(
    (sum, pos) => sum + (pos.shares * pos.averagePrice),
    0
  );
  return currentValue - costBasis;
}

