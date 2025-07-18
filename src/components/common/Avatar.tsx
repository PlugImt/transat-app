import { forwardRef, useState } from "react";
import { Image, View } from "react-native";
import { Text } from "@/components/common/Text";
import { Skeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils";

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
>(({ className, loading = false, source, ...props }, ref) => {
  const [hasError, setHasError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const isLoading = loading || imageLoading;

  // Check if source is valid - handle both URI objects and local images
  const hasValidSource = source && (
    typeof source === 'number' || // local image
    (typeof source === 'object' && 'uri' in source && source.uri && source.uri.trim() !== '') // remote image
  );
  
  // If no valid source or has error, don't render the image
  if (!hasValidSource || hasError) {
    return null;
  }

  return (
    <View className={cn("absolute inset-0 h-full w-full z-10", className)}>
      {isLoading && <AvatarLoading className="absolute inset-0 z-20" />}

      <Image
        ref={ref}
        source={source}
        onError={() => setHasError(true)}
        className={cn(
          "aspect-square h-full w-full",
          isLoading ? "opacity-0" : "opacity-100",
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
        "absolute inset-0 flex h-full w-full items-center justify-center rounded-full z-0",
        className,
      )}
      {...props}
    >
      <Text className={cn("text-4xl font-bold", textClassname)}>
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
