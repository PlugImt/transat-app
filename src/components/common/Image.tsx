import { CameraOff } from "lucide-react-native";
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
  fill?: boolean;
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
      className={cn("h-full w-full items-center justify-center", className)}
    >
      <CameraOff size={size / 3} color={theme.muted} />
    </View>
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
      fill = false,
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

    if (!validSource || hasError) {
      return fallback !== undefined ? (
        fallback
      ) : (
        <ImageFallback size={size} radius={radius} {...props} />
      );
    }

    const containerStyle = !fill ? { width: size, height: size } : undefined;

    return (
      <View
        style={[containerStyle]}
        className={cn(
          "relative overflow-hidden",
          fill ? "h-full w-full" : "flex shrink-0",
          className,
        )}
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
              "h-full w-full flex-shrink-0",
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
