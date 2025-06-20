import Page from "@/components/common/Page";
import ErrorPage from "@/components/custom/ErrorPage";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AboutSection, LoadingState, NoItemsFound, TraqFilter, TraqList } from "./components";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { getTraq } from "@/api";

export const Traq = () => {
	const { t } = useTranslation();
	
	const { data: traq, isPending, refetch, error, isError } = useQuery({
		queryKey: QUERY_KEYS.traq,
		queryFn: () => getTraq(),
		initialData: []
	});

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
			(article) => article.traq_type && selectedTags.includes(article.traq_type),
		);
	}, [traq, selectedTags]);

	if (isPending) {
		return <LoadingState/>
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
			about={<AboutSection/>}
		>
			<TraqFilter tags={tags} selected={selectedTags} setSelected={setSelectedTags} />
			{filteredArticles.length === 0 ? <NoItemsFound /> : <TraqList items={filteredArticles} />}
		</Page>
	);
};

export default Traq;