import { Skeleton } from "@/components/Skeleton";
import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { Text, TouchableOpacity } from "react-native";

const buttonVariants = cva(
  "flex flex-row items-center justify-center rounded-xl gap-2",
  {
    variants: {
      variant: {
        default: "bg-primary",
        secondary: "bg-secondary",
        outlined: "border border-primary",
        destructive: "bg-destructive",
        ghost: "bg-muted",
        link: "text-primary underline-offset-4",
        disabled: "bg-muted",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-2",
        lg: "h-12 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva("text-center font-medium", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      outlined: "text-primary",
      destructive: "text-destructive-foreground",
      ghost: "text-primary-foreground",
      link: "text-primary-foreground underline",
      disabled: "text-muted",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface ButtonProps
  extends ComponentPropsWithoutRef<typeof TouchableOpacity>,
    VariantProps<typeof buttonVariants> {
  label: string;
  labelClasses?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

function Button({
  label,
  labelClasses,
  className,
  variant,
  size,
  icon,
  loading,
  ...props
}: ButtonProps) {
  const isDisabled = props.disabled || loading;
  return (
    <TouchableOpacity
      className={cn(
        buttonVariants({ variant, size, className }),
        isDisabled && "opacity-50",
      )}
      {...props}
      disabled={isDisabled}
    >
      <Text
        className={cn(
          buttonTextVariants({ variant, size, className: labelClasses }),
        )}
      >
        {label}
      </Text>
      {loading ? (
        <Skeleton
          width={20}
          height={20}
          variant="circle"
          className="bg-white opacity-80"
        />
      ) : (
        icon
      )}
    </TouchableOpacity>
  );
}

interface IconButtonProps extends Omit<ButtonProps, "label" | "labelClasses"> {
  icon: React.ReactNode;
}

function IconButton({
  icon,
  variant,
  size,
  loading,
  ...props
}: IconButtonProps) {
  const className = "flex items-center justify-center rounded-full";
  const isDisabled = props.disabled || loading;
  return (
    <TouchableOpacity
      className={cn(
        buttonVariants({ variant, size, className }),
        isDisabled && "opacity-50",
      )}
      {...props}
      disabled={isDisabled}
    >
      {loading ? (
        <Skeleton
          width={20}
          height={20}
          variant="circle"
          className="bg-white opacity-80"
        />
      ) : (
        icon
      )}
    </TouchableOpacity>
  );
}

export { Button, IconButton, buttonVariants, buttonTextVariants };
