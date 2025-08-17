export type BassineUserBasic = {
  email: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
};

export type BassineLeaderboardEntry = BassineUserBasic & {
  rank: number;
  bassine_count: number;
};

export type BassineLeaderboard = {
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string | null;
  score: number;
  rank: number;
};

export type BassineOverview = {
  email: string;
  rank: number;
  bassine_count: number;
  leaderboard: BassineLeaderboard[];
  user_above?: BassineLeaderboardEntry;
  user_below?: BassineLeaderboardEntry;
};

export type BassineHistoryItem = {
  id?: number | string;
  date: string;
  type: "up" | "down";
  user: BassineUserBasic;
  score?: number;
  delta?: number;
};
