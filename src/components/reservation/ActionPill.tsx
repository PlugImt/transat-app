import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";

/** Button-looking label for rows that are themselves the touch target. */
export const ActionPill = ({
  label,
  tone = "secondary",
}: {
  label: string;
  tone?: "primary" | "secondary";
}) => {
  const { theme } = useTheme();
  const isPrimary = tone === "primary";

  return (
    <View
      className="h-8 px-4 rounded-lg items-center justify-center"
      style={{
        backgroundColor: isPrimary ? theme.primary : `${theme.primary}40`,
      }}
    >
      <Text
        variant="sm"
        style={{ color: isPrimary ? theme.primaryText : theme.primary }}
      >
        {label}
      </Text>
    </View>
  );
};
