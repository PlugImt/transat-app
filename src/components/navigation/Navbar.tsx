import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GridIcon, LucideHome, Play, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Home } from "@/app/screens";
import Account from "@/app/screens/account/Account";
import { Games } from "@/app/screens/services/games/Games";
import { Services } from "@/app/screens/services/Services";
import { useTheme } from "@/contexts/ThemeContext";
import { tabBarOptions } from "@/navigation/navigationConfig";
import type { BottomTabParamList } from "@/types";
import { hapticFeedback } from "@/utils/haptics.utils";

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleTabPress = () => {
    return {
      tabPress: () => {
        hapticFeedback.light();
      },
    };
  };

  return (
    <Tab.Navigator screenOptions={tabBarOptions(theme)}>
      <Tab.Screen
        name="HomeScreen"
        component={Home}
        listeners={handleTabPress}
        options={{
          tabBarLabel: t("common.home"),
          tabBarIcon: ({ color, size }) => (
            <LucideHome size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ServicesScreen"
        component={Services}
        listeners={handleTabPress}
        options={{
          tabBarLabel: t("services.title"),
          tabBarIcon: ({ color, size }) => (
            <GridIcon size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="GamesScreen"
        component={Games}
        listeners={handleTabPress}
        options={{
          tabBarLabel: t("games.title"),
          tabBarIcon: ({ color, size }) => <Play size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AccountScreen"
        component={Account}
        listeners={handleTabPress}
        options={{
          tabBarLabel: t("common.account"),
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
