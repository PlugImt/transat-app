import { UserRound } from "lucide-react-native";
import type React from "react";
import { forwardRef, useState } from "react";
import { Image, View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type { User } from "@/dto";
import { cn, isValidSource, normalizeSource } from "@/utils";
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
  const [hasLoaded, setHasLoaded] = useState(false);

  const isLoading = loading || imageLoading;
  const finalSource = normalizeSource(source);
  const validSource = isValidSource(finalSource);

  if (!validSource || hasError) {
    return null;
  }

  return (
    <>
      <View className={cn("absolute inset-0 h-full w-full z-10", className)}>
        <Image
          ref={ref}
          source={source}
          onError={() => {
            setHasError(true);
            setImageLoading(false);
          }}
          className={cn(
            "aspect-square h-full w-full",
            hasLoaded ? "opacity-100" : "opacity-0",
          )}
          onLoadStart={() => {
            setImageLoading(true);
            setHasError(false);
          }}
          onLoad={() => {
            setHasLoaded(true);
          }}
          onLoadEnd={() => {
            setImageLoading(false);
          }}
          {...props}
        />
      </View>
      {isLoading && !hasLoaded && (
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
  user: Pick<User, "profile_picture" | "first_name" | "last_name">;
  size?: number;
  style?: React.ComponentPropsWithoutRef<typeof View>["style"];
}

const Avatar = ({
  user,
  className,
  size = 64,
  style,
  ...props
}: AvatarProps) => {
  const { theme } = useTheme();

  return (
    <AvatarContainer
      style={[{ width: size, height: size }, style]}
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
        {user.first_name && user.last_name ? (
          <>
            {user.first_name?.charAt(0)}
            {user.last_name?.charAt(0)}
          </>
        ) : (
          <UserRound size={size} color={theme.muted} />
        )}
      </AvatarFallback>
    </AvatarContainer>
  );
};

export default Avatar;
