import { MotiView } from "moti";
import type React from "react";
import { cloneElement, createContext, useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "@/components/common/Button";
import Card from "@/components/common/Card";
import ScrollViewWithIndicators from "@/components/common/ScrollViewWithIndicators";
import { Text } from "@/components/common/Text";

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
  scrollable?: boolean;
};

const DialogContent = ({
  className,
  children,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  disableConfirm,
  scrollable,
  title,
  isPending,
}: DialogContentProps) => {
  const { open, setOpen } = useDialog();

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

              <ScrollViewWithIndicators
                keyboardShouldPersistTaps="handled"
                maxHeight={400}
                scrollable={scrollable}
              >
                <TouchableWithoutFeedback className="pr-6">
                  <View className={className}>{children}</View>
                </TouchableWithoutFeedback>
              </ScrollViewWithIndicators>

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
