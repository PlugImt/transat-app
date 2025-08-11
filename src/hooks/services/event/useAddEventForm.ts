import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { TextInput } from "react-native";
import { hapticFeedback } from "@/utils/haptics.utils";
import { type AddEventFormData, createAddEventSchema } from "./types";
import { useAddEvent } from "./useEvent";

export const useAddEventForm = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutate: addEvent, isPending: isAddingEvent } = useAddEvent();

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
      description: "",
      location: "",
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      id_club: undefined,
      link: "",
    },
    mode: "onChange",
  });

  const name = watch("name");
  const description = watch("description");
  const location = watch("location");
  const start_date = watch("start_date");
  const end_date = watch("end_date");
  const link = watch("link");

  console.log(start_date, end_date);

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

  return {
    control,
    errors,
    isValid,
    isDirty,
    isButtonDisabled,
    isAddingEvent,
    handleSubmit,
    handleAddEvent,
    handleCancel,
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
    link,
  };
};
