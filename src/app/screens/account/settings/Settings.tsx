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
  Vibrate,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common/Button";
import { Switch } from "@/components/common/Switch";
import { UserCard } from "@/components/custom/card/UserCard";
import { LogoutButton } from "@/components/custom/LogoutButton";
import { Page } from "@/components/page/Page";
import { QUERY_KEYS } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import { useHapticFeedback } from "@/hooks/account/useHapticFeedback";
import { useLanguageOptions } from "@/hooks/account/useLanguageOptions";
import { useUser } from "@/hooks/account/useUser";
import type { SettingsNavigation } from "@/types";
import SettingCategory from "./components/SettingCategory";
import SettingsItem from "./components/SettingsItem";

export const Settings = () => {
  const { theme, themeMode } = useTheme();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: user, isPending } = useUser();
  const navigation = useNavigation<SettingsNavigation>();
  const { currentLanguageOption } = useLanguageOptions();
  const { isEnabled: isHapticEnabled, toggleHapticFeedback } =
    useHapticFeedback();

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
      <UserCard
        user={user}
        action={
          <Button
            label={t("common.edit")}
            variant="ghost"
            onPress={() => navigation.navigate("EditProfile")}
          />
        }
      />

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

      <SettingCategory title={t("settings.security")}>
        <SettingsItem
          icon={<Shield color={theme.text} size={22} />}
          title={t("auth.resetPassword.changePassword")}
          onPress={() => navigation.navigate("ChangePassword")}
        />
      </SettingCategory>

      <SettingCategory title={t("common.other")}>
        <SettingsItem
          icon={<Vibrate color={theme.text} size={22} />}
          title={t("settings.hapticFeedback.title")}
          subtitle={t("settings.hapticFeedback.description")}
          rightElement={
            <Switch
              value={isHapticEnabled}
              onValueChange={toggleHapticFeedback}
            />
          }
        />
        <SettingsItem
          icon={<HelpCircle color={theme.text} size={22} />}
          title={t("settings.help.title")}
          subtitle={t("settings.help.subtitle")}
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

      <LogoutButton />
    </Page>
  );
};

export default Settings;
