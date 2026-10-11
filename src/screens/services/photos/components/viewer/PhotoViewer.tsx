import { Image as ExpoImage } from "expo-image";
import {
  Check,
  Download,
  ExternalLink,
  Info,
  TriangleAlert,
  X,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/common/Text";
import type { Photo } from "@/dto";
import { useDate } from "@/hooks/common";
import { usePhotoDetail } from "@/hooks/services/photos/usePhotos";
import {
  type SaveError,
  useSavePhoto,
} from "@/hooks/services/photos/useSavePhoto";
import { hapticFeedback } from "@/utils/haptics.utils";
import { PhotoInfoPanel } from "./PhotoInfoPanel";
import { ZoomableImage } from "./ZoomableImage";

const HI_RES_SIZE = 2560;
const NEAR_END = 6;

type PhotoViewerProps = {
  /** Images only, in display order. Videos open in Google Drive from the grid. */
  photos: Photo[];
  startIndex: number;
  onClose: () => void;
  /** Asked when the user nears the end of what is loaded, so paging continues across backend pages. */
  onEndReached?: () => void;
  onOpenAlbum?: (id: number, title: string) => void;
};

export const PhotoViewer = ({
  photos,
  startIndex,
  onClose,
  onEndReached,
  onOpenAlbum,
}: PhotoViewerProps) => {
  const { t } = useTranslation();
  const { formatDate } = useDate();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);
  const [everZoomed, setEverZoomed] = useState<Record<string, boolean>>({});

  const backdrop = useSharedValue(1);
  const chrome = useSharedValue(1);
  const listRef = useRef<FlatList<Photo>>(null);

  const photo = photos[index];
  const { status, save, reset } = useSavePhoto();

  // The sharper rendition is only requested after the user zooms, using the template the backend provides.
  const wantsHiRes = !!photo && !!everZoomed[photo.id];
  const detail = usePhotoDetail(photo?.id, wantsHiRes);
  const hiResUrl = useMemo(
    () =>
      detail.data?.thumbnail_template.replace("{size}", String(HI_RES_SIZE)) ??
      null,
    [detail.data],
  );

  useEffect(() => {
    // Warm only the neighbours' previews: never a run of originals.
    const next = [photos[index - 1], photos[index + 1]]
      .map((p) => p?.preview_url)
      .filter((u): u is string => !!u);
    if (next.length > 0) ExpoImage.prefetch(next, "memory-disk");
    if (onEndReached && index >= photos.length - NEAR_END) onEndReached();
  }, [index, photos, onEndReached]);

  useEffect(() => {
    if (status !== "saved") return;
    const timer = setTimeout(reset, 3500);
    return () => clearTimeout(timer);
  }, [status, reset]);

  const toggleChrome = useCallback(() => {
    setChromeVisible((visible) => {
      chrome.value = withTiming(visible ? 0 : 1, { duration: 180 });
      return !visible;
    });
  }, [chrome]);

  const handleZoomChange = useCallback((id: string, value: boolean) => {
    setZoomed(value);
    if (value) {
      setEverZoomed((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
    }
  }, []);

  const handleClose = useCallback(() => {
    if (infoOpen) {
      setInfoOpen(false);
      return;
    }
    onClose();
  }, [infoOpen, onClose]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));
  const chromeStyle = useAnimatedStyle(() => ({
    opacity: chrome.value * backdrop.value,
  }));

  const openInDrive = () => {
    if (!photo) return;
    setOpenFailed(false);
    Linking.openURL(photo.drive_url).catch(() => setOpenFailed(true));
  };

  const handleSave = () => {
    if (!photo || status === "saving") return;
    hapticFeedback.light();
    save(photo.id);
  };

  if (!photo) return null;

  const title = formatDate(new Date(photo.sort_at), "PPP");
  const banner = openFailed ? "openFailed" : status;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "#000" },
            backdropStyle,
          ]}
        />
        <FlatList
          ref={listRef}
          horizontal
          pagingEnabled
          data={photos}
          extraData={index}
          keyExtractor={(item) => item.id}
          initialScrollIndex={startIndex}
          getItemLayout={(_, i) => ({
            length: width,
            offset: width * i,
            index: i,
          })}
          windowSize={3}
          maxToRenderPerBatch={2}
          initialNumToRender={1}
          scrollEnabled={!zoomed}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const next = Math.round(e.nativeEvent.contentOffset.x / width);
            if (next !== index) {
              setIndex(next);
              setZoomed(false);
              setInfoOpen(false);
              reset();
            }
          }}
          renderItem={({ item, index: i }) => (
            <ZoomableImage
              photoId={item.id}
              width={width}
              height={height}
              thumbnailUrl={item.thumbnail_url}
              previewUrl={item.preview_url}
              fallbackUrl={item.thumbnail_fallback_url}
              hiResUrl={i === index ? hiResUrl : null}
              active={i === index}
              backdrop={backdrop}
              onZoomChange={handleZoomChange}
              onTap={toggleChrome}
              onDismiss={onClose}
            />
          )}
        />

        <Animated.View
          pointerEvents={chromeVisible ? "box-none" : "none"}
          style={[StyleSheet.absoluteFill, chromeStyle]}
        >
          <View
            className="flex-row items-center justify-between px-4"
            style={{ paddingTop: insets.top + 8 }}
          >
            <RoundButton label={t("photos.viewer.close")} onPress={handleClose}>
              <X size={22} color="#fff" />
            </RoundButton>
            <Text
              style={{ color: "#fff" }}
              variant="lg"
              accessibilityRole="header"
            >
              {title}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <View className="flex-1" pointerEvents="box-none" />

          {infoOpen && (
            <PhotoInfoPanel
              photoId={photo.id}
              bottomOffset={insets.bottom + 84}
              onOpenAlbum={
                onOpenAlbum
                  ? (id, albumTitle) => {
                      onClose();
                      onOpenAlbum(id, albumTitle);
                    }
                  : undefined
              }
              onError={() => setOpenFailed(true)}
            />
          )}

          {banner !== "idle" && banner !== "saving" && (
            <Banner
              kind={banner}
              onOpenDrive={openInDrive}
              onDismiss={() => {
                setOpenFailed(false);
                reset();
              }}
              top={insets.top + 64}
            />
          )}

          <View
            className="flex-row items-center justify-around px-6"
            style={{ paddingBottom: insets.bottom + 16, paddingTop: 12 }}
          >
            <ActionButton
              label={t("photos.viewer.save")}
              onPress={handleSave}
              busy={status === "saving"}
              icon={<Download size={22} color="#fff" />}
            />
            <ActionButton
              label={t("photos.viewer.openInDrive")}
              onPress={openInDrive}
              icon={<ExternalLink size={22} color="#fff" />}
            />
            <ActionButton
              label={t("photos.viewer.info")}
              onPress={() => setInfoOpen((open) => !open)}
              active={infoOpen}
              icon={<Info size={22} color="#fff" />}
            />
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const RoundButton = ({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: React.ReactElement;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    hitSlop={8}
    className="h-10 w-10 items-center justify-center rounded-full"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
  >
    {children}
  </Pressable>
);

const ActionButton = ({
  label,
  onPress,
  icon,
  busy,
  active,
}: {
  label: string;
  onPress: () => void;
  icon: React.ReactElement;
  busy?: boolean;
  active?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    disabled={busy}
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ busy, selected: active }}
    className="items-center gap-1 px-3 py-1"
    style={{ opacity: busy ? 0.7 : 1 }}
  >
    <View
      className="h-11 w-11 items-center justify-center rounded-full"
      style={{
        backgroundColor: active
          ? "rgba(255,255,255,0.28)"
          : "rgba(255,255,255,0.14)",
      }}
    >
      {busy ? <ActivityIndicator color="#fff" /> : icon}
    </View>
    <Text style={{ color: "#fff" }} variant="sm">
      {label}
    </Text>
  </Pressable>
);

