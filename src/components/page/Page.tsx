import React, { type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import { useTabBarInset } from "@/components/navigation/TabContentInsets";
import { useTheme } from "@/contexts/ThemeContext";
import {
  AnimatedHeaderContext,
  useAnimatedHeader,
} from "@/hooks/common/useAnimatedHeader";
import { cn } from "@/utils";
import { HEADER_HEIGHT, Header } from "./Header";

export type PageProps = {
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  className?: string;
  style?: ViewStyle;
  title?: string | ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  disableScroll?: boolean;
  asChildren?: boolean;
  onBack?: () => void;
  background?: ReactNode;
};

export const Page = ({
  children,
  refreshing = false,
  onRefresh,
  className,
  style,
  title,
  header,
  footer,
  disableScroll = false,
  asChildren = false,
  onBack,
  background,
}: PageProps) => {
  const { theme } = useTheme();
  const { scrollHandler, headerShown, scrollY } = useAnimatedHeader();
  const tabBarInset = useTabBarInset();
  const base = {
    paddingBottom: footer ? 0 : 40,
    paddingTop: HEADER_HEIGHT,
    ...style,
  };
  // Content scrolls under the translucent tab bar: its last item must be able to come out above it.
  const containerStyle = {
    ...base,
    paddingBottom:
      (typeof base.paddingBottom === "number" ? base.paddingBottom : 0) +
      (tabBarInset ?? 0),
  };

  const containerClassName = cn("gap-6 px-5", className);

  const normalizeChildren = (node: ReactNode): ReactNode =>
    React.Children.map(node, (child) =>
      typeof child === "string" || typeof child === "number" ? (
        <Text>{child}</Text>
      ) : (
        child
      ),
    );

  const normalizedChildren = normalizeChildren(children);

  const contentWrapperProps = {
    // In the tabs the bottom inset is the explicit padding above, never added a second time by UIKit.
    contentInsetAdjustmentBehavior:
      Platform.OS === "ios" && tabBarInset === null
        ? ("automatic" as const)
        : undefined,
    onScroll: scrollHandler,
    refreshControl: onRefresh ? (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={theme.text}
        colors={[theme.primary]}
        progressViewOffset={HEADER_HEIGHT}
      />
    ) : undefined,
    contentContainerStyle: containerStyle,
    contentContainerClassName: containerClassName,
  };

  const getContent = () => {
    if (asChildren) {
      return React.isValidElement(children)
        ? React.cloneElement(children, {
            ...contentWrapperProps,
          })
        : normalizedChildren;
    }
    if (disableScroll) {
      const {
        contentInsetAdjustmentBehavior: _contentInsetAdjustmentBehavior,
        ...viewProps
      } = contentWrapperProps;
      return (
        <View
          className={containerClassName}
          style={[{ flex: 1 }, containerStyle]}
          {...viewProps}
        >
          {normalizedChildren}
        </View>
      );
    }
    return (
      <Animated.ScrollView style={{ flex: 1 }} {...contentWrapperProps}>
        {normalizedChildren}
      </Animated.ScrollView>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {background && (
        <View
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
          className="overflow-hidden"
        >
          {background}
        </View>
      )}
      <AnimatedHeaderContext.Provider value={{ headerShown, scrollY }}>
        <Header headerShown={headerShown} title={title} onBack={onBack}>
          {header}
        </Header>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {getContent()}
        </KeyboardAvoidingView>
        {footer && (
          <View
            style={{
              backgroundColor: theme.background,
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 16 + (tabBarInset ?? 0),
            }}
          >
            {footer}
          </View>
        )}
      </AnimatedHeaderContext.Provider>
    </View>
  );
};
