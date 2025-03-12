import { storage } from "@/services/storage/asyncStorage";
import type { Password, User } from "@/types/user";
import axios from "axios";
import { t } from "i18next";

export async function fetchUser(): Promise<User> {
  const token = await storage.get("token");
  const url = "https://transat.destimt.fr/api/newf/me";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(t("common.errors.unableToFetch"));
  }
  const data = await response.json();
  await storage.set("newf", data);

  return data;
}

export async function updateUser(data: User) {
  const token = await storage.get("token");
  if (!token) {
    throw new Error(t("account.noToken"));
  }

  const response = await axios.patch(
    "https://transat.destimt.fr/api/newf/me",
    {
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      graduation_year: data.graduation_year,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (response.status !== 200) {
    throw new Error(t("account.updateFailed"));
  }

  return response.data as User;
}

export async function updateProfilePicture(imageUrl: string) {
  const token = await storage.get("token");
  if (!token) {
    throw new Error(t("account.noToken"));
  }

  const response = await axios.patch(
    "https://transat.destimt.fr/api/newf/me",
    { profile_picture: imageUrl },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (response.status !== 200) {
    throw new Error(t("account.profilePictureUpdateFailed"));
  }

  return response.data.profile_picture;
}

export async function updatePassword(data: Password) {
  const token = await storage.get("token");
  if (!token) {
    throw new Error(t("account.noToken"));
  }

  const response = await axios.patch(
    "https://transat.destimt.fr/api/auth/change-password",
    {
      email: data.email,
      password: data.password,
      new_password: data.new_password,
      new_password_confirmation: data.new_password_confirmation,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (response.status !== 200) {
    throw new Error(t("account.updateFailed"));
  }
}
