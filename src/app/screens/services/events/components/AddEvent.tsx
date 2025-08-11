import { Link, MapPin } from "lucide-react-native";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import Input from "@/components/common/Input";
import { Text } from "@/components/common/Text";
import { Textarea } from "@/components/common/Textarea";
import { DateTimePicker } from "@/components/custom/date/DateTimePicker";
import { Page } from "@/components/page/Page";
import { useTheme } from "@/contexts/ThemeContext";
import { useAddEventForm } from "@/hooks/services/event";

export const AddEvent = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const {
    control,
    errors,
    setValue,
    isButtonDisabled,
    handleSubmit,
    handleAddEvent,
    handleCancel,
    descriptionRef,
    locationRef,
    linkRef,
    isAddingEvent,
  } = useAddEventForm();

  return (
    <Page
      title={t("services.events.add.title")}
      disableScroll={false}
      className="justify-between"
    >
      <View className="gap-6">
        <Input
          placeholder={t("services.events.add.name.placeholder")}
          control={control}
          name="name"
          label={t("services.events.add.name.title")}
          labelClasses="h3"
          returnKeyType="next"
          onSubmitEditing={() => descriptionRef.current?.focus()}
          error={errors.name?.message}
          autoCapitalize="words"
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
                value={value}
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

        {/* <Input
          placeholder={t("services.events.add.organizer.placeholder")}
          control={control}
          name="organizer"
          label={t("services.events.add.organizer.title")}
          labelClasses="h3"
          returnKeyType="next"
          onSubmitEditing={() => locationRef.current?.focus()}
          error={errors.organizer?.message}
          autoCapitalize="words"
          textContentType="none"
        /> */}

        <Input
          icon={<MapPin size={16} color={theme.muted} />}
          placeholder={t("services.events.add.location.placeholder")}
          control={control}
          name="location"
          label={t("services.events.add.location.title")}
          labelClasses="h3"
          returnKeyType="next"
          //   onSubmitEditing={() => startDateRef.current?.focus()}
          error={errors.location?.message}
          autoCapitalize="sentences"
          textContentType="location"
        />

        {/* <Input
          placeholder={t("services.events.add.schedules.placeholder")}
          control={control}
          icon={<Calendar size={16} color={theme.muted} />}
          name="schedules"
          label={t("services.events.add.schedules.title")}
          labelClasses="h3"
          returnKeyType="next"
          onSubmitEditing={() => linkRef.current?.focus()}
          error={errors.schedules?.message}
          autoCapitalize="sentences"
          textContentType="none"
        /> */}

        <DateTimePicker
          control={control}
          errors={errors}
          onChange={setValue}
          startDateField="start_date"
          endDateField="end_date"
          label="Date"
        />

        {/* Lien (optionnel) */}
        <Input
          icon={<Link size={16} color={theme.muted} />}
          placeholder={t("services.events.add.link.placeholder")}
          control={control}
          name="link"
          label={t("services.events.add.link.title")}
          labelClasses="h3"
          returnKeyType="done"
          onSubmitEditing={handleSubmit(handleAddEvent)}
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
          label={t("services.events.add.submit")}
          onPress={handleSubmit(handleAddEvent)}
          disabled={isButtonDisabled}
          isUpdating={isAddingEvent}
          className="flex-1"
        />
      </View>
    </Page>
  );
};
