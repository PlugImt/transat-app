import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import CardGroup from "@/components/common/CardGroup";
import { WidgetBoundary } from "@/components/query";
import { RowSkeleton } from "@/components/reservation/CatalogCards";
import {
  CatalogRowView,
  catalogRowKey,
} from "@/components/reservation/CatalogRowView";
import { useAuth } from "@/hooks/account";
import { useReservationCatalog } from "@/hooks/services/reservation";
import { paths } from "@/navigation/paths";
import { buildCatalogRows } from "@/utils/reservation.utils";

const PREVIEW_COUNT = 3;

export const ClubReservationWidget = ({ clubId }: { clubId: number }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const { data, isPending, isFetching, isError, error, refetch } =
    useReservationCatalog({ clubId });

  const rows = data
    ? buildCatalogRows(data, { myEmail: user?.email }).filter(
        (row) => row.type !== "header",
      )
    : [];

  return (
    <WidgetBoundary
      title={t("services.reservation.title")}
      query={{ isPending, isFetching, isError, error, refetch }}
      loading={<ClubReservationWidgetSkeleton />}
      isEmpty={rows.length === 0}
    >
      <CardGroup
        title={t("services.reservation.title")}
        onPress={
          rows.length > PREVIEW_COUNT
            ? () => router.push(paths.reservation)
            : undefined
        }
      >
        <View className="gap-2">
          {rows.slice(0, PREVIEW_COUNT).map((row) => (
            <CatalogRowView key={catalogRowKey(row)} row={row} />
          ))}
        </View>
      </CardGroup>
    </WidgetBoundary>
  );
};

export const ClubReservationWidgetSkeleton = () => {
  const { t } = useTranslation();

  return (
    <CardGroup title={t("services.reservation.title")}>
      <View className="gap-2">
        <RowSkeleton />
        <RowSkeleton />
      </View>
    </CardGroup>
  );
};
