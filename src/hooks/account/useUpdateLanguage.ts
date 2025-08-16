import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLanguage } from "@/api";
import { QUERY_KEYS } from "@/constants";
import i18n from "@/i18n";
import { storage } from "@/services/storage/asyncStorage";
import STORAGE_KEYS from "@/services/storage/constants";

export const useUpdateLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (languageCode: string) => {
      await i18n.changeLanguage(languageCode);
      await storage.set(STORAGE_KEYS.LANGUAGE, languageCode);

      await updateLanguage(languageCode);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] });
    },
  });
};
