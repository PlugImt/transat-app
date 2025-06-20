import { updateProfilePicture } from "@/api";
import { QUERY_KEYS } from "@/constants";
import { storage } from "@/services/storage/asyncStorage";
import { uploadImage } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

export function useUpdateProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const imageUrl = await uploadImage();
      await updateProfilePicture(imageUrl);
      return imageUrl;
    },
    onSuccess: async (imageUrl) => {
      const user = await storage.get("newf");
      if (!user) {
        throw new Error(t("account.updateFailed"));
      }
      const updatedUser = { ...user, profile_picture: imageUrl };
      await storage.set("newf", updatedUser);
      queryClient.setQueryData([QUERY_KEYS.user], updatedUser);
    },
  });
}
