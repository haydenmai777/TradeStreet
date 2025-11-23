import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { LeaderboardEntry, subscribeToLeaderboard, updateLeaderboardEntry } from '../services/leaderboard';
import { calculatePortfolioValue, calculatePnL } from '../utils/portfolio';
import { Portfolio } from '../types/market';

const LEADERBOARD_SIZE = 10;

export function useLeaderboard(portfolio: Portfolio, prices: Record<string, number>) {
  const { address } = useAccount();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  // Subscribe to leaderboard updates
  useEffect(() => {
    const unsubscribe = subscribeToLeaderboard(LEADERBOARD_SIZE, (entries) => {
      setLeaderboard(entries);
      setIsLoading(false);
      
      // Find user's rank
      if (address) {
        const userAddressLower = address.toLowerCase();
        const rank = entries.findIndex(
          (entry) => entry.walletAddress === userAddressLower
        );
        setUserRank(rank >= 0 ? rank + 1 : null);
      }
    });

    return () => unsubscribe();
  }, [address]);

  // Update user's leaderboard entry when portfolio changes
  useEffect(() => {
    if (!address || !portfolio || Object.keys(prices).length === 0) {
      return;
    }

    const updateEntry = async () => {
      const pnl = calculatePnL(portfolio, prices);
      const totalValue = calculatePortfolioValue(portfolio, prices);
      
      try {
        await updateLeaderboardEntry(address, pnl, totalValue);
      } catch (error) {
        console.error('Failed to update leaderboard:', error);
      }
    };

    // Debounce updates to avoid too many writes
    const timeoutId = setTimeout(updateEntry, 2000);
    return () => clearTimeout(timeoutId);
  }, [address, portfolio, prices]);

  return {
    leaderboard,
    isLoading,
    userRank,
  };
}

