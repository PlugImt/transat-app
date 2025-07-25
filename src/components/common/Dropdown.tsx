import WheelPicker from "@quidone/react-native-wheel-picker";
import { ChevronDown } from "lucide-react-native";
import type React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import {
  BottomSheet,
  BottomSheetProvider,
  BottomSheetTrigger,
  useBottomSheet,
} from "./BottomSheet";
import { Button } from "./Button";

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
  return (
    <View className="gap-1.5">
      <Text color="muted" variant="sm">
        {label}
      </Text>
      <BottomSheetProvider>
        <DropdownContent
          options={options}
          value={value}
          onValueChange={onValueChange}
          icon={icon}
          label={label}
          placeholder={placeholder}
        />
      </BottomSheetProvider>
    </View>
  );
};

const DropdownContent = ({
  options,
  value,
  onValueChange,
  icon,
  placeholder,
}: DropdownProps) => {
  const { theme } = useTheme();
  const { handleBottomSheet } = useBottomSheet();

  return (
    <>
      <BottomSheetTrigger>
        <TouchableOpacity
          className="flex-row items-center justify-between rounded-lg px-3 h-12"
          style={{ backgroundColor: theme.input }}
        >
          <View className="flex-row items-center gap-2">
            {icon ? icon : null}
            <Text>{value ? value : placeholder}</Text>
          </View>
          <ChevronDown color={theme.text} size={20} />
        </TouchableOpacity>
      </BottomSheetTrigger>

      <BottomSheet>
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
          label="Confirmer"
          variant="secondary"
          onPress={() => handleBottomSheet(false)}
        />
      </BottomSheet>
    </>
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
      <Text color="muted" variant="sm">
        {label}
      </Text>
      <View className="flex-row items-center justify-between bg-muted/70 rounded-lg px-3 h-12 gap-2">
        <View className="flex-row items-center gap-2">
          {icon ? icon : null}
          <Text>{placeholder}</Text>
        </View>
        <ChevronDown color={theme.text} size={20} />
      </View>
    </View>
  );
};
