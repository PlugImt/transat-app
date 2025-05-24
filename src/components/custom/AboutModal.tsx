import { useTheme } from "@/contexts/ThemeContext";
import { Clock, EuroIcon, Info, MapPin, Plus } from "lucide-react-native";
import type React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { IconButton } from "../common/Button";
import { Dialog, DialogContent, DialogTrigger } from "../common/Dialog";

interface AboutModalProps {
  title: string;
  description: string;
  openingHours?: OpeningHours[] | string;
  location?: string;
  price?: string;
  additionalInfo?: string;
}

interface OpeningHours {
  day: string;
  lunch: string;
  dinner: string;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  title,
  description,
  openingHours,
  location,
  price,
  additionalInfo,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Dialog>
      <DialogTrigger>
        <IconButton icon={<Info color={theme.muted} />} variant="link" />
      </DialogTrigger>
      <DialogContent
        title={title}
        confirmLabel={t("common.close")}
        className="gap-8"
      >
        <Text style={{ color: theme.text }}>{description}</Text>

        {openingHours && (
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Clock size={20} color={theme.primary} />
              <Text style={{ color: theme.text }} className="font-bold">
                {t("services.openingHours")}
              </Text>
            </View>

            {typeof openingHours === "string" ? (
              <Text style={{ color: theme.text }}>{openingHours}</Text>
            ) : (
              openingHours.map((item) => (
                <View
                  key={item.day}
                  className="flex-row justify-between w-full"
                >
                  <Text style={{ color: theme.text }} className="w-1/3">
                    {item.day}
                  </Text>
                  <Text
                    style={{ color: theme.text }}
                    className="w-1/3 text-right"
                  >
                    {item.lunch}
                  </Text>
                  <Text
                    style={{ color: theme.text }}
                    className="w-1/3 text-right"
                  >
                    {item.dinner}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}

        {location && (
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <MapPin size={20} color={theme.primary} />
              <Text style={{ color: theme.text }} className="font-bold">
                {t("services.location")}
              </Text>
            </View>

            <Text style={{ color: theme.text }}>{location}</Text>
          </View>
        )}

        {price && (
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <EuroIcon size={20} color={theme.primary} />
              <Text style={{ color: theme.text }} className="font-bold">
                {t("services.price")}
              </Text>
            </View>

            <Text style={{ color: theme.text }}>{price}</Text>
          </View>
        )}

        {additionalInfo && (
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Plus size={20} color={theme.primary} />
              <Text style={{ color: theme.text }} className="font-bold">
                {t("services.additionalInfo")}
              </Text>
            </View>

            <Text style={{ color: theme.text }}>{additionalInfo}</Text>
          </View>
        )}
      </DialogContent>
    </Dialog>
  );
};
