import { CircleCheck, TriangleAlert } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Dialog, DialogContent, useDialog } from "@/components/common/Dialog";
import Input from "@/components/common/Input";
import { Text } from "@/components/common/Text";
import {
  PHOTO_REPORT_COMMENT_MAX,
  PHOTO_REPORT_REASONS,
  type PhotoReportReason,
} from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import { useReportPhoto } from "@/hooks/services/photos/useReportPhoto";

type ReportPhotoDialogProps = {
  photoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** The report dialog; the viewer's menu opens it. */
export const ReportPhotoDialog = ({
  photoId,
  open,
  onOpenChange,
}: ReportPhotoDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={t("photos.viewer.report.title")}
        scrollable
        contentMaxHeight={460}
        dismissible={false}
        className="gap-4"
      >
        <ReportForm photoId={photoId} />
      </DialogContent>
    </Dialog>
  );
};

const ReportForm = ({ photoId }: { photoId: string }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { setOpen } = useDialog();
  const { submit, isPending, isSuccess, error } = useReportPhoto();

  const [reason, setReason] = useState<PhotoReportReason | null>(null);
  const [comment, setComment] = useState("");
  const [triedToSubmit, setTriedToSubmit] = useState(false);
  // "Other" explains nothing by itself, so the words are required there and optional elsewhere.
  const commentRequired = reason === "other";
  const commentMissing = commentRequired && comment.trim() === "";

  const handleSubmit = () => {
    if (isPending) return;
    setTriedToSubmit(true);
    if (!reason || commentMissing) return;
    submit({ photoId, reason, comment: comment.trim() });
  };

  if (isSuccess) {
    return (
      <View className="items-center gap-3 py-2">
        <CircleCheck size={40} color={theme.success} />
        <Text variant="h3" className="text-center">
          {t("photos.viewer.report.successTitle")}
        </Text>
        <Text className="text-center" style={{ color: theme.muted }}>
          {t("photos.viewer.report.successBody")}
        </Text>
        <Button
          label={t("photos.viewer.close")}
          onPress={() => setOpen(false)}
          className="self-stretch"
        />
      </View>
    );
  }

  return (
    <View className="gap-4">
      <Text variant="sm" style={{ color: theme.muted }}>
        {t("photos.viewer.report.intro")}
      </Text>

      <View className="gap-2" accessibilityRole="radiogroup">
        <Text variant="lg">{t("photos.viewer.report.reasonLabel")}</Text>
        {PHOTO_REPORT_REASONS.map((value) => (
          <ReasonOption
            key={value}
            label={t(`photos.viewer.report.reasons.${value}`)}
            selected={reason === value}
            disabled={isPending}
            onPress={() => setReason(value)}
          />
        ))}
        {triedToSubmit && !reason && (
          <Text variant="sm" style={{ color: theme.destructive }}>
            {t("photos.viewer.report.chooseReason")}
          </Text>
        )}
      </View>

      <View className="gap-1">
        <Input
          label={t(
            commentRequired
              ? "photos.viewer.report.commentLabelRequired"
              : "photos.viewer.report.commentLabel",
          )}
          value={comment}
          onChangeText={setComment}
          placeholder={t("photos.viewer.report.commentPlaceholder")}
          error={
            triedToSubmit && commentMissing
              ? t("photos.viewer.report.commentRequired")
              : undefined
          }
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={PHOTO_REPORT_COMMENT_MAX}
          disabled={isPending}
          inputClasses="min-h-[100px] items-start pt-2"
        />
        {triedToSubmit && commentMissing && (
          <Text variant="sm" style={{ color: theme.destructive }}>
            {t("photos.viewer.report.commentRequired")}
          </Text>
        )}
        <View className="flex-row items-start justify-between gap-3">
          <Text variant="sm" className="flex-1" style={{ color: theme.muted }}>
            {t("photos.viewer.report.commentHint")}
          </Text>
          <Text variant="sm" style={{ color: theme.muted }}>
            {t("photos.viewer.report.counter", {
              count: comment.length,
              max: PHOTO_REPORT_COMMENT_MAX,
            })}
          </Text>
        </View>
      </View>

      <Text variant="sm" style={{ color: theme.muted }}>
        {t("photos.viewer.report.privacy")}
      </Text>

      {error && (
        <View
          accessibilityRole="alert"
          className="flex-row items-center gap-2 rounded-lg p-3"
          style={{ backgroundColor: theme.destructiveBackground }}
        >
          <TriangleAlert size={18} color={theme.destructiveText} />
          <Text
            variant="sm"
            className="flex-1"
            style={{ color: theme.destructiveText }}
          >
            {t(`photos.viewer.report.errors.${error}`)}
          </Text>
        </View>
      )}

      <View className="flex-row items-center gap-2">
        <Button
          label={t("common.cancel")}
          variant="secondary"
          disabled={isPending}
          onPress={() => setOpen(false)}
          className="flex-1"
        />
        <Button
          label={t("photos.viewer.report.submit")}
          isUpdating={isPending}
          onPress={handleSubmit}
          className="flex-1"
        />
      </View>
    </View>
  );
};

const ReasonOption = ({
  label,
  selected,
  disabled,
  onPress,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      className="flex-row items-center gap-3 rounded-lg px-3 py-3"
      style={{
        backgroundColor: theme.border,
        borderWidth: 2,
        borderColor: selected ? theme.primary : "transparent",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <View
        className="h-5 w-5 items-center justify-center rounded-full"
        style={{
          borderWidth: 2,
          borderColor: selected ? theme.primary : theme.muted,
        }}
      >
        {selected && (
          <View
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: theme.primary }}
          />
        )}
      </View>
      <Text className="flex-1">{label}</Text>
    </TouchableOpacity>
  );
};
