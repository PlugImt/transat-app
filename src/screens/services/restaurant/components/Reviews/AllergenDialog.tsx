import type React from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import Image from "@/components/common/Image";
import { Text } from "@/components/common/Text";
import { getAllergenImage } from "@/utils/allergenImages";

interface Allergen {
  id_allergen: number;
  name: string;
  description?: string | null;
  description_en?: string | null;
  picture_url?: string | null;
}

interface AllergenDialogProps {
  allergen: Allergen;
  children: React.ReactElement;
}

export const AllergenDialog = ({ allergen, children }: AllergenDialogProps) => {
  const { t, i18n } = useTranslation();
  const isFrench = i18n.language === "fr";

  const description =
    isFrench && allergen.description
      ? allergen.description
      : allergen.description_en || allergen.description || "";

  // Use picture_url (filename) or fallback to name to find local asset
  const imageSource = getAllergenImage(allergen.picture_url || allergen.name);

  return (
    <Dialog>
      <DialogTrigger>
        <Pressable>{children}</Pressable>
      </DialogTrigger>
      <DialogContent
        title={allergen.name}
        className="gap-4 items-center"
        cancelLabel={t("common.close")}
        onCancel={() => {}}
      >
        {imageSource && (
          <Image
            source={imageSource}
            size={120}
            radius={8}
            resizeMode="contain"
          />
        )}
        {description ? (
          <Text className="text-center" color="muted">
            {description}
          </Text>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
