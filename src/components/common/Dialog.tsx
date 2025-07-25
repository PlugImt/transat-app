import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import React, {
  cloneElement,
  createContext,
  useContext,
  useState,
} from "react";
import {
  KeyboardAvoidingView,
  Modal,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
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
  const [showBottomIndicator, setShowBottomIndicator] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  // Check if content should show bottom indicator
  const checkContentOverflow = React.useCallback(() => {
    if (scrollViewHeight > 0 && contentHeight > 0) {
      setShowBottomIndicator(contentHeight > scrollViewHeight + 5);
    }
  }, [scrollViewHeight, contentHeight]);

  // Check overflow when dialog opens or dimensions change
  React.useEffect(() => {
    if (open) {
      checkContentOverflow();
    } else {
      // Don't immediately reset - let the exit animation handle it
      setTimeout(() => {
        setShowBottomIndicator(false);
        setScrollViewHeight(0);
        setContentHeight(0);
      }, 300); // Match the MotiView exit duration
    }
  }, [open, checkContentOverflow]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const scrollViewHeight = layoutMeasurement.height;
    const contentHeight = contentSize.height;

    // Show bottom indicator if there's more content below (with 5px threshold)
    setShowBottomIndicator(scrollY + scrollViewHeight < contentHeight - 5);
  };

  const handleContentSizeChange = (
    _contentWidth: number,
    newContentHeight: number,
  ) => {
    setContentHeight(newContentHeight);
    // Check if content overflows the scroll view
    if (scrollViewHeight > 0) {
      setShowBottomIndicator(newContentHeight > scrollViewHeight + 5);
    }
  };

  const handleScrollViewLayout = (event: {
    nativeEvent: { layout: { height: number } };
  }) => {
    const newScrollViewHeight = event.nativeEvent.layout.height;
    setScrollViewHeight(newScrollViewHeight);
    // Check overflow with new scroll view height
    if (contentHeight > 0) {
      setShowBottomIndicator(contentHeight > newScrollViewHeight + 5);
    }
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

                {showBottomIndicator && (
                  <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: open ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      type: "timing", 
                      duration: 300,
                      delay: open ? 100 : 0 // Small delay on entrance for smoother appearance
                    }}
                  >
                    <LinearGradient
                      colors={[`${theme.card}00`, theme.card]}
                      locations={[0, 1]}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 200,
                        zIndex: 10,
                        pointerEvents: "none",
                      }}
                    />
                  </MotiView>
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
