import { useNavigation } from "expo-router/react-navigation";
import { Images } from "lucide-react-native";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  useWindowDimensions,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { Text } from "@/components/common/Text";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { getIsRefetching } from "@/components/query";
import { useTheme } from "@/contexts/ThemeContext";
import type { PhotoAlbum } from "@/dto";
import { usePhotoAlbums, usePhotos } from "@/hooks/services/photos/usePhotos";
import type { AppNavigation } from "@/types";
import { AlbumCard } from "./components/AlbumCard";
import { PhotoGrid } from "./components/PhotoGrid";
import {
  type PhotosTab,
  PhotosTabSwitcher,
} from "./components/PhotosTabSwitcher";
import {
  type AlbumListRow,
  albumColumnsFor,
  buildAlbumRows,
} from "./photos.utils";

export const Photos = () => {
  const [tab, setTab] = useState<PhotosTab>("gallery");
  const [albumsOpened, setAlbumsOpened] = useState(false);

  const switchTab = (next: PhotosTab) => {
    if (next === "albums") setAlbumsOpened(true);
    setTab(next);
  };
  const switcher = <PhotosTabSwitcher value={tab} onChange={switchTab} />;

  // Both views stay mounted once opened: switching back keeps the scroll position and the loaded pages.
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, display: tab === "gallery" ? "flex" : "none" }}>
        <PhotoGallery header={switcher} />
      </View>
      {albumsOpened && (
        <View style={{ flex: 1, display: tab === "albums" ? "flex" : "none" }}>
          <PhotoAlbums header={switcher} />
        </View>
      )}
    </View>
  );
};

export default Photos;

/** Pull-to-refresh that restarts at page one instead of replaying every page already loaded. */
const useRefresh = (refresh: () => Promise<unknown>) => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);
  return { refreshing, onRefresh };
};

const PhotoGallery = ({ header }: { header: React.ReactElement }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppNavigation>();
  const query = usePhotos();
  const { refreshing, onRefresh } = useRefresh(query.refresh);

  const loadMore = useCallback(() => {
    if (
      query.hasNextPage &&
      !query.isFetchingNextPage &&
      !query.isFetchNextPageError
    ) {
      query.fetchNextPage();
    }
  }, [query]);

  if (query.isError && query.photos.length === 0) {
    return (
      <ErrorPage
        error={query.error}
        title={t("photos.title")}
        refetch={onRefresh}
        isRefetching={getIsRefetching(query.isFetching, query.isPending)}
        refreshing={refreshing}
      />
    );
  }

  return (
    <Page
      title={t("photos.title")}
      className="gap-0 px-0"
      onRefresh={onRefresh}
      refreshing={refreshing}
      asChildren
    >
      <PhotoGrid
        photos={query.photos}
        groupByDay
        header={header}
        loading={query.isPending}
        fetchingMore={query.isFetchingNextPage}
        loadMoreFailed={query.isFetchNextPageError}
        onLoadMore={loadMore}
        onRetryMore={() => query.fetchNextPage()}
        onOpenAlbum={(id, title) =>
          navigation.navigate("AlbumDetails", { id, title })
        }
        empty={<Empty icon={<Images />} title={t("photos.empty")} />}
      />
    </Page>
  );
};

const GAP = 12;
const SIDE = 16;

const PhotoAlbums = ({ header }: { header: React.ReactElement }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const navigation = useNavigation<AppNavigation>();
  const query = usePhotoAlbums();
  const { refreshing, onRefresh } = useRefresh(query.refresh);

  const perRow = albumColumnsFor(width);
  const cardWidth = Math.floor(
    (width - SIDE * 2 - GAP * (perRow - 1)) / perRow,
  );
  const rows = buildAlbumRows(query.albums, perRow);

  const openAlbum = useCallback(
    (album: PhotoAlbum) =>
      navigation.navigate("AlbumDetails", { id: album.id, title: album.title }),
    [navigation],
  );

  if (query.isError && query.albums.length === 0) {
    return (
      <ErrorPage
        error={query.error}
        title={t("photos.title")}
        refetch={onRefresh}
        isRefetching={getIsRefetching(query.isFetching, query.isPending)}
        refreshing={refreshing}
      />
    );
  }

  const renderRow = ({ item }: { item: AlbumListRow<PhotoAlbum> }) =>
    item.type === "year" ? (
      <View className="px-4 pb-3 pt-4" accessibilityRole="header">
        <Text variant="h3">
          {item.year
            ? t("photos.academicYear", { year: item.year })
            : t("photos.otherAlbums")}
        </Text>
      </View>
    ) : (
      <View
        style={{
          flexDirection: "row",
          gap: GAP,
          paddingHorizontal: SIDE,
          marginBottom: 20,
        }}
      >
        {item.albums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            width={cardWidth}
            onPress={openAlbum}
          />
        ))}
      </View>
    );

  return (
    <Page
      title={t("photos.title")}
      className="gap-0 px-0"
      onRefresh={onRefresh}
      refreshing={refreshing}
      asChildren
    >
      <Animated.FlatList
        data={rows}
        keyExtractor={(row) => row.key}
        renderItem={renderRow}
        ListHeaderComponent={header}
        ListEmptyComponent={
          query.isPending ? (
            <ActivityIndicator className="mt-10" color={theme.primary} />
          ) : (
            <Empty icon={<Images />} title={t("photos.emptyAlbums")} />
          )
        }
        ListFooterComponent={
          query.isFetchNextPageError ? (
            <Pressable
              onPress={() => query.fetchNextPage()}
              accessibilityRole="button"
              className="items-center py-6"
            >
              <Text color="muted">{t("photos.loadMoreFailed")}</Text>
            </Pressable>
          ) : query.isFetchingNextPage ? (
            <ActivityIndicator className="my-6" color={theme.primary} />
          ) : null
        }
        onEndReached={() => {
          if (
            query.hasNextPage &&
            !query.isFetchingNextPage &&
            !query.isFetchNextPageError
          ) {
            query.fetchNextPage();
          }
        }}
        onEndReachedThreshold={1.5}
        windowSize={7}
      />
    </Page>
  );
};
