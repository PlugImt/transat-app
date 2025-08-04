import { useTranslation } from "react-i18next";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import { useAuth } from "@/hooks/account/useAuth";
import { hapticFeedback } from "@/utils/haptics.utils";
import { Dialog, DialogContent, DialogTrigger } from "../common/Dialog";
import { useToast } from "../common/Toast";

export const LogoutButton = () => {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast(t("auth.disconnected"));
      hapticFeedback.warning();
    } catch (_) {
      toast(t("auth.disconnectedError"), "destructive");
      hapticFeedback.error();
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          label={t("settings.logout")}
          onPress={handleLogout}
          variant="destructive"
        />
      </DialogTrigger>

      <DialogContent
        title={t("settings.logout")}
        className="gap-2"
        cancelLabel={t("common.cancel")}
        confirmLabel={t("settings.logoutConfirm")}
        onConfirm={handleLogout}
      >
        <Text>{t("settings.logoutDesc")}</Text>
      </DialogContent>
    </Dialog>
  );
};
