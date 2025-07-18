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
      title: t("settings.appearance.system", "System"),
      description: t(
        "settings.appearance.systemDescription",
        "Follow system setting",
      ),
      icon: <Smartphone color={theme.text} size={24} />,
    },
    {
      mode: "light",
      title: t("settings.appearance.light", "Light"),
      description: t("settings.appearance.lightDescription", "Light theme"),
      icon: <Sun color={theme.text} size={24} />,
    },
    {
      mode: "dark",
      title: t("settings.appearance.dark", "Dark"),
      description: t("settings.appearance.darkDescription", "Dark theme"),
      icon: <Moon color={theme.text} size={24} />,
    },
  ];

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  return (
    <Page
      goBack
      title={t("settings.appearance.title", "Appearance")}
      className="gap-6"
    >
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

      <View className="gap-2">
        <Text className="ml-4" variant="h3">
          {t("settings.appearance.preview", "Preview")}
        </Text>
        <View
          style={{ backgroundColor: theme.card }}
          className="rounded-lg p-4"
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text variant="lg">
              {t("settings.appearance.sampleCard", "Sample Card")}
            </Text>
            <View className="bg-primary rounded-full w-8 h-8" />
          </View>
          <Text className="mb-2" color="muted" variant="sm">
            {t(
              "settings.appearance.sampleText",
              "This is how text will appear in the selected theme.",
            )}
          </Text>
          <View className="flex-row gap-2">
            <View className="bg-success w-4 h-4 rounded" />
            <View className="bg-warning w-4 h-4 rounded" />
            <View className="bg-destructive w-4 h-4 rounded" />
          </View>
        </View>
      </View>
    </Page>
  );
};
