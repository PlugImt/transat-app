import { forwardRef } from "react";
import type { TextInput } from "react-native";
import Input from "@/components/common/Input";

interface TextareaProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  disabled: boolean;
  allowAccents?: boolean;
}

export const Textarea = forwardRef<TextInput, TextareaProps>(
  ({ value, onChangeText, placeholder, disabled, allowAccents }, ref) => {
    return (
      <Input
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        disabled={disabled}
        inputClasses="min-h-[100px] min-w-full items-start pt-2"
        className="h-[100px]"
        allowAccents={allowAccents}
      />
    );
  },
);
