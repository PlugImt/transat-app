import { MotiView } from "moti";
import type { ImageSourcePropType } from "react-native";
import Card from "@/components/common/Card";
import Image from "@/components/common/Image";
import { useClubImages, useFloatAnimation } from "../hooks";

interface ClubCardProps {
  image: ImageSourcePropType;
  index?: number;
}

export const ClubCard = ({ image, index = 0 }: ClubCardProps) => {
  const images = useClubImages();

  const amplitude = 2;
  const baseDuration = 6000;
  const duration = baseDuration + (index % 4) * 400; // 6s à 7s
  const direction = index % 2 === 0 ? 1 : -1;
  const phase = (index * Math.PI * 2) / images.length;
  const animatedStyle = useFloatAnimation(
    amplitude,
    duration,
    phase,
    direction,
  );
  return (
    <MotiView style={animatedStyle}>
      <Card className="p-2 items-center justify-center">
        <Image source={image} size={45} resizeMode="contain" />
      </Card>
    </MotiView>
  );
};
