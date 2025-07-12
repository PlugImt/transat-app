import { Text as RText, type StyleProp, type TextStyle } from "react-native";
import { type ThemeColorKeys, useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils";

type TextVariant = "h1" | "h2" | "h3" | "lg" | "default" | "sm";

interface TextProps extends React.ComponentProps<typeof RText> {
  style?: StyleProp<TextStyle>;
  className?: string;
  children: React.ReactNode;
  color?: ThemeColorKeys;
  variant?: TextVariant;
}

export const Text = ({
  className,
  children,
  color,
  variant = "default",
  ...rest
}: TextProps) => {
  const { theme } = useTheme();

  const getVariantClasses = () => {
    switch (variant) {
      case "h1":
        return "text-3xl font-black";
      case "h2":
        return "text-2xl font-bold";
      case "h3":
        return "text-xl font-bold";
      case "lg":
        return "text-lg font-bold";
      case "sm":
        return "text-sm font-medium";
      default:
        return "text-base font-medium";
    }
  };

  const variantClasses = getVariantClasses();

  return (
    <RText
      style={{ color: theme[color ?? "text"] }}
      className={cn(variantClasses, className)}
      {...rest}
    >
      {children}
    </RText>
  );
};
