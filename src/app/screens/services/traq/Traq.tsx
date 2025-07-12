import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { useTraq } from "@/hooks/useTraq";
import {
  AboutSection,
  LoadingState,
  NoItemsFound,
  TraqFilter,
  TraqList,
} from "./components";

export const Traq = () => {
  const { t } = useTranslation();

  const { traq, refetch, isPending, isError, error } = useTraq();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = useMemo(() => {
    if (!traq) return [];

    const tagSet = new Set<string>();
    for (const article of traq) {
      if (article.traq_type) {
        tagSet.add(article.traq_type);
      }
    }

    return Array.from(tagSet);
  }, [traq]);

  const filteredArticles = useMemo(() => {
    if (!traq) return [];
    if (selectedTags.length === 0) return traq;

    return traq.filter(
      (article) =>
        article.traq_type && selectedTags.includes(article.traq_type),
    );
  }, [traq, selectedTags]);

  if (isPending) {
    return <LoadingState />;
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

  return (
    <Page
      goBack
      refreshing={isPending}
      onRefresh={refetch}
      className="gap-4"
      title={t("services.traq.title")}
      header={<AboutSection />}
    >
      <TraqFilter
        tags={tags}
        selected={selectedTags}
        setSelected={setSelectedTags}
      />
      {filteredArticles.length === 0 ? (
        <NoItemsFound />
      ) : (
        <TraqList items={filteredArticles} />
      )}
    </Page>
  );
};

export default Traq;
