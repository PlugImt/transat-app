import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { BadgeLoading } from "@/components/common/Badge";
import Page from "@/components/common/Page";
import { TraqCardLoading } from "@/components/custom/card/TraqCard";
import { TextSkeleton } from "@/components/Skeleton";
import { AboutSection } from "../AboutSection";

export const LoadingState = () => {
  const { t } = useTranslation();

  return (
    <Page
      goBack
      className="gap-4"
      title={t("services.traq.title")}
      about={<AboutSection />}
    >
      <View className="flex-row justify-between items-center">
        <TextSkeleton lines={1} variant="h2" lastLineWidth={100} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[...Array(3).keys()].map((index) => (
          <BadgeLoading key={index} className="mr-2" />
        ))}
      </ScrollView>
      <View className="gap-4">
        {[...Array(5).keys()].map((index) => (
          <TraqCardLoading key={index} />
        ))}
      </View>
    </Page>
  );
};
