import { MotiView } from "moti";
import type React from "react";
import { cloneElement, createContext, useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(
  undefined,
);

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = ({
  children,
}: {
  children: React.ReactElement<{ onPress?: () => void }>;
}) => {
  const { setOpen } = useDropdownMenu();

  return cloneElement(children, { onPress: () => setOpen(true) });
};

type DropdownMenuItemProps = {
  label: string;
  onPress: () => void;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
  preventClose?: boolean;
};

const DropdownMenuItem = ({
  label,
  onPress,
  variant = "default",
  icon,
  preventClose = false,
}: DropdownMenuItemProps) => {
  const { setOpen } = useDropdownMenu();
  const { theme } = useTheme();

  const handlePress = () => {
    onPress();
    if (!preventClose) {
      setOpen(false);
    }
  };

  const textColor = variant === "destructive" ? theme.destructive : theme.text;

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="flex-row items-center gap-3 px-4 py-3 min-w-[160px]">
        {icon && <View className="w-5">{icon}</View>}
        <Text variant="default" className="flex-1" style={{ color: textColor }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const DropdownMenuContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { open, setOpen } = useDropdownMenu();
  const { theme } = useTheme();

  return (
    <Modal
      transparent
      animationType="fade"
      visible={open}
      onRequestClose={() => setOpen(false)}
    >
      <TouchableWithoutFeedback onPress={() => setOpen(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          className="flex-1 justify-center items-center w-full"
        >
          <MotiView
            from={{
              opacity: 0,
              scale: 0.95,
              translateY: -10,
            }}
            animate={{
              opacity: open ? 1 : 0,
              scale: open ? 1 : 0.95,
              translateY: open ? 0 : -10,
            }}
            transition={{
              type: "spring",
            }}
            className="absolute top-20 right-4"
            onStartShouldSetResponder={() => true}
            onResponderGrant={() => {}}
            onResponderRelease={() => {}}
          >
            <View
              className={`gap-0 overflow-hidden rounded-xl border-[1.5px] ${className || ""}`}
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                shadowColor: theme.text,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 8,
              }}
              onStartShouldSetResponder={() => true}
              onResponderGrant={() => {}}
              onResponderRelease={() => {}}
            >
              {children}
            </View>
          </MotiView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const useDropdownMenu = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(
      "useDropdownMenu must be used within a DropdownMenuProvider",
    );
  }
  return context;
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  useDropdownMenu,
};
