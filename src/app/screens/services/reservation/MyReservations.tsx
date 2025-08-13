import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { Page } from "@/components/page/Page";
import { useMyReservations } from "@/hooks/services/reservation/useReservation";
import { ReservationListOnly } from "./components";

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

  const activeData = tab === "current" ? myCurrent : myPast;
  const isPending = tab === "current" ? myCurrentPending : myPastPending;
  const isError = tab === "current" ? myCurrentIsError : myPastIsError;
  const error = tab === "current" ? myCurrentError : myPastError;

  console.log(myCurrent)

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
      <Tabs
        defaultValue="current"
        value={tab}
        onValueChange={(v) => setTab(v as any)}
      >
        <TabsList>
          <TabsTrigger
            title={t("services.reservation.current")}
            value="current"
          />
          <TabsTrigger title={t("services.reservation.past")} value="past" />
        </TabsList>

        <TabsContent value="current">
          <ReservationListOnly
            title={t("services.reservation.title")}
            data={activeData as any}
            isPending={isPending}
            isError={isError}
            error={error}
          />
        </TabsContent>

        <TabsContent value="past">
          <ReservationListOnly
            title={t("services.reservation.title")}
            data={activeData as any}
            isPending={isPending}
            isError={isError}
            error={error}
          />
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default MyReservations;
