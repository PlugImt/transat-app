import { useNavigation } from "expo-router/react-navigation";
import Image from "@/components/common/Image";
import type { Association } from "@/dto/association";
import type { AppNavigation } from "@/types";
import LinkCard, { LinkCardLoading } from "./LinkCard";

interface AssociationCardProps {
  association: Association;
  size?: "sm" | "default";
  onPress?: () => void;
}

const AssociationCard = ({ association, size = "default", onPress }: AssociationCardProps) => {
  const navigation = useNavigation<AppNavigation>();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    navigation.navigate("AssociationDetails", { id: association.id });
  };

  return (
    <LinkCard
      title={association.name}
      description={association.description}
      size={size}
      image={<Image source={association.picture} size={size === "sm" ? 24 : 36} />}
      onPress={handlePress}
    />
  );
};

export default AssociationCard;

interface AssociationCardSkeletonProps {
  size?: "sm" | "default";
}

export const AssociationCardSkeleton = ({
  size = "default",
}: AssociationCardSkeletonProps) => {
  return <LinkCardLoading size={size} />;
};
