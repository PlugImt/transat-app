import React from 'react';
import { View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import type { ServicePreference } from '@/services/storage/widgetPreferences';
import { Maximize, Minimize } from 'lucide-react-native';
import { useTheme } from '@/themes/useThemeProvider';

interface FlexibleGridProps {
  data: ServicePreference[];
  onPress: (item: ServicePreference) => void;
  onToggleSize: (id: string) => void;
  renderCard: (item: ServicePreference, width: number) => React.ReactNode;
}

const FlexibleGrid: React.FC<FlexibleGridProps> = ({
  data,
  onPress,
  onToggleSize,
  renderCard,
}) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const padding = 20; // Padding from screen edges
  const gap = 10; // Gap between cards
  const fullWidth = screenWidth - (padding * 2);
  const halfWidth = (fullWidth - gap) / 2;

  // Create rows for the grid layout
  const createRows = () => {
    const rows: ServicePreference[][] = [];
    let currentRow: ServicePreference[] = [];
    let currentRowWidth = 0;

    data.forEach((item) => {
      const itemWidth = item.size === 'full' ? fullWidth : halfWidth;
      
      // If adding this item would exceed the row width, start a new row
      if (currentRowWidth + itemWidth > fullWidth && currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [item];
        currentRowWidth = itemWidth;
      } else {
        currentRow.push(item);
        currentRowWidth += itemWidth + (currentRow.length > 1 ? gap : 0);
      }
    });

    // Add the last row if it has items
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  };

  const rows = createRows();

  const renderGridItem = (item: ServicePreference) => {
    const cardWidth = item.size === 'full' ? fullWidth : halfWidth;
    
    return (
      <View
        key={item.id}
        style={{
          width: cardWidth,
          position: 'relative',
        }}
      >
        <TouchableOpacity
          onPress={() => onPress(item)}
          activeOpacity={0.8}
          style={{ position: 'relative' }}
        >
          {renderCard(item, cardWidth)}
          
          {/* Size toggle button */}
          <TouchableOpacity
            onPress={() => onToggleSize(item.id)}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: theme.card,
              borderRadius: 6,
              padding: 4,
              opacity: 0.9,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}
          >
            {item.size === 'full' ? (
              <Minimize size={16} color={theme.foreground} />
            ) : (
              <Maximize size={16} color={theme.foreground} />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: padding,
        paddingTop: 10,
        paddingBottom: 50,
      }}
      showsVerticalScrollIndicator={false}
    >
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginBottom: gap,
            gap: gap,
          }}
        >
          {row.map((item) => renderGridItem(item))}
        </View>
      ))}
    </ScrollView>
  );
};

export default FlexibleGrid; 