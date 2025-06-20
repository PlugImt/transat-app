export const API_ROUTES : Record<Route, ApiRoute> = {
    user: "/api/newf/me",
    notifications: "/api/newf/notifications/subscriptions",
    weather: "/api/weather",
    emploiDuTemps: "/api/edt",
    restaurant: "/api/restaurant/menu",
    traq: "/api/traq/",
    translation: "/api/translate",
    washingMachines: "/api/washingmachines",
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    saveToken: "/api/auth/token",
    saveExpoPushToken: "/api/auth/expo-push-token",
    verifyCode: "/api/auth/verify-code",
    resendCode: "/api/auth/resend-code",
    resetPassword: "/api/auth/reset-password",
    changePassword: "/api/auth/change-password"
};

type ApiRoute = `/api/${string}`;
type Route = 
  | "user"
  | "notifications"
  | "weather"
  | "emploiDuTemps"
  | "restaurant"
  | "traq"
  | "translation"
  | "washingMachines"
  | "login"
  | "register"
  | "logout"
  | "saveToken"
  | "saveExpoPushToken"
  | "verifyCode"
  | "resendCode"
  | "resetPassword"
  | "changePassword"