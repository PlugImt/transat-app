import Card from "@/components/common/Card";
import { useBassineLeaderboard } from "@/hooks/services/games/bassine/useBassine";
import {
  BassineUserScore,
  BassineUserScoreSkeleton,
} from "./components/BassineUserScore";

const BassineScores = () => {
  const { data: leaderboard, isPending } = useBassineLeaderboard();

  if (isPending) {
    return <BassineScoresSkeleton />;
  }

  if (!leaderboard) return null;

  return (
    <Card>
      {leaderboard?.map((user) => (
        <BassineUserScore key={user.email} userScore={user} />
      ))}
    </Card>
  );
};

export default BassineScores;

const BassineScoresSkeleton = () => {
  return (
    <Card>
      {Array.from({ length: 10 }).map((_, index) => (
        <BassineUserScoreSkeleton key={String(index)} />
      ))}
    </Card>
  );
};
