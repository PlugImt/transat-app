import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  Camera,
  ImagePlus,
  Info,
  ScanFace,
  ShieldCheck,
  Trash,
} from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import { ApiError } from "@/api/errors";
import { Button, IconButton } from "@/components/common/Button";
import Card from "@/components/common/Card";
import { Checkbox } from "@/components/common/Checkbox";
import { Dialog, DialogContent } from "@/components/common/Dialog";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import { Empty } from "@/components/page/Empty";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { ConfirmAction } from "@/components/reservation/ConfirmAction";
import { useTheme } from "@/contexts/ThemeContext";
import type { FaceStatus } from "@/dto";
import {
  useAddFaceReference,
  useDeleteFaceData,
  useFaceStatus,
  useGiveFaceConsent,
} from "@/hooks/services/photos/useFaces";
import { paths } from "@/navigation/paths";

/** Codes returned by POST /faces/references and /faces/consent, each with its own message. */
const KNOWN_ERRORS = [
  "no_face",
  "multiple_faces",
  "face_too_small",
  "too_many_references",
  "consent_outdated",
  "consent_required",
  "rate_limited",
  "unavailable",
] as const;

const useErrorMessage = () => {
  const { t } = useTranslation();
  return (error: unknown) => {
    const code = ApiError.isApiError(error) ? error.code : undefined;
    const known = KNOWN_ERRORS.find((c) => c === code);
    return known
      ? t(`photos.faces.errors.${known}`)
      : t("photos.faces.errors.generic");
  };
};

/**
 * Face recognition settings: explicit consent, reference selfies, progress, and erasing everything.
 * Consent is never pre-checked and the feature does nothing until the user agrees.
 */
export const FaceRecognition = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const status = useFaceStatus();
  const [infoOpen, setInfoOpen] = useState(false);

  if (status.isError) {
    return (
      <ErrorPage
        error={status.error}
        title={t("photos.faces.settingsTitle")}
        refetch={status.refetch}
        isRefetching={status.isRefetching}
      />
    );
  }
  const data = status.data;
  return (
    <Page
      title={t("photos.faces.settingsTitle")}
      header={
        <IconButton
          icon={<Info size={20} color={theme.text} />}
          variant="link"
          accessibilityLabel={t("photos.faces.about.open")}
          onPress={() => setInfoOpen(true)}
        />
      }
    >
      <AboutDialog open={infoOpen} onOpenChange={setInfoOpen} />
      {!data ? (
        <ActivityIndicator />
      ) : !data.available ? (
        <Empty icon={<ScanFace />} title={t("photos.faces.unavailable")} />
      ) : !data.enabled ||
        data.consent_version !== data.current_consent_version ? (
        <ConsentStep status={data} />
      ) : (
        <EnabledStep status={data} />
      )}
    </Page>
  );
};

export default FaceRecognition;

/** How the feature works and what is kept, reachable at any time from the settings header. */
const AboutDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={t("photos.faces.about.title")}
        className="gap-3"
        confirmLabel={t("photos.faces.about.close")}
        scrollable
      >
        {(["ai", "photos", "selfie", "private", "control"] as const).map(
          (key) => (
            <View key={key} className="gap-0.5">
              <Text variant="lg">{t(`photos.faces.about.${key}.title`)}</Text>
              <Text color="muted">{t(`photos.faces.about.${key}.text`)}</Text>
            </View>
          ),
        )}
      </DialogContent>
    </Dialog>
  );
};

const ConsentStep = ({ status }: { status: FaceStatus }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [accepted, setAccepted] = useState(false);
  const consent = useGiveFaceConsent();
  const errorMessage = useErrorMessage();
  const { toast } = useToast();
  const outdated = status.enabled;

  return (
    <View className="gap-4">
      <View className="items-center gap-2 pt-2">
        <ScanFace size={48} color={theme.primary} />
        <Text variant="h3" className="text-center">
          {t("photos.faces.consent.title")}
        </Text>
      </View>
      {outdated && (
        <Text color="muted">{t("photos.faces.consent.outdated")}</Text>
      )}
      <Card className="gap-3">
        <Text>{t("photos.faces.consent.intro")}</Text>
        {(["selfie", "private", "delete", "legal"] as const).map((key) => (
          <View key={key} className="flex-row gap-2">
            <Text>•</Text>
            <Text className="flex-1">
              {t(`photos.faces.consent.points.${key}`)}
            </Text>
          </View>
        ))}
      </Card>
      <Checkbox
        checked={accepted}
        onPress={setAccepted}
        label={t("photos.faces.consent.checkbox")}
        accessibilityLabel={t("photos.faces.consent.checkbox")}
      />
      <Button
        label={t("photos.faces.consent.accept")}
        icon={<ShieldCheck color={theme.background} />}
        disabled={!accepted || consent.isPending}
        isUpdating={consent.isPending}
        onPress={() =>
          consent.mutate(status.current_consent_version, {
            onError: (error) => toast(errorMessage(error), "destructive"),
          })
        }
      />
    </View>
  );
};

