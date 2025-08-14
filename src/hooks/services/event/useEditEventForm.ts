import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { TextInput } from "react-native";
import type { EventDetails } from "@/dto/event";
import { useImageUpload } from "@/hooks/common";
import { hapticFeedback } from "@/utils/haptics.utils";
import { type AddEventFormData, createAddEventSchema } from "./types";
import { useUpdateEvent } from "./useEvent";

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

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
    setValue,
  } = useForm<AddEventFormData>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      name: event.name || "",
      description: event.description || "",
      location: event.location || "",
      start_date: event.start_date || new Date().toISOString(),
      end_date: event.end_date || undefined,
      id_club: event.club?.id || undefined,
      link: event.link || undefined,
      picture: event.picture || undefined,
    },
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

  const isButtonDisabled = !isValid || !isDirty;

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
