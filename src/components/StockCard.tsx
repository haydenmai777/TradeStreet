import { Company } from '../types/market';

interface StockCardProps {
  company: Company;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  onClick: () => void;
}

export function StockCard({
  company,
  currentPrice,
  priceChange,
  priceChangePercent,
  onClick,
}: StockCardProps) {
  const isPositive = priceChange >= 0;
  
  return (
    <div
      onClick={onClick}
      className="bg-gray-900 border border-gray-700 rounded p-4 cursor-pointer hover:border-gray-600 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-white font-mono font-bold text-lg">
            {company.ticker}
          </div>
          <div className="text-gray-400 text-sm">{company.name}</div>
        </div>
        <div className="text-right">
          <div className="text-white font-mono font-bold text-lg">
            ${currentPrice.toFixed(2)}
          </div>
          <div
            className={`font-mono text-sm ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isPositive ? '+' : ''}
            {priceChange.toFixed(2)} ({isPositive ? '+' : ''}
            {priceChangePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{company.sector}</span>
        <span>Vol: {(company.volatility * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}

