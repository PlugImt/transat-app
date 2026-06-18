import React from "react";
import { View } from "react-native";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { TextSkeleton } from "@/components/Skeleton";
import { CardGroup } from "@/components/common";
import { useSchedule } from "@/hooks/services/schedule/useSchedule";
import { ScheduleEvent } from "@/screens/Schedule/components/ScheduleEvent";
import { useTranslation } from "react-i18next";
import { getNextTwoEvents } from "@/screens/Schedule/schedule.utils";
import {useNavigation} from "expo-router";
import {AppNavigation} from "@/types";

export const ScheduleWidget = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<AppNavigation>();
    const { data, isPending, isError, isNotConfigured } = useSchedule();

    if (isPending) {
        return <ScheduleSkeleton />;
    }

    if (isError || isNotConfigured) {
        return null;
    }

    const nextEvents = getNextTwoEvents(data?.calendar_data);

    return (
        <CardGroup title={t("schedule.titleWidget")}
                   onPress={() => navigation.navigate("ScheduleScreen")}>
            <Card className="flex flex-row justify-between items-center ">
                {nextEvents.length === 0 ? (
                    <Card className="p-4 items-center justify-center">
                        <Text color="muted">
                            {t("schedule.noUpcomingEvents")}
                        </Text>
                    </Card>
                ) : (
                    <View className="gap-2 w-full">
                        {nextEvents.map((event) => (
                            <ScheduleEvent
                                key={event.id}
                                event={event}
                                isOver={false}
                            />
                        ))}
                    </View>
                )}
            </Card>
        </CardGroup>
    );
};

export default ScheduleWidget;

export const ScheduleSkeleton = () => {
    return (
        <CardGroup>
            <View className="gap-2">
                <Card className="flex-row justify-between items-center p-4">
                    <View className="flex-1 gap-1">
                        <TextSkeleton variant="h3" className="w-40" />
                        <TextSkeleton variant="sm" className="w-24" />
                    </View>
                </Card>
                <Card className="flex-row justify-between items-center p-4">
                    <View className="flex-1 gap-1">
                        <TextSkeleton variant="h3" className="w-36" />
                        <TextSkeleton variant="sm" className="w-20" />
                    </View>
                </Card>
            </View>
        </CardGroup>
    );
};