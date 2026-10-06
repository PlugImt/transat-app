import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "expo-router/react-navigation";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { TextInput } from "react-native";
import type { EventDetails } from "@/dto/event";
import { useImageUpload } from "@/hooks/common";
import { createDateTimeISO } from "@/utils/date.utils";
import { hapticFeedback } from "@/utils/haptics.utils";
import { type AddEventFormData, createAddEventSchema } from "./types";
import { useUpdateEvent } from "./useEvent";

// Same format the date picker writes (no seconds/ms), so an untouched date isn't seen as modified.
const normalizeDate = (iso: string) => {
  const date = new Date(iso);
  return createDateTimeISO(date, date);
};

export const useEditEventForm = (event: EventDetails) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutate: updateEvent, isPending: isUpdatingEvent } = useUpdateEvent();
  const { mutate: uploadImage, isPending: isUploadingImage } = useImageUpload();

  const editEventSchema = createAddEventSchema(t);

  const descriptionRef = useRef<TextInput>(null);
  const organizerRef = useRef<TextInput>(null);
  const locationRef = useRef<TextInput>(null);
  const linkRef = useRef<TextInput>(null);

  const initialValues = useRef<Partial<AddEventFormData>>({
    name: event.name || "",
    description: event.description || "",
    location: event.location || "",
    start_date: event.start_date
      ? normalizeDate(event.start_date)
      : new Date().toISOString(),
    end_date: event.end_date ? normalizeDate(event.end_date) : undefined,
    id_club: event.club?.id || undefined,
    link: event.link || undefined,
    picture: event.picture || undefined,
  }).current;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
    setValue: setFormValue,
  } = useForm<AddEventFormData>({
    resolver: zodResolver(editEventSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const name = watch("name");
  const description = watch("description");
  const location = watch("location");
  const start_date = watch("start_date");
  const end_date = watch("end_date");
  const id_club = watch("id_club");
  const link = watch("link");
  const picture = watch("picture");

  // Programmatic changes (date picker, image) must count as edits to enable the button.
  const setValue: typeof setFormValue = useCallback(
    (name, value, options) =>
      setFormValue(name, value, {
        shouldDirty: true,
        shouldValidate: true,
        ...options,
      }),
    [setFormValue],
  );

  // Compare with the initial values directly so any change enables the button, however it was made.
  const current: AddEventFormData = {
    name,
    description,
    location,
    start_date,
    end_date,
    id_club,
    link,
    picture,
  };
  const hasChanges = (Object.keys(current) as (keyof AddEventFormData)[]).some(
    (key) => (current[key] ?? "") !== (initialValues[key] ?? ""),
  );

  const isButtonDisabled = !isValid || !(isDirty || hasChanges);

  const handleUpdateEvent = (data: AddEventFormData) => {
    updateEvent({ id: event.id, data });
    navigation.goBack();
  };

  const handleCancel = () => {
    hapticFeedback.light();
    navigation.goBack();
  };

  const handleSelectImage = () => {
    uploadImage(undefined, {
      onSuccess: (imageUrl) => {
        setValue("picture", imageUrl);
      },
    });
  };

  const handleRemoveImage = () => {
    setValue("picture", undefined);
  };

  return {
    control,
    errors,
    isValid,
    isDirty,
    isButtonDisabled,
    isUpdatingEvent,
    isUploadingImage,
    handleSubmit,
    handleUpdateEvent,
    handleCancel,
    handleSelectImage,
    handleRemoveImage,
    reset,
    setValue,
    descriptionRef,
    organizerRef,
    locationRef,
    linkRef,
    name,
    description,
    location,
    start_date,
    end_date,
    id_club,
    link,
    picture,
  };
};
