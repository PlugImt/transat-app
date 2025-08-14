import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { TextInput } from "react-native";
import { useImageUpload } from "@/hooks/common";
import { hapticFeedback } from "@/utils/haptics.utils";
import { type AddEventFormData, createAddEventSchema } from "./types";
import { useAddEvent } from "./useEvent";

export const useAddEventForm = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutate: addEvent, isPending: isAddingEvent } = useAddEvent();
  const { mutate: uploadImage, isPending: isUploadingImage } = useImageUpload();

  const addEventSchema = createAddEventSchema(t);

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
    resolver: zodResolver(addEventSchema),
    defaultValues: {
      name: "",
      description: undefined,
      location: "",
      start_date: "",
      end_date: undefined,
      id_club: undefined,
      link: undefined,
      picture: undefined,
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

  const handleAddEvent = (data: AddEventFormData) => {
    addEvent(data);
    reset();
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

  return {
    control,
    errors,
    isValid,
    isDirty,
    isButtonDisabled,
    isAddingEvent,
    isUploadingImage,
    handleSubmit,
    handleAddEvent,
    handleCancel,
    handleSelectImage,
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
