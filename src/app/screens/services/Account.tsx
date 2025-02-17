import { Button } from "@/components/common/Button";
import Page from "@/components/common/Page";
import useAuth from "@/hooks/useAuth";
import { storage } from "@/services/storage/asyncStorage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {
  Edit,
  GraduationCap,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Medal,
  Phone,
} from "lucide-react-native";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";

type UserData = {
  first_name: string;
  last_name: string;
  campus: string;
  phone_number: string;
  email: string;
  graduation_year: string;
  profile_picture?: string;
  id_newf?: number;
  total_newf?: number;
  password_updated_date?: string;
};

export const Account = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigation = useNavigation();
  const [user, setUser] = useState<UserData>({
    first_name: "",
    last_name: "",
    campus: "",
    phone_number: "",
    email: "",
    graduation_year: "",
    id_newf: -1,
    total_newf: -1,
    password_updated_date: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const userData = await storage.get("newf");
      if (userData) {
        setUser(userData as UserData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const token = await storage.get("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      // Call the API to get fresh data
      const newfResponse = await axios.get(
        "https://transat.destimt.fr/api/newf/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (newfResponse.status === 200) {
        const newf = newfResponse.data;
        await storage.set("newf", newf);
        setUser(newf);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData().then((r) => r);

    return navigation.addListener("focus", () => {
      fetchUserData().then((r) => r);
    });
  }, [fetchUserData, navigation]);

  const handleLogout = async () => {
    try {
      await logout();
      alert("Logged out successfully. Please restart the app.");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleDeleteAccount = async () => {
    alert("This feature is not yet implemented");
  };

  const navigateToEditProfile = () => {
    // @ts-ignore - Add proper typing for your navigation if needed
    navigation.navigate("EditProfile");
  };

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <View className="flex-row items-center mb-4">
      {icon}
      <View className="ml-4 flex-1">
        <Text className="text-sm text-[#ffe6cc] opacity-70 mb-0.5">
          {label}
        </Text>
        <Text className="text-base text-[#ffe6cc] font-medium">{value}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <Page>
        <View className="flex-1 justify-center items-center">
          <Text className="text-[#ffe6cc] text-base">
            {t("account.loadingProfile")}
          </Text>
        </View>
      </Page>
    );
  }

  return (
    <Page refreshing={refreshing} onRefresh={handleRefresh}>
      <View className="flex-row justify-between items-center m-4">
        <Text className="h1">{t("common.account")}</Text>
        <TouchableOpacity
          onPress={navigateToEditProfile}
          className="bg-[#333333] p-2 rounded-full"
        >
          <Edit color="#ffe6cc" size={20} />
        </TouchableOpacity>
      </View>

      <View className="items-center mb-8">
        <View className="relative mb-4">
          {user.profile_picture ? (
            <Image
              source={{ uri: user.profile_picture }}
              className="w-32 h-32 rounded-full"
            />
          ) : (
            <View className="w-32 h-32 rounded-full bg-[#2c2c2c] justify-center items-center">
              <Text className="text-[#ffe6cc] text-4xl font-bold">
                {user.first_name.charAt(0)}
                {user.last_name.charAt(0)}
              </Text>
            </View>
          )}
          <View
            className={
              "absolute bottom-0 right-0 py-1.5 px-3 rounded-xl bg-[#ec7f32]"
            }
          >
            <Text className="text-[#ffe6cc] font-bold text-xs">
              #{user.id_newf}
            </Text>
          </View>
        </View>

        <Text className="text-2xl font-bold text-[#ffe6cc] mb-1">
          {user.first_name} {user.last_name}
        </Text>
        <Text className="text-base text-[#ffe6cc] opacity-80">
          {t("account.graduation")} {user.graduation_year}
        </Text>
      </View>

      <View className="bg-[#181010] rounded-2xl p-5 mb-6">
        <Text className="text-lg font-bold text-[#ffe6cc] mb-3">
          {t("account.contactInfo")}
        </Text>
        <View className="h-px bg-[#333333] mb-4" />

        <InfoItem
          icon={<Mail color="#ffe6cc" size={20} />}
          label={t("account.email")}
          value={user.email}
        />

        <InfoItem
          icon={<Phone color="#ffe6cc" size={20} />}
          label={t("account.phone")}
          value={user.phone_number || t("account.notProvided")}
        />

        <InfoItem
          icon={<MapPin color="#ffe6cc" size={20} />}
          label={t("account.campus")}
          value={user.campus || t("account.notProvided")}
        />

        <InfoItem
          icon={<GraduationCap color="#ffe6cc" size={20} />}
          label={t("account.graduationYear")}
          value={user.graduation_year || t("account.notProvided")}
        />
      </View>

      <View className="bg-[#181010] rounded-2xl p-5 mb-6">
        <Text className="text-lg font-bold text-[#ffe6cc] mb-3">
          {t("account.infos")}
        </Text>
        <View className="h-px bg-[#333333] mb-4" />

        <InfoItem
          icon={<Medal color="#ffe6cc" size={20} />}
          label={t("account.registration")}
          value={`n°${user.id_newf}/${user.total_newf} ${t("account.newf")}`}
        />

        <InfoItem
          icon={<Lock color="#ffe6cc" size={20} />}
          label={t("account.passwordUpdated")}
          value={
            user.password_updated_date
              ? new Date(user.password_updated_date)
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

      <View className="mt-2">
        <Button
          label={t("common.logout")}
          onPress={handleLogout}
          className="bg-[#e74c3c] py-2"
          icon={() => (
            <LogOut color="white" size={18} style={{ marginRight: 8 }} />
          )}
        />
      </View>

      <View>
        <TouchableOpacity onPress={handleDeleteAccount}>
          <Text className="text-gray-700 text-right mt-4">
            {t("account.deleteAccount")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 50 }} />
    </Page>
  );
};

export default Account;
