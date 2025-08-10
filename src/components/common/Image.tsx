import type React from "react";
import { forwardRef, useState } from "react";
import {
  type ImageSourcePropType,
  Image as RNImage,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils";
import { ImageSkeleton } from "../Skeleton/ImageSkeleton";

interface ImageProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RNImage>, "source"> {
  source?: ImageSourcePropType | string;
  loading?: boolean;
  size?: number;
  fallback?: React.ReactNode;
  radius?: number;
}

interface ImageFallbackProps {
  size?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
  radius?: number;
}

const ImageFallback = ({
  size = 64,
  className,
  style,
  radius,
}: ImageFallbackProps) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.border,
          width: size,
          height: size,
          borderRadius: radius,
        },
        style,
      ]}
      className={cn(
        "absolute inset-0 h-full w-full items-center justify-center z-0",
        className,
      )}
    />
  );
};

const normalizeSource = (
  source?: ImageSourcePropType | string,
): ImageSourcePropType | undefined => {
  if (!source) return undefined;
  if (typeof source === "string") return { uri: source };
  return source;
};

const isValidSource = (src: ImageSourcePropType | undefined) => {
  if (!src) return false;
  if (typeof src === "number") return true;
  if (
    typeof src === "object" &&
    "uri" in src &&
    src.uri &&
    src.uri.trim() !== ""
  )
    return true;
  return false;
};

const Image = forwardRef<React.ElementRef<typeof RNImage>, ImageProps>(
  (
    {
      className,
      loading = false,
      source,
      size = 64,
      fallback,
      radius = 8,
      ...props
    },
    ref,
  ) => {
    const [hasError, setHasError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);

    const isLoading = loading || imageLoading;
    const finalSource = normalizeSource(source);
    const validSource = isValidSource(finalSource);

    if ((!validSource && !isLoading) || hasError) {
      return fallback !== undefined ? (
        fallback
      ) : (
        <ImageFallback size={size} radius={radius} {...props} />
      );
    }

    return (
      <View
        style={[{ width: size, height: size }]}
        className={cn("relative flex shrink-0 overflow-hidden", className)}
      >
        <View className="absolute inset-0 h-full w-full z-10">
          <RNImage
            ref={ref}
            source={finalSource}
            onError={() => {
              setHasError(true);
              setImageLoading(false);
            }}
            className={cn(
              "aspect-square h-full w-full",
              hasLoaded ? "opacity-100" : "opacity-0",
            )}
            borderRadius={radius}
            resizeMode={props.resizeMode ?? "contain"}
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
          <View className="z-20 absolute inset-0 h-full w-full">
            <ImageSkeleton size={size} radius={radius} {...props} />
          </View>
        )}
      </View>
    );
  },
);
Image.displayName = "Image";

export default Image;
