import { useNavigation } from "@react-navigation/native";
import { ChevronRight } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/common";
import { Text } from "@/components/common/Text";
import { UserStack } from "@/components/custom";
import { useTheme } from "@/contexts/ThemeContext";

export interface BassineButtonLeaderboardProps {
  photos: string[];
}

export const BassineButtonLeaderboard = ({
  photos,
}: BassineButtonLeaderboardProps) => {
  const member_photos = photos?.slice(0, 3);
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const onPress = async () => {
    navigation.navigate("BassineLeaderboard" as never);
  };


  return (
    <TouchableOpacity onPress={onPress} style={{ alignSelf: "center" }}>
      <Card className="rounded-full flex-row items-center justify-center px-3 py-2">
        <UserStack pictures={member_photos} count={member_photos?.length} />
        <Text className="mx-2">{t("games.bassine.leaderboard")}</Text>
        <ChevronRight size={16} color={theme.primaryText} />
      </Card>
    </TouchableOpacity>
  );
};

export default BassineButtonLeaderboard;
