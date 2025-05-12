import { apiRequest, getAPIUrl } from "@/lib/apiRequest";
import { storage } from "@/services/storage/asyncStorage";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { t } from "i18next";

export interface SupportRequest {
  id: string;
  subject: string;
  message: string;
  image_url?: string;
  status: "pending" | "in_progress" | "resolved";
  created_at: string;
  response?: string;
}

export interface CreateSupportRequest {
  subject: string;
  message: string;
  image_url?: string;
}

/**
 * Fetches all support requests for the current user
 * @returns A list of support requests
 */
export async function fetchSupportRequests(): Promise<SupportRequest[]> {
  try {
    const response = await apiRequest<{ requests: SupportRequest[] }>(
      "/api/support",
      "GET",
    );

    // Sort requests by date, newest first
    return response.requests.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  } catch (error) {
    console.error("Error fetching support requests:", error);
    throw error;
  }
}

/**
 * Creates a new support request
 * @param data The support request data
 * @returns The created support request
 */
export async function createSupportRequest(
  data: CreateSupportRequest,
): Promise<SupportRequest> {
  try {
    // Convert to Record<string, unknown> explicitly
    const payload: Record<string, unknown> = {
      subject: data.subject,
      message: data.message,
    };

    if (data.image_url) {
      payload.image_url = data.image_url;
    }

    const response = await apiRequest<{ request: SupportRequest }>(
      "/api/support",
      "POST",
      payload,
    );

    return response.request;
  } catch (error) {
    console.error("Error creating support request:", error);
    throw error;
  }
}

/**
 * Uploads an image for a support request
 * @returns The URL of the uploaded image
 */
export async function uploadSupportImage(): Promise<string | undefined> {
  // Request permission to access the gallery
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    throw new Error(t("account.permissionDenied"));
  }

  // Open the gallery and select an image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0].uri) {
    return undefined; // User canceled, return undefined instead of throwing error
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
      throw new Error(t("settings.help.imageUploadFailed"));
    }

    return apiUrl + uploadResponse.data.url;
  } catch (error) {
    console.error("Support image upload failed:", error);
    throw error;
  }
}
