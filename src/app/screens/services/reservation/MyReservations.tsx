import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import { useMyReservations } from "@/hooks/services/reservation/useReservation";
import { toYYYYMMDD } from "@/utils/date.utils";
import { MyReservationCard } from "./components";

export const MyReservations = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"current" | "past">("current");

  const {
    data: myCurrent,
    isPending: myCurrentPending,
    isError: myCurrentIsError,
    error: myCurrentError,
    refetch: myCurrentRefetch,
  } = useMyReservations("current");
  const {
    data: myPast,
    isPending: myPastPending,
    isError: myPastIsError,
    error: myPastError,
    refetch: myPastRefetch,
  } = useMyReservations("past");

  const currentList = myCurrent?.current ?? [];
  const currentSlotItems = currentList.filter((i) => i.slot);
  const currentNonSlotItems = currentList.filter((i) => !i.slot);
  const groupedCurrent = currentSlotItems.reduce<Record<string, typeof currentSlotItems>>(
    (acc, item) => {
      const key = toYYYYMMDD(new Date(item.start_date));
      acc[key] = acc[key] ? [...acc[key], item] : [item];
      return acc;
    },
    {},
  );
  const orderedCurrentDays = Object.keys(groupedCurrent).sort((a, b) =>
    a.localeCompare(b),
  );

  const pastList = myPast?.past ?? [];
  const pastSlotItems = pastList.filter((i) => i.slot);
  const pastNonSlotItems = pastList.filter((i) => !i.slot);
  const groupedPast = pastSlotItems.reduce<Record<string, typeof pastSlotItems>>(
    (acc, item) => {
      const key = toYYYYMMDD(new Date(item.start_date));
      acc[key] = acc[key] ? [...acc[key], item] : [item];
      return acc;
    },
    {},
  );
  const orderedPastDays = Object.keys(groupedPast).sort((a, b) =>
    b.localeCompare(a),
  );
  const isPending = tab === "current" ? myCurrentPending : myPastPending;
  const isError = tab === "current" ? myCurrentIsError : myPastIsError;
  const error = tab === "current" ? myCurrentError : myPastError;
  console.log("-----------CURRENT-----------");
  console.log(myCurrent);
  console.log("-----------PAST-----------");
  console.log(myPast);

  return (
    <Page
      title={t("services.reservation.title")}
      onRefresh={() => {
        if (tab === "current") {
          myCurrentRefetch().then((r) => r);
        } else {
          myPastRefetch().then((r) => r);
        }
      }}
      refreshing={isPending}
      className="gap-2"
      asChildren
    >
      <View className="mt-24" />
      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger
            title={t("services.reservation.current")}
            value="current"
          />
          <TabsTrigger title={t("services.reservation.past")} value="past" />
        </TabsList>

        <TabsContent value="current">
          <Animated.FlatList
            ListHeaderComponent={
              currentNonSlotItems.length > 0 ? (
                <View className="gap-2 mb-3">
                  <Text variant="h3" className="ml-4">
                    {t("services.reservation.current")}
                  </Text>
                  {currentNonSlotItems.map((res) => (
                    <MyReservationCard key={res.id} item={res} action="return" />
                  ))}
                </View>
              ) : null
            }
            data={orderedCurrentDays}
            keyExtractor={(d) => d}
            renderItem={({ item: day }) => (
              <View className="gap-2 mb-3">
                <Text variant="h3" className="ml-4">
                  {day}
                </Text>
                {groupedCurrent[day]
                  .sort(
                    (a, b) =>
                      new Date(a.start_date).getTime() -
                      new Date(b.start_date).getTime(),
                  )
                  .map((res) => (
                    <MyReservationCard key={res.id} item={res} action="cancel" />
                  ))}
              </View>
            )}
          />
        </TabsContent>

        <TabsContent value="past">
          <Animated.FlatList
            ListHeaderComponent={
              pastNonSlotItems.length > 0 ? (
                <View className="gap-2 mb-3">
                  <Text variant="h3" className="ml-4">
                    {t("services.reservation.past")}
                  </Text>
                  {pastNonSlotItems.map((res) => (
                    <MyReservationCard key={res.id} item={res} />
                  ))}
                </View>
              ) : null
            }
            data={orderedPastDays}
            keyExtractor={(d) => d}
            renderItem={({ item: day }) => (
              <View className="gap-2 mb-3">
                <Text variant="h3" className="ml-4">
                  {day}
                </Text>
                {groupedPast[day]
                  .sort(
                    (a, b) =>
                      new Date(b.start_date).getTime() -
                      new Date(a.start_date).getTime(),
                  )
                  .map((res) => (
                    <MyReservationCard key={res.id} item={res} />
                  ))}
              </View>
            )}
          />
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default MyReservations;
