import type { Href } from "expo-router";
import type { Homework, OrderedItem } from "@/dto";

type Query = Record<string, string>;

const id = (value: number) => String(value);

const route = (pathname: string, params?: Query): Href =>
  (params ? { pathname, params } : pathname) as Href;

/**
 * Shared screens live in the `(home,services)` directory. Expo Router expands
 * that array group into the `(home)` and `(services)` tabs, so the comma form
 * is not a URL segment. Prefixing `(services)` opens the screen on the
 * Services tab, including from a cold start.
 */
const services = (pathname: string, params?: Query): Href =>
  route(`/(services)${pathname}`, params);

export const paths = {
  welcome: "/welcome" as Href,
  signIn: "/sign-in" as Href,
  signUp: "/sign-up" as Href,
  resetPassword: (email: string) => route("/reset-password", { email }),
  authLegal: "/legal" as Href,

  home: "/" as Href,
  services: "/services" as Href,
  photos: "/photos" as Href,
  account: "/account" as Href,

  laundry: "/laundry" as Href,
  restaurant: "/restaurant" as Href,
  restaurantReviews: (restaurantId: number) =>
    route("/restaurant/[id]", { id: id(restaurantId) }),
  timetable: "/timetable" as Href,
  homework: "/homework" as Href,
  homeworkDetails: (homework: Homework) =>
    route("/homework/[id]", {
      id: id(homework.id),
      homework: JSON.stringify(homework),
    }),
  clubs: "/clubs" as Href,
  club: (clubId: number) => route("/clubs/[id]", { id: id(clubId) }),
  clubMembers: (clubId: number) =>
    route("/clubs/[id]/members", { id: id(clubId) }),
  clubEvents: (clubId: number) =>
    route("/clubs/[id]/events", { id: id(clubId) }),
  events: "/events" as Href,
  event: (eventId: number) => route("/events/[id]", { id: id(eventId) }),
  editEvent: (eventId: number) =>
    route("/events/[id]/edit", { id: id(eventId) }),
  eventMembers: (eventId: number) =>
    route("/events/[id]/members", { id: id(eventId) }),
  addEvent: "/events/new" as Href,
  traq: "/traq" as Href,
  olimtpe: "/olimtpe" as Href,
  reservation: "/reservation" as Href,
  myReservations: "/reservation/mine" as Href,
  reservationCategory: (categoryId: number, title: string) =>
    route("/reservation/[id]", { id: id(categoryId), title }),
  reservationCalendar: (itemId: number, title?: string, date?: string) =>
    route("/reservation/[id]/calendar", {
      id: id(itemId),
      title: title ?? "",
      date: date ?? "",
    }),
  fourchettas: "/fourchettas" as Href,
  fourchettasOrder: (eventId: number, orderUser?: OrderedItem[]) =>
    route("/fourchettas/[id]", {
      id: id(eventId),
      orderUser: orderUser ? JSON.stringify(orderUser) : "",
    }),
  games: "/games" as Href,
  bassine: "/games/bassine" as Href,
  bassineLeaderboard: "/games/bassine/leaderboard" as Href,

  album: (albumId: number, title: string) =>
    route("/photos/[id]", { id: id(albumId), title }),

  editProfile: "/account/edit-profile" as Href,
  settings: "/account/settings" as Href,
  changePassword: "/account/change-password" as Href,
  notifications: "/account/notifications" as Href,
  language: "/account/language" as Href,
  appearance: "/account/appearance" as Href,
  about: "/account/about" as Href,
  help: "/account/help" as Href,
  legal: "/account/legal" as Href,

  profilePicture: "/profile-picture" as Href,
  basicInfo: "/basic-info" as Href,
  academicInfo: "/academic-info" as Href,
  preview: "/preview" as Href,
  success: "/success" as Href,
};

/** Screen names stored on service preferences and sent by notifications. */
export const preferenceHref = {
  Laundry: paths.laundry,
  Restaurant: paths.restaurant,
  Traq: paths.traq,
  Fourchettas: paths.fourchettas,
  Clubs: paths.clubs,
  Reservation: paths.reservation,
  Events: paths.events,
  Games: paths.games,
  Bassine: paths.bassine,
} as const;

export type PreferenceScreen = keyof typeof preferenceHref;

const serviceLanding = {
  Laundry: "/laundry",
  Timetable: "/timetable",
  Homework: "/homework",
  Clubs: "/clubs",
  Events: "/events",
  Traq: "/traq",
  Reservation: "/reservation",
  MyReservations: "/reservation/mine",
  Fourchettas: "/fourchettas",
  Restaurant: "/restaurant",
} as const;

export type ServiceLanding = keyof typeof serviceLanding;

export function servicesHref(
  screen:
    | ServiceLanding
    | "EventDetails"
    | "ClubDetails"
    | "ReservationCalendar",
  params?: { id?: number; title?: string; date?: string },
): Href {
  if (screen === "EventDetails" || screen === "ClubDetails") {
    const pathname = screen === "EventDetails" ? "/events/[id]" : "/clubs/[id]";
    return services(pathname, { id: id(params?.id ?? 0) });
  }
  if (screen === "ReservationCalendar") {
    return services("/reservation/[id]/calendar", {
      id: id(params?.id ?? 0),
      title: params?.title ?? "",
      date: params?.date ?? "",
    });
  }
  return services(serviceLanding[screen]);
}

export function photosHref(
  screen: "Photos" | "AlbumDetails",
  params?: { id: number; title?: string },
): Href {
  if (screen === "Photos" || !params) return paths.photos;
  return paths.album(params.id, params.title ?? "");
}
