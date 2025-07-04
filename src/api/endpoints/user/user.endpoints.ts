import { API_ROUTES, apiRequest, Method } from "@/api";
import type {
  UpdatePasswordPayload,
  UpdateProfilePictureResponse,
  UpdateUserPayload,
  User,
} from "@/dto";
import { storage } from "@/services/storage/asyncStorage";

export const fetchUser = async (): Promise<User> => {
  const data = await apiRequest<User>(API_ROUTES.user);
  await storage.set("newf", data);
  return data;
};

export const updateLanguage = async (language: string) => {
  return await apiRequest(API_ROUTES.user, Method.PATCH, { language });
};

export const updateUser = async (data: UpdateUserPayload) => {
  return await apiRequest<UpdateUserPayload>(API_ROUTES.user, Method.PATCH, {
    ...data,
  });
};

export const updateProfilePicture = async (imageUrl: string) => {
  const response = await apiRequest<UpdateProfilePictureResponse>(
    API_ROUTES.user,
    Method.PATCH,
    { profile_picture: imageUrl },
  );
  return response.profile_picture;
};

export const updatePassword = async (_: UpdatePasswordPayload) => {
  return await apiRequest(API_ROUTES.changePassword, Method.PATCH);
};
