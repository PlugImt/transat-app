import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import type React from "react";
import {
  cloneElement,
  createContext,
  type ReactElement,
  type ReactNode,
  useContext,
  useRef,
} from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";

interface BottomSheetContextType {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  handleBottomSheet: (open: boolean) => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined,
);

const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context)
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  return context;
};

const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const handleBottomSheet = (open: boolean) => {
    if (open) bottomSheetRef.current?.present();
    else bottomSheetRef.current?.dismiss();
  };
  return (
    <BottomSheetContext.Provider value={{ bottomSheetRef, handleBottomSheet }}>
      {children}
    </BottomSheetContext.Provider>
  );
};

const BottomSheetTrigger = ({
  children,
}: {
  children: ReactElement<{ onPress?: () => void }>;
}) => {
  const { handleBottomSheet } = useBottomSheet();
  return cloneElement(children, { onPress: () => handleBottomSheet(true) });
};

const BottomSheet = ({ children }: { children: ReactNode }) => {
  const { bottomSheetRef, handleBottomSheet } = useBottomSheet();
  const { theme } = useTheme();
  const opacity = useSharedValue(0);

  const gesture = Gesture.Pan().onFinalize((e) => {
    if (e.velocityY > 500) runOnJS(handleBottomSheet)(false);
  });

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      backgroundStyle={{ backgroundColor: theme.card }}
      handleIndicatorStyle={{ backgroundColor: theme.text }}
      enableDismissOnClose
      enablePanDownToClose
      index={0}
      onAnimate={(_from, to) => {
        opacity.value = withTiming(to === 0 ? 0.5 : 0, { duration: 300 });
      }}
      backdropComponent={({ style }) => (
        <Animated.View
          style={[
            style,
            { backgroundColor: theme.backdrop },
            animatedBackdropStyle,
          ]}
          onTouchEnd={() => handleBottomSheet(false)}
        />
      )}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View>
          <BottomSheetView
            style={{ backgroundColor: theme.card }}
            className="gap-1 py-6 px-5"
          >
            {children}
          </BottomSheetView>
        </Animated.View>
      </GestureDetector>
    </BottomSheetModal>
  );
};

// Exports regroupés
export { BottomSheetProvider, BottomSheetTrigger, BottomSheet, useBottomSheet };
