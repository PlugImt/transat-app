import type { LucideIcon } from "lucide-react-native";
import { Soup } from "lucide-react-native";

export type Game = {
  key: string;
  titleKey: string;
  Icon: LucideIcon;
  route: string;
};

export const gamesConfig: Game[] = [
  {
    key: "bassine",
    titleKey: "games.bassine.title",
    Icon: Soup,
    route: "Bassine",
  },
];
