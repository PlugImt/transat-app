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
}

const ImageFallback = ({ size = 64, className, style }: ImageFallbackProps) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        { backgroundColor: theme.border, width: size, height: size },
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
    const isLoading = loading || imageLoading;
    const finalSource = normalizeSource(source);
    const validSource = isValidSource(finalSource);

    if ((!validSource && hasError) || (!validSource && !isLoading)) {
      return fallback !== undefined ? (
        fallback
      ) : (
        <ImageFallback size={size} {...props} />
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
            onError={() => setHasError(true)}
            className={cn(
              "aspect-square h-full w-full",
              isLoading ? "opacity-0" : "opacity-100",
            )}
            borderRadius={radius}
            resizeMode={props.resizeMode ?? "contain"}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            {...props}
          />
        </View>
        {isLoading && (
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
