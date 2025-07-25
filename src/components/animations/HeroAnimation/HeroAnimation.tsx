import { MotiView } from "moti";
import { useState } from "react";
import { Image, View } from "react-native";
import Logo from "@/assets/images/icon.png";
import { cn } from "@/utils";
import { ClubCard } from "./components/ClubCard";
import { HeroAvatar } from "./components/HeroAvatar";
import { useClubImages } from "./hooks/useClubImages";
import { useHeroAvatars } from "./hooks/useHeroAvatars";

interface HeroAnimationProps {
  className?: string;
}

const getAnimationConfig = (
  containerLayout: { width: number; height: number },
  position: { top: number; left: number },
  index: number,
  baseDelay = 200,
) => ({
  from: {
    top: containerLayout.height - 45,
    left: containerLayout.width / 2 - 45,
    opacity: 0,
  },
  animate: {
    top: position.top,
    left: position.left,
    opacity: 1,
  },
  transition: {
    type: "spring" as const,
    damping: 15,
    stiffness: 100,
    delay: index * baseDelay,
  },
});

export const HeroAnimation = ({ className }: HeroAnimationProps) => {
  const images = useClubImages();
  const avatars = useHeroAvatars();

  const [containerLayout, setContainerLayout] = useState<{
    width: number;
    height: number;
  } | null>(null);

  return (
    <View
      className={cn(
        "relative w-full h-[250px] items-center justify-end",
        className,
      )}
      onLayout={(e) => setContainerLayout(e.nativeEvent.layout)}
    >
      <Image source={Logo} className="w-[135px] h-[135px] z-20" />
      {containerLayout &&
        avatars.map(({ image, size, position }, index) => {
          const anim = getAnimationConfig(containerLayout, position, index);
          return (
            <MotiView
              key={`${position.top}-${position.left}`}
              from={anim.from}
              animate={anim.animate}
              transition={anim.transition}
              className="absolute z-10"
            >
              <HeroAvatar image={image} size={size} index={index} />
            </MotiView>
          );
        })}
      {containerLayout &&
        images.map(({ image, top, left }, index) => {
          const anim = getAnimationConfig(
            containerLayout,
            { top, left },
            index,
          );
          return (
            <MotiView
              key={String(image)}
              from={anim.from}
              animate={anim.animate}
              transition={anim.transition}
              className="absolute"
            >
              <ClubCard image={image} index={index} />
            </MotiView>
          );
        })}
    </View>
  );
};

export default HeroAnimation;
