import { useTheme } from "@/themes/useThemeProvider";
import { Picker } from "@react-native-picker/picker";
import { ChevronDown } from "lucide-react-native";
import type React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import {
  BottomSheet,
  BottomSheetProvider,
  BottomSheetTrigger,
} from "./BottomSheet";

type DropdownProps = {
  options: string[];
  value?: string;
  onValueChange: (value: string) => void;
  icon?: React.ReactNode;
  label: string;
  placeholder: string;
};

const Dropdown = ({
  options,
  value,
  onValueChange,
  icon,
  label,
  placeholder,
}: DropdownProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <BottomSheetProvider>
      <View className="gap-1.5">
        <Text className="text-foreground/70 text-sm">{label}</Text>
        <BottomSheetTrigger>
          <TouchableOpacity className="flex-row items-center justify-between bg-muted/70 rounded-lg px-3 h-12">
            <View className="flex-row items-center gap-2">
              {icon ? icon : null}
              <Text className="text-foreground">
                {value ? value : placeholder}
              </Text>
            </View>
            <ChevronDown color={theme.foreground} size={20} />
          </TouchableOpacity>
        </BottomSheetTrigger>

        <BottomSheet>
          <Text className="h2">{placeholder}</Text>
          <Picker selectedValue={value} onValueChange={onValueChange}>
            {options.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </BottomSheet>
      </View>
    </BottomSheetProvider>
  );
};

export default Dropdown;
