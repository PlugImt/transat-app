import { useQueryClient } from "@tanstack/react-query";
import { Bell, Globe, HelpCircle, Info, Shield } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Button } from "@/components/common/Button";
import Page from "@/components/common/Page";
import { useToast } from "@/components/common/Toast";
import { AccountCard } from "@/components/custom/card/AccountCard";
import { useAccount } from "@/hooks/account/useAccount";
import useAuth from "@/hooks/account/useAuth";
import { QUERY_KEYS } from "@/lib/queryKeys";
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
  const { data: user, isPending } = useAccount();
  const navigation = useNavigation<SettingsNavigation>();

  const handleLogout = async () => {
    try {
      await logout();
      toast(t("auth.disconnected"));
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleDeleteAccount = async () => {
    toast("We are working on it 🚧");
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
            onPress={() => {}}
          />
          <SettingsItem
            icon={<Info color={theme.foreground} size={22} />}
            title={t("common.about")}
            subtitle={t("common.knowMore")}
            onPress={() => navigation.navigate("About")}
          />
        </View>
      </View>

      <View className="gap-2">
        <Button
          label={t("settings.logout")}
          onPress={handleLogout}
          variant="destructive"
        />
        <Button
          label={t("account.deleteAccount")}
          onPress={handleDeleteAccount}
          variant="outlined"
          className="border-destructive"
          labelClasses="text-destructive"
        />
      </View>
    </Page>
  );
};

export default Settings;
