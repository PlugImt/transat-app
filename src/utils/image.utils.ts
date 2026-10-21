import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { t } from "i18next";
import type { ImageSourcePropType } from "react-native";
import { API_ROUTES } from "@/api/common";
import { Method } from "@/api/enums";
import { apiRequest } from "@/api/helpers/api-request";

/**
 * Opens the gallery, lets the user pick an image, and uploads it to the API.
 * Returns the uploaded image URL.
 */
export const uploadImage = async (): Promise<string> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    throw new Error(t("account.permissionDenied"));
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0].uri) {
    throw new Error();
  }

  const image = result.assets[0];

  try {
    // expo/fetch (the global fetch since SDK 58) does not read `{ uri, name, type }` parts: it needs a File.
    const formData = new FormData();
    formData.append("image", new File(image.uri) as unknown as Blob);

    const upload = await apiRequest<{ success: boolean; url: string }>(
      API_ROUTES.upload,
      Method.POST,
      formData,
    );

    if (!upload.success) {
      throw new Error(t("account.profilePictureUpdateFailed"));
    }

    return upload.url;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error(t("account.profilePictureUpdateFailed"));
  }
};

export const isValidSource = (src: ImageSourcePropType | undefined) => {
  if (!src) return false;
  if (typeof src === "number") return true;
  if (
    typeof src === "object" &&
    "uri" in src &&
    src.uri &&
    src.uri.trim() !== ""
  )
    return true;
  return false;
};

export const normalizeSource = (
  source?: ImageSourcePropType | string,
): ImageSourcePropType | undefined => {
  if (!source) return undefined;
  if (typeof source === "string") return { uri: source };
  return source;
};
