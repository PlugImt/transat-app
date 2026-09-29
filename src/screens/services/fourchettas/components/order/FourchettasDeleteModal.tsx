import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import { Text } from "@/components/common/Text";

interface FourchettasDeleteModalProps {
  children: ReactElement<{ onPress?: () => void }>;
  onConfirm?: () => void;
}

export const FourchettasDeleteModal = ({
  children,
  onConfirm,
}: FourchettasDeleteModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent
        title={t("services.fourchettas.orderDeleteTitle")}
        className="gap-2"
        cancelLabel={t("common.cancel")}
        confirmLabel={t("common.delete")}
        onConfirm={onConfirm}
        isPending={false}
      >
        <Text>{t("services.fourchettas.orderDeleteDesc")}</Text>
      </DialogContent>
    </Dialog>
  );
};

export default FourchettasDeleteModal;
