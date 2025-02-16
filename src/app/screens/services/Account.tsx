import { Button } from "@/components/common/Button";
import Page from "@/components/common/Page";
import useAuth from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

export const Account = () => {
  const { logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
      alert("Logged out restart the app");
    } catch (err) {
      console.error("Error logging out");
    }
  };

  return (
    <Page>
      <Text className="h1 m-4">Account</Text>
      <Button label={t("common.logout")} onPress={handleLogout} />
    </Page>
  );
};

export default Account;
