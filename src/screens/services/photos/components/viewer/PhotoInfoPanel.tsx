import {
  Calendar,
  Folder,
  FolderOpen,
  HardDrive,
  Image as ImageIcon,
  Images,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Linking, Pressable, View } from "react-native";
import { Text } from "@/components/common/Text";
import { useDate } from "@/hooks/common";
import { usePhotoDetail } from "@/hooks/services/photos/usePhotos";
import { formatBytes } from "@/utils/photo.utils";

type PhotoInfoPanelProps = {
  photoId: string;
  bottomOffset: number;
  onOpenAlbum?: (id: number, title: string) => void;
  onError: () => void;
};

const MUTED = "#ffffffa6";

export const PhotoInfoPanel = ({
  photoId,
  bottomOffset,
  onOpenAlbum,
  onError,
}: PhotoInfoPanelProps) => {
  const { t } = useTranslation();
  const { formatDate } = useDate();
  const { data, isPending, isError, refetch } = usePhotoDetail(photoId);

  const taken = data?.taken_at ? new Date(data.taken_at) : null;
  const size = data ? formatBytes(data.size_bytes) : "";
  const dimensions =
    data && data.width > 0 && data.height > 0
      ? `${data.width} × ${data.height}`
      : "";
  const album = data?.album ?? null;
  const location = data
    ? [data.album?.title, data.section].filter(Boolean).join(" › ")
    : "";

  const open = (url: string) => {
    Linking.openURL(url).catch(onError);
  };

  return (
    <View
      accessibilityViewIsModal={false}
      className="absolute left-3 right-3 rounded-3xl px-5 py-4 gap-3"
      style={{ bottom: bottomOffset, backgroundColor: "rgba(24,24,24,0.96)" }}
    >
      {isPending && <ActivityIndicator color="#fff" />}
      {isError && (
        <Pressable
          onPress={() => refetch()}
          accessibilityRole="button"
          className="py-2"
        >
          <Text style={{ color: "#fff" }}>{t("photos.viewer.infoError")}</Text>
        </Pressable>
      )}
      {data && (
        <>
          <Row icon={<ImageIcon size={18} color={MUTED} />} text={data.name} />
          {(taken || data.sort_at) && (
            <Row
              icon={<Calendar size={18} color={MUTED} />}
              text={formatDate(
                taken ?? new Date(data.sort_at),
                taken ? "Pp" : "PPP",
              )}
            />
          )}
          {(size || dimensions) && (
            <Row
              icon={<HardDrive size={18} color={MUTED} />}
              text={[dimensions, size].filter(Boolean).join(" · ")}
            />
          )}
          {location !== "" && (
            <Row icon={<Folder size={18} color={MUTED} />} text={location} />
          )}
          <View className="flex-row flex-wrap gap-2 pt-1">
            {album && onOpenAlbum && (
              <PanelButton
                icon={<Images size={16} color="#fff" />}
                label={t("photos.viewer.viewAlbum")}
                onPress={() => onOpenAlbum(album.id, album.title)}
              />
            )}
            {/* The event's root folder, never "Sports" or "Autres". */}
            {album && (
              <PanelButton
                icon={<FolderOpen size={16} color="#fff" />}
                label={t("photos.viewer.openEventFolder")}
                onPress={() => open(album.drive_url)}
              />
            )}
            {data.folder_url !== "" && (
              <PanelButton
                icon={<Folder size={16} color="#fff" />}
                label={t("photos.viewer.openFolder")}
                onPress={() => open(data.folder_url)}
              />
            )}
          </View>
        </>
      )}
    </View>
  );
};

const Row = ({ icon, text }: { icon: React.ReactElement; text: string }) => (
  <View className="flex-row items-center gap-3">
    {icon}
    <Text style={{ color: "#fff", flex: 1 }} numberOfLines={2}>
      {text}
    </Text>
  </View>
);

const PanelButton = ({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactElement;
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    className="flex-row items-center gap-2 rounded-full px-4 py-2"
    style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
  >
    {icon}
    <Text style={{ color: "#fff" }} variant="sm">
      {label}
    </Text>
  </Pressable>
);
