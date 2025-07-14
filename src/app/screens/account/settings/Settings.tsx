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
import { View } from "react-native";
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
import { useUser } from "@/hooks/account/useUser";
import { storage } from "@/services/storage/asyncStorage";
import STORAGE_KEYS from "@/services/storage/constants";
import type { SettingsNavigation } from "@/services/storage/types";
import SettingsItem from "./SettingsItem";

export const Settings = () => {
  const { theme, themeMode } = useTheme();
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: user, isPending } = useUser();
  const navigation = useNavigation<SettingsNavigation>();
  const [isDevServerSelected, setIsDevServerSelected] = React.useState(false);

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

  return (
    <Page
      goBack
      className="gap-6"
      refreshing={isPending}
      onRefresh={refetch}
      title={t("settings.settings")}
    >
      <AccountCard user={user} />

      <View className="gap-2">
        <Text className="ml-4" variant="h3">
          {t("common.appearance")}
        </Text>
        <View
          className=" rounded-lg px-4 py-2 gap-4"
          style={{ backgroundColor: theme.card }}
        >
          <SettingsItem
            icon={<Palette color={theme.text} size={22} />}
            title={t("settings.appearance.title", "Theme")}
            subtitle={
              themeMode === "system"
                ? t("settings.appearance.system", "System")
                : themeMode === "light"
                  ? t("settings.appearance.light", "Light")
                  : t("settings.appearance.dark", "Dark")
            }
            onPress={() => navigation.navigate("Appearance")}
          />
          <SettingsItem
            icon={<Globe color={theme.text} size={22} />}
            title={t("settings.language.language")}
            subtitle={t(
              `settings.language.${
                i18n.language === "fr"
                  ? "french"
                  : i18n.language === "en"
                    ? "english"
                    : "spanish"
              }`,
            )}
            onPress={() => navigation.navigate("Language")}
          />
        </View>
      </View>

      <View className="gap-2">
        <Text className="ml-4" variant="h3">
          {t("settings.notifications.notifications")}
        </Text>
        <View
          className=" rounded-lg px-4 py-2"
          style={{ backgroundColor: theme.card }}
        >
          <SettingsItem
            icon={<Bell color={theme.text} size={22} />}
            title="Notifications"
            onPress={() => navigation.navigate("Notifications")}
          />
        </View>
      </View>

      <View className="gap-2">
        <Text className="ml-4" variant="h3">
          {t("account.security")}
        </Text>
        <View
          className=" rounded-lg px-4 py-2"
          style={{ backgroundColor: theme.card }}
        >
          <SettingsItem
            icon={<Shield color={theme.text} size={22} />}
            title={t("account.changePassword")}
            onPress={() => navigation.navigate("ChangePassword")}
          />
        </View>
      </View>

      <View className="gap-2">
        <Text className="ml-4" variant="h3">
          {t("common.other")}
        </Text>
        <View
          className=" rounded-lg px-4 py-2 gap-4"
          style={{ backgroundColor: theme.card }}
        >
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
            subtitle={t(
              "settings.statistics.subtitle",
              "View system statistics",
            )}
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
        </View>
      </View>

      <View className="gap-2">
        <Dialog>
          <DialogTrigger>
            <Button
              label={t("settings.logout")}
              onPress={handleLogout}
              variant="destructive"
              size="lg"
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

        {/* <Button
                  label={t("account.deleteAccount")}
                  onPress={handleDeleteAccount}
                  variant="outlined"
                  className="border-destructive"
                  labelClasses="text-destructive"
                /> */}
      </View>
    </Page>
  );
};

export default Settings;
