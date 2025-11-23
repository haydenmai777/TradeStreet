import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';

export interface LeaderboardEntry {
  walletAddress: string;
  pnl: number;
  totalValue: number;
  lastUpdated: Timestamp;
}

const LEADERBOARD_COLLECTION = 'leaderboard';

/**
 * Update or create a leaderboard entry for a wallet address
 */
export async function updateLeaderboardEntry(
  walletAddress: string,
  pnl: number,
  totalValue: number
): Promise<void> {
  if (!walletAddress) return;

  const entryRef = doc(db, LEADERBOARD_COLLECTION, walletAddress.toLowerCase());
  
  await setDoc(
    entryRef,
    {
      walletAddress: walletAddress.toLowerCase(),
      pnl,
      totalValue,
      lastUpdated: Timestamp.now(),
    },
    { merge: true }
  );
}

/**
 * Get top N leaderboard entries
 */
export async function getLeaderboard(limitCount: number = 10): Promise<LeaderboardEntry[]> {
  const q = query(
    collection(db, LEADERBOARD_COLLECTION),
    orderBy('pnl', 'desc'),
    limit(limitCount)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as LeaderboardEntry);
}

/**
 * Subscribe to leaderboard updates in real-time
 */
export function subscribeToLeaderboard(
  limitCount: number,
  callback: (entries: LeaderboardEntry[]) => void
): () => void {
  const q = query(
    collection(db, LEADERBOARD_COLLECTION),
    orderBy('pnl', 'desc'),
    limit(limitCount)
  );

  return onSnapshot(q, (querySnapshot) => {
    const entries = querySnapshot.docs.map((doc) => doc.data() as LeaderboardEntry);
    callback(entries);
  });
}

