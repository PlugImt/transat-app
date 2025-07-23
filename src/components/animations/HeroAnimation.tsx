import { Image, View } from "react-native";
import Logo from "@/assets/images/icon.png";

interface HeroAnimationProps {
  className?: string;
}

export const HeroAnimation = ({ className }: HeroAnimationProps) => {
  return (
    <View className={className}>
      <Image source={Logo} className="w-[135px] h-[135px]" />
    </View>
  );
};
