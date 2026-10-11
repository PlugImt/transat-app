import {
  type ComponentProps,
  memo,
  type ReactElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
  type ViewToken,
} from "react-native";
import Animated from "react-native-reanimated";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type { Photo } from "@/dto";
import { useDate } from "@/hooks/common";
import {
  buildRows,
  columnsFor,
  GRID_GAP,
  type GridRow,
  type PhotoRow,
  tileSizeFor,
} from "../photos.utils";
import { PhotoTile } from "./PhotoTile";
import { PhotoViewer } from "./viewer/PhotoViewer";

type PhotoGridProps = Omit<
  ComponentProps<typeof Animated.FlatList<GridRow>>,
  | "data"
  | "renderItem"
  | "keyExtractor"
  | "getItemLayout"
  | "numColumns"
  | "onEndReached"
> & {
  photos: Photo[];
  /** One header per calendar day (gallery, multi-day albums). */
  groupByDay?: boolean;
  header?: ReactElement;
  empty?: ReactElement;
  loading?: boolean;
  fetchingMore?: boolean;
  loadMoreFailed?: boolean;
  onLoadMore: () => void;
  onRetryMore?: () => void;
  onOpenAlbum?: (id: number, title: string) => void;
};

const VIEWABILITY = { itemVisiblePercentThreshold: 1 } as const;

export const PhotoGrid = ({
  photos,
  groupByDay = false,
  header,
  empty,
  loading,
  fetchingMore,
  loadMoreFailed,
  onLoadMore,
  onRetryMore,
  onOpenAlbum,
  ...listProps
}: PhotoGridProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState({ first: 0, last: 8 });

  const columns = columnsFor(width);
  const tile = tileSizeFor(width, columns);
  const layout = useMemo(
    () => buildRows(photos, columns, tile, groupByDay),
    [photos, columns, tile, groupByDay],
  );

  // Rows on screen download first; the ones rendered around them wait.
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const indexes = viewableItems
        .map((v) => v.index)
        .filter((i): i is number => typeof i === "number");
      if (indexes.length === 0) return;
      const first = Math.min(...indexes);
      const last = Math.max(...indexes);
      setVisible((prev) =>
        prev.first === first && prev.last === last ? prev : { first, last },
      );
    },
  ).current;

  const closeViewer = useCallback(() => setViewerIndex(null), []);

  const openPhoto = useCallback(
    (photo: Photo) => {
      if (photo.media_type === "video") {
        // Videos are never played in the app: Google Drive opens them.
        Linking.openURL(photo.drive_url).catch(() =>
          Alert.alert(t("photos.openFailed")),
        );
        return;
      }
      const index = layout.imageIndex.get(photo.id);
      if (index !== undefined) setViewerIndex(index);
    },
    [layout.imageIndex, t],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: GridRow; index: number }) =>
      item.type === "header" ? (
        <DayHeader date={item.date} />
      ) : (
        <PhotoRowView
          row={item}
          tile={tile}
          priority={
            index >= visible.first && index <= visible.last ? "high" : "low"
          }
          onPress={openPhoto}
        />
      ),
    [tile, visible, openPhoto],
  );

  const footer = loadMoreFailed ? (
    <Pressable
      onPress={onRetryMore ?? onLoadMore}
      accessibilityRole="button"
      className="items-center py-6"
    >
      <Text color="muted">{t("photos.loadMoreFailed")}</Text>
    </Pressable>
  ) : fetchingMore ? (
    <ActivityIndicator className="my-6" color={theme.primary} />
  ) : null;

  return (
    <>
      <Animated.FlatList
        {...listProps}
        data={layout.rows}
        keyExtractor={(row) => row.key}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ListEmptyComponent={
          loading ? <GridSkeleton tile={tile} columns={columns} /> : empty
        }
        ListFooterComponent={footer}
        onEndReached={onLoadMore}
        onEndReachedThreshold={2}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY}
        // Only rows around the screen exist: tens of thousands of photos stay light.
        initialNumToRender={Math.ceil(12 / columns) + 4}
        maxToRenderPerBatch={6}
        windowSize={7}
        updateCellsBatchingPeriod={40}
        removeClippedSubviews={Platform.OS === "android"}
      />
      {viewerIndex !== null && (
        <PhotoViewer
          photos={layout.images}
          startIndex={viewerIndex}
          onClose={closeViewer}
          onEndReached={onLoadMore}
          onOpenAlbum={onOpenAlbum}
        />
      )}
    </>
  );
};

const PhotoRowView = memo(
  ({
    row,
    tile,
    priority,
    onPress,
  }: {
    row: PhotoRow;
    tile: number;
    priority: "high" | "low";
    onPress: (photo: Photo) => void;
  }) => {
    const { t } = useTranslation();
    const { formatDate } = useDate();
    return (
      <View
        style={{ flexDirection: "row", gap: GRID_GAP, marginBottom: GRID_GAP }}
      >
        {row.photos.map((photo) => (
          <PhotoTile
            key={photo.id}
            photo={photo}
            size={tile}
            priority={priority}
            onPress={onPress}
            label={t(
              photo.media_type === "video"
                ? "photos.a11y.video"
                : "photos.a11y.photo",
              { date: formatDate(new Date(photo.sort_at), "PPP") },
            )}
          />
        ))}
      </View>
    );
  },
  // Rows are rebuilt on every page; compare what actually shows.
  (a, b) =>
    a.row.key === b.row.key &&
    a.row.photos.length === b.row.photos.length &&
    a.tile === b.tile &&
    a.priority === b.priority &&
    a.onPress === b.onPress,
);
PhotoRowView.displayName = "PhotoRowView";

const DayHeader = memo(({ date }: { date: Date }) => {
  const { t } = useTranslation();
  const { formatDate } = useDate();

  const now = new Date();
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );

  const label = sameDay(date, now)
    ? t("photos.today")
    : sameDay(date, yesterday)
      ? t("photos.yesterday")
      : formatDate(
          date,
          date.getFullYear() === now.getFullYear()
            ? "EEEE d MMMM"
            : "d MMMM yyyy",
        );

  return (
    <View className="px-4 pb-2 pt-5" accessibilityRole="header">
      <Text variant="lg">{label.charAt(0).toUpperCase() + label.slice(1)}</Text>
    </View>
  );
});
DayHeader.displayName = "DayHeader";

/** Grey tiles in the exact grid geometry, so the real photos replace them without any layout shift. */
const GridSkeleton = ({ tile, columns }: { tile: number; columns: number }) => {
  const { theme } = useTheme();
  const rows = 6;
  return (
    <View accessibilityLabel="Loading" accessibilityRole="progressbar">
      {Array.from({ length: rows }, (_, r) => (
        <View
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows
          key={r}
          style={{
            flexDirection: "row",
            gap: GRID_GAP,
            marginBottom: GRID_GAP,
          }}
        >
          {Array.from({ length: columns }, (_, c) => (
            <View
              // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder tiles
              key={c}
              style={{
                width: tile,
                height: tile,
                backgroundColor: theme.card,
                opacity: 0.6,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
};
