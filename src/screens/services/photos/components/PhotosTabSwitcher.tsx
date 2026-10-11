import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { hapticFeedback } from "@/utils/haptics.utils";

export type PhotosTab = "gallery" | "albums";

type Props = {
  value: PhotosTab;
  onChange: (tab: PhotosTab) => void;
};

export const PhotosTabSwitcher = ({ value, onChange }: Props) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      accessibilityRole="tablist"
      className="mx-4 mb-3 mt-1 flex-row rounded-full p-1"
      style={{ backgroundColor: theme.card }}
    >
      {(["gallery", "albums"] as const).map((tab) => {
        const selected = value === tab;
        return (
          <Pressable
            key={tab}
            className="flex-1 rounded-full py-2.5"
            style={{
              backgroundColor: selected ? theme.primary : "transparent",
            }}
            onPress={() => {
              if (!selected) {
                hapticFeedback.light();
                onChange(tab);
              }
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Text
              className="text-center"
              style={{ color: selected ? theme.primaryText : theme.text }}
            >
              {t(`photos.tabs.${tab}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
