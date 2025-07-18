import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart,
  Bell,
  FileText,
  Globe,
  HelpCircle,
  Info,
  Palette,
  Server,
  Shield,
} from "lucide-react-native";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import { Switch } from "@/components/common/Switch";
import { Text } from "@/components/common/Text";
import { useToast } from "@/components/common/Toast";
import { AccountCard } from "@/components/custom/card/AccountCard";
import { Page } from "@/components/page/Page";
import { QUERY_KEYS } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import useAuth from "@/hooks/account/useAuth";
import { useLanguageOptions } from "@/hooks/account/useLanguageOptions";
import { useUser } from "@/hooks/account/useUser";
import { storage } from "@/services/storage/asyncStorage";
import STORAGE_KEYS from "@/services/storage/constants";
import type { SettingsNavigation } from "@/services/storage/types";
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
  const [isDevServerSelected, setIsDevServerSelected] = React.useState(false);
  const { currentLanguageOption } = useLanguageOptions();

  useEffect(() => {
    const loadDevServerSetting = async () => {
      const value = await storage.get(STORAGE_KEYS.IS_DEV_SERVER_SELECTED);
      setIsDevServerSelected(value === "true");
    };
    loadDevServerSetting();
  }, []);

  const handleDevServerToggle = async (value: boolean) => {
    setIsDevServerSelected(value);
    await storage.set(STORAGE_KEYS.IS_DEV_SERVER_SELECTED, value.toString());
  };

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
      goBack
      className="gap-6"
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
          icon={<BarChart color={theme.text} size={22} />}
          title={t("settings.statistics.title", "Statistics")}
          subtitle={t("settings.statistics.subtitle", "View system statistics")}
          onPress={() => navigation.navigate("Statistics")}
        />
        <SettingsItem
          icon={<FileText color={theme.text} size={22} />}
          title={t("settings.legal.title")}
          subtitle={t("settings.legal.subtitle")}
          onPress={() => navigation.navigate("Legal")}
        />

        {process.env.NODE_ENV === "development" && (
          <SettingsItem
            icon={<Server color={theme.text} size={22} />}
            title={t("settings.devServer")}
            subtitle={t("settings.devServerDescription")}
            onPress={() => {}}
            rightElement={
              <Switch
                value={isDevServerSelected}
                onValueChange={handleDevServerToggle}
              />
            }
          />
        )}
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
