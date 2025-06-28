import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import Badge from "@/components/common/Badge";
import { useTheme } from "@/contexts/ThemeContext";

interface TraqFilterProps {
  tags: string[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TraqFilter = ({
  tags,
  selected,
  setSelected,
}: TraqFilterProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const toggle = (tag: string) => {
    setSelected((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      return [...prev, tag];
    });
  };

  return (
    <>
      <View className="flex-row justify-between items-center ml-4">
        <Text className="h2" style={{ color: theme.text }}>
          {t("common.filter")}
        </Text>
        {selected.length > 0 && (
          <Badge
            label={t("common.clearAll")}
            variant="secondary"
            onPress={() => setSelected([])}
          />
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="ml-4"
      >
        {tags.map((tag) => (
          <Badge
            key={tag}
            label={tag}
            variant={selected.includes(tag) ? "secondary" : "light"}
            onPress={() => toggle(tag)}
            className="mr-2"
          />
        ))}
      </ScrollView>
    </>
  );
};
