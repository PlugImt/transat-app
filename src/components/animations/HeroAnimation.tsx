import { Image, View } from "react-native";
import Logo from "@/assets/images/icon.png";
import { cn } from "@/utils";

interface HeroAnimationProps {
  className?: string;
}

export const HeroAnimation = ({ className }: HeroAnimationProps) => {
  return (
    <View className={cn("relative", className)}>
      <Image source={Logo} className="w-[135px] h-[135px]" />
    </View>
  );
};
