import {
  type ComponentProps,
  memo,
  type ReactElement,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  type FlatList,
  Linking,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
  type ViewToken,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import {
  FLOATING_ACTION_BAR_BOTTOM,
  FLOATING_ACTION_BAR_HEIGHT,
} from "@/components/common/FloatingActionBar";
import { Text } from "@/components/common/Text";
import { HEADER_HEIGHT } from "@/components/page/Header";
import { useTheme } from "@/contexts/ThemeContext";
import type { Photo } from "@/dto";
import { useDate } from "@/hooks/common";
import { useAnimatedHeaderContext } from "@/hooks/common/useAnimatedHeader";
import { usePhotoLayout } from "@/hooks/services/photos/usePhotoLayout";
import {
  type PhotoSelectionStore,
  useSelectionSummary,
} from "@/hooks/services/photos/usePhotoSelection";
import { hapticFeedback } from "@/utils/haptics.utils";
import {
  buildRows,
  columnsFor,
  columnsForLevel,
  EVENT_HEADER_ROW_HEIGHT,
  GRID_GAP,
  type GridRow,
  HEADER_ROW_HEIGHT,
  type PhotoRow,
  sameRow,
  tileSizeFor,
} from "../photos.layout";
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
  /** One header per calendar day, per event within each day (gallery), or none. */
  grouping?: "none" | "day" | "event";
  header?: ReactElement;
  empty?: ReactElement;
  loading?: boolean;
  fetchingMore?: boolean;
  loadMoreFailed?: boolean;
  /** Another page follows: the last row stays provisional until it arrives. */
  hasMore?: boolean;
  onLoadMore: () => void;
  onRetryMore?: () => void;
  onOpenAlbum?: (id: number, title: string) => void;
  /** Multi-selection by long press. Omitted: photos only open. */
  selection?: PhotoSelectionStore;
  /** The selection limit was hit. */
  onSelectionLimit?: () => void;
};

const VIEWABILITY = { itemVisiblePercentThreshold: 1 } as const;
// Pinch ratio (relative to where the last level change happened) that moves one level.
const PINCH_OUT = 1.25;
const PINCH_IN = 0.8;

