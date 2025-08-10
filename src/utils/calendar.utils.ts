import type { ReservationScheme } from "@/dto";

export const SortReservationSchema = (reservationList: ReservationScheme[]) => {
  return reservationList.sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateA.getTime() - dateB.getTime();
  });
};

export const generateCalendarSlots = (
  reservationList: ReservationScheme[],
  date: Date,
) => {
  const sortedReservations = SortReservationSchema(reservationList);

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
      const resStart = new Date(res.start_date);
      const resEnd = new Date(res.end_date);
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
