import Dimitri from "@/assets/images/avatars/dimitri.jpeg";
import Ninon from "@/assets/images/avatars/ninon.jpeg";

type HeroAvatarType = {
  image: string;
  position: {
    top: number;
    left: number;
  };
  size?: number;
};

const avatars: HeroAvatarType[] = [
  {
    image: Dimitri,
    position: {
      top: 55,
      left: 52,
    },
  },
  {
    image: Ninon,
    position: {
      top: 64,
      left: 73,
    },
    size: 40,
  },
  {
    image: Dimitri,
    position: {
      top: 147,
      left: 60,
    },
    size: 48,
  },
  {
    image: Ninon,
    position: {
      top: 69,
      left: 148,
    },
    size: 26,
  },
  {
    image: Dimitri,
    position: {
      top: -14,
      left: 243,
    },
    size: 48,
  },
  {
    image: Ninon,
    position: {
      top: 90,
      left: 296,
    },
    size: 38,
  },
];

export const useHeroAvatars = (): HeroAvatarType[] =>
  avatars.slice().sort((a, b) => {
    if (a.position.top !== b.position.top) {
      return b.position.top - a.position.top; // top décroissant (du plus bas au plus haut)
    }
    return a.position.left - b.position.left; // left croissant (du plus à gauche au plus à droite)
  });
