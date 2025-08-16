import type { ReservationScheme } from "@/dto";

const parseDateSafe = (value: string): Date => {
  if (!value) return new Date(Number.NaN);
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  return new Date(normalized);
};

export const SortReservationSchema = (reservationList: ReservationScheme[]) => {
  return reservationList.sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateA.getTime() - dateB.getTime();
  });
};

export const generateCalendarSlots = (
  reservationList: (ReservationScheme | undefined)[],
  date: Date,
) => {
  const cleanedReservations: ReservationScheme[] = (
    reservationList || []
  ).filter(Boolean) as ReservationScheme[];
  const sortedReservations = SortReservationSchema(cleanedReservations);

  const slots: ReservationScheme[] = [];
  const startHour = 8;
  const endHour = 25;
  const currentDate = new Date(date);

  currentDate.setHours(startHour, 0, 0, 0);
  const endDate = new Date(currentDate);
  endDate.setHours(endHour, 0, 0, 0);

  while (currentDate < endDate) {
    const slotStart = new Date(currentDate);
    const slotEnd = new Date(currentDate);
    slotEnd.setHours(slotEnd.getHours() + 1);

    const reservation = sortedReservations.find((res) => {
      const resStart = parseDateSafe(res.start_date);
      const resEnd = parseDateSafe(res.end_date);
      return resStart < slotEnd && resEnd > slotStart;
    });

    if (reservation) {
      slots.push(reservation);
    } else {
      slots.push({
        id: -1,
        start_date: slotStart.toISOString(),
        end_date: slotEnd.toISOString(),
      });
    }

    currentDate.setHours(currentDate.getHours() + 1);
  }
  return slots;
};

export const toYMD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export const fromYMD = (ymd: string) => {
  const [y, m, d] = ymd.split("-").map((v) => Number(v));
  const date = new Date(y, (m || 1) - 1, d || 1);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const shiftDate = (base: string | undefined, deltaDays: number) => {
  const d = base ? fromYMD(base) : new Date();
  const shifted = new Date(d);
  shifted.setDate(d.getDate() + deltaDays);
  shifted.setHours(0, 0, 0, 0);
  return shifted;
};

export const formatDateSQL = (date: Date): string => {
  return date.toISOString().slice(0, 19).replace("T", " ");
};
