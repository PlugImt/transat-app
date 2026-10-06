import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { Page } from "@/components/page/Page";
import { PersonalReservationList } from "@/components/reservation/PersonalReservationList";
import { QUERY_KEYS } from "@/constants";

export const PersonalReservations = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all(
        (["current", "past"] as const).map((filter) =>
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.reservation.my(filter),
          }),
        ),
      );
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Page
      title={t("services.reservation.personal.title")}
      onRefresh={refresh}
      refreshing={refreshing}
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
          <PersonalReservationList filter="current" />
        </TabsContent>

        <TabsContent value="past">
          <PersonalReservationList filter="past" />
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default PersonalReservations;
