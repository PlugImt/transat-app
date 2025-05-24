import { useTheme } from "@/contexts/ThemeContext";
import { forwardRef } from "react";
import { Controller, type FieldValues, type Path } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

import { cn } from "@/lib/utils";

export interface InputProps<T extends FieldValues>
  extends Omit<
    React.ComponentPropsWithoutRef<typeof TextInput>,
    "onChangeText" | "value"
  > {
  label?: string;
  labelClasses?: string;
  inputClasses?: string;
  // biome-ignore lint/suspicious/noExplicitAny: TODO: à être mieux handle
  control: any;
  name: Path<T>;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
}

const Input = forwardRef(
  <T extends FieldValues>(
    {
      className,
      label,
      labelClasses,
      inputClasses,
      control,
      name,
      disabled,
      loading,
      error,
      ...props
    }: InputProps<T>,
    ref: React.Ref<TextInput>,
  ) => {
    const { theme } = useTheme();

    if (loading) {
      return (
        <InputLoading
          label={label}
          className={className}
          labelClasses={labelClasses}
          inputClasses={inputClasses}
        />
      );
    }

    return (
      <View className={cn("gap-1.5", className)}>
        {label && (
          <Text
            className={cn("text-sm", labelClasses)}
            style={{ color: theme.textSecondary }}
          >
            {label}
          </Text>
        )}

        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              ref={ref}
              editable={!disabled}
              style={{
                backgroundColor: theme.input,
                color: theme.text,
                borderColor: error ? "#ef4444" : "transparent",
                borderWidth: error ? 1 : 0,
              }}
              className={cn(inputClasses, "py-2.5 px-4 rounded-lg h-12")}
              placeholderTextColor={theme.textPlaceholder}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              {...props}
            />
          )}
        />

        {error && <Text className="text-red-500 text-sm">{error}</Text>}
      </View>
    );
  },
);

export default Input;

interface InputLoadingProps {
  label?: string;
  className?: string;
  labelClasses?: string;
  inputClasses?: string;
}

export const InputLoading = ({
  label,
  className,
  labelClasses,
  inputClasses,
}: InputLoadingProps) => {
  const { theme } = useTheme();

  return (
    <View className={cn("gap-1.5 opacity-50", className)}>
      {label && (
        <Text
          className={cn("text-sm", labelClasses)}
          style={{ color: theme.textSecondary }}
        >
          {label}
        </Text>
      )}

      <TextInput
        editable={false}
        style={{
          backgroundColor: theme.input,
          color: theme.text,
        }}
        className={cn(inputClasses, "py-2.5 px-4 rounded-lg")}
        placeholderTextColor={theme.textPlaceholder}
      />
    </View>
  );
};
