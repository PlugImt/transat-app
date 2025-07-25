import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import React, { cloneElement, createContext, useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "./Button";
import Card from "./Card";

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

const Dialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({
  children,
}: {
  children: React.ReactElement<{ onPress?: () => void }>;
}) => {
  const { setOpen } = useDialog();

  return cloneElement(children, { onPress: () => setOpen(true) });
};

type DialogContentProps = {
  className?: string;
  children: React.ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  title: string;
  isPending?: boolean;
  disableConfirm?: boolean;
};

const DialogContent = ({
  className,
  children,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  disableConfirm,
  title,
  isPending,
}: DialogContentProps) => {
  const { open, setOpen } = useDialog();
  const { theme } = useTheme();
  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const [showBottomIndicator, setShowBottomIndicator] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  // Reset indicators when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setShowTopIndicator(false);
      setShowBottomIndicator(false);
      setScrollViewHeight(0);
    }
  }, [open]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const scrollViewHeight = layoutMeasurement.height;
    const contentHeight = contentSize.height;

    // Show top indicator if scrolled down more than 5px
    setShowTopIndicator(scrollY > 5);

    // Show bottom indicator if there's more content below (with 5px threshold)
    setShowBottomIndicator(scrollY + scrollViewHeight < contentHeight - 5);
  };

  const handleContentSizeChange = (_contentWidth: number, contentHeight: number) => {
    // Check if content overflows the scroll view
    if (scrollViewHeight > 0) {
      setShowBottomIndicator(contentHeight > scrollViewHeight);
    }
  };

  const handleScrollViewLayout = (event: { nativeEvent: { layout: { height: number } } }) => {
    setScrollViewHeight(event.nativeEvent.layout.height);
  };

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
    setOpen(false);
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={open}
      onRequestClose={() => setOpen(false)}
    >
      <TouchableWithoutFeedback
        className="w-full h-full"
        onPress={() => setOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          className="flex flex-1 justify-center items-center w-full"
        >
          <MotiView
            from={{
              opacity: 0,
              scale: 0.8,
              translateY: 20,
            }}
            animate={{
              opacity: open ? 1 : 0,
              scale: open ? 1 : 0.8,
              translateY: open ? 0 : 20,
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
            className="w-[90%] max-h-[80%]"
            onStartShouldSetResponder={() => true}
            onResponderGrant={() => {}}
            onResponderRelease={() => {}}
          >
            <Card className="w-full gap-6">
              <Text variant="h2">{title}</Text>
              <View className="relative">
                <ScrollView 
                  keyboardShouldPersistTaps="handled"
                  onScroll={handleScroll}
                  onContentSizeChange={handleContentSizeChange}
                  onLayout={handleScrollViewLayout}
                  scrollEventThrottle={16}
                  style={{ maxHeight: 400 }}
                >
                  <TouchableWithoutFeedback className="pr-6">
                    <View className={className}>{children}</View>
                  </TouchableWithoutFeedback>
                </ScrollView>
                
                {/* Top scroll indicator */}
                {showTopIndicator && (
                  <LinearGradient
                    colors={[theme.card, `${theme.card}00`]}
                    locations={[0, 1]}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 20,
                      zIndex: 10,
                      pointerEvents: "none",
                    }}
                  />
                )}
                
                {/* Bottom scroll indicator */}
                {showBottomIndicator && (
                  <LinearGradient
                    colors={[`${theme.card}00`, theme.card]}
                    locations={[0, 1]}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 20,
                      zIndex: 10,
                      pointerEvents: "none",
                    }}
                  />
                )}
              </View>
              {(cancelLabel || confirmLabel) && (
                <View className="flex-row items-center gap-2">
                  {cancelLabel && (
                    <Button
                      onPress={handleCancel}
                      label={cancelLabel}
                      variant="secondary"
                      className="flex-1"
                    />
                  )}
                  {confirmLabel && (
                    <Button
                      onPress={handleConfirm}
                      label={confirmLabel}
                      isUpdating={isPending}
                      disabled={disableConfirm}
                      className="flex-1"
                    />
                  )}
                </View>
              )}
            </Card>
          </MotiView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};

export { Dialog, DialogTrigger, DialogContent, useDialog };
