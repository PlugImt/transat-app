import { View, Text } from "react-native";
import Page from "@/components/common/Page";

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
        <Text className="h1 m-4">{title}</Text>
        <View className="min-h-screen flex justify-center items-center">
            <Text className="text-red-500 text-center h1">{error?.message}</Text>
        </View>
    </Page>
);
