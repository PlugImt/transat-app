import { useNavigation } from "expo-router/react-navigation";
import { CalendarClock, ChevronRight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { useMyReservations } from "@/hooks/services/reservation";
import type { AppNavigation } from "@/types";

export const MyReservationsEntry = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<AppNavigation>();
  const { data } = useMyReservations("current");

  const count = data?.current.length ?? 0;

  return (
    <Card
      className="flex-row items-center gap-4"
      accessibilityLabel={t("services.reservation.personal.title")}
      onPress={() => navigation.navigate("MyReservations")}
    >
      <CalendarClock color={theme.primary} size={24} />
      <View className="flex-1">
        <Text variant="h3" numberOfLines={1}>
          {t("services.reservation.personal.title")}
        </Text>
        {data && (
          <Text variant="sm" color="muted" numberOfLines={1}>
            {count > 0
              ? t("services.reservation.personal.activeCount", { count })
              : t("services.reservation.personal.noneActive")}
          </Text>
        )}
      </View>
      <ChevronRight color={theme.muted} />
    </Card>
  );
};
