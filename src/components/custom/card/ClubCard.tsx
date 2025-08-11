import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import Image from "@/components/common/Image";
import type { Club } from "@/dto/club";
import LinkCard, { LinkCardLoading } from "./LinkCard";

type NavigationProp = StackNavigationProp<{
  ClubDetails: { id: number };
}>;

interface ClubCardProps {
  club: Club;
  size?: "sm" | "default";
  onPress?: () => void;
}

const ClubCard = ({ club, size = "default", onPress }: ClubCardProps) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate("ClubDetails", { id: club.id });
    }
  };

  return (
    <LinkCard
      title={club.name}
      description={club.description}
      size={size}
      image={<Image source={club.picture} size={size === "sm" ? 24 : 36} />}
      onPress={handlePress}
    />
  );
};

export default ClubCard;

interface ClubCardSkeletonProps {
  size?: "sm" | "default";
}

export const ClubCardSkeleton = ({
  size = "default",
}: ClubCardSkeletonProps) => {
  return <LinkCardLoading size={size} />;
};
