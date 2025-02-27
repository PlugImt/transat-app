import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Button } from "../common/Button";

type Props = {
  error: Error;
  refetch: () => void;
  isRefetching: boolean;
};

export default function ErrorPage({ error, refetch, isRefetching }: Props) {
  const { t } = useTranslation();
  return (
    <View className="bg-background px-5 justify-center items-center gap-6 h-screen">
      <View className="gap-2 justify-center items-center">
        <Text className="h3">{t("common.errors.occurred")}</Text>
        <Text className="text-foreground/70">{error?.message}</Text>
      </View>
      <Button
        label="Réessayer"
        variant="outlined"
        onPress={refetch}
        loading={isRefetching}
      />
    </View>
  );
}
