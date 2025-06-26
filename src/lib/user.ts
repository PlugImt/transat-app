import { storage } from "@/services/storage/asyncStorage";
import type { Password, User } from "@/types/user";
import { apiRequest } from "./apiRequest";

export async function fetchUser(): Promise<User> {
  const data = await apiRequest<User>("/newf/me");
  await storage.set("newf", data);
  return data;
}

export async function updateLanguage(language: string) {
  return apiRequest("/newf/me", "PATCH", { language });
}

export async function updateUser(data: User) {
  return apiRequest<User>("/newf/me", "PATCH", {
    first_name: data.first_name,
    last_name: data.last_name,
    phone_number: data.phone_number,
    graduation_year: data.graduation_year,
    language: data.language,
  });
}

export async function updateProfilePicture(imageUrl: string) {
  const response = await apiRequest<{ profile_picture: string }>(
    "/newf/me",
    "PATCH",
    { profile_picture: imageUrl },
  );
  return response.profile_picture;
}

export async function updatePassword(data: Password) {
  return apiRequest("/auth/change-password", "PATCH", {
    email: data.email,
    password: data.password,
    new_password: data.new_password,
    new_password_confirmation: data.new_password_confirmation,
  });
}
