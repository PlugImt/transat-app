import { Check, Moon, Smartphone, Sun } from "lucide-react-native";
import type React from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import { type ThemeMode, useTheme } from "@/contexts/ThemeContext";
import SettingCategory from "./components/SettingCategory";

export const Appearance = () => {
  const { t } = useTranslation();
  const { theme, themeMode, setThemeMode } = useTheme();

  const themeOptions: Array<{
    mode: ThemeMode;
    title: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      mode: "system",
      title: t("settings.appearance.system"),
      description: t("settings.appearance.systemDescription"),
      icon: <Smartphone color={theme.text} size={24} />,
    },
    {
      mode: "light",
      title: t("settings.appearance.light", "Light"),
      description: t("settings.appearance.lightDescription"),
      icon: <Sun color={theme.text} size={24} />,
    },
    {
      mode: "dark",
      title: t("settings.appearance.dark", "Dark"),
      description: t("settings.appearance.darkDescription"),
      icon: <Moon color={theme.text} size={24} />,
    },
  ];

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  return (
    <Page title={t("settings.appearance.title", "Appearance")}>
      <SettingCategory title={t("settings.appearance.theme", "Theme")}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.mode}
            onPress={() => handleThemeChange(option.mode)}
            className="flex-row items-center justify-between py-4"
          >
            <View className="flex-row items-center flex-1">
              <View className="mr-3">{option.icon}</View>
              <View className="flex-1">
                <Text>{option.title}</Text>
                <Text color="muted" variant="sm">
                  {option.description}
                </Text>
              </View>
            </View>
            {themeMode === option.mode && (
              <Check color={theme.primary} size={20} />
            )}
          </TouchableOpacity>
        ))}
      </SettingCategory>
    </Page>
  );
};
