import { t } from "i18next";
import type { MachineData, MachinesApiResponse, MachineWithType } from "@/dto";
import { API_ROUTES, apiRequest, Method } from "@/api";

export const fetchWashingMachines = async (): Promise<MachineWithType[]> => {
    
	const response = await apiRequest<MachinesApiResponse>(API_ROUTES.washingMachines, Method.GET);

    if (!response.success) {
      	throw new Error(t("common.errors.unableToFetch"));
    }

	const mapMachines = <T extends MachineWithType["type"]>(
		machines: MachineData[],
		type: T
	): MachineWithType[] =>
		machines.map((machine) => ({
		...machine,
		type,
	}));

	return [
		...mapMachines(response.data.washing_machine ?? [], "WASHING MACHINE"),
		...mapMachines(response.data.dryer ?? [], "DRYER"),
	];

}