type BannerKind = "saved" | "openFailed" | SaveError;

const Banner = ({
  kind,
  onOpenDrive,
  onDismiss,
  top,
}: {
  kind: BannerKind | "idle" | "saving";
  onOpenDrive: () => void;
  onDismiss: () => void;
  top: number;
}) => {
  const { t } = useTranslation();
  if (kind === "idle" || kind === "saving") return null;

  const ok = kind === "saved";
  // Errors the user can solve elsewhere get a direct action.
  const action =
    kind === "permissionBlocked"
      ? {
          label: t("photos.viewer.openSettings"),
          run: () => Linking.openSettings(),
        }
      : kind === "unsupported" || kind === "tooLarge" || kind === "incomplete"
        ? { label: t("photos.viewer.openInDrive"), run: onOpenDrive }
        : null;

  return (
    <Pressable
      onPress={onDismiss}
      accessibilityRole="alert"
      className="absolute left-3 right-3 flex-row items-center gap-3 rounded-2xl px-4 py-3"
      style={{
        top,
        backgroundColor: ok ? "rgba(34,120,70,0.96)" : "rgba(120,30,30,0.96)",
      }}
    >
      {ok ? (
        <Check size={18} color="#fff" />
      ) : (
        <TriangleAlert size={18} color="#fff" />
      )}
      <Text style={{ color: "#fff", flex: 1 }} variant="sm">
        {t(`photos.viewer.status.${kind}`)}
      </Text>
      {action && (
        <Pressable onPress={action.run} accessibilityRole="button" hitSlop={8}>
          <Text
            style={{ color: "#fff", textDecorationLine: "underline" }}
            variant="sm"
          >
            {action.label}
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
};
