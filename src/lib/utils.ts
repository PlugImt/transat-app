import { storage } from "@/services/storage/asyncStorage";
import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { t } from "i18next";
import { twMerge } from "tailwind-merge";
import { getAPIUrl } from "./apiRequest";
import { apiUrlDev, apiUrlProd } from "./config";

export function isLunch() {
  const now = new Date();
  const hour = now.getHours();
  return hour < 14;
}

export function isDinner() {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 14 && hour < 21;
}

export function outOfService(lastUpdate: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const updateDate = new Date(lastUpdate);
  const updateDay = new Date(
    updateDate.getFullYear(),
    updateDate.getMonth(),
    updateDate.getDate(),
  );

  // Return true if update date is before today, false otherwise
  return updateDay < today;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function uploadImage(): Promise<string> {
  // Request permission to access the gallery
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    throw new Error(t("account.permissionDenied"));
  }

  // Open the gallery and select an image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8, // Reduced quality for better performance
  });

  if (result.canceled || !result.assets[0].uri) {
    throw new Error();
  }

  // Get the selected image
  const image = result.assets[0];
  const base64 = await FileSystem.readAsStringAsync(image.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  try {
    const token = await storage.get("token");
    if (!token) {
      throw new Error(t("account.noToken"));
    }

    const formData = new FormData();

    formData.append("image", {
      uri: image.uri,
      name: image.uri.split("/").pop() || "image.jpg",
      type: `image/${image.uri.split(".").pop()}` || "image/jpeg",
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } as any);

    const apiUrl = await getAPIUrl();

    const uploadResponse = await axios.post(`${apiUrl}/api/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (!uploadResponse.data.success) {
      throw new Error(t("account.profilePictureUpdateFailed"));
    }

    return apiUrl + uploadResponse.data.url;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error(t("account.profilePictureUpdateFailed"));
  }
}
