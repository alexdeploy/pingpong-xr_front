export interface Player {
  _id: string;
  name: string;
  rating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface PlayerScore {
  playerId: string;
  score: number;
}

export interface MatchSubmission {
  players: PlayerScore[];
  winnerId: string;
  loserId: string;
}