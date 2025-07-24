import { MotiView } from "moti";
import Avatar from "@/components/common/Avatar";
import { useTheme } from "@/contexts/ThemeContext";
import type { User } from "@/dto";
import { useFloatAnimation, useHeroAvatars } from "../hooks";

interface HeroAvatarProps {
  user: User;
  index?: number;
}

export const HeroAvatar = ({ user, index = 0 }: HeroAvatarProps) => {
  const { theme } = useTheme();
  const avatars = useHeroAvatars();

  const amplitude = 2;
  const baseDuration = 4000;
  const duration = baseDuration + (index % 4) * 400; // 4s à 5s
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
      <Avatar
        size={32}
        user={user}
        className="border"
        style={{ borderColor: theme.border }}
      />
    </MotiView>
  );
};
