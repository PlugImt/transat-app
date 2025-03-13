import { storage } from "@/services/storage/asyncStorage";
import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { t } from "i18next";
import { twMerge } from "tailwind-merge";

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

export function outOfService() {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 21 || hour < 9;
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
    // Get the JWT token for authentication
    const token = await storage.get("token");
    if (!token) {
      throw new Error(t("account.noToken"));
    }

    // Create form data
    const formData = new FormData();

    formData.append("image", {
      uri: image.uri,
      name: image.uri.split("/").pop() || "image.jpg",
      type: `image/${image.uri.split(".").pop()}` || "image/jpeg",
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } as any);

    // Upload to your API
    const uploadResponse = await axios.post(
      "https://transat.destimt.fr/api/upload",
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (!uploadResponse.data.success) {
      throw new Error(t("account.uploadFailed"));
    }

    // Return the URL from your API response
    // Modify this based on your actual API response structure
    const baseUrl = "https://transat.destimt.fr/api";
    return baseUrl + uploadResponse.data.url;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error(t("account.uploadFailed"));
  }
}
