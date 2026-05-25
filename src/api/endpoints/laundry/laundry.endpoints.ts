import { t } from "i18next";
import { API_ROUTES } from "@/api/common";
import { Method } from "@/api/enums";
import { apiRequest } from "@/api/helpers";
import type {
  LaundryApiResponseSchema,
  LaundryData,
  LaundryWithType,
} from "@/dto";

export const fetchLaundry = async (): Promise<LaundryWithType[]> => {
  const response = await apiRequest<LaundryApiResponseSchema>(
    API_ROUTES.washingMachines,
    Method.GET,
  );

  if (!response.success) {
    throw new Error(t("common.errors.unableToFetch"));
  }

  const mapLaundry = <T extends LaundryWithType["type"]>(
    machines: LaundryData[],
    type: T,
  ): LaundryWithType[] =>
    machines.map((machine) => ({
      ...machine,
      type,
    }));

  return [
    ...mapLaundry(response.data.washing_machine ?? [], "WASHING MACHINE"),
    ...mapLaundry(response.data.dryer ?? [], "DRYER"),
  ];
};
