import type { ServicePreference } from "@/services/storage/widgetPreferences";
import type React from "react";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";

interface FlexibleGridProps {
  data: ServicePreference[];
  onPress: (item: ServicePreference) => void;
  renderCard: (item: ServicePreference, width: number) => React.ReactNode;
}

const FlexibleGrid: React.FC<FlexibleGridProps> = ({
  data,
  onPress,
  renderCard,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const padding = 20; // Padding from screen edges
  const gap = 15; // Gap between cards
  const fullWidth = screenWidth - padding * 2 + 5;
  const halfWidth = (fullWidth - gap) / 2;

  // Create rows for the grid layout
  const createRows = () => {
    const rows: ServicePreference[][] = [];
    let currentRow: ServicePreference[] = [];
    let currentRowWidth = 0;

    for (const item of data) {
      const itemWidth = item.size === "full" ? fullWidth : halfWidth;

      // If adding this item would exceed the row width, start a new row
      if (currentRowWidth + itemWidth > fullWidth && currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [item];
        currentRowWidth = itemWidth;
      } else {
        currentRow.push(item);
        currentRowWidth += itemWidth + (currentRow.length > 1 ? gap : 0);
      }
    }

    // Add the last row if it has items
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  };

  const rows = createRows();

  const renderGridItem = (item: ServicePreference) => {
    const cardWidth = item.size === "full" ? fullWidth : halfWidth;

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => onPress(item)}
        activeOpacity={0.8}
        style={{
          width: cardWidth,
        }}
      >
        {renderCard(item, cardWidth)}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {rows.map((row) => (
        <View
          key={row.map((item) => item.id).join("-")}
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            // marginBottom: gap,
            gap: gap,
            // paddingHorizontal: padding,
          }}
        >
          {row.map((item) => renderGridItem(item))}
        </View>
      ))}
    </ScrollView>
  );
};

export default FlexibleGrid;
