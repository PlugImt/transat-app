import Input from "@/components/common/Input";

interface TextareaProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  disabled: boolean;
}

export const Textarea = ({
  value,
  onChangeText,
  placeholder,
  disabled,
}: TextareaProps) => {
  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      disabled={disabled}
      inputClasses="min-h-[100px] min-w-full"
    />
  );
};
