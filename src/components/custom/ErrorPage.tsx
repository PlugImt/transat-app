import { useTheme } from "@/contexts/ThemeContext";
import useAuth from "@/hooks/account/useAuth";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Button } from "../common/Button";

type Props = {
  error: Error;
  refetch: () => void;
  isRefetching: boolean;
  isAccountPage?: boolean;
};

export default function ErrorPage({
  error,
  refetch,
  isRefetching,
  isAccountPage = false,
}: Props) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { theme } = useTheme();

  return (
    <View
      style={{ backgroundColor: theme.background }}
      className=" px-5 justify-center items-center gap-6 h-screen"
    >
      <View className="gap-2 justify-center items-center">
        <Text className="h3" style={{ color: theme.foreground }}>
          {t("common.errors.occurred")}
        </Text>
        <Text style={{ color: theme.foregroundSecondary }}>
          {error?.message}
        </Text>
      </View>
      <Button
        label="Réessayer"
        variant="outlined"
        onPress={refetch}
        loading={isRefetching}
      />
      {isAccountPage && (
        <Button
          label="Déconnexion"
          variant="destructive"
          onPress={() => logout()}
        />
      )}
    </View>
  );
}
