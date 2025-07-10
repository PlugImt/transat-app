import { Text as RText, type StyleProp, type TextStyle } from "react-native";
import { cn } from "@/utils";

interface TextProps {
  style?: StyleProp<TextStyle>;
  className?: string;
  children: React.ReactNode;
}

export const Text = ({ className, children, ...rest }: TextProps) => {
  return (
    <RText className={cn(className, "font-medium")} {...rest}>
      {children}
    </RText>
  );
};
