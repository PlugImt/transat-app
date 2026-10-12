import {
  Calendar,
  File as FileIcon,
  Folder,
  FolderOpen,
  HardDrive,
  Images,
  Tag,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Linking, View } from "react-native";
import { Button } from "@/components/common/Button";
import { useDialog } from "@/components/common/Dialog";
import InfoItem from "@/components/common/InfoItem";
import { useTheme } from "@/contexts/ThemeContext";
import { useDate } from "@/hooks/common";
import { usePhotoDetail } from "@/hooks/services/photos/usePhotos";
import { formatBytes, isDriveFolderUrl } from "@/utils/photo.utils";

type PhotoInfoPanelProps = {
  photoId: string;
  onOpenAlbum?: (id: number, title: string) => void;
  onError: () => void;
};

/** Content of the viewer's information dialog. Only what the backend actually knows is shown. */
export const PhotoInfoPanel = ({
  photoId,
  onOpenAlbum,
  onError,
}: PhotoInfoPanelProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { formatDate } = useDate();
  const { setOpen } = useDialog();
  const { data, isPending, isError, refetch } = usePhotoDetail(photoId);

  const open = (url: string) => {
    Linking.openURL(url).catch(onError);
  };

  if (isPending) return <ActivityIndicator color={theme.primary} />;
  if (isError || !data) {
    return (
      <Button
        variant="secondary"
        label={t("photos.viewer.infoError")}
        onPress={() => refetch()}
      />
    );
  }

  const icon = (Icon: typeof Calendar) => (
    <Icon size={20} color={theme.muted} />
  );
  const dimensions =
    data.width > 0 && data.height > 0 ? `${data.width} × ${data.height}` : "";
  const size = formatBytes(data.size_bytes);
  const album = data.album;
  const eventFolder = isDriveFolderUrl(album?.drive_url)
    ? album.drive_url
    : null;
  const photoFolder = isDriveFolderUrl(data.folder_url)
    ? data.folder_url
    : null;

  // A capture date only exists with EXIF or a date in the file name; otherwise the date shown is an approximation.
  const when = data.taken_at
    ? {
        label: t("photos.viewer.captured"),
        value:
          formatDate(new Date(data.taken_at), "PPPp") +
          (data.taken_at_source === "filename"
            ? ` · ${t("photos.viewer.fromFileName")}`
            : ""),
      }
    : {
        label: t("photos.viewer.dateApprox"),
        value: formatDate(new Date(data.sort_at), "PPP"),
      };

  const closeThen = (run: () => void) => () => {
    setOpen(false);
    run();
  };

  return (
    <View className="gap-4">
      {album && (
        <InfoItem
          icon={icon(Tag)}
          label={t("photos.viewer.event")}
          value={album.title}
        />
      )}
      <InfoItem icon={icon(Calendar)} label={when.label} value={when.value} />
      <InfoItem
        icon={icon(FileIcon)}
        label={t("photos.viewer.fileName")}
        value={data.name}
      />
      {data.section !== "" && (
        <InfoItem
          icon={icon(Folder)}
          label={t("photos.viewer.folder")}
          value={data.section}
        />
      )}
      {(dimensions || size) && (
        <InfoItem
          icon={icon(HardDrive)}
          label={t("photos.viewer.size")}
          value={[dimensions, size].filter(Boolean).join(" · ")}
        />
      )}

      <View className="gap-2 pt-1">
        {album && onOpenAlbum && (
          <Button
            variant="secondary"
            label={t("photos.viewer.viewAlbum")}
            icon={<Images size={16} color="#000" />}
            onPress={closeThen(() => onOpenAlbum(album.id, album.title))}
          />
        )}
        {/* The event's root folder, never "Sports" or "Autres". */}
        {eventFolder && (
          <Button
            variant="secondary"
            label={t("photos.viewer.openEventFolder")}
            icon={<FolderOpen size={16} color="#000" />}
            onPress={() => open(eventFolder)}
          />
        )}
        {photoFolder && photoFolder !== eventFolder && (
          <Button
            variant="secondary"
            label={t("photos.viewer.openFolder")}
            icon={<Folder size={16} color="#000" />}
            onPress={() => open(photoFolder)}
          />
        )}
      </View>
    </View>
  );
};
