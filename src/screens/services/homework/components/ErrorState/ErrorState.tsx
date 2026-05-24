import { t } from "i18next";
import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { AboutModal } from "@/components/custom/AboutModal";
import { Page } from "@/components/page/Page";

export const ErrorState = ({
  error,
  onRefresh,
  refreshing,
}: {
  error: Error | null;
  onRefresh: () => void;
  refreshing: boolean;
}) => {
  return (
    <Page
      refreshing={refreshing}
      onRefresh={onRefresh}
      title={t("services.homework.title")}
      header={
        <AboutModal
          title={t("services.homework.title")}
          description={t("services.homework.about")}
          openingHours="TEMP"
          location={t("services.homework.location")}
          price={t("services.homework.price")}
          additionalInfo={t("services.homework.additionalInfo")}
        />
      }
    >
      <View className="min-h-screen flex justify-center items-center">
        <Text variant="h1" className="text-center" color="destructive">
          {error?.message}
        </Text>
      </View>
    </Page>
  );
};
