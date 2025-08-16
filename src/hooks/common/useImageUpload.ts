import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "@/utils";

export const useImageUpload = () => {
  return useMutation({
    mutationFn: async () => await uploadImage(),
  });
};
