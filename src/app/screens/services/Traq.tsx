import Page from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import Loading from "@/components/custom/Loading";
import NotificationBell from "@/components/custom/NotificationBell";
import TraqCard from "@/components/custom/card/TraqCard";
import { useTraq } from "@/hooks/useTraq";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export const Traq = () => {
  const { t } = useTranslation();
  const { data: traq, isPending, refetch, error, isError } = useTraq();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const uniqueTags = useMemo(() => {
    if (!traq) return [];

    const tagSet = new Set<string>();
    for (const article of traq) {
      if (article.traq_type) {
        tagSet.add(article.traq_type);
      }
    }

    return Array.from(tagSet);
  }, [traq]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      return [...prev, tag];
    });
  };

  const clearTags = () => {
    setSelectedTags([]);
  };

  const filteredArticles = useMemo(() => {
    if (!traq) return [];
    if (selectedTags.length === 0) return traq;

    return traq.filter(
      (article) =>
        article.traq_type && selectedTags.includes(article.traq_type),
    );
  }, [traq, selectedTags]);

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

      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold text-foreground">
            {t("common.filter")}
          </Text>
          {selectedTags.length > 0 && (
            <TouchableOpacity onPress={clearTags}>
              <Text className="text-secondary">{t("common.clear_all")}</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pb-2"
        >
          {uniqueTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              onPress={() => toggleTag(tag)}
              className={`mr-2  pl-5 pr-5 pt-2 pb-2 py-1 rounded-lg ${
                selectedTags.includes(tag) ? "bg-secondary" : "bg-foreground"
              }`}
            >
              <Text
                className={`${
                  selectedTags.includes(tag) ? "text-white" : "text-gray-800"
                }`}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="flex flex-col gap-8">
        {filteredArticles.length === 0 ? (
          <View className="flex items-center justify-center py-10">
            <Text className="text-gray-500">
              {t("services.traq.no_items_found")}
            </Text>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            {filteredArticles.map((article) => (
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
        )}
      </View>
    </Page>
  );
};

export default Traq;
