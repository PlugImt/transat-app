import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  Check,
  Download,
  EllipsisVertical,
  ExternalLink,
  Flag,
  Info,
  Share as ShareIcon,
  TriangleAlert,
  X,
} from "lucide-react-native";
import {
  type ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
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
import { Button, IconButton } from "@/components/common/Button";
import { Dialog, DialogContent } from "@/components/common/Dialog";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import type { Photo } from "@/dto";
import { useDate } from "@/hooks/common";
import { usePhotoDetail } from "@/hooks/services/photos/usePhotos";
import {
  type SaveError,
  useSavePhoto,
} from "@/hooks/services/photos/useSavePhoto";
import { hapticFeedback } from "@/utils/haptics.utils";
import { shareLink } from "@/utils/photo.utils";
import { PhotoInfoPanel } from "./PhotoInfoPanel";
import { ReportPhotoDialog } from "./ReportPhotoDialog";
import { ZoomableImage } from "./ZoomableImage";

const HI_RES_SIZE = 2048;
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
  const { theme } = useTheme();
  const { formatDate } = useDate();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [notice, setNotice] = useState<"openFailed" | "shareFailed" | null>(
    null,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [everZoomed, setEverZoomed] = useState<Record<string, boolean>>({});

  const backdrop = useSharedValue(1);
  const chrome = useSharedValue(1);
  const listRef = useRef<FlatList<Photo>>(null);

  const photo = photos[index];
  const { status, progress, save, reset } = useSavePhoto();

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

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));
  const chromeStyle = useAnimatedStyle(() => ({
    opacity: chrome.value * backdrop.value,
  }));

  const openInDrive = () => {
    if (!photo) return;
    setNotice(null);
    Linking.openURL(photo.drive_url).catch(() => setNotice("openFailed"));
  };

  const handleShare = () => {
    if (!photo) return;
    setNotice(null);
    shareLink(
      photo.album_title ?? formatDate(new Date(photo.sort_at), "PPP"),
      photo.drive_url,
    ).catch(() => setNotice("shareFailed"));
  };

  const handleSave = () => {
    if (!photo || status === "saving") return;
    hapticFeedback.light();
    save(photo.id);
  };

  if (!photo) return null;

  // The event leads when there is one; without it the date stands alone, nothing is invented.
  const dateLabel = formatDate(new Date(photo.sort_at), "PPP");
  const headline = photo.album_title ?? dateLabel;
  const subtitle = photo.album_title ? dateLabel : null;
  const banner = notice ?? status;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
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
          {menuOpen && (
            <Pressable
              style={StyleSheet.absoluteFill}
              accessibilityLabel={t("photos.viewer.close")}
              onPress={() => setMenuOpen(false)}
            />
          )}
          <LinearGradient
            colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0)"]}
            pointerEvents="box-none"
            style={{
              paddingTop: insets.top + 8,
              paddingBottom: 28,
              paddingHorizontal: 16,
            }}
          >
            <View
              className="flex-row items-start gap-3"
              pointerEvents="box-none"
            >
              <IconButton
                icon={<X size={24} color="#fff" />}
                variant="link"
                accessibilityLabel={t("photos.viewer.close")}
                onPress={onClose}
              />
              <View
                className="flex-1 items-center justify-center"
                style={{ minHeight: 40 }}
                pointerEvents="none"
              >
                <Text
                  variant="lg"
                  numberOfLines={2}
                  accessibilityRole="header"
                  style={[styles.headerText, { color: "#fff" }]}
                >
                  {headline}
                </Text>
                {subtitle && (
                  <Text
                    variant="sm"
                    numberOfLines={1}
                    style={[
                      styles.headerText,
                      { color: "rgba(255,255,255,0.85)" },
                    ]}
                  >
                    {subtitle}
                  </Text>
                )}
              </View>
              {/* Same width as the close button so the title stays centred. */}
              <IconButton
                icon={<EllipsisVertical size={24} color="#fff" />}
                variant="link"
                accessibilityLabel={t("photos.viewer.more")}
                onPress={() => setMenuOpen((open) => !open)}
              />
            </View>
          </LinearGradient>

          {menuOpen && (
            <View
              className="absolute right-4 overflow-hidden rounded-xl border-[1.5px]"
              style={{
                top: insets.top + 56,
                backgroundColor: theme.card,
                borderColor: theme.border,
              }}
            >
              <MenuItem
                icon={<Info size={18} color={theme.text} />}
                label={t("photos.viewer.info")}
                onPress={() => {
                  setMenuOpen(false);
                  setInfoOpen(true);
                }}
              />
              <MenuItem
                icon={<ExternalLink size={18} color={theme.text} />}
                label={t("photos.viewer.openInDrive")}
                onPress={() => {
                  setMenuOpen(false);
                  openInDrive();
                }}
              />
              <MenuItem
                icon={<Flag size={18} color={theme.text} />}
                label={t("photos.viewer.report.action")}
                onPress={() => {
                  setMenuOpen(false);
                  setReportOpen(true);
                }}
              />
            </View>
          )}

          <View className="flex-1" pointerEvents="box-none" />

          {banner !== "idle" && banner !== "saving" && (
            <Banner
              kind={banner}
              onOpenDrive={openInDrive}
              onDismiss={() => {
                setNotice(null);
                reset();
              }}
              top={insets.top + 96}
            />
          )}

          <View
            className="flex-row items-center gap-3 self-center overflow-hidden rounded-2xl px-3 py-3"
            style={{
              marginBottom: insets.bottom + 16,
              width: Math.min(width - 32, 420),
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <Button
              variant="ghost"
              label={t("photos.selection.download")}
              icon={<Download />}
              isUpdating={status === "saving"}
              progress={progress}
              accessibilityLabel={t("photos.viewer.save")}
              onPress={handleSave}
              className="flex-1"
            />
            <IconButton
              icon={<ShareIcon />}
              variant="ghost"
              accessibilityLabel={t("photos.viewer.share")}
              onPress={handleShare}
            />
          </View>
        </Animated.View>

        <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
          <DialogContent
            title={t("photos.viewer.info")}
            cancelLabel={t("photos.viewer.close")}
            contentMaxHeight={420}
            scrollable
          >
            <PhotoInfoPanel
              photoId={photo.id}
              onOpenAlbum={
                onOpenAlbum
                  ? (id, albumTitle) => {
                      onClose();
                      onOpenAlbum(id, albumTitle);
                    }
                  : undefined
              }
              onError={() => setNotice("openFailed")}
            />
          </DialogContent>
        </Dialog>
        <ReportPhotoDialog
          photoId={photo.id}
          open={reportOpen}
          onOpenChange={setReportOpen}
        />
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Legible over bright photos as well as dark ones.
  headerText: {
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

type BannerKind = "saved" | "openFailed" | "shareFailed" | SaveError;

const MenuItem = ({
  icon,
  label,
  onPress,
}: {
  icon: ReactElement;
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="menuitem"
    className="min-w-[200px] flex-row items-center gap-3 px-4 py-3"
  >
    {icon}
    <Text>{label}</Text>
  </Pressable>
);

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
