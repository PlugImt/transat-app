import type { User } from "@/dto/user";

export interface ReservationItem {
  id: number;
  name: string;
  slot: boolean;
  user?: User;
}

export interface ReservationCategory {
  id: number;
  name: string;
}

export interface Reservation {
  id: number;
  start_date: string;
  end_date: string;
  user?: User;
}

export interface ReservationListResponse {
  categories?: ReservationCategory[];
  items?: ReservationItem[];
}

export type GetReservation = ReservationListResponse;

export interface ReservationItemResponse {
  item?: {
    id: number;
    name: string;
    slot: boolean;
    reservation?: Reservation[];
    reservation_before?: Reservation[];
    reservation_after?: Reservation[];
  };
  reservation?: Reservation[];
  reservation_before?: Reservation[];
  reservation_after?: Reservation[];
}

export interface MyReservationItem {
  id: number;
  name: string;
  slot: boolean;
  start_date: string;
  end_date: string | null;
}

export interface MyReservationsResponse {
  current: MyReservationItem[];
  past: MyReservationItem[];
}

export interface ReservationDisplayItem {
  id: number;
  name: string;
  type: "category" | "item";
  slot?: boolean;
  user?: User;
}

export interface GroupedReservations<T = MyReservationItem> {
  [date: string]: T[];
}

export interface ReservationCardBaseProps {
  id: number;
  name: string;
  variant?: "default" | "compact";
  showActions?: boolean;
}

export interface MyReservationCardProps extends ReservationCardBaseProps {
  item: MyReservationItem;
  action?: "cancel" | "return";
  showFullDate?: boolean;
}

export type ReservationTimeFilter = "all" | "past" | "current";

export interface ReservationMutationParams {
  id: number;
  isReturning?: boolean;
  isCancelling?: boolean;
  startDate?: string;
}
