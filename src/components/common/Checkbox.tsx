import { Check } from "lucide-react-native";
import type React from "react";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils";
import { hapticFeedback } from "@/utils/haptics.utils";

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof View> {
  checked?: boolean;
  onPress: (checked: boolean) => void;
  label?: string | React.ReactNode;
  labelClasses?: string;
  checkboxClasses?: string;
}
function Checkbox({
  checked = false,
  onPress,
  label,
  labelClasses,
  checkboxClasses,
  className,
  ...props
}: CheckboxProps) {
  const [isChecked, setChecked] = useState(checked);
  const { theme } = useTheme();

  useEffect(() => {
    setChecked(checked);
  }, [checked]);

  const toggleCheckbox = () => {
    hapticFeedback.medium();
    const checked = !isChecked;
    setChecked(checked);
    onPress(checked);
  };

  return (
    <TouchableOpacity
      onPress={toggleCheckbox}
      className={cn("flex-row items-center gap-2", className)}
      {...props}
    >
      <View
        className={cn(
          "w-6 h-6 border rounded-md justify-center items-center",
          checkboxClasses,
        )}
        style={{
          borderColor: theme.border,
          backgroundColor: isChecked ? theme.primary : theme.border,
        }}
      >
        {isChecked && <Check size={16} color="white" />}
      </View>
      {label && <Text className={labelClasses}>{label}</Text>}
    </TouchableOpacity>
  );
}

export { Checkbox };
