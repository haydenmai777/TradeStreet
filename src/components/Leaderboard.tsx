import { useAccount } from 'wagmi';
import { LeaderboardEntry } from '../services/leaderboard';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  userRank: number | null;
}

export function Leaderboard({ entries, isLoading, userRank }: LeaderboardProps) {
  const { address } = useAccount();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded p-4">
        <div className="text-gray-400 text-sm">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-lg">🏆 Leaderboard</h2>
        {userRank !== null && address && (
          <div className="text-sm text-gray-400">
            Your Rank: <span className="text-green-400 font-bold">#{userRank}</span>
          </div>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-gray-500 text-sm text-center py-4">
          No entries yet. Start trading to appear on the leaderboard!
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => {
            const isCurrentUser = address?.toLowerCase() === entry.walletAddress;
            const rank = index + 1;
            const isPositive = entry.pnl >= 0;

            return (
              <div
                key={entry.walletAddress}
                className={`flex items-center justify-between p-3 rounded ${
                  isCurrentUser
                    ? 'bg-green-900/30 border border-green-700'
                    : 'bg-gray-800 border border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      rank === 1
                        ? 'bg-yellow-500 text-black'
                        : rank === 2
                        ? 'bg-gray-400 text-black'
                        : rank === 3
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {rank}
                  </div>
                  <div>
                    <div className="text-white font-mono text-sm">
                      {isCurrentUser ? (
                        <span className="text-green-400">You</span>
                      ) : (
                        formatAddress(entry.walletAddress)
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      Value: {formatCurrency(entry.totalValue)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-mono font-bold ${
                      isPositive ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {formatCurrency(entry.pnl)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {((entry.pnl / 100000) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

