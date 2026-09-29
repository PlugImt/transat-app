import { useTranslation } from "react-i18next";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { useDeleteAccount } from "@/hooks/account/useDeleteAccount";
import { hapticFeedback } from "@/utils/haptics.utils";
import { Dialog, DialogContent, DialogTrigger } from "../common/Dialog";
import { useToast } from "../common/Toast";

export const DeleteAccountButton = () => {
  const { mutateAsync: deleteAccount, isPending } = useDeleteAccount();
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteAccount();
      hapticFeedback.warning();
    } catch (_) {
      toast(t("settings.deleteAccount.error"), "destructive");
      hapticFeedback.error();
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          label={t("settings.deleteAccount.title")}
          variant="destructive"
          disabled={isPending}
        />
      </DialogTrigger>

      <DialogContent
        title={t("settings.deleteAccount.title")}
        className="gap-2"
        cancelLabel={t("common.cancel")}
        confirmLabel={t("settings.deleteAccount.confirm")}
        onConfirm={handleDelete}
      >
        <Text>{t("settings.deleteAccount.desc")}</Text>
      </DialogContent>
    </Dialog>
  );
};