export const PhotoGrid = ({
  photos,
  grouping = "none",
  header,
  empty,
  loading,
  fetchingMore,
  loadMoreFailed,
  hasMore = false,
  onLoadMore,
  onRetryMore,
  onOpenAlbum,
  selection,
  onSelectionLimit,
  ...listProps
}: PhotoGridProps) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { level, stepLevel } = usePhotoLayout();
  const headerContext = useAnimatedHeaderContext();
  const listRef = useRef<FlatList<GridRow>>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState({ first: 0, last: 8 });
  // Where the rows start in scroll coordinates: below the page header padding and the list header.
  const [rowsStart, setRowsStart] = useState(HEADER_HEIGHT);

  const layout = useMemo(
    () => buildRows(photos, { level, width, grouping, complete: !hasMore }),
    [photos, level, width, grouping, hasMore],
  );

  // Latest values for callbacks that must keep a stable identity (viewability).
  const live = useRef({ layout, rowsStart, topPhotoId: "" });
  live.current.layout = layout;
  live.current.rowsStart = rowsStart;

  const scrollTo = useCallback((offset: number) => {
    listRef.current?.scrollToOffset({
      offset: Math.max(0, offset),
      animated: false,
    });
  }, []);

  // Changing the density or the width re-flows every row: keep the photo that was at the top at the same place.
  const previous = useRef({ layout, rowsStart, level, width });
  useLayoutEffect(() => {
    const before = previous.current;
    previous.current = { layout, rowsStart, level, width };
    if (before.layout === layout) return;
    if (before.level === level && before.width === width) return;
    const anchor = live.current.topPhotoId;
    const oldRow = before.layout.rowOfPhoto.get(anchor);
    const newRow = layout.rowOfPhoto.get(anchor);
    if (oldRow === undefined || newRow === undefined) return;
    const offset = headerContext?.scrollY.value ?? 0;
    const screenY =
      before.rowsStart + before.layout.rows[oldRow].offset - offset;
    const next = rowsStart + layout.rows[newRow].offset - screenY;
    requestAnimationFrame(() => scrollTo(next));
  }, [layout, rowsStart, level, width, headerContext, scrollTo]);

  // Rows on screen download first; the ones rendered around them wait.
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      let first = Number.POSITIVE_INFINITY;
      let last = -1;
      let firstPhotoRow: PhotoRow | null = null;
      for (const v of viewableItems) {
        if (typeof v.index !== "number") continue;
        first = Math.min(first, v.index);
        last = Math.max(last, v.index);
        const row = v.item as GridRow;
        if (
          row.type === "row" &&
          (!firstPhotoRow || row.offset < firstPhotoRow.offset)
        ) {
          firstPhotoRow = row;
        }
      }
      if (last < 0) return;
      setVisible((prev) =>
        prev.first === first && prev.last === last ? prev : { first, last },
      );
      if (!firstPhotoRow) return;
      const top = firstPhotoRow.tiles[0].photo;
      live.current.topPhotoId = top.id;
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

  // Outside selection a tap opens the photo; while selecting it toggles it. Read at tap time so the handler
  // keeps one identity and never re-renders the tiles.
  const handlePress = useCallback(
    (photo: Photo) => {
      if (!selection?.mode) {
        openPhoto(photo);
        return;
      }
      if (photo.media_type !== "image") return;
      if (selection.toggle(photo.id)) hapticFeedback.light();
      else onSelectionLimit?.();
    },
    [selection, openPhoto, onSelectionLimit],
  );

  const handleLongPress = useCallback(
    (photo: Photo) => {
      if (!selection || photo.media_type !== "image") return;
      if (selection.start(photo.id)) hapticFeedback.medium();
      else onSelectionLimit?.();
    },
    [selection, onSelectionLimit],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: GridRow; index: number }) =>
      item.type === "header" ? (
        <DayHeader date={item.date} title={item.title} />
      ) : (
        <PhotoRowView
          row={item}
          priority={
            index >= visible.first && index <= visible.last ? "high" : "low"
          }
          selection={selection}
          onPress={handlePress}
          onLongPress={handleLongPress}
        />
      ),
    [visible, handlePress, handleLongPress, selection],
  );

  // Row heights and offsets are known, so the list can jump anywhere without measuring what lies in between.
  const getItemLayout = useCallback(
    (_: ArrayLike<GridRow> | null | undefined, index: number) => {
      const row = layout.rows[index];
      return { length: row.height, offset: rowsStart + row.offset, index };
    },
    [layout, rowsStart],
  );

  // Pinch out for bigger tiles, pinch in for smaller ones: one level per threshold crossed, never a continuous zoom.
  const pinchBase = useRef(1);
  const pinch = useMemo(
    () =>
      Gesture.Pinch()
        .runOnJS(true)
        .onStart(() => {
          pinchBase.current = 1;
        })
        .onUpdate((e) => {
          const ratio = e.scale / pinchBase.current;
          const direction = ratio >= PINCH_OUT ? 1 : ratio <= PINCH_IN ? -1 : 0;
          if (direction === 0) return;
          if (stepLevel(direction)) hapticFeedback.light();
          pinchBase.current = e.scale;
        }),
    [stepLevel],
  );

  const pageFooter = loadMoreFailed ? (
    <Pressable
      onPress={onRetryMore ?? onLoadMore}
      accessibilityRole="button"
      className="items-center py-6"
    >
      <Text color="muted">{t("photos.loadMoreFailed")}</Text>
    </Pressable>
  ) : hasMore || fetchingMore ? (
    // Photos exist beyond the loaded ones: grey tiles, not animated, until they arrive.
    <GridSkeleton width={width} level={level} rows={4} />
  ) : null;

  const footer = (
    <>
      {pageFooter}
      {selection && <SelectionSpacer store={selection} />}
    </>
  );

  const listHeader = useMemo(
    () =>
      header ? (
        <View
          onLayout={(e) => {
            const { y, height } = e.nativeEvent.layout;
            setRowsStart(y + height);
          }}
        >
          {header}
        </View>
      ) : null,
    [header],
  );

  const columns = columnsForLevel(level, width);

  return (
    <>
      <GestureDetector gesture={pinch}>
        <View style={{ flex: 1 }}>
          <Animated.FlatList
            {...listProps}
            ref={listRef as never}
            data={layout.rows}
            keyExtractor={(row) => row.key}
            renderItem={renderItem}
            getItemLayout={getItemLayout}
            ListHeaderComponent={listHeader}
            ListEmptyComponent={
              loading ? <GridSkeleton width={width} level={level} /> : empty
            }
            ListFooterComponent={footer}
            onEndReached={onLoadMore}
            onEndReachedThreshold={2}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={VIEWABILITY}
            // Only rows around the screen exist: tens of thousands of photos stay light.
            initialNumToRender={
              level === "mosaic" ? 8 : Math.ceil(12 / columns) + 4
            }
            maxToRenderPerBatch={6}
            windowSize={7}
            updateCellsBatchingPeriod={40}
            removeClippedSubviews={Platform.OS === "android"}
          />
        </View>
      </GestureDetector>
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
    priority,
    selection,
    onPress,
    onLongPress,
  }: {
    row: PhotoRow;
    priority: "high" | "low";
    selection?: PhotoSelectionStore;
    onPress: (photo: Photo) => void;
    onLongPress: (photo: Photo) => void;
  }) => {
    const { t } = useTranslation();
    const { formatDate } = useDate();
    return (
      <View style={{ height: row.height }}>
        {row.tiles.map((tile) => (
          <View
            key={tile.photo.id}
            style={{ position: "absolute", left: tile.x, top: tile.y }}
          >
            <PhotoTile
              photo={tile.photo}
              width={tile.width}
              height={tile.height}
              priority={priority}
              onPress={onPress}
              onLongPress={onLongPress}
              selection={selection}
              label={t(
                tile.photo.media_type === "video"
                  ? "photos.a11y.video"
                  : "photos.a11y.photo",
                { date: formatDate(new Date(tile.photo.sort_at), "PPP") },
              )}
            />
          </View>
        ))}
      </View>
    );
  },
  // Rows are rebuilt on every page; compare what actually shows.
  (a, b) =>
    sameRow(a.row, b.row) &&
    a.priority === b.priority &&
    a.selection === b.selection &&
    a.onPress === b.onPress &&
    a.onLongPress === b.onLongPress,
);
PhotoRowView.displayName = "PhotoRowView";

