import { Skeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";
import { Image, Text, View } from "react-native";

const Avatar = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof Image> {
  loading?: boolean;
}

const AvatarImage = forwardRef<
  React.ElementRef<typeof Image>,
  AvatarImageProps
>(({ className, loading = false, ...props }, ref) => {
  const [hasError, setHasError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const isLoading = loading || imageLoading;

  if (hasError) {
    return null;
  }

  return (
    <View className={cn("h-full w-full", className)}>
      {isLoading && <AvatarLoading className="absolute inset-0 z-10" />}

      <Image
        ref={ref}
        onError={() => setHasError(true)}
        className={cn(
          "aspect-square h-full w-full",
          isLoading ? "opacity-0" : "visible",
        )}
        onLoadStart={() => setImageLoading(true)}
        onLoadEnd={() => setImageLoading(false)}
        {...props}
      />
    </View>
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & { textClassname?: string }
>(({ children, className, textClassname, ...props }, ref) => {
  const { theme } = useTheme();

  return (
    <View
      ref={ref}
      style={{ backgroundColor: theme.muted }}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    >
      <Text
        style={{ color: theme.text }}
        className={cn("text-4xl font-bold", textClassname)}
      >
        {children}
      </Text>
    </View>
  );
});
AvatarFallback.displayName = "AvatarFallback";

const AvatarLoading = ({ className }: AvatarImageProps) => (
  <Skeleton
    variant="circle"
    width="100%"
    height="100%"
    className={cn("aspect-square h-full w-full", className)}
  />
);

export { Avatar, AvatarImage, AvatarFallback };
