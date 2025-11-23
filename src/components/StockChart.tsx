import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PricePoint } from '../types/market';

interface StockChartProps {
  priceHistory: PricePoint[];
  ticker: string;
}

export function StockChart({ priceHistory, ticker }: StockChartProps) {
  if (priceHistory.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No price data available
      </div>
    );
  }

  // Format data for Recharts (show last 30 points for readability)
  const displayData = priceHistory.slice(-30).map((point, index) => ({
    time: index,
    price: Number(point.price.toFixed(2)),
  }));

  const latestPrice = priceHistory[priceHistory.length - 1]?.price || 0;
  const firstPrice = priceHistory[0]?.price || latestPrice;
  const priceChange = latestPrice - firstPrice;
  const isPositive = priceChange >= 0;

  return (
    <div className="h-64">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-300">{ticker}</div>
        <div className={`text-sm font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          ${latestPrice.toFixed(2)}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={displayData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="time"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            hide
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '4px',
              color: '#F3F4F6',
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? '#34D399' : '#F87171'}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

