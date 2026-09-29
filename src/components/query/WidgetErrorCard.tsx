import { CircleX, ShieldOff } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { isStudentOnlyForbiddenError } from "@/api/errors";
import { Button } from "@/components/common/Button";
import Card from "@/components/common/Card";
import CardGroup from "@/components/common/CardGroup";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { useSafeRefetch } from "./useSafeRefetch";

export type WidgetErrorCardProps = {
  title?: string;
  error?: Error | null;
  onRetry?: () => void;
  isRetrying?: boolean;
};

export const WidgetErrorCard = ({
  title,
  error,
  onRetry,
  isRetrying = false,
}: WidgetErrorCardProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const safeRetry = useSafeRefetch(onRetry ?? (() => {}), isRetrying);
  const isStudentOnly = isStudentOnlyForbiddenError(error);

  const content = (
    <Card className="flex-col gap-3 items-center py-4">
      {isStudentOnly ? (
        <ShieldOff color={theme.secondary} size={24} />
      ) : (
        <CircleX color={theme.destructive} size={24} />
      )}
      <Text variant="sm" className="text-center" color="muted">
        {isStudentOnly
          ? t("common.errors.studentOnly")
          : (error?.message ?? t("common.errors.unableToFetch"))}
      </Text>
      {onRetry && !isStudentOnly && (
        <Button
          label={t("common.retry")}
          variant="secondary"
          size="sm"
          onPress={safeRetry}
          isUpdating={isRetrying}
        />
      )}
    </Card>
  );

  if (title) {
    return <CardGroup title={title}>{content}</CardGroup>;
  }

  return <View className="gap-2">{content}</View>;
};
