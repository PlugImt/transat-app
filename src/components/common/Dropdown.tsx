import { useTheme } from "@/contexts/ThemeContext";
import { Picker } from "@react-native-picker/picker";
import { ChevronDown } from "lucide-react-native";
import type React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
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
  const { theme } = useTheme();

  return (
    <View className="gap-1.5">
      <Text className=" text-sm" style={{ color: theme.textSecondary }}>
        {label}
      </Text>
      {Platform.OS === "android" ? (
        <View className="bg-muted/70 rounded-lg h-12 justify-center">
          <Picker
            selectedValue={value}
            onValueChange={onValueChange}
            mode="dropdown"
            style={{ color: theme.text }}
            itemStyle={{
              backgroundColor: theme.card,
              color: theme.text,
              fontSize: 16,
            }}
            dropdownIconColor={theme.text}
          >
            {options.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>
      ) : (
        <BottomSheetProvider>
          <BottomSheetTrigger>
            <TouchableOpacity className="flex-row items-center justify-between bg-muted/70 rounded-lg px-3 h-12">
              <View className="flex-row items-center gap-2">
                {icon ? icon : null}
                <Text style={{ color: theme.text }}>
                  {value ? value : placeholder}
                </Text>
              </View>
              <ChevronDown color={theme.text} size={20} />
            </TouchableOpacity>
          </BottomSheetTrigger>

          <BottomSheet>
            <Text className="h2">{placeholder}</Text>
            <Picker
              selectedValue={value}
              onValueChange={onValueChange}
              mode="dropdown"
            >
              {options.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </BottomSheet>
        </BottomSheetProvider>
      )}
    </View>
  );
};

export default Dropdown;

interface DropdownLoadingProps {
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
}

export const DropdownLoading = ({
  label,
  placeholder,
  icon,
}: DropdownLoadingProps) => {
  const { theme } = useTheme();
  return (
    <View className="gap-1.5 opacity-50">
      <Text className="text-sm" style={{ color: theme.textSecondary }}>
        {label}
      </Text>
      <View className="flex-row items-center justify-between bg-muted/70 rounded-lg px-3 h-12 gap-2">
        <View className="flex-row items-center gap-2">
          {icon ? icon : null}
          <Text style={{ color: theme.text }}>{placeholder}</Text>
        </View>
        <ChevronDown color={theme.text} size={20} />
      </View>
    </View>
  );
};
