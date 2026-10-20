import { NativeTabs } from "expo-router/native-tabs";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/account/useAuth";
import { useNotificationNavigation } from "@/hooks/home/useNotificationNavigation";

export default function AppLayout() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const isAcademics = user?.roles?.includes("ACADEMICS") ?? false;

  useNotificationNavigation();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        paddingTop: insets.top,
      }}
    >
      <NativeTabs
        tintColor={theme.primary}
        backgroundColor={theme.background}
        indicatorColor={`${theme.primary}33`}
        labelVisibilityMode="labeled"
      >
        <NativeTabs.Trigger name="(home)" disableAutomaticContentInsets>
          <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
          <NativeTabs.Trigger.Label>
            {t("common.home")}
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="(services)" disableAutomaticContentInsets>
          <NativeTabs.Trigger.Icon sf="square.grid.2x2.fill" md="grid_view" />
          <NativeTabs.Trigger.Label>
            {t("services.title")}
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger
          name="photos"
          hidden={isAcademics}
          disableAutomaticContentInsets
        >
          <NativeTabs.Trigger.Icon sf="photo.on.rectangle" md="photo_library" />
          <NativeTabs.Trigger.Label>
            {t("photos.title")}
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="account" disableAutomaticContentInsets>
          <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
          <NativeTabs.Trigger.Label>
            {t("common.account")}
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </View>
  );
}
