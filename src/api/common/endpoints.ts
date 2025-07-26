export const API_ROUTES: Record<Route, ApiRoute> = {
  user: "/newf/me",
  notifications: "/newf/notifications/subscriptions",
  weather: "/weather",
  planning_today: "/planning/users/:email/courses/today",
  planning_week: "/planning/users/:email/courses",
  restaurant: "/restaurant",
  restaurantRating: "/restaurant/:id",
  traq: "/traq/",
  translation: "/translate",
  washingMachines: "/washingmachines",
  login: "/auth/login",
  register: "/auth/register",
  logout: "/auth/logout",
  saveToken: "/auth/token",
  saveExpoPushToken: "/auth/expo-push-token",
  verifyCode: "/auth/verification-code",
  verifyAccount: "/auth/verify-account",
  resendCode: "/auth/resend-code",
  resetPassword: "/auth/reset-password",
  changePassword: "/auth/change-password",
  club: "/club",
};

type ApiRoute = `/${string}`;
type Route =
  | "user"
  | "notifications"
  | "weather"
  | "planning_today"
  | "planning_week"
  | "restaurant"
  | "restaurantRating"
  | "traq"
  | "translation"
  | "washingMachines"
  | "login"
  | "register"
  | "logout"
  | "saveToken"
  | "saveExpoPushToken"
  | "verifyCode"
  | "verifyAccount"
  | "resendCode"
  | "resetPassword"
  | "changePassword"
  | "club";
