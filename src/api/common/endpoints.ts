export const API_ROUTES : Record<Route, ApiRoute> = {
    user: "/api/newf/me",
    notifications: "/api/newf/notifications/subscriptions",
    weather: "/api/weather",
    planning_today: "/api/planning/users/:email/courses/today",
    planning_week: "/api/planning/users/:email/courses",
    restaurant: "/api/restaurant/menu",
    traq: "/api/traq/",
    translation: "/api/translate",
    washingMachines: "/api/washingmachines",
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    saveToken: "/api/auth/token",
    saveExpoPushToken: "/api/auth/expo-push-token",
    verifyCode: "/api/auth/verification-code",
    verifyAccount: '/api/auth/verify-account',
    resendCode: "/api/auth/resend-code",
    resetPassword: "/api/auth/reset-password",
    changePassword: "/api/auth/change-password"
};

type ApiRoute = `/api/${string}`;
type Route = 
  | "user"
  | "notifications"
  | "weather"
  | "planning_today"
  | "planning_week"
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
  | "verifyAccount"
  | "resendCode"
  | "resetPassword"
  | "changePassword"