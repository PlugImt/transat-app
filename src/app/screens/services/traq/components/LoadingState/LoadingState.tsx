import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { AboutSection } from "@/app/screens/services/traq/components/AboutSection";
import { BadgeSkeleton } from "@/components/common/Badge";
import { TraqCardLoading } from "@/components/custom/card/TraqCard";
import { Page } from "@/components/page/Page";

export const LoadingState = () => {
  const { t } = useTranslation();

  return (
    <Page
      className="gap-4"
      title={t("services.traq.title")}
      header={<AboutSection />}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[...Array(3).keys()].map((index) => (
          <BadgeSkeleton key={index} className="mr-2" variant="ghost" />
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
