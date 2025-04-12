import { Skeleton } from "@/components/Skeleton";
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
>(({ className, loading, ...props }, ref) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }
  if (loading) {
    return (
      <Skeleton
        variant="circle"
        width="100%"
        height="100%"
        className="h-full w-full"
      />
    );
  }
  return (
    <Image
      ref={ref}
      onError={() => setHasError(true)}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & { textClassname?: string }
>(({ children, className, textClassname, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  >
    <Text className={cn("text-foreground text-4xl font-bold", textClassname)}>
      {children}
    </Text>
  </View>
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
