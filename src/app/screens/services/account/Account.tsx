import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";
import Page from "@/components/common/Page";
import { useToast } from "@/components/common/Toast";
import ErrorPage from "@/components/custom/ErrorPage";
import Loading from "@/components/custom/Loading";
import { useAccount } from "@/hooks/account/useAccount";
import useAuth from "@/hooks/account/useAuth";
import { QUERY_KEYS } from "@/lib/queryKeys";
import theme from "@/themes";
import { useNavigation } from "@react-navigation/native";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import {
  GraduationCap,
  Lock,
  Mail,
  MapPin,
  Medal,
  Phone,
} from "lucide-react-native";
import type React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { InfoItem } from "./components/InfoItem";

export const Account = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigation = useNavigation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isPending, isError, error } = useAccount();
  const isUserFetching =
    useIsFetching({
      queryKey: QUERY_KEYS.user,
    }) > 0;

  const refetch = async () => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
  };

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

  const navigateToEditProfile = () => {
    // @ts-ignore - Add proper typing for your navigation if needed
    navigation.navigate("EditProfile");
  };

  if (isPending) {
    return <Loading />;
  }

  if (isError && error) {
    return (
      <ErrorPage error={error} refetch={refetch} isRefetching={isPending} />
    );
  }

  return (
    <Page refreshing={isUserFetching} onRefresh={refetch} className="gap-6">
      <View className="flex-row justify-between items-center ">
        <Text className="h1">{t("common.account")}</Text>
        <Button
          label={t("account.editProfile")}
          onPress={navigateToEditProfile}
          size="sm"
          variant="ghost"
        />
      </View>

      <View className="items-center gap-2">
        <Avatar className="w-32 h-32">
          <AvatarImage
            source={{
              uri: user?.profile_picture,
            }}
          />
          <AvatarFallback>
            {user?.first_name.charAt(0)}
            {user?.last_name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <View className="gap-1">
          <Text className="text-2xl font-bold text-foreground">
            {user?.first_name} {user?.last_name}
          </Text>
          {user?.graduation_year && (
            <Text className="text-base text-foreground/80">
              {t("account.graduation")} {user?.graduation_year}
            </Text>
          )}
        </View>
      </View>

      <View className="bg-card rounded-lg px-6 py-4 gap-4">
        <Text className="h3">{t("account.contactInfo")}</Text>
        <InfoItem
          icon={<Mail color={theme.textPrimary} size={20} />}
          label={t("account.email")}
          value={user?.email || t("account.notProvided")}
        />
        <InfoItem
          icon={<Phone color={theme.textPrimary} size={20} />}
          label={t("account.phone")}
          value={user?.phone_number || t("account.notProvided")}
        />
        <InfoItem
          icon={<MapPin color={theme.textPrimary} size={20} />}
          label={t("account.campus")}
          value={user?.campus || t("account.notProvided")}
        />
        <InfoItem
          icon={<GraduationCap color={theme.textPrimary} size={20} />}
          label={t("account.graduationYear")}
          value={user?.graduation_year || t("account.notProvided")}
        />
      </View>

      <View className="bg-card rounded-lg px-6 py-4 gap-4">
        <Text className="h3">{t("account.infos")}</Text>

        <InfoItem
          icon={<Medal color={theme.textPrimary} size={20} />}
          label={t("account.registration")}
          value={`n°${user?.id_newf}/${user?.total_newf} ${t("account.newf")}`}
        />

        <InfoItem
          icon={<Lock color={theme.textPrimary} size={20} />}
          label={t("account.passwordUpdated")}
          value={
            user?.password_updated_date
              ? new Date(user?.password_updated_date)
                  .toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                  .replace(",", "")
              : t("account.notProvided")
          }
        />
      </View>

      <View className="gap-2">
        <Button
          label={t("common.logout")}
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

export default Account;
