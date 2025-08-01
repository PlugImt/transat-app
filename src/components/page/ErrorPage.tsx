import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "@/components/common/Button";
import { Text } from "../common/Text";
import { Page } from "./Page";

type ErrorPageProps = {
  title: string;
  error: Error | null;
  refetch: () => void;
  isRefetching: boolean;
  children?: React.ReactNode;
};

export const ErrorPage = ({
  title,
  error,
  refetch,
  isRefetching,
  children,
}: ErrorPageProps) => {
  const { t } = useTranslation();

  return (
    <Page
      title={title}
      disableScroll
      className="flex-1 justify-center items-center"
      footer={children}
    >
      <View className="justify-center items-center">
        <Text variant="h3" className="text-center">
          {t("common.errors.occurred")}
        </Text>
        {error && (
          <Text color="muted" className="text-center">
            {error?.message}
          </Text>
        )}
      </View>
      <View className="gap-2">
        <Button
          label="Réessayer"
          variant="secondary"
          onPress={refetch}
          isUpdating={isRefetching}
        />
      </View>
    </Page>
  );
};
