import { DepartureData } from "@/dto";

export const MOCK_DEPARTURES: DepartureData = [
    {
        name: "C6",
        nextDeparture: new Date(Date.now() + 3 * 60 * 1000),
        nextDeparture2: new Date(Date.now() + 12 * 60 * 1000),
    },
    {
        name: "E5",
        nextDeparture: new Date(Date.now() + 5 * 60 * 1000),
        nextDeparture2: new Date(Date.now() + 305 * 60 * 1000),
    },
    {
        name: "75",
        nextDeparture: new Date(Date.now() + 0 * 60 * 1000),
        nextDeparture2: new Date(Date.now() + 10 * 60 * 1000),
    },
];