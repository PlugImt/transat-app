import React, { type ReactNode } from "react";
import { RefreshControl, View, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimatedHeader } from "@/hooks/common/useAnimatedHeader";
import { cn } from "@/utils";
import { HEADER_HEIGHT, Header } from "./Header";

type PageProps = {
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
}: PageProps) => {
  const { theme } = useTheme();
  const { scrollHandler, headerShown } = useAnimatedHeader();
  const containerStyle = {
    paddingBottom: footer ? 0 : 40,
    paddingTop: HEADER_HEIGHT,
    ...style,
  };

  const containerClassName = cn("gap-6 px-5", className);

  const contentWrapperProps = {
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
        : children;
    }
    if (disableScroll) {
      return (
        <View
          className={containerClassName}
          style={containerStyle}
          {...contentWrapperProps}
        >
          {children}
        </View>
      );
    }
    return (
      <Animated.ScrollView {...contentWrapperProps}>
        {children}
      </Animated.ScrollView>
    );
  };

  return (
    <View style={{ backgroundColor: theme.background }} className="flex-1">
      <Header headerShown={headerShown} title={title}>
        {header}
      </Header>
      {getContent()}
      {footer && (
        <View
          style={{
            backgroundColor: theme.background,
            paddingHorizontal: 20,
            paddingVertical: 16,
          }}
        >
          {footer}
        </View>
      )}
    </View>
  );
};
