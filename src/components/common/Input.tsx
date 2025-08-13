import { Eye, EyeOff } from "lucide-react-native";
import type React from "react";
import { cloneElement, forwardRef, useState } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { TextInput, TouchableOpacity, View } from "react-native";
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
  icon?: React.ReactElement<{ color?: string; size?: number }>;
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
  icon?: React.ReactElement<{ color?: string; size?: number }>;
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
      icon,
      ...props
    }: InputProps<T>,
    ref: React.Ref<TextInput>,
  ) => {
    const { theme } = useTheme();
    const [showPassword, setShowPassword] = useState(false);

    if (loading) {
      return (
        <InputLoading
          label={label}
          className={className}
          labelClasses={labelClasses}
          inputClasses={inputClasses}
          icon={icon}
        />
      );
    }

    const commonTextInputProps = {
      ref,
      editable: !disabled,
      style: {
        backgroundColor: "transparent",
        color: theme.text,
        flex: 1,
      },
      className: cn("py-2.5", disabled && "opacity-50"),
      placeholderTextColor: theme.muted,
      ...props,
    };

    const inputContainerStyle = {
      backgroundColor: theme.input,
      borderColor: error ? theme.destructive : "transparent",
      borderWidth: error ? 1 : 0,
    };

    return (
      <View className={cn("gap-1.5", className)}>
        {label && (
          <Text variant="sm" className={labelClasses} color="muted">
            {label}
          </Text>
        )}

        <View
          className={cn(
            "flex-row items-center rounded-lg h-12 px-4",
            inputClasses,
          )}
          style={inputContainerStyle}
        >
          {icon && (
            <View className="mr-3">
              {cloneElement(icon, {
                color: theme.muted,
                ...(icon.props.size === undefined && { size: 20 }),
              })}
            </View>
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
                  secureTextEntry={props.secureTextEntry && !showPassword}
                />
              )}
            />
          ) : (
            <TextInput
              {...commonTextInputProps}
              onChangeText={onChangeText}
              value={value ?? ""}
              secureTextEntry={props.secureTextEntry && !showPassword}
            />
          )}

          {props.secureTextEntry && (
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
              {showPassword ? (
                <Eye color={theme.muted} size={20} />
              ) : (
                <EyeOff color={theme.muted} size={20} />
              )}
            </TouchableOpacity>
          )}
        </View>

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
  icon?: React.ReactNode;
}

export const InputLoading = ({
  label,
  className,
  labelClasses,
  inputClasses,
  icon,
}: InputLoadingProps) => {
  const { theme } = useTheme();

  return (
    <View className={cn("gap-1.5 opacity-50", className)}>
      {label && (
        <Text variant="sm" className={labelClasses} color="muted">
          {label}
        </Text>
      )}

      <View
        className={cn(
          "flex-row items-center rounded-lg h-12 px-4",
          inputClasses,
        )}
        style={{
          backgroundColor: theme.input,
        }}
      >
        {icon && <View className="mr-3">{icon}</View>}

        <TextInput
          editable={false}
          style={{
            backgroundColor: "transparent",
            color: theme.text,
            flex: 1,
          }}
          className="py-2.5"
          placeholderTextColor={theme.muted}
        />
      </View>
    </View>
  );
};
