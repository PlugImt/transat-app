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
  return hour >= 21 || hour < 11;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function uploadImage(): Promise<string> {
  // Demander la permission d'accès à la galerie
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    throw new Error(t("account.permissionDenied"));
  }

  // Ouvrir la galerie et sélectionner une image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    base64: true,
  });

  if (result.canceled || !result.assets[0].uri) {
    throw new Error("Image selection cancelled");
  }

  // Lire l'image en base64
  const image = result.assets[0];
  const base64 = await FileSystem.readAsStringAsync(image.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Upload sur ImgBB
  const formData = new FormData();
  formData.append("key", "08a0689ec289e5488db04a7da79d5dff");
  formData.append("image", base64);

  const uploadResponse = await axios.post(
    "https://api.imgbb.com/1/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  if (!uploadResponse.data.success) {
    throw new Error("Image upload failed");
  }

  return uploadResponse.data.data.url;
}