const EnabledStep = ({ status }: { status: FaceStatus }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const add = useAddFaceReference();
  const remove = useDeleteFaceData();
  const errorMessage = useErrorMessage();
  const { toast } = useToast();
  const canAdd = status.references < status.max_references;

  const pick = async (source: "camera" | "library") => {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      toast(t("photos.faces.selfie.permissionDenied"), "destructive");
      return;
    }
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      quality: 0.8,
      cameraType: ImagePicker.CameraType.front,
      // A JPEG the backend can decode, even for HEIC originals.
      preferredAssetRepresentationMode:
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
    };
    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
    const uri = result.canceled ? undefined : result.assets[0]?.uri;
    if (!uri) return;
    add.mutate(uri, {
      onSuccess: () => toast(t("photos.faces.selfie.added"), "success", 5000),
      onError: (error) => toast(errorMessage(error), "destructive", 5000),
    });
  };

  const deleteAll = () =>
    remove.mutate(undefined, {
      onSuccess: () => {
        toast(t("photos.faces.delete.done"), "success");
        router.canGoBack() ? router.back() : router.navigate(paths.photos);
      },
      onError: (error) => toast(errorMessage(error), "destructive"),
    });

  return (
    <View className="gap-4">
      <Card className="gap-2">
        <View className="flex-row items-center gap-2">
          <ShieldCheck size={20} color={theme.primary} />
          <Text variant="lg">{t("photos.faces.status.enabled")}</Text>
        </View>
        <Text color="muted">
          {t("photos.faces.status.references", {
            count: status.references,
            max: status.max_references,
          })}
        </Text>
        {status.references > 0 && (
          <Text color="muted">
            {status.matching
              ? t("photos.faces.status.matching")
              : t("photos.faces.status.found", { count: status.photo_count })}
          </Text>
        )}
        {status.library_total > 0 &&
          status.library_scanned < status.library_total && (
            <Text color="muted">
              {t("photos.faces.status.library", {
                scanned: status.library_scanned,
                total: status.library_total,
              })}
            </Text>
          )}
      </Card>

      {canAdd && (
        <Card className="gap-3">
          <Text variant="lg">
            {status.references === 0
              ? t("photos.faces.selfie.title")
              : t("photos.faces.selfie.addAnother")}
          </Text>
          <Text color="muted">{t("photos.faces.selfie.hint")}</Text>
          <Button
            label={t("photos.faces.selfie.camera")}
            icon={<Camera color={theme.background} />}
            isUpdating={add.isPending}
            disabled={add.isPending}
            onPress={() => pick("camera")}
          />
          <Button
            label={t("photos.faces.selfie.library")}
            variant="secondary"
            icon={<ImagePlus color={theme.text} />}
            disabled={add.isPending}
            onPress={() => pick("library")}
          />
        </Card>
      )}

      {status.references > 0 && (
        <Button
          label={t("photos.faces.openAlbum")}
          variant="secondary"
          onPress={() => router.navigate(paths.myPhotos)}
        />
      )}

      <ConfirmAction
        title={t("photos.faces.delete.confirmTitle")}
        description={t("photos.faces.delete.confirmMessage")}
        confirmLabel={t("photos.faces.delete.confirm")}
        onConfirm={deleteAll}
        isPending={remove.isPending}
      >
        <Button
          label={t("photos.faces.delete.action")}
          variant="destructive"
          icon={<Trash color={theme.background} />}
          isUpdating={remove.isPending}
          disabled={remove.isPending}
        />
      </ConfirmAction>
      <Text variant="sm" color="muted">
        {t("photos.faces.delete.hint")}
      </Text>
    </View>
  );
};
