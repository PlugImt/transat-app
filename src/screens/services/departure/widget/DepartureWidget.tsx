import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Card from "@/components/common/Card";
import CardGroup from "@/components/common/CardGroup";
import { Text } from "@/components/common/Text";
import { WidgetBoundary } from "@/components/query";
import { TextSkeleton } from "@/components/Skeleton";
import type { BusDeparturesData } from "@/dto";
import { useBusDepartures } from "@/hooks/services/departure/useBusDepartures";
import { formatParisTime, parisWallTimeToDate } from "@/utils/reservation-time";

const LINE_COLORS: Record<string, string> = {
  C6: "#a877b2",
  E5: "#e30613",
  "75": "#e8b975",
};
const DEFAULT_LINE_COLOR = "#6B7280";
const MAX_DEPARTURES = 3;
const TICK_MS = 30_000;

/** The API sends Paris wall time as "YYYY-MM-DD HH:mm:ss". */
const parseDepartureTime = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/.exec(value);
  if (!match) return null;
  const [year, month, day, hour, minute] = match.slice(1).map(Number);
  return parisWallTimeToDate(year, month, day, hour, minute);
};

type Line = BusDeparturesData["lines"][number];

const upcoming = (line: Line, now: number) =>
  (line.departures ?? [])
    .map((departure) => ({
      ...departure,
      date: parseDepartureTime(departure.time),
    }))
    .filter(
      (departure): departure is typeof departure & { date: Date } =>
        departure.date !== null && departure.date.getTime() > now - 30_000,
    )
    .slice(0, MAX_DEPARTURES);

export const DepartureWidget = () => {
  const { t } = useTranslation();
  const { data, isPending, isFetching, isError, error, refetch } =
    useBusDepartures();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <WidgetBoundary
      title={t("services.departure.title")}
      query={{ isPending, isFetching, isError, error, refetch }}
      loading={<DepartureSkeleton />}
    >
      <CardGroup title={t("services.departure.title")}>
        <Card>
          <View className="flex-row justify-between">
            {(data?.lines ?? []).map((line) => (
              <LineColumn key={line.name} line={line} now={now} />
            ))}
          </View>
        </Card>
      </CardGroup>
    </WidgetBoundary>
  );
};

export default DepartureWidget;

const LineColumn = ({ line, now }: { line: Line; now: number }) => {
  const { t } = useTranslation();
  const departures = upcoming(line, now);

  return (
    <View className="flex-1 items-center gap-1">
      <View
        className="rounded-lg px-3 py-1"
        style={{
          backgroundColor: LINE_COLORS[line.name] ?? DEFAULT_LINE_COLOR,
        }}
      >
        <Text variant="lg" className="text-white">
          {line.name}
        </Text>
      </View>
      {departures.length === 0 ? (
        <Text variant="sm" color="muted">
          {t("services.departure.none")}
        </Text>
      ) : (
        departures.map((departure, index) => {
          const minutes = Math.max(
            0,
            Math.round((departure.date.getTime() - now) / 60_000),
          );
          return (
            <Text
              key={departure.time}
              variant={index === 0 ? "h3" : "sm"}
              color={index === 0 && departure.realtime ? "primary" : "muted"}
            >
              {minutes < 60
                ? t("services.departure.minutes", { count: minutes })
                : formatParisTime(departure.date)}
            </Text>
          );
        })
      )}
    </View>
  );
};

export const DepartureSkeleton = () => {
  const { t } = useTranslation();

  return (
    <CardGroup title={t("services.departure.title")}>
      <Card>
        <View className="flex-row justify-between">
          {[0, 1, 2].map((index) => (
            <View key={index} className="flex-1 items-center gap-2">
              <TextSkeleton variant="lg" className="w-12" />
              <TextSkeleton variant="h3" className="w-14" />
              <TextSkeleton variant="sm" className="w-10" />
            </View>
          ))}
        </View>
      </Card>
    </CardGroup>
  );
};
