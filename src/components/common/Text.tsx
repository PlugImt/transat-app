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

  const variantClasses: { [key: string]: string } = {
    h1: "text-3xl font-black",
    h2: "text-2xl font-bold",
    h3: "text-xl font-bold",
    lg: "text-lg font-bold",
    sm: "text-sm font-medium",
  };

  function getVariantClasses(variant: string): string {
    return variantClasses[variant] || "text-base font-medium";
  }

  return (
    <RText
      style={{ color: theme[color ?? "text"] }}
      className={cn(getVariantClasses(variant), className)}
      {...rest}
    >
      {children}
    </RText>
  );
};
