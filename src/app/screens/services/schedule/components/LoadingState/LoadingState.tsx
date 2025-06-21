import Page from "@/components/common/Page";
import { AboutModal } from "@/components/custom/AboutModal";
import EmploiDuTempsCard from "@/components/custom/card/EmploiDuTempsCard";
import { useTranslation } from "react-i18next";
import { View, Text } from "react-native";

export const LoadingState = () => {
  	const { t } = useTranslation();

	return (
		<Page
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

					<EmploiDuTempsCard
						title={t("services.restaurant.grill")}
						icon={"Beef"}
					/>
					<EmploiDuTempsCard
						title={t("services.restaurant.migrator")}
						icon={"ChefHat"}
					/>
					<EmploiDuTempsCard
						title={t("services.restaurant.vegetarian")}
						icon={"Vegan"}
					/>
					<EmploiDuTempsCard
						title={t("services.restaurant.sideDishes")}
						icon={"Soup"}
					/>
				</View>
			</View>
		</Page>
	);
};
