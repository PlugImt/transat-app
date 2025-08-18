import { View } from "react-native";
import Avatar from "@/components/common/Avatar";
import Image from "@/components/common/Image";
import { Text } from "@/components/common/Text";
import { AvatarSkeleton, TextSkeleton } from "@/components/Skeleton";
import ImageSkeleton from "@/components/Skeleton/ImageSkeleton";
import type { BassineLeaderboardEntry, User } from "@/dto";

const top = [
  "https://em-content.zobj.net/source/apple/419/trophy_1f3c6.png",
  "https://em-content.zobj.net/source/apple/419/2nd-place-medal_1f948.png",
  "https://em-content.zobj.net/source/apple/419/3rd-place-medal_1f949.png",
];

interface BassineUserScoreProps {
  userScore: BassineLeaderboardEntry;
}

export const BassineUserScore = ({ userScore }: BassineUserScoreProps) => {
  const user = {
    first_name: userScore.first_name,
    last_name: userScore.last_name,
    profile_picture: userScore.profile_picture || undefined,
  };

  return (
    <View className="flex-row items-center gap-6">
      {userScore.rank <= 3 ? (
        <Image source={{ uri: top[userScore.rank - 1] }} size={24} />
      ) : (
        <Text>{userScore.rank}</Text>
      )}
      <View className="flex-row items-center gap-2 flex-1">
        <Avatar user={user as User} size={24} />
        <Text className="flex-1" numberOfLines={1}>
          {userScore.first_name} {userScore.last_name}
        </Text>
      </View>
      <Text className="font-bold">{userScore.bassine_count}</Text>
    </View>
  );
};

export default BassineUserScore;

export const BassineUserScoreSkeleton = () => {
  return (
    <View className="flex-row items-center gap-6">
      <ImageSkeleton size={24} />
      <View className="flex-row items-center gap-2 flex-1">
        <AvatarSkeleton size={24} />
        <TextSkeleton lastLineWidth={150} />
      </View>
      <TextSkeleton lastLineWidth={30} />
    </View>
  );
};
