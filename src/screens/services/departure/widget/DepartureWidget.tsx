import React from "react";
import { View } from "react-native";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { AvatarSkeleton, TextSkeleton } from "@/components/Skeleton";
import { useDeparture } from "@/hooks/services/departure/useDeparture";
import { CardGroup } from "@/components/common";
import colors from "@/themes/colors";
import { useTranslation } from "react-i18next";

export const DepartureWidget = () => {
    const { t } = useTranslation();
    const { departure, isPending, isError } = useDeparture();

    if (isPending) {
        return <DepartureSkeleton />;
    }

    if (isError) {
        return null;
    }

    return (
        <CardGroup title={t("services.departure.title")}>
            <Card className="flex-row justify-between bg-green-500 items-start">
                {departure.map((item, index) => {

                    const isLast = index === 2;

                    return (
                        <View key={index} className={`flex-1 items-center gap-1`}>
                            <Text
                                variant="h3"
                                className="rounded-lg px-5 py-0.5 text-white font-bold"
                                style={{ backgroundColor: colors.departure[item.name as keyof typeof colors.departure] || '#000' }}
                            >
                                {item.name}
                            </Text>

                            <View className={`items-center gap-1`}>
                                {renderDepartureTime(item.nextDeparture, t, isLast ? "font-semibold" : "")}
                            </View>

                            <View className={`items-center`}>
                                {renderDepartureTime(item.nextDeparture2, t, isLast ? "text-muted" : "")}
                            </View>
                        </View>
                    );
                })}
            </Card>
        </CardGroup>
    );
};
export default DepartureWidget;

export const DepartureSkeleton = (t: any) => {
    return (
        <CardGroup>
            <Card className="flex flex-row justify-between items-center ">
                <View className="flex-1 items-center">
                    <TextSkeleton variant="h2" className="w-32" />
                    <TextSkeleton variant="h3" className="w-32" />
                    <TextSkeleton variant="h3" className="w-32" />
                </View>

                <View className="flex-1 items-center">
                    <TextSkeleton variant="h2" className="w-32" />
                    <TextSkeleton variant="h3" className="w-32" />
                    <TextSkeleton variant="h3" className="w-32" />
                </View>

                <View className="flex-1 items-center">
                    <TextSkeleton variant="h2" className="w-32" />
                    <TextSkeleton variant="h3" className="w-32" />
                    <TextSkeleton variant="h3" className="w-32" />
                </View>
            </Card>
        </CardGroup>
    );
};

const renderDepartureTime = (departureDate: Date | string | number, t: any, extraStyles: string): React.ReactNode => {
    const date = new Date(departureDate);
    if (isNaN(date.getTime())) {
        return "";
    }

    const now = new Date();
    const differenceInMs = date.getTime() - now.getTime();
    const differenceInMinutes = differenceInMs / (1000 * 60);

    if (differenceInMinutes >= 60) {
        const hour = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        return (
            <View className={`flex-row items-baseline items-center`}>

                <Text className={`${extraStyles}`}>{t("services.departure.scheduledFor")} </Text>
                <Text className="text-xl font-bold leading-none">{hour}</Text>
            </View>
        );
    }
    else if (differenceInMinutes >= 0 && differenceInMinutes < 1) {
        return (
            <Text className={`${extraStyles}`}>
                {t("services.departure.approaching")}
            </Text>
        );
    }
    else if (differenceInMinutes >= 1) {
        const minutesLeft = Math.floor(differenceInMinutes);
        return (
            <View className={`flex-row items-baseline items-center`}>
                <Text className="text-xl font-bold leading-none">{minutesLeft}</Text>
                <Text className={`${extraStyles}`}>{t("services.departure.minutes")}</Text>
            </View>
        );
    }
    else {
        return (
            <Text className={`${extraStyles}`}>
                {t("services.departure.alreadyGone")}
            </Text>
        );
    }
};