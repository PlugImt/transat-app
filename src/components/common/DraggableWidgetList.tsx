import type { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  type RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface DraggableItem {
  id: string;
  key: string;
  component: ReactNode;
}

interface DraggableWidgetListProps {
  data: DraggableItem[];
  onDragEnd: (data: DraggableItem[]) => void;
  isEditMode?: boolean;
}

const DraggableWidgetList = ({
  data,
  onDragEnd,
  isEditMode = false,
}: DraggableWidgetListProps) => {
  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<DraggableItem>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          style={{
            opacity: isActive ? 0.8 : 1,
            transform: [{ scale: isActive ? 1.02 : 1 }],
          }}
          onLongPress={isEditMode ? drag : undefined}
          delayLongPress={200}
          activeOpacity={1}
        >
          {item.component}
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  if (!isEditMode) {
    return (
      <View className="gap-6">
        {data.map((item) => (
          <View key={item.key}>{item.component}</View>
        ))}
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DraggableFlatList
        data={data}
        onDragEnd={({ data: newData }) => onDragEnd(newData)}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 24 }}
      />
    </GestureHandlerRootView>
  );
};

export default DraggableWidgetList;
