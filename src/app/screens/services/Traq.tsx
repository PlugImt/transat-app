import Page from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import Loading from "@/components/custom/Loading";
import NotificationBell from "@/components/custom/NotificationBell";
import TraqCard from "@/components/custom/card/TraqCard";
import { useTraq } from "@/hooks/useTraq";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const Traq = () => {
  const { t } = useTranslation();

  const { data: traq, isPending, refetch, error, isError } = useTraq();

  if (isPending) {
    return <Loading />;
  }

  const header = (
    <View className="flex-row gap-2 justify-between items-center">
      <View className="flex flex-row items-center gap-2">
        <Text className="h1 m-4">{t("services.traq.title")}</Text>
        <NotificationBell service={"TRAQ"} />
      </View>

      <AboutModal
        title={t("services.traq.title")}
        description={t("services.traq.about")}
        openingHours={t("services.traq.opening_hours")}
        location={t("services.traq.location")}
        additionalInfo={t("services.traq.additional_info")}
      />
    </View>
  );

  if (isError) {
    return (
      <Page refreshing={isPending} onRefresh={refetch}>
        {header}

        <View className="min-h-screen flex justify-center items-center ">
          <Text className="text-red-500 text-center h1">{error?.message}</Text>
        </View>
      </Page>
    );
  }

  return (
    <Page refreshing={isPending} onRefresh={refetch}>
      {header}

      <View className="flex flex-col gap-8">
        <View className="flex flex-col gap-4">
          {traq?.map((article) => (
            <TraqCard
              key={article.id_traq}
              image={article.picture}
              description={article.description}
              name={article.name}
              price={article.price}
              limited={article.limited}
              outOfStock={article.out_of_stock}
              alcohol={article.alcohol}
              priceHalf={article.price_half}
            />
          ))}
        </View>
      </View>
    </Page>
  );
};

export default Traq;
