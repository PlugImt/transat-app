import { Switch as NativeSwitch } from "react-native";

import { useTheme } from "@/themes/useThemeProvider";

function Switch({
  ...props
}: React.ComponentPropsWithoutRef<typeof NativeSwitch>) {
  const theme = useTheme();

  const trackColor = props.trackColor || {
    false: theme.background,
    true: theme.foreground,
  };
  const thumbColor = props.thumbColor || theme.background;
  const ios_backgroundColor = props.ios_backgroundColor || theme.background;

  return (
    <NativeSwitch
      trackColor={trackColor}
      thumbColor={thumbColor}
      ios_backgroundColor={ios_backgroundColor}
      {...props}
    />
  );
}

export { Switch };
