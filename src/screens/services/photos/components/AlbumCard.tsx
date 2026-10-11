import { Image as ExpoImage } from "expo-image";
import { Images } from "lucide-react-native";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type { PhotoAlbum } from "@/dto";
import { useDate } from "@/hooks/common";
import { parseEventDate } from "../photos.utils";

type AlbumCardProps = {
  album: PhotoAlbum;
  width: number;
  onPress: (album: PhotoAlbum) => void;
};

const AlbumCardComponent = ({ album, width, onPress }: AlbumCardProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { formatDate } = useDate();

  const eventDate = parseEventDate(album.event_date);
  // Undated events stay listed: no invented date, only the first photo's day when known.
  const subtitle = eventDate
    ? formatDate(eventDate, "PPP")
    : album.first_taken_at
      ? t("photos.photosFrom", {
          date: formatDate(new Date(album.first_taken_at), "PPP"),
        })
      : t("photos.dateUnknown");
  const count = t("photos.photoCount", { count: album.photo_count });

  return (
    <Pressable
      onPress={() => onPress(album)}
      accessibilityRole="button"
      accessibilityLabel={`${album.title}. ${subtitle}. ${count}`}
      style={({ pressed }) => ({ width, opacity: pressed ? 0.85 : 1 })}
    >
      <View
        style={{
          width,
          height: width,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: theme.card,
        }}
      >
        {album.cover_url ? (
          <ExpoImage
            source={{ uri: album.cover_url }}
            style={{ width, height: width }}
            contentFit="cover"
            cachePolicy="memory-disk"
            recyclingKey={String(album.id)}
            transition={160}
            accessible={false}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Images size={width / 4} color={theme.muted} />
          </View>
        )}
      </View>
      <View className="pt-2 gap-0.5">
        <Text variant="lg" numberOfLines={2}>
          {album.title}
        </Text>
        <Text color="muted" variant="sm" numberOfLines={1}>
          {subtitle}
        </Text>
        <Text color="muted" variant="sm">
          {count}
        </Text>
      </View>
    </Pressable>
  );
};

export const AlbumCard = memo(AlbumCardComponent);
