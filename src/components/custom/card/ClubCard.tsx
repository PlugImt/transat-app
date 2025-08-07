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
}

const ClubCard = ({ club }: ClubCardProps) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <LinkCard
      title={club.name}
      description={club.description}
      image={<Image source={club.picture} size={36} />}
      onPress={() => {
        navigation.navigate("ClubDetails", { id: club.id });
      }}
    />
  );
};

export default ClubCard;

export const ClubCardSkeleton = () => {
  return <LinkCardLoading />;
};
