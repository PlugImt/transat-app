import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "expo-router/react-navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { TextInput } from "react-native";
import { hapticFeedback } from "@/utils/haptics.utils";
import { type AddCovoiturageFormData, createAddCovoiturageSchema } from "./types";
import { useAddCovoiturage } from "./useCovoiturage";

export const useAddCovoiturageForm = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { mutate: addCovoiturage, isPending: isAddingCovoiturage } = useAddCovoiturage();

  const addCovoiturageSchema = createAddCovoiturageSchema(t);

  const destinationRef = useRef<TextInput>(null);
  const contactRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
    setValue,
  } = useForm<AddCovoiturageFormData>({
    resolver: zodResolver(addCovoiturageSchema),
    defaultValues: {
      departure_place: "",
      destination: "",
      departure_time: new Date().toISOString(),
      contact_details: "+33",
      trip_type: "OTHER",
      description: "",
    },
    mode: "onChange",
  });

  const departure_place = watch("departure_place");
  const destination = watch("destination");
  const departure_time = watch("departure_time");
  const contact_details = watch("contact_details");
  const trip_type = watch("trip_type");
  const description = watch("description");

  const isButtonDisabled = !isValid || !isDirty;

  const handleAddCovoiturage = (data: AddCovoiturageFormData) => {
    const payload = {
      ...data,
      departure_time: new Date(data.departure_time).toISOString(),
    };

    addCovoiturage(payload, {
      onSuccess: () => {
        reset();
        navigation.goBack();
      }
    });
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
    isAddingCovoiturage,
    handleSubmit,
    handleAddCovoiturage,
    handleCancel,
    reset,
    setValue,
    destinationRef,
    contactRef,
    descriptionRef,
    departure_place,
    destination,
    departure_time,
    contact_details,
    trip_type,
    description,
  };
};