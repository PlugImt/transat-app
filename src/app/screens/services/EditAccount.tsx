import { Button } from "@/components/common/ButtonV2";
import Page from "@/components/common/Page";
import { storage } from "@/services/storage/asyncStorage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {
  ChevronDown,
  Edit,
  GraduationCap,
  Key,
  MapPin,
  Phone,
  Save,
} from "lucide-react-native";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type UserData = {
  first_name: string;
  last_name: string;
  campus: string;
  phone_number: string;
  email: string;
  graduation_year: number;
  profile_picture?: string;
};

export const EditProfile = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [formState, setFormState] = useState<UserData>({
    first_name: "",
    last_name: "",
    campus: "",
    phone_number: "",
    email: "",
    graduation_year: 0,
  });

  const [user, setUser] = useState<UserData>({
    first_name: "",
    last_name: "",
    campus: "",
    phone_number: "",
    email: "",
    graduation_year: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const campusOptions = ["NANTES", "BREST", "RENNES"];
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) =>
    (currentYear + i).toString(),
  );

  const fetchUserData = useCallback(async () => {
    try {
      const userData = await storage.get("newf");
      if (userData) {
        const typedUserData = userData as UserData;
        setUser(typedUserData);
        setFormState(typedUserData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData().then((r) => r);
  }, [fetchUserData]);

  const handleUpdateProfile = async () => {
    try {
      Keyboard.dismiss();
      setIsSaving(true);
      const token = await storage.get("token");

      if (!token) {
        Alert.alert(t("common.error"), t("account.noToken"));
        return;
      }

      const response = await axios.patch(
        "https://transat.destimt.fr/api/newf/me",
        {
          first_name: formState.first_name,
          last_name: formState.last_name,
          campus: formState.campus,
          phone_number: formState.phone_number,
          graduation_year: formState.graduation_year,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        const updatedUser = { ...user, ...formState };
        await storage.set("newf", updatedUser);
        setUser(updatedUser);
        Alert.alert(t("common.success"), t("account.profileUpdated"));
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(t("common.error"), t("account.updateFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      Keyboard.dismiss();
      if (newPassword !== confirmPassword) {
        Alert.alert(t("common.error"), t("account.passwordMismatch"));
        return;
      }

      setIsSaving(true);

      const response = await axios.post(
        "https://transat.destimt.fr/api/auth/change-password",
        {
          email: user.email,
          password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        },
      );

      if (response.status === 200) {
        Alert.alert(t("common.success"), t("account.passwordChanged"));
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert(t("common.error"), t("account.passwordChangeFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    icon,
    editable = true,
    keyboardType = "default",
    secureTextEntry = false,
  }: {
    label: string;
    value: string;
    onChangeText?: (text: string) => void;
    icon: React.ReactNode;
    editable?: boolean;
    keyboardType?: "default" | "email-address" | "number-pad" | "phone-pad";
    secureTextEntry?: boolean;
  }) => (
    <View className="mb-4">
      <Text className="text-sm text-[#ffe6cc] opacity-70 mb-1">{label}</Text>
      <View className="flex-row items-center bg-[#222222] rounded-lg px-3 h-12">
        {icon}
        <TextInput
          className="flex-1 ml-2 text-[#ffe6cc] text-base h-full"
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="#666666"
        />
      </View>
    </View>
  );

  const DropdownField = ({
    label,
    value,
    onPress,
    icon,
  }: {
    label: string;
    value: string;
    onPress: () => void;
    icon: React.ReactNode;
  }) => (
    <View className="mb-4">
      <Text className="text-sm text-[#ffe6cc] opacity-70 mb-1">{label}</Text>
      <TouchableOpacity
        className="flex-row items-center justify-between bg-[#222222] rounded-lg px-3 h-12"
        onPress={onPress}
      >
        <View className="flex-row items-center">
          {icon}
          <Text className="ml-2 text-[#ffe6cc] text-base">{value}</Text>
        </View>
        <ChevronDown color="#ffe6cc" size={20} />
      </TouchableOpacity>
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
    <Page>
      <View className="flex-row items-center justify-between m-4">
        <Text className="h1">{t("account.editProfile")}</Text>
        <TouchableOpacity
          className="bg-[#333333] rounded-full p-2"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-[#ffe6cc]">{t("common.cancel")}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
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
                  {formState.first_name.charAt(0)}
                  {formState.last_name.charAt(0)}
                </Text>
              </View>
            )}
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-[#333333] p-2 rounded-full"
              onPress={() => handleUpdateProfilePicture()}
            >
              <Edit color="#ffe6cc" size={16} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-[#181010] rounded-2xl p-5 mb-6">
          <Text className="text-lg font-bold text-[#ffe6cc] mb-3">
            {t("account.personalInfo")}
          </Text>
          <View className="h-px bg-[#333333] mb-4" />

          <InputField
            label={t("account.firstName")}
            value={formState.first_name}
            onChangeText={(text) =>
              setFormState({ ...formState, first_name: text })
            }
            icon={<Edit color="#ffe6cc" size={20} />}
          />

          <InputField
            label={t("account.lastName")}
            value={formState.last_name}
            onChangeText={(text) =>
              setFormState({ ...formState, last_name: text })
            }
            icon={<Edit color="#ffe6cc" size={20} />}
          />

          <InputField
            label={t("account.email")}
            value={formState.email}
            icon={<Edit color="#666666" size={20} />}
            editable={false}
          />

          <InputField
            label={t("account.phone")}
            value={formState.phone_number}
            onChangeText={(text) =>
              setFormState({ ...formState, phone_number: text })
            }
            icon={<Phone color="#ffe6cc" size={20} />}
            keyboardType="phone-pad"
          />

          <DropdownField
            label={t("account.campus")}
            value={formState.campus}
            onPress={() => {
              Keyboard.dismiss();
              setShowCampusDropdown(true);
            }}
            icon={<MapPin color="#ffe6cc" size={20} />}
          />

          <DropdownField
            label={t("account.graduationYear")}
            value={formState.graduation_year.toString()}
            onPress={() => {
              Keyboard.dismiss();
              setShowYearDropdown(true);
            }}
            icon={<GraduationCap color="#ffe6cc" size={20} />}
          />
        </View>

        {showPasswordModal ? (
          <View className="bg-[#181010] rounded-2xl p-5 mb-6">
            <Text className="text-lg font-bold text-[#ffe6cc] mb-3">
              {t("account.changePassword")}
            </Text>
            <View className="h-px bg-[#333333] mb-4" />

            <InputField
              label={t("account.currentPassword")}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              icon={<Key color="#ffe6cc" size={20} />}
              secureTextEntry
            />

            <InputField
              label={t("account.newPassword")}
              value={newPassword}
              onChangeText={setNewPassword}
              icon={<Key color="#ffe6cc" size={20} />}
              secureTextEntry
            />

            <InputField
              label={t("account.confirmPassword")}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              icon={<Key color="#ffe6cc" size={20} />}
              secureTextEntry
            />

            <View className="flex-row space-x-3 mt-2">
              <Button
                label={t("common.cancel")}
                onPress={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="flex-1 bg-[#333333] py-2 mr-2.5"
              />
              <Button
                label={t("common.save")}
                onPress={handleChangePassword}
                className="flex-1 bg-[#0049a8] py-2 ml-2.5"
                loading={isSaving}
                icon={() => (
                  <Save color="white" size={18} style={{ marginRight: 8 }} />
                )}
              />
            </View>
          </View>
        ) : (
          <Button
            label={t("account.changePassword")}
            onPress={() => setShowPasswordModal(true)}
            className="bg-[#333333] py-2 mb-6"
            icon={() => (
              <Key color="white" size={18} style={{ marginRight: 8 }} />
            )}
          />
        )}

        <Button
          label={t("common.saveChanges")}
          onPress={handleUpdateProfile}
          className="bg-[#0049a8] py-2"
          loading={isSaving}
          icon={() => (
            <Save color="white" size={18} style={{ marginRight: 8 }} />
          )}
        />

        <View style={{ height: 50 }} />
      </ScrollView>

      <Modal
        visible={showCampusDropdown}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-[#222222] w-4/5 rounded-2xl p-4">
            <Text className="text-lg font-bold text-[#ffe6cc] mb-3 text-center">
              {t("account.selectCampus")}
            </Text>
            <View className="h-px bg-[#333333] mb-2" />

            {campusOptions.map((campus) => (
              <TouchableOpacity
                key={campus}
                className="py-3 border-b border-[#333333]"
                onPress={() => {
                  setFormState({ ...formState, campus });
                  setShowCampusDropdown(false);
                }}
              >
                <Text
                  className={`text-[#ffe6cc] text-center text-lg ${
                    formState.campus === campus ? "font-bold" : ""
                  }`}
                >
                  {campus}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              className="mt-3 bg-[#333333] py-2 rounded-lg"
              onPress={() => setShowCampusDropdown(false)}
            >
              <Text className="text-[#ffe6cc] text-center">
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Graduation Year Dropdown Modal */}
      <Modal visible={showYearDropdown} transparent={true} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-[#222222] w-4/5 rounded-2xl p-4">
            <Text className="text-lg font-bold text-[#ffe6cc] mb-3 text-center">
              {t("account.selectGraduationYear")}
            </Text>
            <View className="h-px bg-[#333333] mb-2" />

            <ScrollView style={{ maxHeight: 250 }}>
              {yearOptions.map((year) => (
                <TouchableOpacity
                  key={year}
                  className="py-3 border-b border-[#333333]"
                  onPress={() => {
                    setFormState({
                      ...formState,
                      graduation_year: Number.parseInt(year),
                    });
                    setShowYearDropdown(false);
                  }}
                >
                  <Text
                    className={`text-[#ffe6cc] text-center text-lg ${
                      formState.graduation_year === Number.parseInt(year)
                        ? "font-bold"
                        : ""
                    }`}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              className="mt-3 bg-[#333333] py-2 rounded-lg"
              onPress={() => setShowYearDropdown(false)}
            >
              <Text className="text-[#ffe6cc] text-center">
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Page>
  );
};

export default EditProfile;
