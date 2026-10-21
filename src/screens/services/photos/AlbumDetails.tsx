import { useLocalSearchParams, useRouter } from "expo-router";
import { Images, Share as ShareIcon } from "lucide-react-native";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, View } from "react-native";
import { ApiError } from "@/api/errors";
import { Button, IconButton } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { getIsRefetching } from "@/components/query";
import { useTheme } from "@/contexts/ThemeContext";
import { useDate } from "@/hooks/common";
import {
  usePhotoSelection,
  useSelectionMode,
} from "@/hooks/services/photos/usePhotoSelection";
import {
  useAlbumPhotos,
  usePhotoAlbum,
} from "@/hooks/services/photos/usePhotos";
import { paramNumber, paramString } from "@/navigation/params";
import { paths } from "@/navigation/paths";
import { isDriveFolderUrl, shareLink } from "@/utils/photo.utils";
import { PhotoGrid } from "./components/PhotoGrid";
import { PhotoMenu } from "./components/PhotoMenu";
import { PhotoSelectionBar } from "./components/PhotoSelectionBar";
import { parseEventDate } from "./photos.utils";

export const AlbumDetails = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ id: string; title?: string }>();
  const router = useRouter();
  const id = paramNumber(params.id);
  const titleParam = paramString(params.title);

  const album = usePhotoAlbum(id);
  // The title can be empty (a notification only carries a heading): the album's own name takes over once loaded.
  const title = titleParam || album.data?.title || t("photos.title");
  const query = useAlbumPhotos(id);
  const { store, onLimit } = usePhotoSelection();
  const selecting = useSelectionMode(store);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([query.refresh(), album.refetch()]);
    } finally {
      setRefreshing(false);
    }
  }, [query, album]);

  const loadMore = useCallback(() => {
    if (
      query.hasNextPage &&
      !query.isFetchingNextPage &&
      !query.isFetchNextPageError
    ) {
      query.fetchNextPage();
    }
  }, [query]);

  // Deleted, hidden or not yet published (for instance when opened from an old notification).
  const unavailable = [album.error, query.error].some(
    (error) => ApiError.isApiError(error) && error.status === 404,
  );
  if (unavailable) {
    return (
      <Page title={title}>
        <Empty
          icon={<Images />}
          title={t("photos.albumUnavailable")}
          description={t("photos.albumUnavailableHint")}
        >
          <Button
            variant="secondary"
            label={t("photos.backToPhotos")}
            onPress={() =>
              router.canGoBack() ? router.back() : router.navigate(paths.photos)
            }
          />
        </Empty>
      </Page>
    );
  }

  if ((query.isError && query.photos.length === 0) || album.isError) {
    return (
      <ErrorPage
        error={query.error ?? album.error}
        title={title}
        refetch={refresh}
        isRefetching={getIsRefetching(query.isFetching, query.isPending)}
        refreshing={refreshing}
      />
    );
  }

  const data = album.data;
  // The backend always returns the event's own folder, never the year or "Sports"/"Autres": no usable link, no button.
  const folderUrl = isDriveFolderUrl(data?.drive_url) ? data.drive_url : null;
  const shareAlbum = () => {
    if (!folderUrl) return;
    shareLink(title, folderUrl).catch(() =>
      Alert.alert(t("photos.openFailed")),
    );
  };

  return (
    <View className="flex-1">
      <Page
        title={title}
        className="gap-0 px-0"
        onRefresh={refresh}
        refreshing={refreshing}
        header={
          <View className="flex-row items-center">
            {folderUrl && (
              <IconButton
                icon={<ShareIcon size={20} color={theme.text} />}
                variant="link"
                accessibilityLabel={t("photos.share")}
                onPress={shareAlbum}
              />
            )}
            <PhotoMenu selection={store} />
          </View>
        }
        // Back leaves selection first (the system Back button does the same).
        onBack={selecting ? () => store.clear() : undefined}
        asChildren
      >
        <PhotoGrid
          selection={store}
          onSelectionLimit={onLimit}
          photos={query.photos}
          hasMore={query.hasNextPage}
          header={
            data ? (
              <AlbumHeader
                eventDate={data.event_date}
                firstTakenAt={data.first_taken_at}
                category={data.category}
              />
            ) : undefined
          }
          loading={query.isPending}
          fetchingMore={query.isFetchingNextPage}
          loadMoreFailed={query.isFetchNextPageError}
          onLoadMore={loadMore}
          onRetryMore={() => query.fetchNextPage()}
          empty={<Empty icon={<Images />} title={t("photos.empty")} />}
        />
      </Page>

      <PhotoSelectionBar store={store} />
    </View>
  );
};

export default AlbumDetails;

type AlbumHeaderProps = {
  eventDate: string | null;
  firstTakenAt: string | null;
  category: string;
};

const AlbumHeader = ({
  eventDate,
  firstTakenAt,
  category,
}: AlbumHeaderProps) => {
  const { t } = useTranslation();
  const { formatDate } = useDate();

  const date = parseEventDate(eventDate);
  const dateLabel = date
    ? formatDate(date, "PPPP")
    : firstTakenAt
      ? t("photos.photosFrom", {
          date: formatDate(new Date(firstTakenAt), "PPP"),
        })
      : t("photos.dateUnknown");

  return (
    <View className="gap-0.5 px-4 pb-4 pt-1">
      <Text variant="lg">{dateLabel}</Text>
      {category !== "" && <Text color="muted">{category}</Text>}
    </View>
  );
};
