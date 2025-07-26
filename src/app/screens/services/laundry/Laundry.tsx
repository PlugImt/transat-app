import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import { useLaundry } from "@/hooks/services/laundry/useLaundry";
import {
  AboutSection,
  ErrorState,
  LaundryList,
  LaundryLoadingState,
} from "./components";

export const Laundry = () => {
  const { t } = useTranslation();
  const [_aboutPopupVisible, _setAboutPopupVisible] = useState(false);

  const {
    dryers,
    washingMachines,
    error,
    isEmpty,
    isError,
    isFetching,
    isPending,
    refetch,
  } = useLaundry();

  if (isPending) return <LaundryLoadingState />;

  if (isError)
    return (
      <ErrorState
        error={error}
        title={t("services.laundry.title")}
        onRefresh={refetch}
      />
    );

  return (
    <Page
      onRefresh={refetch}
      refreshing={isFetching}
      className="gap-6"
      title={t("services.laundry.title")}
      header={<AboutSection />}
    >
      {isEmpty ? (
        <View className="min-h-screen flex justify-center items-center">
          <Text variant="h1" className="text-center">
            {t("services.laundry.noMachine")}
          </Text>
        </View>
      ) : (
        <>
          <LaundryList
            title={t("services.laundry.washingMachine")}
            items={washingMachines}
            icon="WASHING MACHINE"
          />
          <LaundryList
            title={t("services.laundry.dryer")}
            items={dryers}
            icon="DRYER"
          />
        </>
      )}
    </Page>
  );
};

export default Laundry;
