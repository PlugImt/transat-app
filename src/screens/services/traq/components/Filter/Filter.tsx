import type React from "react";
import { ScrollView } from "react-native";
import Badge from "@/components/common/Badge";

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
  const toggle = (tag: string) => {
    setSelected((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      return [...prev, tag];
    });
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {tags.map((tag) => (
        <Badge
          key={tag}
          label={tag}
          variant={selected.includes(tag) ? "secondary" : "ghost"}
          onPress={() => toggle(tag)}
          className="mr-2"
        />
      ))}
    </ScrollView>
  );
};
