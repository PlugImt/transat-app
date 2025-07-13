import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Button } from "@/components/common/Button";
import { useTheme } from "@/contexts/ThemeContext";
import useAuth from "@/hooks/account/useAuth";

type ErrorPageProps = {
  error: Error;
  refetch: () => void;
  isRefetching: boolean;
  isAccountPage?: boolean;
};

export const ErrorPage = ({
  error,
  refetch,
  isRefetching,
  isAccountPage = false,
}: ErrorPageProps) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { theme } = useTheme();

  return (
    <View
      style={{ backgroundColor: theme.background }}
      className="px-5 justify-center items-center gap-6 h-screen"
    >
      <View className="gap-2 justify-center items-center">
        <Text className="h3" style={{ color: theme.text }}>
          {t("common.errors.occurred")}
        </Text>
        <Text style={{ color: theme.muted }}>{error?.message}</Text>
      </View>
      <Button
        label="Réessayer"
        variant="secondary"
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
};
