import { forwardRef } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { TextInput, View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils";

// Interface pour l'utilisation avec react-hook-form
export interface InputWithControlProps<T extends FieldValues>
  extends Omit<
    React.ComponentPropsWithoutRef<typeof TextInput>,
    "onChangeText" | "value"
  > {
  label?: string;
  labelClasses?: string;
  inputClasses?: string;
  control: Control<T>;
  name: Path<T>;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
}

// Interface pour l'utilisation standalone (sans react-hook-form)
export interface InputStandaloneProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof TextInput>,
    "onChangeText" | "value"
  > {
  label?: string;
  labelClasses?: string;
  inputClasses?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
}

// Union type pour supporter les deux cas d'usage
export type InputProps<T extends FieldValues> =
  | (InputWithControlProps<T> & {
      control: Control<T>;
      name: Path<T>;
      value?: never;
      onChangeText?: never;
    })
  | (InputStandaloneProps & {
      control?: never;
      name?: never;
      value?: string;
      onChangeText?: (text: string) => void;
    });

const Input = forwardRef(
  <T extends FieldValues>(
    {
      className,
      label,
      labelClasses,
      inputClasses,
      control,
      name,
      value,
      onChangeText,
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

    const commonTextInputProps = {
      ref,
      editable: !disabled,
      style: {
        backgroundColor: theme.input,
        color: theme.text,
        borderColor: error ? theme.destructive : "transparent",
        borderWidth: error ? 1 : 0,
      },
      className: cn(inputClasses, "py-2.5 px-4 rounded-lg h-12"),
      placeholderTextColor: theme.muted,
      ...props,
    };

    return (
      <View className={cn("gap-1.5", className)}>
        {label && (
          <Text variant="sm" className={labelClasses} color="muted">
            {label}
          </Text>
        )}

        {control && name ? (
          <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                {...commonTextInputProps}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
        ) : (
          <TextInput
            {...commonTextInputProps}
            onChangeText={onChangeText}
            value={value ?? ""}
          />
        )}

        {error && (
          <Text color="destructive" variant="sm">
            {error}
          </Text>
        )}
      </View>
    );
  },
) as <T extends FieldValues>(
  props: InputProps<T> & { ref?: React.Ref<TextInput> },
) => React.ReactElement;

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
        <Text variant="sm" className={labelClasses} color="muted">
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
        placeholderTextColor={theme.muted}
      />
    </View>
  );
};
