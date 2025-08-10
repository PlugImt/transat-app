import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Text } from "@/components/common/Text";
import { Page } from "@/components/page/Page";
import { useReservationItem } from "@/hooks/services/reservation/useReservation";

import type { AppStackParamList } from "@/types";
import Animated from 'react-native-reanimated';
import ClubCard from '@/components/custom/card/ClubCard';
import { SearchClub } from '@/app/screens/services/clubs/components';
import { Button } from '@/components/common/Button';
import { Empty } from '@/components/page/Empty';
import { SearchX } from 'lucide-react-native';
import { useAnimatedHeader } from '@/hooks/common/useAnimatedHeader';

type ItemRouteProp = RouteProp<AppStackParamList, "ReservationCalendar">;

export const ReservationCalendar = () => {
  const { t } = useTranslation();
  const route = useRoute<ItemRouteProp>();
  const { id, title } = route.params;
    const { scrollHandler } = useAnimatedHeader();

  const { data, isPending, isError, error, refetch } = useReservationItem(id);

  return (
      <Page
          title={ title }
          onRefresh={refetch}
          refreshing={isPending}
          className="gap-2"
          asChildren
      >
          <Animated.FlatList
                data={data}
                renderItem={({ item }) => <Text>TODO: display the slot list</Text>}
                keyExtractor={(item) => String(item.id)}
                onScroll={scrollHandler}
                showsVerticalScrollIndicator
                ListHeaderComponent={
                    <Text>{t("services.reservation.calendar.title", { title })}</Text>
                }
                ListFooterComponent={
                    isPending ? <Text>{t("common.loading")}</Text> : null
                }
            />
      </Page>
  );
};

export default ReservationCalendar;


