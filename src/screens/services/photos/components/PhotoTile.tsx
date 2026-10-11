import { Image as ExpoImage } from "expo-image";
import { ImageOff, Play } from "lucide-react-native";
import { memo, useState } from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { Photo } from "@/dto";

type PhotoTileProps = {
  photo: Photo;
  size: number;
  /** High for rows on screen, low for the rows rendered around them. */
  priority: "high" | "low";
  label: string;
  onPress: (photo: Photo) => void;
};

// 0: primary thumbnail, 1: Drive's second thumbnail endpoint, 2: both failed (tap to retry).
type Stage = 0 | 1 | 2;

const PhotoTileComponent = ({
  photo,
  size,
  priority,
  label,
  onPress,
}: PhotoTileProps) => {
  const { theme } = useTheme();
  const [stage, setStage] = useState<Stage>(0);

  const uri =
    stage === 0
      ? photo.thumbnail_url
      : stage === 1
        ? photo.thumbnail_fallback_url
        : null;
  // No thumbnail at all (the backend says Drive has none): a placeholder, not an error to retry.
  const unavailable = !photo.thumbnail_url;

  const handlePress = () => {
    if (stage === 2) {
      setStage(0);
      return;
    }
    onPress(photo);
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        width: size,
        height: size,
        backgroundColor: theme.card,
        opacity: pressed ? 0.82 : 1,
      })}
    >
      {uri ? (
        <ExpoImage
          source={{ uri }}
          style={{ width: size, height: size }}
          contentFit="cover"
          cachePolicy="memory-disk"
          priority={priority === "high" ? "high" : "low"}
          recyclingKey={photo.id}
          transition={140}
          onError={() => setStage((s) => (s === 0 ? 1 : 2))}
          accessible={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <ImageOff size={size / 4} color={theme.muted} />
        </View>
      )}
      {photo.media_type === "video" && !unavailable && stage !== 2 && (
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center"
        >
          <View className="rounded-full bg-black/50 p-2">
            <Play size={16} color="#fff" fill="#fff" />
          </View>
        </View>
      )}
    </Pressable>
  );
};

/** Memoised: appending a page of photos must not re-render the tiles already on screen. */
export const PhotoTile = memo(PhotoTileComponent);
