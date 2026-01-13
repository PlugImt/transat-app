import WheelPicker from "@quidone/react-native-wheel-picker";
import { ChevronDown } from "lucide-react-native";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "./Button";

type SimpleDropdownProps = {
  options: string[];
  value?: string;
  onValueChange: (value: string) => void;
  icon?: React.ReactNode;
  label: string;
  placeholder: string;
};

export const SimpleDropdown = ({
  options,
  value,
  onValueChange,
  icon,
  label,
  placeholder,
}: SimpleDropdownProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="gap-1.5">
      <Text color="muted" variant="sm">
        {label}
      </Text>
      <TouchableOpacity
        className="flex-row items-center justify-between rounded-lg px-3 h-12"
        style={{ backgroundColor: theme.input }}
        onPress={() => setIsOpen(true)}
      >
        <View className="flex-row items-center gap-2">
          {icon ? icon : null}
          <Text>{value ? value : placeholder}</Text>
        </View>
        <ChevronDown color={theme.text} size={20} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View
            style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
            className="justify-end"
          >
            <TouchableWithoutFeedback>
              <View
                style={{ backgroundColor: theme.card }}
                className="rounded-t-3xl p-6 gap-4"
              >
                <Text variant="h2">{placeholder}</Text>
                <WheelPicker
                  data={options.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  itemTextStyle={{ color: theme.text }}
                  overlayItemStyle={{ backgroundColor: theme.primary }}
                  value={value}
                  onValueChanged={({ item: { value } }) => onValueChange(value)}
                  enableScrollByTapOnItem={true}
                />
                <Button
                  label={t("common.confirm")}
                  variant="secondary"
                  onPress={() => setIsOpen(false)}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default SimpleDropdown;
