import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";

export const ErrorState = ({
  error,
  title,
  onRefresh,
}: {
  error: Error | null;
  title: string;
  onRefresh: () => void;
}) => (
  <Page goBack refreshing={false} onRefresh={onRefresh}>
    <Text variant="h1" className="m-4">
      {title}
    </Text>
    <View className="min-h-screen flex justify-center items-center">
      <Text variant="h1" className="text-center" color="destructive">
        {error?.message}
      </Text>
    </View>
  </Page>
);
