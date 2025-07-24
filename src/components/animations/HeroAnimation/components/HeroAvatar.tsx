import { MotiView } from "moti";
import Image from "@/components/common/Image";
import { useTheme } from "@/contexts/ThemeContext";
import { useFloatAnimation, useHeroAvatars } from "../hooks";

interface HeroAvatarProps {
  image: string;
  size?: number;
  index?: number;
}

export const HeroAvatar = ({
  image,
  size = 32,
  index = 0,
}: HeroAvatarProps) => {
  const { theme } = useTheme();
  const avatars = useHeroAvatars();

  const amplitude = 2;
  const baseDuration = 6000;
  const duration = baseDuration + (index % 4) * 400; // 6s à 7s
  const direction = index % 2 === 0 ? 1 : -1;
  const phase = (index * Math.PI * 2) / avatars.length;
  const animatedStyle = useFloatAnimation(
    amplitude,
    duration,
    phase,
    direction,
  );
  return (
    <MotiView style={animatedStyle}>
      <Image
        source={image}
        size={size}
        className="rounded-full border"
        style={{ borderColor: theme.border }}
      />
    </MotiView>
  );
};
