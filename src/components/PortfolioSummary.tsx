import { Portfolio, Position } from '../types/market';
import { calculatePortfolioValue, calculatePnL } from '../utils/portfolio';

interface PortfolioSummaryProps {
  portfolio: Portfolio;
  prices: Record<string, number>;
}

export function PortfolioSummary({ portfolio, prices }: PortfolioSummaryProps) {
  const totalValue = calculatePortfolioValue(portfolio, prices);
  const pnl = calculatePnL(portfolio, prices);
  const pnlPercent = portfolio.positions.reduce((sum, pos) => {
    const costBasis = pos.shares * pos.averagePrice;
    return sum + costBasis;
  }, 0) > 0
    ? (pnl / portfolio.positions.reduce((sum, pos) => sum + pos.shares * pos.averagePrice, 0)) * 100
    : 0;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded p-4">
      <div className="text-white font-bold mb-4">Portfolio</div>
      
      <div className="mb-4">
        <div className="text-gray-400 text-sm">Cash</div>
        <div className="text-white font-mono text-lg">
          ${portfolio.cash.toFixed(2)}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-gray-400 text-sm">Total Value</div>
        <div className="text-white font-mono text-xl">
          ${totalValue.toFixed(2)}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-gray-400 text-sm">P&L</div>
        <div
          className={`font-mono text-lg ${
            pnl >= 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnl >= 0 ? '+' : ''}
          {pnlPercent.toFixed(2)}%)
        </div>
      </div>

      {portfolio.positions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-gray-400 text-sm mb-2">Positions</div>
          <div className="space-y-2">
            {portfolio.positions.map((pos) => {
              const currentPrice = prices[pos.ticker] || 0;
              const positionValue = pos.shares * currentPrice;
              const positionPnL = (currentPrice - pos.averagePrice) * pos.shares;
              const positionPnLPercent =
                ((currentPrice - pos.averagePrice) / pos.averagePrice) * 100;

              return (
                <div key={pos.ticker} className="text-xs">
                  <div className="flex justify-between">
                    <span className="text-white font-mono font-bold">
                      {pos.ticker}
                    </span>
                    <span className="text-white font-mono">
                      {pos.shares} @ ${pos.averagePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Value: ${positionValue.toFixed(2)}</span>
                    <span
                      className={
                        positionPnL >= 0 ? 'text-green-400' : 'text-red-400'
                      }
                    >
                      {positionPnL >= 0 ? '+' : ''}${positionPnL.toFixed(2)} (
                      {positionPnL >= 0 ? '+' : ''}
                      {positionPnLPercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

