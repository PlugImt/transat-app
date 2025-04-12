import { storage } from "@/services/storage/asyncStorage";
import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { t } from "i18next";
import { twMerge } from "tailwind-merge";
import { getAPIUrl } from "./apiRequest";

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

export function isWeekend() {
  const now = new Date();
  const day = now.getDay();
  return day === 0 || day === 6 || (day === 5 && now.getHours() > 14); // Sunday or Saturday
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
  const _base64 = await FileSystem.readAsStringAsync(image.uri, {
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

/**
 * Calculates the current study year based on the graduation year
 * @param graduation_year Graduation year of the student
 * @returns A string representing the current study year
 * @example "2ème année"
 */
export function getStudentYear(graduationYear: number) {
  const maxStudyYears = 3;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // L'année académique commence en septembre (8ème mois)
  // Si on est avant septembre, l'année académique est l'année en cours
  // Si on est après septembre, l'année académique est l'année en cours + 1
  const academicYear = currentMonth >= 8 ? currentYear + 1 : currentYear;
  const yearsLeft = graduationYear - academicYear;

  // Le programme est en 3 ans
  const currentStudyYear = maxStudyYears - yearsLeft;
  console.log("currentStudyYear", currentStudyYear, yearsLeft);
  const studyLevel = [
    t("account.firstYear"),
    t("account.secondYear"),
    t("account.thirdYear"),
  ];

  // Si l'année d'étude est supérieure à 3, on retourne l'année de la promotion
  if (currentStudyYear > maxStudyYears || currentStudyYear <= 0) {
    return `${t("account.promotion")} ${graduationYear}`;
  }

  return studyLevel[currentStudyYear - 1];
}
