import React from "react";
import LinkCard from "@/components/custom/card/LinkCard";
import { Page } from "@/components/page/Page";
import { useNavigation } from "expo-router/react-navigation";
import { AppNavigation } from "@/types/navigation/navigation.types";
import { t } from "i18next";

export const Plannings = () => {
  const navigation = useNavigation<AppNavigation>();

  return (
    <Page title={t('services.plannings.title')}>
      <>
        <LinkCard
          title={t('services.plannings.sport.title')}
          description={t('services.plannings.sport.description')}
          size={"default"}
          onPress={() => { navigation.navigate("PlanningSport") }}
        />
        <LinkCard
          title="inté"
          description="inté"
          size={"default"}
          onPress={() => { navigation.navigate("PlanningInte") }}
        />
      </>
    </Page>
  );
};

export default Plannings;
