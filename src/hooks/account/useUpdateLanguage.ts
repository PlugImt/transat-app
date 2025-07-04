import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "@/i18n";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { updateLanguage } from "@/lib/user";
import { storage } from "@/services/storage/asyncStorage";
import STORAGE_KEYS from "@/services/storage/constants";

export function useUpdateLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (languageCode: string) => {
      await i18n.changeLanguage(languageCode);
      await storage.set(STORAGE_KEYS.LANGUAGE, languageCode);

      await updateLanguage(languageCode);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] });
    },
  });
}
