import { useNavigation } from "expo-router";
import { Download, RotateCw, Settings, X } from "lucide-react-native";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, Linking, View } from "react-native";
import { Button, IconButton } from "@/components/common/Button";
import { FloatingActionBar } from "@/components/common/FloatingActionBar";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import { useBulkSavePhotos } from "@/hooks/services/photos/useBulkSavePhotos";
import {
  type PhotoSelectionStore,
  useSelectionSummary,
} from "@/hooks/services/photos/usePhotoSelection";
import type { SaveError } from "@/hooks/services/photos/useSavePhoto";
import { hapticFeedback } from "@/utils/haptics.utils";

type PhotoSelectionBarProps = {
  store: PhotoSelectionStore;
  /** False while the screen's view is hidden (another tab of the same screen): the selection is dropped. */
  active?: boolean;
};

/** The most frequent cause among failures, which is what the user can act on. */
const dominantReason = (failed: Record<string, SaveError>) => {
  const counts = new Map<SaveError, number>();
  for (const code of Object.values(failed)) {
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
};

export const PhotoSelectionBar = ({
  store,
  active = true,
}: PhotoSelectionBarProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigation = useNavigation();
  const { mode, count } = useSelectionSummary(store);
  const { state, start, cancel, reset } = useBulkSavePhotos();

  const running = state.phase === "running";
  // Failures still in the selection; once the user changes it, the bar goes back to a plain download.
  const stillFailed = Object.fromEntries(
    Object.entries(state.failed).filter(([id]) => store.has(id)),
  );
  const failedCount = Object.keys(stillFailed).length;
  const hasFailures =
    state.phase === "done" && failedCount > 0 && failedCount === count;
  const reason = hasFailures ? dominantReason(stillFailed) : null;

  const exit = useCallback(() => {
    if (running) cancel();
    store.clear();
    reset();
  }, [running, cancel, store, reset]);

  // Leaving the screen or switching view drops the selection; a batch already started keeps going and reports.
  useEffect(() => {
    if (!active) store.clear();
  }, [active, store]);
  useEffect(
    () => navigation.addListener("blur", () => store.clear()),
    [navigation, store],
  );

  // Back leaves selection first, and only then the screen.
  useEffect(() => {
    if (!mode) return;
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        exit();
        return true;
      },
    );
    return () => subscription.remove();
  }, [mode, exit]);

  const download = async () => {
    hapticFeedback.light();
    store.locked = true;
    let outcome: Awaited<ReturnType<typeof start>>;
    try {
      outcome = await start(store.ids());
    } finally {
      store.locked = false;
    }
    if (!outcome) {
      toast(t("photos.selection.busy"), "default");
      return;
    }
    const saved = outcome.saved.length;
    const failed = Object.keys(outcome.failed);

    if (outcome.cancelled) {
      store.clear();
      reset();
      toast(t("photos.selection.cancelled", { count: saved }), "info");
      return;
    }
    if (failed.length === 0) {
      store.clear();
      reset();
      toast(t("photos.selection.saved", { count: saved }), "success");
      hapticFeedback.success();
      return;
    }
    // Saved photos leave the selection; the ones that failed stay, marked, ready to retry.
    store.keepFailed(failed);
    hapticFeedback.error();
    toast(
      saved > 0
        ? t("photos.selection.partial", { saved, failed: failed.length })
        : t("photos.selection.failedAll", { count: failed.length }),
      saved > 0 ? "info" : "destructive",
    );
  };

  if (!mode) return null;

  const blocked = reason === "permissionBlocked";
  const label = running
    ? t("photos.selection.saving", { done: state.done, total: state.total })
    : hasFailures
      ? t("photos.selection.retry")
      : t("photos.selection.downloadCount", { count });

  return (
    <FloatingActionBar>
      <IconButton
        icon={<X />}
        variant="ghost"
        accessibilityLabel={t("photos.selection.close")}
        onPress={exit}
      />

      <View className="flex-1 gap-1">
        {reason && !running && (
          <Text variant="sm" color="muted" numberOfLines={1}>
            {t(`photos.selection.reason.${reason}`)}
          </Text>
        )}
        {blocked ? (
          <Button
            label={t("photos.viewer.openSettings")}
            icon={<Settings size={16} color="#000" />}
            onPress={() => Linking.openSettings()}
          />
        ) : (
          <Button
            label={label}
            isUpdating={running}
            disabled={count === 0}
            icon={
              hasFailures ? (
                <RotateCw size={16} color="#000" />
              ) : (
                <Download size={16} color="#000" />
              )
            }
            accessibilityLiveRegion="polite"
            onPress={download}
          />
        )}
      </View>
    </FloatingActionBar>
  );
};
