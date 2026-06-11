import { Tabs } from "expo-router";
import { GridIcon, LucideHome, Play, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { tabBarOptions } from "@/navigation/navigationConfig";
import { hapticFeedback } from "@/utils/haptics.utils";

export default function TabsLayout() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Tabs screenOptions={tabBarOptions(theme)}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: t("common.home"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <LucideHome size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            hapticFeedback.light();
          },
        }}
      />
      <Tabs.Screen
        name="(services)"
        options={{
          title: t("services.title"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <GridIcon size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            hapticFeedback.light();
          },
        }}
      />
      <Tabs.Screen
        name="(games)"
        options={{
          title: t("games.title"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Play size={size} color={color} />,
        }}
        listeners={{
          tabPress: () => {
            hapticFeedback.light();
          },
        }}
      />
      <Tabs.Screen
        name="(account)"
        options={{
          title: t("common.account"),
          headerShown: false,
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
        listeners={{
          tabPress: () => {
            hapticFeedback.light();
          },
        }}
      />
    </Tabs>
  );
}
