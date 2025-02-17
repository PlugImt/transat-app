import theme from "@/themes";
import { Picker } from "@react-native-picker/picker";
import { ChevronDown } from "lucide-react-native";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { Button } from "./Button";
import { Dialog, DialogContent, DialogTrigger, useDialog } from "./Dialog";

type DropdownProps = {
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  icon?: React.ReactNode;
  label: string;
  placeholder: string;
};

const Dropdown = ({
  options,
  selectedValue,
  onValueChange,
  icon,
  label,
  placeholder,
}: DropdownProps) => {
  const { t } = useTranslation();
  const [currentValue, setCurrentValue] = useState(selectedValue);

  useEffect(() => {
    setCurrentValue(selectedValue);
  }, [selectedValue]);

  const handleCancel = () => {
    onValueChange(selectedValue);
  };

  return (
    <Dialog>
      <View>
        <Text className="text-sm text-[#ffe6cc] opacity-70 mb-1">{label}</Text>
        <DialogTrigger>
          <TouchableOpacity className="flex-row items-center justify-between bg-[#22222222] rounded-lg px-3 h-12">
            <View className="flex-row items-center gap-2">
              {icon ? icon : null}
              <Text className="text-foreground">
                {currentValue ? currentValue : placeholder}
              </Text>
            </View>
            <ChevronDown color={theme.textPrimary} size={20} />
          </TouchableOpacity>
        </DialogTrigger>
      </View>
      <DialogContent
        cancelLabel={t("common.cancel")}
        confirmLabel={t("common.save")}
        onConfirm={() => {}}
        onCancel={handleCancel}
      >
        <Text className="h2">{placeholder}</Text>
        <Picker
          selectedValue={currentValue}
          onValueChange={(itemValue) => {
            onValueChange(itemValue);
          }}
        >
          {options.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </DialogContent>
    </Dialog>
  );
};

export default Dropdown;
