import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart,
  Bell,
  Globe,
  HelpCircle,
  Info,
  Palette,
  Server,
  Shield,
} from "lucide-react-native";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Button } from "@/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import Page from "@/components/common/Page";
import { Switch } from "@/components/common/Switch";
import { useToast } from "@/components/common/Toast";
import { AccountCard } from "@/components/custom/card/AccountCard";
import { useTheme } from "@/contexts/ThemeContext";
import useAuth from "@/hooks/account/useAuth";
import { useUser } from "@/hooks/account/useUser";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { storage } from "@/services/storage/asyncStorage";
import STORAGE_KEYS from "@/services/storage/constants";
import type { SettingsNavigation } from "@/services/storage/types";
import { useNavigation } from "@react-navigation/native";
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
        <Text className="h3 ml-4">{t("common.appearance")}</Text>
        <View className="bg-card rounded-lg px-4 py-2 gap-4">
          <SettingsItem
            icon={<Palette color={theme.foreground} size={22} />}
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
            icon={<Globe color={theme.foreground} size={22} />}
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
        <Text className="h3 ml-4">
          {t("settings.notifications.notifications")}
        </Text>
        <View className="bg-card rounded-lg px-4 py-2">
          <SettingsItem
            icon={<Bell color={theme.foreground} size={22} />}
            title="Notifications"
            onPress={() => navigation.navigate("Notifications")}
          />
        </View>
      </View>

      <View className="gap-2">
        <Text className="h3 ml-4">{t("account.security")}</Text>
        <View className="bg-card rounded-lg px-4 py-2">
          <SettingsItem
            icon={<Shield color={theme.foreground} size={22} />}
            title={t("account.changePassword")}
            onPress={() => navigation.navigate("ChangePassword")}
          />
        </View>
      </View>

      <View className="gap-2">
        <Text className="h3 ml-4">{t("common.other")}</Text>
        <View className="bg-card rounded-lg px-4 py-2 gap-4">
          <SettingsItem
            icon={<HelpCircle color={theme.foreground} size={22} />}
            title={t("settings.help.title")}
            subtitle={t("settings.contactSupport")}
            onPress={() => navigation.navigate("Help")}
          />
          <SettingsItem
            icon={<Info color={theme.foreground} size={22} />}
            title={t("settings.about.title")}
            subtitle={t("common.knowMore")}
            onPress={() => navigation.navigate("About")}
          />
          <SettingsItem
            icon={<BarChart color={theme.foreground} size={22} />}
            title={t("settings.statistics.title", "Statistics")}
            subtitle={t(
              "settings.statistics.subtitle",
              "View system statistics",
            )}
            onPress={() => navigation.navigate("Statistics")}
          />

          {process.env.NODE_ENV === "development" && (
            <SettingsItem
              icon={<Server color={theme.foreground} size={22} />}
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
            <Text className="text-foreground">{t("settings.logoutDesc")}</Text>
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
