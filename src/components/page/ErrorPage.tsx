import { CircleX, ShieldOff } from "lucide-react-native";
import type React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { isStudentOnlyForbiddenError } from "@/api/errors";
import { Button } from "@/components/common/Button";
import { useSafeRefetch } from "@/components/query/useSafeRefetch";
import { useTheme } from "@/contexts/ThemeContext";
import { hapticFeedback } from "@/utils/haptics.utils";
import { Text } from "../common/Text";
import { Page } from "./Page";

type ErrorPageProps = {
  title: string;
  error: Error | null;
  refetch: () => void;
  isRefetching: boolean;
  refreshing?: boolean;
  children?: React.ReactNode;
};

export const ErrorPage = ({
  title,
  error,
  refetch,
  isRefetching,
  refreshing = isRefetching,
  children,
}: ErrorPageProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const safeRefetch = useSafeRefetch(refetch, refreshing);
  const isStudentOnly = isStudentOnlyForbiddenError(error);

  useEffect(() => {
    hapticFeedback.error();
  }, []);

  if (isStudentOnly) {
    return (
      <Page
        title={title}
        className="flex-1 justify-center items-center"
        footer={children}
      >
        <View className="justify-center items-center gap-4">
          <ShieldOff color={theme.secondary} size={40} />
          <View className="items-center gap-1">
            <Text variant="h3" className="text-center">
              {t("common.errors.studentOnlyTitle")}
            </Text>
            <Text color="muted" className="text-center">
              {t("common.errors.studentOnly")}
            </Text>
          </View>
        </View>
      </Page>
    );
  }

  return (
    <Page
      title={title}
      className="flex-1 justify-center items-center"
      footer={children}
      onRefresh={safeRefetch}
      refreshing={refreshing}
    >
      <View className="justify-center items-center gap-4">
        <CircleX color={theme.destructive} size={40} />
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
          label={t("common.retry")}
          variant="secondary"
          onPress={safeRefetch}
          isUpdating={isRefetching}
        />
      </View>
    </Page>
  );
};
