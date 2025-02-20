import { cloneElement, createContext, useContext, useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";

import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

function Dialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

// biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
function DialogTrigger({ children }: any) {
  const { setOpen } = useDialog();

  return cloneElement(children, { onPress: () => setOpen(true) });
}

function DialogContent({
  className,
  children,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  className?: string;
  children: React.ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}) {
  const { open, setOpen } = useDialog();

  const handleCancel = () => {
    setOpen(false);
    onCancel?.();
  };

  const handleConfirm = () => {
    setOpen(false);
    onConfirm?.();
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={open}
      onRequestClose={() => setOpen(false)}
    >
      <TouchableOpacity
        className="w-full h-full"
        onPress={() => setOpen(false)}
      >
        <View className="flex flex-1 justify-center items-center bg-background/75">
          <TouchableOpacity
            className="border border-border bg-background rounded-lg p-6 shadow-lg"
            activeOpacity={1}
          >
            <View className="gap-10">
              <View className={className}>{children}</View>
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
                    <Button onPress={handleConfirm} label={confirmLabel} />
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};

export { Dialog, DialogTrigger, DialogContent, useDialog };
