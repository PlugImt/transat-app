import { useMutation, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { updateProfilePicture } from "@/api";
import { QUERY_KEYS } from "@/constants";
import type { User } from "@/dto";
import { storage } from "@/services/storage/asyncStorage";
import { uploadImage } from "@/utils";

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const imageUrl = await uploadImage();
      await updateProfilePicture(imageUrl);
      return imageUrl;
    },
    onSuccess: async (imageUrl) => {
      const cachedUser = queryClient.getQueryData<User>(QUERY_KEYS.user);
      const storedUser = cachedUser ?? (await storage.get("newf"));
      if (!storedUser) {
        throw new Error(t("account.updateFailed"));
      }
      const updatedUser = { ...storedUser, profile_picture: imageUrl };
      await storage.set("newf", updatedUser);
      queryClient.setQueryData(QUERY_KEYS.user, updatedUser);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
    },
  });
};
