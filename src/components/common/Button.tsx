import { type VariantProps, cva } from 'class-variance-authority';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

const buttonVariants = cva('flex flex-row items-center justify-center rounded-xl gap-2 ', {
    variants: {
        variant: {
            default: 'bg-primary',
            secondary: 'bg-secondary',
            outlined: 'border border-primary',
            destructive: 'bg-destructive',
            ghost: 'bg-slate-700',
            link: 'text-primary underline-offset-4',
        },
        size: {
            default: 'h-10 px-4',
            sm: 'h-8 px-2',
            lg: 'h-12 px-8',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});

const buttonTextVariants = cva('text-center font-medium', {
    variants: {
        variant: {
            default: 'text-primary-foreground',
            secondary: 'text-secondary-foreground',
            outlined: 'text-primary',
            destructive: 'text-destructive-foreground',
            ghost: 'text-primary-foreground',
            link: 'text-primary-foreground underline',
        },
        size: {
            default: 'text-base',
            sm: 'text-sm',
            lg: 'text-xl',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});

interface ButtonProps
    extends ComponentPropsWithoutRef<typeof TouchableOpacity>,
        VariantProps<typeof buttonVariants> {
    label: string;
    labelClasses?: string;
    loading?: boolean;
}
function Button({ label, labelClasses, className, variant, size, loading, ...props }: ButtonProps) {
    return (
        <TouchableOpacity className={cn(buttonVariants({ variant, size, className }))} {...props}>
            <Text className={cn(buttonTextVariants({ variant, size, className: labelClasses }))}>
                {label}
            </Text>
            {loading && (
                <ActivityIndicator size="small" color="white" />
            )}
        </TouchableOpacity>
    );
}

export { Button, buttonVariants, buttonTextVariants };
