import type { MachineData } from "@/types/washingMachine";

export async function fetchWashingMachines(): Promise<
  MachineData[] | undefined
> {
  const response = await fetch(
    "https://status.wi-line.fr/update_machine_ext.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: new URLSearchParams({
        action: "READ_LIST_STATUS",
        serial_centrale: "65e4444c3471550a789e2138a9e28eff",
      }).toString(),
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.machine_info_status.machine_list as MachineData[];
}
