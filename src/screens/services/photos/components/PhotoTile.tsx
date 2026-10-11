import { Image as ExpoImage } from "expo-image";
import { Check, ImageOff, Play, TriangleAlert } from "lucide-react-native";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { Photo } from "@/dto";
import {
  type PhotoSelectionStore,
  TILE_FAILED,
  TILE_MODE,
  TILE_SELECTED,
  useTileSelection,
} from "@/hooks/services/photos/usePhotoSelection";

type PhotoTileProps = {
  photo: Photo;
  width: number;
  height: number;
  /** High for rows on screen, low for the rows rendered around them. */
  priority: "high" | "low";
  label: string;
  onPress: (photo: Photo) => void;
  /** Long press: starts selection. Videos open in Drive, so they are not selectable. */
  onLongPress?: (photo: Photo) => void;
  selection?: PhotoSelectionStore;
};

// 0: primary thumbnail, 1: Drive's second thumbnail endpoint, 2: both failed (tap to retry).
type Stage = 0 | 1 | 2;

const PhotoTileComponent = ({
  photo,
  width,
  height,
  priority,
  label,
  onPress,
  onLongPress,
  selection,
}: PhotoTileProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const state = useTileSelection(selection, photo.id);
  const selecting = (state & TILE_MODE) !== 0;
  const selected = (state & TILE_SELECTED) !== 0;
  const failed = (state & TILE_FAILED) !== 0;
  const selectable = photo.media_type === "image";
  const [stage, setStage] = useState<Stage>(0);

  // One size for every grid level: changing the density reuses the cached images instead of downloading others.
  const uri =
    stage === 0
      ? photo.thumbnail_url
      : stage === 1
        ? photo.thumbnail_fallback_url
        : null;
  // No thumbnail at all (the backend says Drive has none): a placeholder, not an error to retry.
  const unavailable = !photo.thumbnail_url;

  const handlePress = () => {
    // While selecting, a tap always toggles; a failed thumbnail is retried only outside selection.
    if (stage === 2 && !selecting) {
      setStage(0);
      return;
    }
    onPress(photo);
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={
        selectable && onLongPress ? () => onLongPress(photo) : undefined
      }
      delayLongPress={350}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={selecting ? { selected } : undefined}
      accessibilityActions={
        selectable && onLongPress && !selecting
          ? [{ name: "select", label: t("photos.selection.select") }]
          : undefined
      }
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === "select") onLongPress?.(photo);
      }}
      style={({ pressed }) => ({
        width,
        height,
        backgroundColor: theme.card,
        opacity: pressed ? 0.82 : selecting && !selectable ? 0.45 : 1,
      })}
    >
      {uri ? (
        <ExpoImage
          source={{ uri }}
          style={{ width, height }}
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
          <ImageOff size={Math.min(width, height) / 4} color={theme.muted} />
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
      {selecting && selectable && (
        <SelectionMark
          selected={selected}
          failed={failed}
          color={failed ? theme.destructive : theme.primary}
          iconColor={failed ? theme.destructiveText : theme.primaryText}
        />
      )}
    </Pressable>
  );
};

/** Overlay and corner badge: filled with a check when selected, an empty ring while selection is on. */
const SelectionMark = ({
  selected,
  failed,
  color,
  iconColor,
}: {
  selected: boolean;
  failed: boolean;
  color: string;
  iconColor: string;
}) => (
  <View pointerEvents="none" className="absolute inset-0">
    {selected && (
      <View
        className="absolute inset-0"
        style={{
          backgroundColor: `${color}33`,
          borderWidth: 3,
          borderColor: color,
        }}
      />
    )}
    <View
      className="absolute items-center justify-center rounded-full"
      style={{
        top: 6,
        left: 6,
        width: 22,
        height: 22,
        borderWidth: 2,
        borderColor: selected ? "#fff" : "rgba(255,255,255,0.9)",
        backgroundColor: selected ? color : "rgba(0,0,0,0.25)",
      }}
    >
      {selected &&
        (failed ? (
          <TriangleAlert size={12} color={iconColor} />
        ) : (
          <Check size={13} color={iconColor} strokeWidth={3} />
        ))}
    </View>
  </View>
);

/** Memoised: appending a page of photos must not re-render the tiles already on screen. */
export const PhotoTile = memo(PhotoTileComponent);
