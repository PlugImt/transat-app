import { useRouter } from "expo-router";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/common/Tabs";
import { Text } from "@/components/common/Text";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { getIsRefetching } from "@/components/query";
import { useTheme } from "@/contexts/ThemeContext";
import type { PhotoAlbum } from "@/dto";
import { usePhotoSelection } from "@/hooks/services/photos/usePhotoSelection";
import { usePhotoAlbums, usePhotos } from "@/hooks/services/photos/usePhotos";
import { paths } from "@/navigation/paths";
import { AlbumCard } from "./components/AlbumCard";
import { PhotoGrid } from "./components/PhotoGrid";
import { PhotoLayoutMenu } from "./components/PhotoLayoutMenu";
import { PhotoSelectionBar } from "./components/PhotoSelectionBar";
import {
  type AlbumListRow,
  albumColumnsFor,
  buildAlbumRows,
} from "./photos.utils";

type PhotosTab = "gallery" | "albums";

export const Photos = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<PhotosTab>("gallery");
  const [albumsOpened, setAlbumsOpened] = useState(false);

  const switchTab = (next: string) => {
    if (next === "albums") setAlbumsOpened(true);
    setTab(next as PhotosTab);
  };
  // Same Tabs as the reservation screens; the page padding is 0 here, so the list gets the default px-5.
  const switcher = (
    <Tabs value={tab} onValueChange={switchTab}>
      <TabsList className="grid grid-cols-2 w-full px-5 pb-4">
        <TabsTrigger value="gallery" title={t("photos.tabs.gallery")} />
        <TabsTrigger value="albums" title={t("photos.tabs.albums")} />
      </TabsList>
    </Tabs>
  );

  // Both views stay mounted once opened: switching back keeps the scroll position and the loaded pages.
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, display: tab === "gallery" ? "flex" : "none" }}>
        <PhotoGallery header={switcher} active={tab === "gallery"} />
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

const PhotoGallery = ({
  header,
  active,
}: {
  header: React.ReactElement;
  active: boolean;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { store, onLimit } = usePhotoSelection();
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
    <View style={{ flex: 1 }}>
      <Page
        title={t("photos.title")}
        className="gap-0 px-0"
        onRefresh={onRefresh}
        refreshing={refreshing}
        header={<PhotoLayoutMenu />}
        asChildren
      >
        <PhotoGrid
          selection={store}
          onSelectionLimit={onLimit}
          photos={query.photos}
          grouping="event"
          header={header}
          hasMore={query.hasNextPage}
          loading={query.isPending}
          fetchingMore={query.isFetchingNextPage}
          loadMoreFailed={query.isFetchNextPageError}
          onLoadMore={loadMore}
          onRetryMore={() => query.fetchNextPage()}
          onOpenAlbum={(id, title) => router.navigate(paths.album(id, title))}
          empty={<Empty icon={<Images />} title={t("photos.empty")} />}
        />
      </Page>
      <PhotoSelectionBar store={store} active={active} />
    </View>
  );
};

const GAP = 12;
const SIDE = 16;

const PhotoAlbums = ({ header }: { header: React.ReactElement }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const query = usePhotoAlbums();
  const { refreshing, onRefresh } = useRefresh(query.refresh);

  const perRow = albumColumnsFor(width);
  const cardWidth = Math.floor(
    (width - SIDE * 2 - GAP * (perRow - 1)) / perRow,
  );
  const rows = buildAlbumRows(query.albums, perRow);

  const openAlbum = useCallback(
    (album: PhotoAlbum) => router.navigate(paths.album(album.id, album.title)),
    [router],
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
