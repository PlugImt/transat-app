import { type RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { UserStack } from "@/components/custom";
import { Page } from "@/components/page/Page";
import type { AppStackParamList } from "@/types/navigation";

export type ClubDetailsRouteProp = RouteProp<AppStackParamList, "ClubDetails">;

const ClubDetails = () => {
  const { t } = useTranslation();
  const route = useRoute<ClubDetailsRouteProp>();
  //   const { id } = route.params;

  const pictures = [
    "https://picsum.photos/200/300",
    "https://picsum.photos/202/302",
    "https://picsum.photos/203/303",
    "https://picsum.photos/204/304",
    "https://picsum.photos/205/305",
    "https://picsum.photos/206/306",
  ];

  return (
    <Page title={t("services.clubs.title")}>
      <View className="gap-4">
        <View>
          <Text variant="sm">M214</Text>
          <Text variant="h2">Bureau Des Arts</Text>
          <Text color="muted">
            Événements et promotion de l’art sur le campus
          </Text>
        </View>
        <UserStack pictures={pictures} count={10} />
      </View>
    </Page>
  );
};

export default ClubDetails;
