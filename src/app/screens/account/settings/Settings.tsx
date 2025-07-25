import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  FileText,
  Globe,
  HelpCircle,
  Info,
  Palette,
  Shield,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import { AccountCard } from "@/components/custom/card/AccountCard";
import { Page } from "@/components/page/Page";
import { QUERY_KEYS } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import useAuth from "@/hooks/account/useAuth";
import { useLanguageOptions } from "@/hooks/account/useLanguageOptions";
import { useUser } from "@/hooks/account/useUser";
import type { SettingsNavigation } from "@/types";
import SettingCategory from "./components/SettingCategory";
import SettingsItem from "./components/SettingsItem";

export const Settings = () => {
  const { theme, themeMode } = useTheme();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: user, isPending } = useUser();
  const navigation = useNavigation<SettingsNavigation>();
  const { currentLanguageOption } = useLanguageOptions();

  const handleLogout = async () => {
    try {
      await logout();
      toast(t("auth.disconnected"));
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const refetch = async () => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
  };

  const getAppearanceSubtitle = () => {
    const subtitles = {
      system: t("settings.appearance.system", "System"),
      light: t("settings.appearance.light", "Light"),
      dark: t("settings.appearance.dark", "Dark"),
    };

    return subtitles[themeMode];
  };

  return (
    <Page
      refreshing={isPending}
      onRefresh={refetch}
      title={t("settings.settings")}
    >
      <AccountCard user={user} />

      <SettingCategory title={t("common.appearance")}>
        <SettingsItem
          icon={<Palette color={theme.text} size={22} />}
          title={t("settings.appearance.title", "Theme")}
          subtitle={getAppearanceSubtitle()}
          onPress={() => navigation.navigate("Appearance")}
        />
        <SettingsItem
          icon={<Globe color={theme.text} size={22} />}
          title={t("settings.language.language")}
          subtitle={currentLanguageOption?.name ?? ""}
          onPress={() => navigation.navigate("Language")}
        />
      </SettingCategory>

      <SettingCategory title={t("settings.notifications.notifications")}>
        <SettingsItem
          icon={<Bell color={theme.text} size={22} />}
          title="Notifications"
          onPress={() => navigation.navigate("Notifications")}
        />
      </SettingCategory>

      <SettingCategory title={t("account.security")}>
        <SettingsItem
          icon={<Shield color={theme.text} size={22} />}
          title={t("account.changePassword")}
          onPress={() => navigation.navigate("ChangePassword")}
        />
      </SettingCategory>

      <SettingCategory title={t("common.other")}>
        <SettingsItem
          icon={<HelpCircle color={theme.text} size={22} />}
          title={t("settings.help.title")}
          subtitle={t("settings.contactSupport")}
          onPress={() => navigation.navigate("Help")}
        />
        <SettingsItem
          icon={<Info color={theme.text} size={22} />}
          title={t("settings.about.title")}
          subtitle={t("common.knowMore")}
          onPress={() => navigation.navigate("About")}
        />
        <SettingsItem
          icon={<FileText color={theme.text} size={22} />}
          title={t("settings.legal.title")}
          subtitle={t("settings.legal.subtitle")}
          onPress={() => navigation.navigate("Legal")}
        />
      </SettingCategory>

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
    </Page>
  );
};

export default Settings;
