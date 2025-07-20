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
          <View
            className="w-[90%] max-h-[80%]"
            onStartShouldSetResponder={() => true}
            onResponderGrant={() => {}}
            onResponderRelease={() => {}}
          >
            <Card className="w-full gap-6">
              <Text variant="h2">{title}</Text>
              <ScrollView keyboardShouldPersistTaps="handled">
                <TouchableWithoutFeedback className="pr-6">
                  <View className={className}>{children}</View>
                </TouchableWithoutFeedback>
              </ScrollView>
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
                      loading={isPending}
                      disabled={disableConfirm}
                      className="flex-1"
                    />
                  )}
                </View>
              )}
            </Card>
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
