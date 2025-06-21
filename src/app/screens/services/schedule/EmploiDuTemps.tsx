import { getEmploiDuTempsToday } from "@/api";
import Page from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import EmploiDuTempsCard from "@/components/custom/card/EmploiDuTempsCard";
import { QUERY_KEYS } from "@/constants";
import useAuth from "@/hooks/account/useAuth";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { LoadingState } from "./components";

export const EmploiDuTemps = () => {
	const { t } = useTranslation();

	const { user } = useAuth();

	const { refetch, isPending, error, isError } = useQuery({
		queryKey: QUERY_KEYS.emploiDuTemps,
		queryFn: user?.email ? () => getEmploiDuTempsToday(user.email) : skipToken,
		enabled: !!user?.email,
	});

	if (isPending) {
		return <LoadingState />;
	}

	if (isError) {
		return (
			<Page
				refreshing={isPending}
				onRefresh={refetch}
				title={t("services.emploiDuTemps.title")}
				about={
				<AboutModal
					title={t("services.emploiDuTemps.title")}
					description={t("services.restaurant.about")}
					openingHours="TEMP"
					location={t("services.restaurant.location")}
					price={t("services.restaurant.price")}
					additionalInfo={t("services.restaurant.additionalInfo")}
				/>
				}
			>
				<View className="min-h-screen flex justify-center items-center ">
					<Text className="text-red-500 text-center h1">{error?.message}</Text>
				</View>
			</Page>
		);
	}

	return (
		<Page
		refreshing={isPending}
		onRefresh={refetch}
		goBack
		title={t("services.emploiDuTemps.title")}
		about={
			<AboutModal
			title={t("services.emploiDuTemps.title")}
			description={t("services.restaurant.about")}
			openingHours="TEMP"
			location={t("services.restaurant.location")}
			price={t("services.restaurant.price")}
			additionalInfo={t("services.restaurant.additionalInfo")}
			/>
		}
		>
			<View className="flex flex-col gap-8">
				<View className="flex flex-col gap-4">
					<Text className="h3 ml-4">{t("services.restaurant.lunch")}</Text>
				</View>
				<View className="flex flex-col gap-4">
					<Text className="h3 ml-4">{t("services.restaurant.dinner")}</Text>
					<EmploiDuTempsCard
						title={t("services.restaurant.grill")}
						icon={"Beef"}
					/>
				</View>
			</View>
		</Page>
	);
};

export default EmploiDuTemps;