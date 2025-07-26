import { CircleX } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import { useTheme } from "@/contexts/ThemeContext";
import useAuth from "@/hooks/account/useAuth";
import { Text } from "../common/Text";
import { Page } from "./Page";

type ErrorPageProps = {
  title: string;
  error: Error | null;
  refetch: () => void;
  isRefetching: boolean;
  isAccountPage?: boolean;
};

export const ErrorPage = ({
  title,
  error,
  refetch,
  isRefetching,
  isAccountPage = false,
}: ErrorPageProps) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { theme } = useTheme();

  return (
    <Page
      title={title}
      className="flex-1 justify-center items-center"
      onRefresh={refetch}
      refreshing={isRefetching}
    >
      <View className="justify-center items-center gap-4">
        <CircleX color={theme.text} size={40} />
        <View className="items-center">
          <Text variant="h3" className="text-center">
            {t("common.errors.occurred")}
          </Text>
          {error && (
            <Text color="muted" className="text-center">
              {error?.message}
            </Text>
          )}
        </View>
      </View>
      <View className="gap-2">
        <Button
          label="Réessayer"
          variant="secondary"
          onPress={refetch}
          isUpdating={isRefetching}
        />
        {isAccountPage && (
          <Button
            label="Déconnexion"
            variant="destructive"
            onPress={() => logout()}
          />
        )}
      </View>
    </Page>
  );
};
