import Page from "@/components/common/Page"
import { AboutModal } from "@/components/custom/AboutModal";
import { t } from "i18next";
import { View, Text } from "react-native";

export const ErrorState = ({
    error,
    onRefresh,
    refreshing
}: {
    error: Error | null;
    onRefresh: () => void;
    refreshing: boolean;
}) => {
    return (
        <Page
            refreshing={refreshing}
            onRefresh={onRefresh}
            title={t("services.homework.title")}
            about={
                <AboutModal
                    title={t("services.homework.title")}
                    description={t("services.homework.about")}
                    openingHours="TEMP"
                    location={t("services.homework.location")}
                    price={t("services.homework.price")}
                    additionalInfo={t("services.homework.additionalInfo")}
                />
            }
            >
            <View className="min-h-screen flex justify-center items-center">
                <Text className="text-red-500 text-center h1">{error?.message}</Text>
            </View>
        </Page>
    );
}