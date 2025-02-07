import { Home } from "@/app/screens/Home";
import Account from "@/app/screens/services/Account";
import Games from "@/app/screens/services/Games";
import { Services } from "@/app/screens/services/Services";
import type { BottomTabParamList } from "@/types/navigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GridIcon, LucideHome, Play, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ec7f32",
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: t("common.home"),
          tabBarIcon: ({ color, size }) => (
            <LucideHome size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Services"
        component={Services}
        options={{
          tabBarLabel: t("services.services"),
          tabBarIcon: ({ color, size }) => (
            <GridIcon size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Games"
        component={Games}
        options={{
          tabBarLabel: t("services.games"),
          tabBarIcon: ({ color, size }) => <Play size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: t("common.account"),
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#0D0505",
    borderTopWidth: 0,
  },
});

export default BottomTabNavigator;
