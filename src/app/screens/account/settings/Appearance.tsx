import { Check, Moon, Smartphone, Sun } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

import Page from "@/components/common/Page";
import { useTheme, type ThemeMode } from "@/contexts/ThemeContext";

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
      description: t("settings.appearance.systemDescription", "Follow system setting"),
      icon: <Smartphone color={theme.foreground} size={24} />,
    },
    {
      mode: "light",
      title: t("settings.appearance.light", "Light"),
      description: t("settings.appearance.lightDescription", "Light theme"),
      icon: <Sun color={theme.foreground} size={24} />,
    },
    {
      mode: "dark",
      title: t("settings.appearance.dark", "Dark"),
      description: t("settings.appearance.darkDescription", "Dark theme"),
      icon: <Moon color={theme.foreground} size={24} />,
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
      <View className="gap-2">
        <Text className="h3 ml-4">{t("settings.appearance.theme", "Theme")}</Text>
        <View className="bg-card rounded-lg px-4 py-2">
          {themeOptions.map((option, index) => (
            <TouchableOpacity
              key={option.mode}
              onPress={() => handleThemeChange(option.mode)}
              className={`flex-row items-center justify-between py-4 ${
                index < themeOptions.length - 1 ? "border-b border-muted/20" : ""
              }`}
            >
              <View className="flex-row items-center flex-1">
                <View className="mr-3">{option.icon}</View>
                <View className="flex-1">
                  <Text className="text-foreground font-medium text-base">
                    {option.title}
                  </Text>
                  <Text className="text-muted text-sm mt-1">
                    {option.description}
                  </Text>
                </View>
              </View>
              {themeMode === option.mode && (
                <Check color={theme.primary} size={20} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="gap-2">
        <Text className="h3 ml-4">{t("settings.appearance.preview", "Preview")}</Text>
        <View className="bg-card rounded-lg p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground font-semibold">
              {t("settings.appearance.sampleCard", "Sample Card")}
            </Text>
            <View className="bg-primary rounded-full w-8 h-8" />
          </View>
          <Text className="text-muted text-sm mb-2">
            {t("settings.appearance.sampleText", "This is how text will appear in the selected theme.")}
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