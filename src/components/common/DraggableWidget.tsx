import type { ReactNode } from "react";
import { View } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  type PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

interface DraggableWidgetProps {
  children: ReactNode;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  disabled?: boolean;
  delayLongPress?: number;
}

const DraggableWidget = ({
  children,
  onDragStart,
  onDragEnd,
  disabled = false,
}: DraggableWidgetProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const gestureHandler =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onStart: () => {
        scale.value = withSpring(1.05);
        if (onDragStart) {
          runOnJS(onDragStart)();
        }
      },
      onActive: (event) => {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      },
      onEnd: () => {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
        if (onDragEnd) {
          runOnJS(onDragEnd)();
        }
      },
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  if (disabled) {
    return <View>{children}</View>;
  }

  return (
    <GestureHandlerRootView>
      <PanGestureHandler
        onGestureEvent={gestureHandler}
        minPointers={1}
        maxPointers={1}
        simultaneousHandlers={[]}
        shouldCancelWhenOutside={false}
        activeOffsetX={[-10, 10]}
        activeOffsetY={[-10, 10]}
        minDist={5}
      >
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default DraggableWidget;
