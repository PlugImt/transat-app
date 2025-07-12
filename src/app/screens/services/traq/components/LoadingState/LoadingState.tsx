import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { AboutSection } from "@/app/screens/services/traq/components/AboutSection";
import { BadgeLoading } from "@/components/common/Badge";
import { TraqCardLoading } from "@/components/custom/card/TraqCard";
import { Page } from "@/components/page/Page";
import { TextSkeleton } from "@/components/Skeleton";

export const LoadingState = () => {
  const { t } = useTranslation();

  return (
    <Page
      goBack
      className="gap-4"
      title={t("services.traq.title")}
      header={<AboutSection />}
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
