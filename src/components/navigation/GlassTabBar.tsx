import { GlassView } from "expo-glass-effect";
import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import {
  FLOATING_TAB_BAR_HEIGHT,
  getFloatingTabBarBottomOffset,
} from "./floatingTabBar";

export const GlassTabBar = ({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) => {
  const { theme, actualTheme } = useTheme();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        { bottom: getFloatingTabBarBottomOffset(insets.bottom) },
      ]}
    >
      <GlassView
        glassEffectStyle="regular"
        colorScheme={actualTheme}
        isInteractive
        style={styles.bar}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const color = focused ? theme.primary : theme.muted;
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : (options.title ?? route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: "tabLongPress", target: route.key });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.item}
            >
              {focused && (
                <View
                  pointerEvents="none"
                  style={[styles.selection, { backgroundColor: theme.primary }]}
                />
              )}
              {options.tabBarIcon?.({ focused, color, size: 24 })}
              <Text numberOfLines={1} style={[styles.label, { color }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </GlassView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 420,
    height: FLOATING_TAB_BAR_HEIGHT,
    borderRadius: FLOATING_TAB_BAR_HEIGHT / 2,
    padding: 6,
  },
  item: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderRadius: (FLOATING_TAB_BAR_HEIGHT - 12) / 2,
  },
  selection: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: (FLOATING_TAB_BAR_HEIGHT - 12) / 2,
    opacity: 0.16,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
  },
});
