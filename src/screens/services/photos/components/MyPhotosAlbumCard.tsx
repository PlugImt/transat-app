import { Image as ExpoImage } from "expo-image";
import { useRouter } from "expo-router";
import { Pin, ScanFace } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { useFaceStatus, useMyPhotos } from "@/hooks/services/photos/useFaces";
import { paths } from "@/navigation/paths";

type Props = { width: number; side: number };

/**
 * "Mes photos", pinned above the albums: the user's own face recognition album, or an invitation to turn the
 * feature on. Hidden when the backend has no recognition service.
 */
export const MyPhotosAlbumCard = ({ width, side }: Props) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const status = useFaceStatus();
  const data = status.data;
  const ready = !!data?.enabled && data.references > 0;
  const album = useMyPhotos(ready);

  if (!data?.available) return null;

  const cover = ready ? album.photos[0]?.thumbnail_url : null;
  const subtitle = !ready
    ? t("photos.faces.pinned.off")
    : data.matching && data.photo_count === 0
      ? t("photos.faces.pinned.searching")
      : t("photos.photoCount", { count: data.photo_count });
  const title = t("photos.faces.title");

  return (
    <View style={{ paddingHorizontal: side, marginBottom: 20 }}>
      <View className="flex-row items-center gap-1.5 pb-3 pt-1">
        <Pin size={16} color={theme.muted} />
        <Text color="muted" variant="sm">
          {t("photos.faces.pinned.label")}
        </Text>
      </View>
      <Pressable
        onPress={() => router.push(paths.myPhotos)}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${subtitle}`}
        style={({ pressed }) => ({ width, opacity: pressed ? 0.85 : 1 })}
      >
        <View
          style={{
            width,
            height: width,
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: theme.card,
            borderWidth: 1.5,
            borderColor: theme.primary,
          }}
        >
          {cover ? (
            <ExpoImage
              source={{ uri: cover }}
              style={{ width, height: width }}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={160}
              accessible={false}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <ScanFace size={width / 4} color={theme.primary} />
            </View>
          )}
        </View>
        <View className="pt-2 gap-0.5" style={{ width, overflow: "hidden" }}>
          <Text variant="lg" numberOfLines={1}>
            {title}
          </Text>
          <Text color="muted" variant="sm" numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};
