import { useTranslation } from "react-i18next";
import type { BassineLeaderboardEntry } from "@/dto";

interface UseNeighborsProps {
  user: BassineLeaderboardEntry;
  userAbove?: BassineLeaderboardEntry;
  userBelow?: BassineLeaderboardEntry;
}

export const useNeighbors = ({
  user,
  userAbove,
  userBelow,
}: UseNeighborsProps) => {
  const { t } = useTranslation();

  if (user.rank === 1 && userBelow) {
    const bassineDifference = user.bassine_count - userBelow.bassine_count;
    return {
      followingUser: userBelow,
      followingText: t("games.bassine.leaderboard.firstPlaceLead", {
        count: bassineDifference,
      }),
    };
  }

  if (userAbove) {
    const bassineDifference = userAbove.bassine_count - user.bassine_count;
    return {
      followingUser: userAbove,
      followingText: t("games.bassine.leaderboard.followingPlace", {
        count: bassineDifference,
      }),
    };
  }
};
