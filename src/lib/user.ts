import { storage } from "@/services/storage/asyncStorage";
import type { Password, User } from "@/types/user";
import { apiRequest } from "./apiRequest";

export async function fetchUser(): Promise<User> {
  const data = await apiRequest<User>("/api/newf/me");
  await storage.set("newf", data);
  return data;
}

export async function updateLanguage(language: string) {
  return apiRequest("/api/newf/me", "PATCH", { language });
}

export async function updateUser(data: User) {
  try {
    return apiRequest<User>("/api/newf/me", "PATCH", {
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      scolarity: {
        graduation_year: data.scolarity?.graduation_year,
        branch: data.scolarity?.branch,
        group: data.scolarity?.group,
      },
      language: data.language,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user information");
  }
}

export async function updateProfilePicture(imageUrl: string) {
  const response = await apiRequest<{ profile_picture: string }>(
    "/api/newf/me",
    "PATCH",
    { profile_picture: imageUrl },
  );
  return response.profile_picture;
}

export async function updatePassword(data: Password) {
  return apiRequest("/api/auth/change-password", "PATCH", {
    email: data.email,
    password: data.password,
    new_password: data.new_password,
    new_password_confirmation: data.new_password_confirmation,
  });
}
