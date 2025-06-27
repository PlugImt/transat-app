import { t } from "i18next";
import type { MachineData } from "@/types/washingMachine";

export async function fetchWashingMachines(): Promise<
  (MachineData & { type: "WASHING MACHINE" | "DRYER" })[]
> {
  const response = await fetch(
    "https://transat.destimt.fr/api/washingmachines",
  );

  if (!response.ok) {
    throw new Error(t("common.errors.unableToFetch"));
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(t("common.errors.unableToFetch"));
  }

  // Flatten and add type
  const washingMachines = (data.data.washing_machine || []).map(
    (machine: MachineData) => ({
      ...machine,
      type: "WASHING MACHINE" as const,
    }),
  );
  const dryers = (data.data.dryer || []).map((machine: MachineData) => ({
    ...machine,
    type: "DRYER" as const,
  }));

  return [...washingMachines, ...dryers];
}
