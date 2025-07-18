import { useNavigation } from "@react-navigation/native";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { Lock, Mail, Medal, Phone, Settings } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/common/Avatar";
import { Button, IconButton } from "@/components/common/Button";
import Card from "@/components/common/Card";
import InfoItem from "@/components/common/InfoItem";
import { Text } from "@/components/common/Text";
import { ErrorPage } from "@/components/page/ErrorPage";
import { Page } from "@/components/page/Page";
import { TextSkeleton } from "@/components/Skeleton";
import { QUERY_KEYS } from "@/constants";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/hooks/account/useUser";
import type { AccountNavigation } from "@/services/storage/types";
import { getStudentYear } from "@/utils";

export const Account = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<AccountNavigation>();
  const queryClient = useQueryClient();

  const { data: user, isPending, isError, error } = useUser();
  const isUserFetching =
    useIsFetching({
      queryKey: QUERY_KEYS.user,
    }) > 0;

  const refetch = async () => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
  };

  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  if (isPending) {
    return <AccountLoading />;
  }

  if (isError && error) {
    return (
      <ErrorPage
        error={error}
        refetch={refetch}
        isRefetching={isPending}
        isAccountPage={true}
      />
    );
  }

  return (
    <Page
      refreshing={isUserFetching}
      onRefresh={refetch}
      className="gap-6"
      title={t("common.account")}
      header={
        <IconButton
          icon={<Settings />}
          variant="ghost"
          onPress={() => navigation.navigate("Settings")}
        />
      }
    >
      <View className="items-center gap-2">
        <Avatar className="w-32 h-32">
          <AvatarImage
            source={{
              uri: user?.profile_picture,
            }}
          />
          <AvatarFallback>
            {user?.first_name?.charAt(0)}
            {user?.last_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <View className="gap-1 justify-center items-center">
          <Text variant="h2">
            {user?.first_name} {user?.last_name}
          </Text>
          {user?.graduation_year && (
            <Text color="muted">{getStudentYear(user?.graduation_year)}</Text>
          )}
        </View>
      </View>
      <Card className="gap-4">
        <Text variant="h3">{t("account.contactInfo")}</Text>
        <InfoItem
          icon={<Mail color={theme.text} size={20} />}
          label={t("account.email")}
          value={user?.email || t("account.notProvided")}
        />
        <InfoItem
          icon={<Phone color={theme.text} size={20} />}
          label={t("account.phone")}
          value={user?.phone_number || t("account.notProvided")}
        />
      </Card>

      <Button
        label={t("account.editProfile")}
        onPress={navigateToEditProfile}
        size="sm"
        variant="secondary"
      />
    </Page>
  );
};

export default Account;

const AccountLoading = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <Page
      title={t("common.account")}
      header={<IconButton disabled icon={<Settings />} variant="ghost" />}
    >
      <View className="items-center gap-2">
        <Avatar className="w-32 h-32">
          <AvatarImage loading />
        </Avatar>

        <View className="gap-1 justify-center items-center">
          <TextSkeleton className="w-64 items-center" lines={1} variant="h2" />
          <TextSkeleton className="w-24 items-center" lines={1} />
        </View>
      </View>
      <View
        className=" rounded-lg px-6 py-4 gap-4"
        style={{ backgroundColor: theme.card }}
      >
        <Text variant="h3">{t("account.contactInfo")}</Text>
        <InfoItem
          icon={<Mail color={theme.text} size={20} />}
          label={t("account.email")}
        />
        <InfoItem
          icon={<Phone color={theme.text} size={20} />}
          label={t("account.phone")}
        />
      </View>
    </Page>
  );
};
