import { TextSkeleton } from "@/components/Skeleton";
import Badge, { BadgeLoading } from "@/components/common/Badge";
import Page from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import ErrorPage from "@/components/custom/ErrorPage";
import TraqCard, { TraqCardLoading } from "@/components/custom/card/TraqCard";
import { useTheme } from "@/contexts/ThemeContext";
import { useTraq } from "@/hooks/useTraq";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

export const Traq = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
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
    return <TraqLoading />;
  }

  if (isError && error) {
    return (
      <ErrorPage
        error={
          error || ({ message: t("common.errors.unableToFetch") } as Error)
        }
        refetch={refetch}
        isRefetching={isPending}
      />
    );
  }

  if (!traq) {
    return (
      <Page>
        <View className="flex items-center justify-center">
          <Text className="h3 text-muted-foreground">
            {t("services.traq.noItemsFound")}
          </Text>
        </View>
      </Page>
    );
  }

  return (
    <Page
      goBack
      refreshing={isPending}
      onRefresh={refetch}
      className="gap-4"
      title={t("services.traq.title")}
      about={
        <AboutModal
          title={t("services.traq.title")}
          description={t("services.traq.about")}
          openingHours={t("services.traq.openingHours")}
          location={t("services.traq.location")}
          additionalInfo={t("services.traq.additionalInfo")}
        />
      }
    >
      <View className="flex-row justify-between items-center ml-4">
        <Text className="h2" style={{ color: theme.text }}>
          {t("common.filter")}
        </Text>
        {selectedTags.length > 0 && (
          <Badge
            label={t("common.clearAll")}
            variant="secondary"
            onPress={clearTags}
          />
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="ml-4"
      >
        {uniqueTags.map((tag) => (
          <Badge
            key={tag}
            label={tag}
            variant={selectedTags.includes(tag) ? "secondary" : "light"}
            onPress={() => toggleTag(tag)}
            className="mr-2"
          />
        ))}
      </ScrollView>

      {filteredArticles.length === 0 ? (
        <View className="flex items-center justify-center h-full">
          <Text className="h3 text-muted-foreground">
            {t("services.traq.noItemsFound")}
          </Text>
        </View>
      ) : (
        <View className="gap-4">
          {filteredArticles.map((article) => (
            <TraqCard
              key={article.id_traq}
              image={article.picture}
              description={article.description}
              name={article.name}
              price={article.price}
              limited={article.limited}
              outOfStock={article.outOfStock}
              alcohol={article.alcohol}
              priceHalf={article.priceHalf}
            />
          ))}
        </View>
      )}
    </Page>
  );
};

export default Traq;

const TraqLoading = () => {
  const { t } = useTranslation();

  return (
    <Page
      goBack
      className="gap-4"
      title={t("services.traq.title")}
      about={
        <AboutModal
          title={t("services.traq.title")}
          description={t("services.traq.about")}
          openingHours={t("services.traq.openingHours")}
          location={t("services.traq.location")}
          additionalInfo={t("services.traq.additionalInfo")}
        />
      }
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
