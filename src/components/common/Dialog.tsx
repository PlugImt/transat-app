import { cloneElement, createContext, useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "./Button";

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

// biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
const DialogTrigger = ({ children }: any) => {
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
      animationType="slide"
      visible={open}
      onRequestClose={() => setOpen(false)}
    >
      <TouchableWithoutFeedback
        className="w-full h-full"
        onPress={() => setOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ backgroundColor: theme.backdrop }}
          className="flex flex-1 justify-center items-center w-full"
        >
          <View
            style={{
              backgroundColor: theme.background,
              borderColor: theme.muted,
            }}
            className="border rounded-lg p-6 shadow-lg w-11/12 max-h-[80%] gap-8"
          >
            <Text variant="h2">{title}</Text>
            <ScrollView keyboardShouldPersistTaps="handled">
              <TouchableWithoutFeedback className="pr-6">
                <View className={className}>{children}</View>
              </TouchableWithoutFeedback>
            </ScrollView>
            {(cancelLabel || confirmLabel) && (
              <View className="flex-row gap-4 justify-end">
                {cancelLabel && (
                  <Button
                    onPress={handleCancel}
                    label={cancelLabel}
                    variant="outlined"
                  />
                )}
                {confirmLabel && (
                  <Button
                    onPress={handleConfirm}
                    label={confirmLabel}
                    loading={isPending}
                    disabled={disableConfirm}
                  />
                )}
              </View>
            )}
          </View>
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
