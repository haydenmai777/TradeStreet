import { useState } from 'react';
import { Company, Position } from '../types/market';

interface TradePanelProps {
  selectedCompany: Company | null;
  currentPrice: number;
  portfolio: {
    cash: number;
    positions: Position[];
  };
  onBuy: (ticker: string, shares: number) => void;
  onSell: (ticker: string, shares: number) => void;
}

export function TradePanel({
  selectedCompany,
  currentPrice,
  portfolio,
  onBuy,
  onSell,
}: TradePanelProps) {
  const [shares, setShares] = useState<string>('1');
  const [error, setError] = useState<string | null>(null);

  if (!selectedCompany) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded p-4">
        <div className="text-gray-500 text-center">Select a stock to trade</div>
      </div>
    );
  }

  const sharesNum = parseInt(shares, 10) || 0;
  const position = portfolio.positions.find((p) => p.ticker === selectedCompany.ticker);
  const ownedShares = position?.shares || 0;
  const totalCost = sharesNum * currentPrice;
  const canBuy = totalCost <= portfolio.cash && sharesNum > 0;
  const canSell = sharesNum > 0 && sharesNum <= ownedShares;

  const handleBuy = () => {
    try {
      setError(null);
      onBuy(selectedCompany.ticker, sharesNum);
      setShares('1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Trade failed');
    }
  };

  const handleSell = () => {
    try {
      setError(null);
      onSell(selectedCompany.ticker, sharesNum);
      setShares('1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Trade failed');
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded p-4">
      <div className="mb-4">
        <div className="text-white font-mono font-bold text-lg mb-1">
          {selectedCompany.ticker}
        </div>
        <div className="text-gray-400 text-sm">{selectedCompany.name}</div>
        <div className="text-white font-mono text-xl mt-2">
          ${currentPrice.toFixed(2)}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-400 text-sm mb-2">Shares</label>
        <input
          type="number"
          min="1"
          value={shares}
          onChange={(e) => {
            setShares(e.target.value);
            setError(null);
          }}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-gray-600"
        />
        {sharesNum > 0 && (
          <div className="text-gray-500 text-xs mt-1">
            Total: ${totalCost.toFixed(2)}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 text-red-400 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleBuy}
          disabled={!canBuy}
          className={`px-4 py-2 rounded font-mono text-sm font-bold transition-colors ${
            canBuy
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          BUY
        </button>
        <button
          onClick={handleSell}
          disabled={!canSell}
          className={`px-4 py-2 rounded font-mono text-sm font-bold transition-colors ${
            canSell
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          SELL
        </button>
      </div>

      {position && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-gray-400 text-sm">Position</div>
          <div className="text-white font-mono">
            {ownedShares} shares @ ${position.averagePrice.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}