const DayHeader = memo(
  ({ date, title }: { date: Date; title: string | null }) => {
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

    const dateLabel = label.charAt(0).toUpperCase() + label.slice(1);

    return (
      // Fixed height: the layout computes row offsets in advance.
      <View
        className="px-4"
        style={{
          height: title ? EVENT_HEADER_ROW_HEIGHT : HEADER_ROW_HEIGHT,
          justifyContent: "flex-end",
          paddingBottom: 8,
        }}
        accessible
        accessibilityRole="header"
        accessibilityLabel={title ? `${title}, ${dateLabel}` : dateLabel}
      >
        {title ? (
          <>
            <Text variant="lg" numberOfLines={1}>
              {title}
            </Text>
            <Text variant="sm" color="muted" numberOfLines={1}>
              {dateLabel}
            </Text>
          </>
        ) : (
          <Text variant="lg" numberOfLines={1}>
            {dateLabel}
          </Text>
        )}
      </View>
    );
  },
);
DayHeader.displayName = "DayHeader";

/** Grey tiles in the geometry of the current level, so the real photos replace them without layout shift. */
const GridSkeleton = ({
  width,
  level,
  rows = 6,
}: {
  width: number;
  level: Parameters<typeof columnsForLevel>[0];
  rows?: number;
}) => {
  const { theme } = useTheme();
  // The mosaic has no regular geometry: it starts from the standard grid.
  const columns =
    level === "mosaic" ? columnsFor(width) : columnsForLevel(level, width);
  const tile = tileSizeFor(width, columns);
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

/** Room under the last photos for the floating bar while selecting, so the bar never hides them. */
const SelectionSpacer = ({ store }: { store: PhotoSelectionStore }) => {
  const { mode } = useSelectionSummary(store);
  if (!mode) return null;
  return (
    <View
      style={{
        height: FLOATING_ACTION_BAR_HEIGHT + FLOATING_ACTION_BAR_BOTTOM + 16,
      }}
    />
  );
};
