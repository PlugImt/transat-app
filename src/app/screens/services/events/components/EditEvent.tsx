import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { Link, MapPin, Users } from "lucide-react-native";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SelectClubButton } from "@/app/screens/services/clubs/components";
import { Button } from "@/components/common/Button";
import Input from "@/components/common/Input";
import { Text } from "@/components/common/Text";
import { Textarea } from "@/components/common/Textarea";
import { DateTimePicker } from "@/components/custom/date/DateTimePicker";
import { ImageSelector } from "@/components/custom/ImageSelector";
import { InputButton } from "@/components/custom/InputButton";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import type { EventDetails } from "@/dto/event";
import { useEditEventForm } from "@/hooks/services/event/useEditEventForm";
import { useEventDetails } from "@/hooks/services/event/useEvent";
import type { BottomTabParamList } from "@/types/navigation";

type EditEventRouteProp = RouteProp<BottomTabParamList, "EditEvent">;

export const EditEvent = () => {
  const { t } = useTranslation();
  const route = useRoute<EditEventRouteProp>();
  const { id } = route.params;

  const {
    data: event,
    isPending,
    isError,
    error,
    refetch,
  } = useEventDetails(id);

  if (isPending) {
    return <EditEventLoading />;
  }

  if (isError || !event) {
    return (
      <ErrorPage
        title={t("services.events.edit.title")}
        error={error}
        refetch={refetch}
        isRefetching={isPending}
      />
    );
  }

  return <EditEventForm event={event} />;
};

interface EditEventFormProps {
  event: EventDetails;
}

const EditEventForm = ({ event }: EditEventFormProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const {
    control,
    errors,
    setValue,
    isButtonDisabled,
    handleSubmit,
    handleUpdateEvent,
    handleCancel,
    handleSelectImage,
    handleRemoveImage,
    descriptionRef,
    isUpdatingEvent,
    isUploadingImage,
    picture,
  } = useEditEventForm(event);

  return (
    <Page
      title={t("services.events.edit.title")}
      disableScroll={false}
      className="justify-between"
    >
      <View className="gap-6">
        <ImageSelector
          imageUrl={picture}
          onImageSelect={handleSelectImage}
          onImageRemove={handleRemoveImage}
          isUploading={isUploadingImage}
          title={t("services.events.add.image.title")}
          aspectRatio="square"
        />

        <Input
          placeholder={t("services.events.add.name.placeholder")}
          control={control}
          name="name"
          label={t("services.events.add.name.title")}
          labelClasses="h3"
          returnKeyType="next"
          onSubmitEditing={() => descriptionRef.current?.focus()}
          error={errors.name?.message}
          textContentType="none"
        />

        <View className="gap-1.5">
          <Text variant="sm" className="h3" color="muted">
            {t("services.events.add.description.title")}
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Textarea
                ref={descriptionRef}
                value={value || ""}
                onChangeText={onChange}
                placeholder={t("services.events.add.description.placeholder")}
                disabled={false}
              />
            )}
          />
          {errors.description && (
            <Text color="destructive" variant="sm">
              {errors.description.message}
            </Text>
          )}
        </View>

        <View className="gap-1.5">
          <Controller
            control={control}
            name="id_club"
            render={({ field: { onChange, value } }) => (
              <SelectClubButton
                onSelect={onChange}
                title={t("services.events.add.organizer.title")}
                selectedClubId={value}
              >
                <InputButton
                  Icon={Users}
                  label={t("services.events.add.organizer.title")}
                  placeholder={t("services.events.add.organizer.placeholder")}
                  error={errors.id_club?.message}
                  onPress={() => {}}
                />
              </SelectClubButton>
            )}
          />
          {errors.id_club && (
            <Text color="destructive" variant="sm">
              {errors.id_club.message}
            </Text>
          )}
        </View>

        <Input
          icon={<MapPin size={16} color={theme.muted} />}
          placeholder={t("services.events.add.location.placeholder")}
          control={control}
          name="location"
          label={t("services.events.add.location.title")}
          labelClasses="h3"
          returnKeyType="next"
          error={errors.location?.message}
          textContentType="location"
        />

        <DateTimePicker
          control={control}
          errors={errors}
          onChange={setValue}
          startDateField="start_date"
          endDateField="end_date"
          label={t("services.events.add.date.title")}
          initialStartDate={event.start_date}
          initialEndDate={event.end_date}
        />

        <Input
          icon={<Link size={16} color={theme.muted} />}
          placeholder={t("services.events.add.link.placeholder")}
          control={control}
          name="link"
          label={t("services.events.add.link.title")}
          labelClasses="h3"
          returnKeyType={isButtonDisabled ? "default" : "done"}
          onSubmitEditing={handleSubmit(handleUpdateEvent)}
          error={errors.link?.message}
          autoCapitalize="none"
        />
      </View>

      <View className="flex-row items-center gap-2">
        <Button
          label={t("common.cancel")}
          onPress={handleCancel}
          variant="secondary"
          className="flex-1"
        />
        <Button
          label={t("services.events.edit.submit")}
          onPress={handleSubmit(handleUpdateEvent)}
          disabled={isButtonDisabled}
          isUpdating={isUpdatingEvent}
          className="flex-1"
        />
      </View>
    </Page>
  );
};

const EditEventLoading = () => {
  const { t } = useTranslation();

  return (
    <Page
      title={t("services.events.edit.title")}
      disableScroll={false}
      className="justify-between"
    >
      <View className="gap-6">
        <View className="h-32 bg-muted rounded-lg animate-pulse" />
        <View className="h-12 bg-muted rounded-lg animate-pulse" />
        <View className="h-24 bg-muted rounded-lg animate-pulse" />
        <View className="h-12 bg-muted rounded-lg animate-pulse" />
        <View className="h-12 bg-muted rounded-lg animate-pulse" />
        <View className="h-12 bg-muted rounded-lg animate-pulse" />
      </View>

      <View className="flex-row items-center gap-2">
        <View className="flex-1 h-12 bg-muted rounded-lg animate-pulse" />
        <View className="flex-1 h-12 bg-muted rounded-lg animate-pulse" />
      </View>
    </Page>
  );
};
