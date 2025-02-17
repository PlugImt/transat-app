import { Clock, EuroIcon, MapPin, Plus } from "lucide-react-native";
import type React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface AboutModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  openingHours: OpeningHours[];
  location: string;
  price: string;
  additionalInfo: string;
}

interface OpeningHours {
  day: string;
  lunch: string;
  dinner: string;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isVisible,
  onClose,
  title,
  description,
  openingHours,
  location,
  price,
  additionalInfo,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="w-5/6 rounded-lg bg-[#181010] p-5">
          <Text className="text-xl text-[#ffe6cc] font-black mb-4">
            {title}
          </Text>

          <Text className="text-base text-[#ffe6cc] mb-8">{description}</Text>

          <View className={"mb-8"}>
            <View className={"flex flex-row items-center  gap-2 mb-2"}>
              <Clock size={20} color="#ec7f32" />

              <Text className="text-base text-[#ffe6cc] font-bold">
                {t("services.opening_hours")}
              </Text>
            </View>

            {openingHours.map((item) => (
              <View
                key={item.day}
                className="flex flex-row justify-between w-full"
              >
                <Text className="text-base text-[#ffe6cc] w-1/3">
                  {item.day}
                </Text>
                <Text className="text-base text-[#ffe6cc] w-1/3 text-right">
                  {item.lunch}
                </Text>
                <Text className="text-base text-[#ffe6cc] w-1/3 text-right">
                  {item.dinner}
                </Text>
              </View>
            ))}
          </View>

          <View className={"mb-8"}>
            <View className="flex flex-row items-center gap-2 mb-2">
              <MapPin size={20} color="#ec7f32" />
              <Text className="text-base text-[#ffe6cc] font-bold">
                {t("services.location")}
              </Text>
            </View>

            <Text className="text-base text-[#ffe6cc]">{location}</Text>
          </View>

          <View className={"mb-8"}>
            <View className="flex flex-row items-center gap-2 mb-2">
              <EuroIcon size={20} color="#ec7f32" />
              <Text className="text-base text-[#ffe6cc] font-bold">
                {t("services.price")}
              </Text>
            </View>

            <Text className="text-base text-[#ffe6cc]">{price}</Text>
          </View>

          <View className={"mb-8"}>
            <View className="flex flex-row items-center gap-2 mb-2">
              <Plus size={20} color="#ec7f32" />
              <Text className="text-base text-[#ffe6cc] font-bold">
                {t("services.additional_info")}
              </Text>
            </View>

            <Text className="text-base text-[#ffe6cc]">{additionalInfo}</Text>
          </View>

          <View className="flex w-full flex-row justify-end">
            <TouchableOpacity onPress={onClose} className="p-2">
              <Text className="text-base text-[#ec7f32]">
                {t("common.close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
