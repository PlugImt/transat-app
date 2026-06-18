import React from "react";
import { View } from "react-native";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MapPin, Phone } from "lucide-react-native";

import { Page } from "@/components/page/Page";
import Input from "@/components/common/Input";
import { Text } from "@/components/common/Text";
import { Textarea } from "@/components/common/Textarea";
import { Button } from "@/components/common/Button";
import { DateTimePicker } from "@/components/custom/date/DateTimePicker";
import { useTheme } from "@/contexts/ThemeContext";
import { useAddCovoiturageForm } from "@/hooks/services/covoiturage/useAddCovoiturageForm";

export const AddCovoiturage = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const {
    control,
    errors,
    setValue,
    trip_type,
    isButtonDisabled,
    isAddingCovoiturage,
    handleSubmit,
    handleAddCovoiturage,
    handleCancel,
    descriptionRef,
    destinationRef,
    contactRef,
  } = useAddCovoiturageForm();

  return (
    <Page
      title={t("services.covoit.add.title")}
      disableScroll={false}
      className="justify-between"
    >
      <View className="gap-6">
        <Input
          icon={<MapPin size={16} color={theme.muted} />}
          placeholder={t("services.covoit.add.departure.placeholder")}
          control={control}
          name="departure_place"
          label={t("services.covoit.add.departure.title")}
          labelClasses="h3"
          returnKeyType="next"
          onSubmitEditing={() => destinationRef.current?.focus()}
          error={errors.departure_place?.message}
        />

        <Input
          ref={destinationRef}
          icon={<MapPin size={16} color={theme.primary} />}
          placeholder={t("services.covoit.add.destination.placeholder")}
          control={control}
          name="destination"
          label={t("services.covoit.add.destination.title")}
          labelClasses="h3"
          returnKeyType="next"
          onSubmitEditing={() => contactRef.current?.focus()}
          error={errors.destination?.message}
        />

        <DateTimePicker
          control={control}
          errors={errors}
          onChange={setValue}
          startDateField="departure_time"
          label={t("services.covoit.add.date.title")}
        />

        <Input
          ref={contactRef}
          icon={<Phone size={16} color={theme.muted} />}
          placeholder="+33 6 12 34 56 78"
          control={control}
          name="contact_details"
          label={t("services.covoit.add.contact.title")}
          labelClasses="h3"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          returnKeyType="next"
          onSubmitEditing={() => descriptionRef.current?.focus()}
          error={errors.contact_details?.message}
        />

        <View className="gap-1.5">
          <Text variant="sm" className="h3" color="muted">
            {t("services.covoit.add.type.title")}
          </Text>
          <View className="flex-row gap-2">
            {[
              { label: t("services.covoit.tags.shopping"), value: "SHOPPING" },
              { label: t("services.covoit.tags.long_trip"), value: "LONG_TRIP" },
              { label: t("services.covoit.tags.other"), value: "OTHER" },
            ].map((type) => {
              const isSelected = trip_type === type.value;
              return (
                <Button
                  key={type.value}
                  label={type.label}
                  variant={isSelected ? "primary" : "secondary"}
                  className="flex-1 py-2 h-10"
                  onPress={() => setValue("trip_type", type.value as any, { shouldValidate: true })}
                />
              );
            })}
          </View>
        </View>

        <View className="gap-1.5">
          <Text variant="sm" className="h3" color="muted">
            {t("services.covoit.add.description.title")}
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Textarea
                ref={descriptionRef}
                value={value || ""}
                onChangeText={onChange}
                placeholder={t("services.covoit.add.description.placeholder")}
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
      </View>

      <View className="flex-row items-center gap-2 pt-4">
        <Button
          label={t("common.cancel")}
          onPress={handleCancel}
          variant="secondary"
          className="flex-1"
        />
        <Button
          label={t("services.covoit.add.submit")}
          onPress={handleSubmit(handleAddCovoiturage)}
          disabled={isButtonDisabled}
          isUpdating={isAddingCovoiturage}
          className="flex-1"
        />
      </View>
    </Page>
  );
};

export default AddCovoiturage;