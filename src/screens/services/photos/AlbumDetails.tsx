import { type RouteProp, useRoute } from "expo-router/react-navigation";
import { ExternalLink, Images } from "lucide-react-native";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { getIsRefetching } from "@/components/query";
import { useDate } from "@/hooks/common";
import {
  useAlbumPhotos,
  usePhotoAlbum,
} from "@/hooks/services/photos/usePhotos";
import type { BottomTabParamList } from "@/types";
import { PhotoGrid } from "./components/PhotoGrid";
import { parseEventDate, spansSeveralDays } from "./photos.utils";

export const AlbumDetails = () => {
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<BottomTabParamList, "AlbumDetails">>();
  const { id, title } = params;

  const album = usePhotoAlbum(id);
  const query = useAlbumPhotos(id);
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

  return (
    <Page
      title={title}
      className="gap-0 px-0"
      onRefresh={refresh}
      refreshing={refreshing}
      asChildren
    >
      <PhotoGrid
        photos={query.photos}
        // Single-day events need no day header; multi-day ones (festivals, tournaments) get one per day.
        groupByDay={
          data
            ? spansSeveralDays(data.first_taken_at, data.last_taken_at)
            : false
        }
        header={
          data ? (
            <AlbumHeader
              eventDate={data.event_date}
              firstTakenAt={data.first_taken_at}
              category={data.category}
              count={data.photo_count}
              driveUrl={data.drive_url}
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
  );
};

export default AlbumDetails;

type AlbumHeaderProps = {
  eventDate: string | null;
  firstTakenAt: string | null;
  category: string;
  count: number;
  driveUrl: string;
};

const AlbumHeader = ({
  eventDate,
  firstTakenAt,
  category,
  count,
  driveUrl,
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
    <View className="gap-3 px-4 pb-4 pt-1">
      <View className="gap-0.5">
        <Text color="muted">{dateLabel}</Text>
        <Text color="muted">
          {[category || null, t("photos.photoCount", { count })]
            .filter(Boolean)
            .join(" · ")}
        </Text>
      </View>
      {/* Always the event's own folder (never "Sports", "Autres" or the school year). */}
      <Button
        variant="secondary"
        label={t("photos.openFolderInDrive")}
        icon={<ExternalLink size={16} color="#000" />}
        onPress={() =>
          Linking.openURL(driveUrl).catch(() =>
            Alert.alert(t("photos.openFailed")),
          )
        }
      />
    </View>
  );
};
