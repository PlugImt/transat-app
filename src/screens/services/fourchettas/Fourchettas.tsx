import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { AboutModal } from "@/components/custom/AboutModal";
import { Page } from "@/components/page/Page";
import { useUser } from "@/hooks/account/useUser";
import { useEventsUpcomingPhone } from "@/hooks/services/fourchettas/useFourchettas";
import { paths } from "@/navigation/paths";
import {
  FourchettasEventCard,
  FourchettasEventCardLoading,
} from "./components/FourchettasEventCard";
import { phoneWithoutSpaces } from "./utils/common";

export const Fourchettas = () => {
  const { data: user } = useUser();
  const { t } = useTranslation();
  const router = useRouter();

  const {
    data: events = [],
    isLoading,
    isError,
  } = useEventsUpcomingPhone(phoneWithoutSpaces(user?.phone_number ?? ""));

  if (!user?.phone_number || user?.phone_number === "") {
    return (
      <Page title={t("services.fourchettas.title")} className="h-full">
        <View className="items-center gap-4 h-full justify-center">
          <Image
            source={require("@/assets/images/services/fourchettas_dead.png")}
            style={{ width: 200, height: 200 }}
          />
          <Text className="text-center w-3/4">
            {t("services.fourchettas.noPhoneNumber")}
          </Text>
          <Button
            variant="default"
            onPress={() => {
              router.push(paths.editProfile);
            }}
            label={t("services.fourchettas.addPhoneNumberButton")}
          />
        </View>{" "}
      </Page>
    );
  }

  if (isLoading) {
    return (
      <Page title={t("services.fourchettas.title")} className="h-full">
        <View className="w-full items-center gap-4">
          <FourchettasEventCardLoading />
        </View>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page title={t("services.fourchettas.title")} className="h-full">
        <View className="items-center gap-4 h-full justify-center">
          <Image
            source={require("@/assets/images/services/fourchettas_dead.png")}
            className="w-32 h-32"
          />
          <Text className="text-center w-3/4" color="warning">
            {t("services.fourchettas.apiError")}
          </Text>
        </View>
      </Page>
    );
  }

  return (
    <Page
      title={t("services.fourchettas.title")}
      header={
        <AboutModal
          title={t("services.fourchettas.title")}
          description={t("services.fourchettas.about")}
          additionalInfo={t("services.fourchettas.additionalInfo")}
        />
      }
      className="gap-6"
    >
      <Text variant="h2">{t("services.fourchettas.nextEvent")}</Text>
      <View className="min-w-full w-full flex items-center gap-4">
        {events.length === 0 ? (
          <View className="items-center gap-4">
            <Image
              source={require("@/assets/images/services/fourchettas.png")}
              style={{ width: 200, height: 200 }}
            />
            <Text className="text-center" color="primary">
              {t("services.fourchettas.noEvents")}
            </Text>
          </View>
        ) : (
          events.map((evt) => (
            <FourchettasEventCard
              key={evt.id}
              event={evt}
              onPress={() =>
                router.push(paths.fourchettasOrder(evt.id, evt.orderuser))
              }
            />
          ))
        )}
      </View>
    </Page>
  );
};

export default Fourchettas;
