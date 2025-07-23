import { forwardRef, useState } from "react";
import { Image, View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type { User } from "@/dto";
import { cn } from "@/utils";
import { AvatarSkeleton } from "../Skeleton";

const AvatarContainer = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      "relative flex shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));
AvatarContainer.displayName = "AvatarContainer";

interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof Image> {
  loading?: boolean;
  size?: number;
}

const AvatarImage = forwardRef<
  React.ElementRef<typeof Image>,
  AvatarImageProps
>(({ className, loading = false, source, size, ...props }, ref) => {
  const [hasError, setHasError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const isLoading = loading || imageLoading;

  // Check if source is valid - handle both URI objects and local images
  const hasValidSource =
    source &&
    (typeof source === "number" || // local image
      (typeof source === "object" &&
        "uri" in source &&
        source.uri &&
        source.uri.trim() !== "")); // remote image

  if (!hasValidSource || hasError) {
    return null;
  }

  return (
    <>
      <View className={cn("absolute inset-0 h-full w-full z-10", className)}>
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
      {isLoading && (
        <View className="z-10">
          <AvatarSkeleton size={size} />
        </View>
      )}
    </>
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & {
    textClassname?: string;
    size: number;
  }
>(({ children, className, textClassname, size, ...props }, ref) => {
  const { theme } = useTheme();

  return (
    <View
      ref={ref}
      style={{ backgroundColor: theme.border }}
      className={cn(
        "absolute inset-0 h-full w-full items-center justify-center rounded-full z-0",
        className,
      )}
      {...props}
    >
      <Text
        className={cn("font-bold", textClassname)}
        style={{
          fontSize: size / 3,
          lineHeight: size / 3,
          marginTop: size / 10,
          color: theme.text,
        }}
      >
        {children}
      </Text>
    </View>
  );
});
AvatarFallback.displayName = "AvatarFallback";

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof View> {
  user: User;
  size?: number;
}

const Avatar = ({ user, className, size = 64, ...props }: AvatarProps) => {
  return (
    <AvatarContainer
      style={{ width: size, height: size }}
      className={className}
      {...props}
    >
      <AvatarImage
        source={{
          uri: user.profile_picture,
        }}
        size={size}
      />
      <AvatarFallback size={size}>
        {user.first_name?.charAt(0)}
        {user.last_name?.charAt(0)}
      </AvatarFallback>
    </AvatarContainer>
  );
};

export default Avatar;
