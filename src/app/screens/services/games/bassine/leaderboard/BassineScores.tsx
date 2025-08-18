import Card from "@/components/common/Card";
import { useBassineLeaderboard } from "@/hooks/services/games/bassine/useBassine";
import { BassineUserScore } from "./components/BassineUserScore";

const BassineScores = () => {
  const { data: leaderboard } = useBassineLeaderboard();

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
