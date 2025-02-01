import axios from "axios";

interface MachineData {
    machine_id: string;
    nom_type: string;
    selecteur_machine: string;
    status: number;
    time_before_off: number;
}

export async function getWashingMachines(setRefreshing: (refreshing: boolean) => void): Promise<MachineData[] | undefined> {
    try {
        const response = await axios.post(
            'https://status.wi-line.fr/update_machine_ext.php',
            new URLSearchParams({
                action: 'READ_LIST_STATUS',
                serial_centrale: '65e4444c3471550a789e2138a9e28eff'
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
            }
        );

        setRefreshing(false);
        return (response.data.machine_info_status.machine_list);
    } catch (error) {
        console.error('Axios error:', error);
    } finally {
        setRefreshing(false);
    }
}
