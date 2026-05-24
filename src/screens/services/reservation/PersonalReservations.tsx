import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { Page } from "@/components/page/Page";
import { QUERY_KEYS } from "@/constants";
import { PastPersonalReservations } from "./components/PastPersonalReservations";
import { UpcomingPersonalReservations } from "./components/UpcomingPersonalReservations";

export const PersonalReservations = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const currentFetching = useIsFetching({
    queryKey: QUERY_KEYS.reservation.my("current"),
  });
  const pastFetching = useIsFetching({
    queryKey: QUERY_KEYS.reservation.my("past"),
  });

  const isPending = currentFetching + pastFetching > 0;

  const refetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reservation.my("current"),
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reservation.my("past"),
      }),
    ]);
  };

  return (
    <Page
      title={t("services.reservation.personal.title")}
      onRefresh={refetch}
      refreshing={isPending}
    >
      <Tabs defaultValue="current">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger
            value="current"
            title={t("services.reservation.current")}
          />
          <TabsTrigger value="past" title={t("services.reservation.past")} />
        </TabsList>

        <TabsContent value="current">
          <UpcomingPersonalReservations />
        </TabsContent>

        <TabsContent value="past">
          <PastPersonalReservations />
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default PersonalReservations;
