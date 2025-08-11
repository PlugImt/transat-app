import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";

interface CalendarHeaderProps {
  selectedDate: Date;
  onToday: () => void;
}

export const CalendarHeader = ({
  selectedDate,
  onToday,
}: CalendarHeaderProps) => {
  const { theme } = useTheme();
  const { i18n, t } = useTranslation();

  const isToday = useMemo(() => {
    const now = new Date();
    return (
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate()
    );
  }, [selectedDate]);

  const monthYear = useMemo(() => {
    try {
      return selectedDate.toLocaleDateString(i18n.language, {
        month: "long",
        year: "numeric",
      });
    } catch {
      return selectedDate.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      });
    }
  }, [selectedDate, i18n.language]);

  return (
    <View className="px-4 mt-2 mb-1 flex flex-row items-center justify-center">
      <Text variant="h3" style={{ color: theme.text }} className="h-[32px]">
        {monthYear}
      </Text>
      <View className="ml-auto">
        {!isToday ? (
          <Button
            variant="link"
            size="sm"
            label={t("common.today", { defaultValue: "Today" })}
            onPress={onToday}
            className="gap-0"
          />
        ) : null}
      </View>
    </View>
  );
};

export default CalendarHeader;
