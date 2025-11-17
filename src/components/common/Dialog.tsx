import { LinearGradient } from "expo-linear-gradient";
import {
  Dialog as NativeDialog,
  ScrollShadow,
  useThemeColor,
} from "heroui-native";
import type React from "react";
import { useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils";

type DialogProps = {
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
  trigger?: React.ReactNode;
};

export const Dialog = ({
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
  trigger,
}: DialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { height } = useWindowDimensions();
  const { theme } = useTheme();
  const themeColorOverlay = useThemeColor("overlay");

  return (
    <NativeDialog isOpen={isOpen} onOpenChange={setIsOpen}>
      <NativeDialog.Trigger asChild>{trigger}</NativeDialog.Trigger>
      <NativeDialog.Portal>
        <NativeDialog.Overlay />
        <NativeDialog.Content>
          <View className="gap-2 mb-4">
            <View className="flex-row justify-between items-center gap-2">
              <NativeDialog.Title>
                <Text variant="h2">{title}</Text>
              </NativeDialog.Title>
              <NativeDialog.Close />
            </View>
            <ScrollShadow
              LinearGradientComponent={LinearGradient}
              className="max-h-[60vh]"
              color={themeColorOverlay}
            >
              <ScrollView
                contentContainerClassName={cn("pr-6", className)}
                scrollEnabled={scrollable}
                style={{ height: scrollable ? height * 0.35 : undefined }}
              >
                {children}
              </ScrollView>
            </ScrollShadow>
          </View>
          {(cancelLabel || confirmLabel) && (
            <View className="flex-row items-center gap-2">
              {cancelLabel && (
                <NativeDialog.Close asChild>
                  <Button
                    onPress={() => onCancel?.()}
                    label={cancelLabel}
                    variant="secondary"
                    className="flex-1"
                  />
                </NativeDialog.Close>
              )}
              {confirmLabel && (
                <NativeDialog.Close asChild>
                  <Button
                    onPress={() => onConfirm?.()}
                    label={confirmLabel}
                    isUpdating={isPending}
                    disabled={disableConfirm}
                    className="flex-1"
                  />
                </NativeDialog.Close>
              )}
            </View>
          )}
        </NativeDialog.Content>
      </NativeDialog.Portal>
    </NativeDialog>
  );
};
