import { addHours, format, parseISO } from "date-fns";
import { useMemo } from "react";
import { View } from "react-native";
import Avatar from "@/components/common/Avatar";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { useBassineHistory } from "@/hooks/services/games/bassine/useBassine";

type HistoryUser = {
  email: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null | undefined;
  dates: string[];
};

export const BassineHistory = () => {
  const { data, isPending, isError } = useBassineHistory();

  const usersWithDates: HistoryUser[] = useMemo(() => {
    if (!data) return [];

    // biome-ignore lint/suspicious/noExplicitAny: will be improved later
    if (Array.isArray(data) && data.length > 0 && (data[0] as any).user) {
      const map = new Map<string, HistoryUser>();
      // biome-ignore lint/suspicious/noExplicitAny: will be improved later
      for (const item of data as any[]) {
        if (item.type && item.type !== "up") continue;
        const u = item.user;
        const key = u?.email ?? "unknown";
        if (!map.has(key)) {
          map.set(key, {
            email: u?.email,
            first_name: u?.first_name,
            last_name: u?.last_name,
            profile_picture: u?.profile_picture,
            dates: [],
          });
        }
        map.get(key)?.dates.push(item.date);
      }
      return Array.from(map.values());
    }

    // biome-ignore lint/suspicious/noExplicitAny: will be improved later
    return (data as any[]).map((u) => ({
      email: u.email,
      first_name: u.first_name,
      last_name: u.last_name,
      profile_picture: u.profile_picture,
      dates: u.dates ?? [],
    }));
  }, [data]);

  const groupedByDay = useMemo(() => {
    type GroupEntry = {
      user: HistoryUser;
      start: Date;
      count: number;
    };
    const dayMap = new Map<string, GroupEntry[]>();

    for (const user of usersWithDates) {
      const sorted = [...user.dates]
        .map((iso) => parseISO(iso))
        .sort((a, b) => a.getTime() - b.getTime());
      let i = 0;
      while (i < sorted.length) {
        const first = sorted[i];
        const windowEnd = addHours(first, 1).getTime();
        let j = i + 1;
        while (j < sorted.length && sorted[j].getTime() < windowEnd) {
          j++;
        }
        const count = j - i;
        const dayKey = format(first, "yyyy-MM-dd");
        const arr = dayMap.get(dayKey) ?? [];
        arr.push({ user, start: first, count });
        dayMap.set(dayKey, arr);
        i = j;
      }
    }

    const sortedDays = Array.from(dayMap.entries()).sort((a, b) =>
      a[0] < b[0] ? 1 : -1,
    );
    return sortedDays.map(([dayKey, entries]) => ({
      dayKey,
      display: format(parseISO(`${dayKey}T12:00:00`), "PPP"),
      entries: entries.sort((a, b) => b.start.getTime() - a.start.getTime()),
    }));
  }, [usersWithDates]);

  if (isPending)
    return (
      <Card>
        <Text>Loading...</Text>
      </Card>
    );
  if (isError)
    return (
      <Card>
        <Text>Failed to load history</Text>
      </Card>
    );
  if (!usersWithDates.length)
    return (
      <Card>
        <Text>No history yet</Text>
      </Card>
    );

  return (
    <View className="gap-4">
      {groupedByDay.map(({ dayKey, display, entries }) => (
        <View key={dayKey} className="gap-3">
          <Text className="font-bold">{display}</Text>
          {entries.map((e, idx) => (
            <Card
              key={`${e.user.email}-${e.start.toISOString()}-${idx}`}
              className="flex-row items-center justify-between px-3 py-2"
            >
              <View className="flex-row items-center gap-3">
                <Avatar
                  size={28}
                  user={{
                    first_name: e.user.first_name,
                    last_name: e.user.last_name,
                    profile_picture: e.user.profile_picture ?? undefined,
                  }}
                />
                <View>
                  <Text className="font-bold">
                    {e.user.first_name} {e.user.last_name}
                  </Text>
                  <Text variant="sm">{format(e.start, "HH:mm")}</Text>
                </View>
              </View>
              <Text className="font-bold">+{e.count}</Text>
            </Card>
          ))}
        </View>
      ))}
    </View>
  );
};

export default BassineHistory;
