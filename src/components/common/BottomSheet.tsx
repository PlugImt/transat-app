import { useTheme } from "@/themes/useThemeProvider";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import type React from "react";
import { cloneElement, createContext, useContext, useRef } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

// Context pour gérer l'état du bottom sheet
interface BottomSheetContextType {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  handleBottomSheet: (open: boolean) => void;
}
const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined,
);

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }
  return context;
};

// Composant qui déclenche l'ouverture du bottom sheet
export function BottomSheetTrigger({
  children,
}: { children: React.ReactElement }) {
  const { handleBottomSheet } = useBottomSheet();
  return cloneElement(children, { onPress: () => handleBottomSheet(true) });
}

// Provider qui gère l'état global du bottom sheet
export function BottomSheetProvider({
  children,
}: { children: React.ReactNode }) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleBottomSheet = (open: boolean) => {
    if (open) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  };

  return (
    <BottomSheetContext.Provider value={{ bottomSheetRef, handleBottomSheet }}>
      {children}
    </BottomSheetContext.Provider>
  );
}

// Composant principal du bottom sheet
export function BottomSheet({ children }: { children: React.ReactNode }) {
  const { bottomSheetRef, handleBottomSheet } = useBottomSheet();
  const theme = useTheme();
  const opacity = useSharedValue(0);

  // Configuration du geste de fermeture
  const gesture = Gesture.Pan().onFinalize((e) => {
    if (e.velocityY > 500) {
      runOnJS(handleBottomSheet)(false);
    }
  });

  // Style animé pour le backdrop
  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      backgroundStyle={{ backgroundColor: theme.card }}
      handleIndicatorStyle={{ backgroundColor: theme.foreground }}
      enableDismissOnClose
      enablePanDownToClose
      index={0}
      // Animation du backdrop
      onAnimate={(_fromIndex, toIndex) => {
        opacity.value = withTiming(toIndex === 0 ? 0.5 : 0, { duration: 300 });
      }}
      // Backdrop avec animation
      backdropComponent={({ style }) => (
        <Animated.View
          style={[
            style,
            { backgroundColor: "rgba(0, 0, 0, 1)" },
            animatedBackdropStyle,
          ]}
          onTouchEnd={() => handleBottomSheet(false)}
        />
      )}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View>
          <BottomSheetView className="bg-card px-5 pt-8 gap-2">
            {children}
          </BottomSheetView>
        </Animated.View>
      </GestureDetector>
    </BottomSheetModal>
  );
}
