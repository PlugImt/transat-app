import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "expo-router/react-navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/common/Dialog";
import Input from "@/components/common/Input";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import { Page } from "@/components/page/Page";
import { useSchedule } from "@/hooks/services/schedule/useSchedule";
import {
  useDeleteSchedule,
  useUpdateSchedule,
} from "@/hooks/services/schedule/useScheduleMutations";
import { hapticFeedback } from "@/utils/haptics.utils";

export const CalendarSettings = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { toast } = useToast();
  const { data: schedule, isPending: isSchedulePending } = useSchedule();
  const { mutate: updateSchedule, isPending: isUpdating } = useUpdateSchedule();
  const { mutateAsync: deleteSchedule, isPending: isDeleting } =
    useDeleteSchedule();

  const calendarSchema = z.object({
    ics_url: z.string().url(t("settings.calendar.invalidUrl")),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(calendarSchema),
    mode: "onChange",
    defaultValues: {
      ics_url: "",
    },
  });

  useEffect(() => {
    if (schedule?.ics_url) {
      reset({ ics_url: schedule.ics_url });
    }
  }, [schedule?.ics_url, reset]);

  const handleSave = ({ ics_url }: z.infer<typeof calendarSchema>) => {
    Keyboard.dismiss();
    updateSchedule(
      { ics_url },
      {
        onSuccess: () => {
          toast(t("settings.calendar.saveSuccess"), "success");
          hapticFeedback.success();
          navigation.goBack();
        },
        onError: (error) => {
          toast(error.message || t("settings.calendar.saveError"), "destructive");
          hapticFeedback.error();
        },
      },
    );
  };

  const handleDelete = async () => {
    try {
      await deleteSchedule();
      reset({ ics_url: "" });
      toast(t("settings.calendar.deleteSuccess"), "success");
      hapticFeedback.success();
      navigation.goBack();
    } catch {
      toast(t("settings.calendar.deleteError"), "destructive");
      hapticFeedback.error();
    }
  };

  return (
    <Page
      className="gap-6"
      title={t("settings.calendar.title")}
      disableScroll
    >
      <Text color="muted">{t("settings.calendar.description")}</Text>

      <Input
        label={t("settings.calendar.icsUrlLabel")}
        control={control}
        name="ics_url"
        placeholder={t("settings.calendar.icsUrlPlaceholder")}
        error={errors.ics_url?.message}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        textContentType="URL"
      />

      <Button
        label={t("common.save")}
        onPress={handleSubmit(handleSave)}
        disabled={isSchedulePending || isUpdating || !isValid || !isDirty}
        isUpdating={isUpdating}
      />

      {schedule?.ics_url && (
        <Dialog>
          <DialogTrigger>
            <Button
              label={t("settings.calendar.deleteTitle")}
              variant="destructive"
              disabled={isDeleting}
            />
          </DialogTrigger>
          <DialogContent
            title={t("settings.calendar.deleteTitle")}
            className="gap-2"
            cancelLabel={t("common.cancel")}
            confirmLabel={t("common.delete")}
            onConfirm={handleDelete}
          >
            <Text>{t("settings.calendar.deleteDescription")}</Text>
          </DialogContent>
        </Dialog>
      )}
    </Page>
  );
};

export default CalendarSettings;
