import LinkCard from "@/components/custom/card/LinkCard";
import { Page } from "@/components/page/Page";
import { useNavigation } from "expo-router/react-navigation";
import { AppNavigation } from "@/types/navigation/navigation.types";
import { t } from "i18next";

export const Plannings = () => {
  const navigation = useNavigation<AppNavigation>();
  
  return (
    <Page>
      <LinkCard
        title={t('services.plannings.sport.title')}
        description={t('services.plannings.sport.description')}
        size={"default"}
        onPress={()=>{navigation.navigate("PlanningSport")}}
    />
    </Page>
  );
};

export default Plannings;
