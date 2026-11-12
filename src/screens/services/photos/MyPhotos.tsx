import { useRouter } from "expo-router";
import { ScanFace, Settings } from "lucide-react-native";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import { Button, IconButton } from "@/components/common/Button";
import { Dialog, DialogContent } from "@/components/common/Dialog";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { getIsRefetching } from "@/components/query";
import { useTheme } from "@/contexts/ThemeContext";
import type { Photo } from "@/dto";
import {
  useFaceStatus,
  useMyPhotos,
  useRejectMyPhoto,
} from "@/hooks/services/photos/useFaces";
import {
  usePhotoSelection,
  useSelectionMode,
} from "@/hooks/services/photos/usePhotoSelection";
import { paths } from "@/navigation/paths";
import { PhotoGrid } from "./components/PhotoGrid";
import { PhotoSelectionBar } from "./components/PhotoSelectionBar";

/** The photos where face recognition found the user. Without consent or selfie, it leads to the settings. */
export const MyPhotos = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const status = useFaceStatus();
  const ready = !!status.data?.enabled && status.data.references > 0;
  const query = useMyPhotos(ready);
  const reject = useRejectMyPhoto();
  const { store, onLimit } = usePhotoSelection();
  const selecting = useSelectionMode(store);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  // The photo waiting for the "not me" confirmation.
  const [notMe, setNotMe] = useState<Photo | null>(null);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([status.refetch(), ready && query.refresh()]);
    } finally {
      setRefreshing(false);
    }
  }, [status, query, ready]);

  const loadMore = useCallback(() => {
    if (
      query.hasNextPage &&
      !query.isFetchingNextPage &&
      !query.isFetchNextPageError
    ) {
      query.fetchNextPage();
    }
  }, [query]);

  const onNotMe = useCallback((photo: Photo) => setNotMe(photo), []);
  const confirmNotMe = () => {
    if (!notMe) return;
    reject.mutate(notMe.id, {
      onSuccess: () => toast(t("photos.faces.notMe.done"), "success"),
      onError: () => toast(t("photos.faces.errors.generic"), "destructive"),
    });
  };

  const title = t("photos.faces.title");
  const settingsButton = (
    <IconButton
      icon={<Settings size={20} color={theme.text} />}
      variant="link"
      accessibilityLabel={t("photos.faces.manage")}
      onPress={() => router.push(paths.faceRecognition)}
    />
  );

  if (status.isError || (query.isError && query.photos.length === 0)) {
    return (
      <ErrorPage
        error={status.error ?? query.error}
        title={title}
        refetch={refresh}
        isRefetching={getIsRefetching(query.isFetching, query.isPending)}
        refreshing={refreshing}
      />
    );
  }

  if (!status.data) {
    return (
      <Page title={title}>
        <ActivityIndicator />
      </Page>
    );
  }

  if (!ready) {
    return (
      <Page title={title}>
        <Empty
          icon={<ScanFace />}
          title={t("photos.faces.onboarding.title")}
          description={t("photos.faces.onboarding.description")}
        >
          <Button
            label={t("photos.faces.onboarding.cta")}
            onPress={() => router.push(paths.faceRecognition)}
          />
        </Empty>
      </Page>
    );
  }

  return (
    <View className="flex-1">
      <Page
        title={title}
        className="gap-0 px-0"
        onRefresh={refresh}
        refreshing={refreshing}
        header={settingsButton}
        onBack={selecting ? () => store.clear() : undefined}
        asChildren
      >
        <PhotoGrid
          selection={store}
          onSelectionLimit={onLimit}
          photos={query.photos}
          grouping="event"
          hasMore={query.hasNextPage}
          loading={query.isPending}
          fetchingMore={query.isFetchingNextPage}
          loadMoreFailed={query.isFetchNextPageError}
          onLoadMore={loadMore}
          onRetryMore={() => query.fetchNextPage()}
          onNotMe={onNotMe}
          empty={
            <Empty
              icon={<ScanFace />}
              title={t("photos.faces.empty")}
              description={
                status.data.matching
                  ? t("photos.faces.status.matching")
                  : t("photos.faces.emptyHint")
              }
            />
          }
        />
      </Page>
      <PhotoSelectionBar store={store} />
      <Dialog
        open={notMe !== null}
        onOpenChange={(open) => !open && setNotMe(null)}
      >
        <DialogContent
          title={t("photos.faces.notMe.confirmTitle")}
          cancelLabel={t("photos.faces.delete.cancel")}
          confirmLabel={t("photos.faces.notMe.action")}
          onConfirm={confirmNotMe}
        >
          <Text>{t("photos.faces.notMe.confirmMessage")}</Text>
        </DialogContent>
      </Dialog>
    </View>
  );
};

export default MyPhotos;
