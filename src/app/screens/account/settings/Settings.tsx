import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Globe,
  HelpCircle,
  Info,
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
import useAuth from "@/hooks/account/useAuth";
import { useUser } from "@/hooks/account/useUser";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { storage } from "@/services/storage/asyncStorage";
import STORAGE_KEYS from "@/services/storage/constants";
import type { SettingsNavigation } from "@/services/storage/types";
import { useTheme } from "@/themes/useThemeProvider";
import { useNavigation } from "@react-navigation/native";
import SettingsItem from "./SettingsItem";

export const Settings = () => {
  const theme = useTheme();
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
    <Page className="gap-6" refreshing={isPending} onRefresh={refetch}>
      <Text className="h1 m-4">{t("settings.settings")}</Text>

      <AccountCard user={user} />

      <View className="gap-2">
        <Text className="h3">{t("common.appearance")}</Text>
        <View className="bg-card rounded-lg px-4 py-2">
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
        <Text className="h3">{t("settings.notifications.notifications")}</Text>
        <View className="bg-card rounded-lg px-4 py-2">
          <SettingsItem
            icon={<Bell color={theme.foreground} size={22} />}
            title="Notifications"
            onPress={() => navigation.navigate("Notifications")}
          />
        </View>
      </View>

      <View className="gap-2">
        <Text className="h3">{t("account.security")}</Text>
        <View className="bg-card rounded-lg px-4 py-2">
          <SettingsItem
            icon={<Shield color={theme.foreground} size={22} />}
            title={t("account.changePassword")}
            onPress={() => navigation.navigate("ChangePassword")}
          />
        </View>
      </View>

      <View className="gap-2">
        <Text className="h3">{t("common.other")}</Text>
        <View className="bg-card rounded-lg px-4 py-2 gap-4">
          <SettingsItem
            icon={<HelpCircle color={theme.foreground} size={22} />}
            title={t("common.help")}
            subtitle={t("settings.contactSupport")}
            onPress={() => navigation.navigate("Help")}
          />
          <SettingsItem
            icon={<Info color={theme.foreground} size={22} />}
            title={t("settings.about.title")}
            subtitle={t("common.knowMore")}
            onPress={() => navigation.navigate("About")}
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
