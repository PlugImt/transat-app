import ClubsImg from "@/assets/images/services/club.png";
import FourchettasImg from "@/assets/images/services/fourchettas.png";
import RestaurantImg from "@/assets/images/services/restaurant.png";
import TraqImg from "@/assets/images/services/traq.png";
import LaundryDarkImg from "@/assets/images/services/washing_machine_dark.png";
import LaundryLightImg from "@/assets/images/services/washing_machine_light.png";
import { useTheme } from "@/contexts/ThemeContext";

export const useFeatureImages = () => {
  const { actualTheme } = useTheme();
  const images = [
    {
      image: ClubsImg,
      top: 102,
      left: 17,
    },
    {
      image: TraqImg,
      top: -14,
      left: 63,
    },
    {
      image: actualTheme === "dark" ? LaundryLightImg : LaundryDarkImg,
      top: 26,
      left: 162,
    },
    {
      image: FourchettasImg,
      top: 6,
      left: 274,
    },
    {
      image: RestaurantImg,
      top: 106,
      left: 251,
    },
  ];
  return images;
};
