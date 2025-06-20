import { fetchWashingMachines } from "@/api";
import Page from "@/components/common/Page";
import { QUERY_KEYS } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import type { MachineWithType } from "@/dto";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { AboutSection, ErrorState, MachineList, WashingMachineLoadingState } from "./components";

export const WashingMachines = () => {
	const { t } = useTranslation();
	const { theme } = useTheme();
	const [_aboutPopupVisible, _setAboutPopupVisible] = useState(false);

	const { data = [], isPending, isFetching, isError, error, refetch } = useQuery({
		queryFn: () => fetchWashingMachines(),
		queryKey: QUERY_KEYS.washingMachines,
		initialData: []
	});
  
	if (isPending)
		return <WashingMachineLoadingState />;

	if (isError)
		return <ErrorState error={error} title={t("services.washingMachine.title")} onRefresh={refetch} />;

	const washingMachines = data?.filter((machine: MachineWithType) => machine.type === "WASHING MACHINE");
	const dryers = data?.filter((machine: MachineWithType) => machine.type === "DRYER");

  	const isEmpty = washingMachines.length === 0 && dryers.length === 0;

	return (
		<Page
			goBack
			onRefresh={refetch}
			refreshing={isFetching}
			className="gap-6"
			title={t("services.washingMachine.title")}
			about={<AboutSection/>}
		>
			{isEmpty ? (
				<View className="min-h-screen flex justify-center items-center">
					<Text style={{ color: theme.text }} className="text-center h1">
						{t("services.washingMachine.noMachine")}
					</Text>
				</View>
			) : (
				<>
					<MachineList
						title={t("services.washingMachine.washingMachine")}
						items={washingMachines}
						icon="WASHING MACHINE"
					/>
					<MachineList
						title={t("services.washingMachine.dryer")}
						items={dryers}
						icon="DRYER"
					/>
				</>
			)}
		</Page>
	);
};

export default WashingMachines;