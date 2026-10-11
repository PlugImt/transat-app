import { useMemo } from "react";
import type { BassineHistoryItem, BassineUserBasic } from "@/dto";
import { useBassineHistory } from "@/hooks/services/games/bassine/useBassine";

export type BassineHistoryGroupType = "hour" | "day" | "week" | "month";

export type GroupedBassineUser = {
  user: BassineUserBasic;
  count: number;
};

// Groupe temporel (heure/jour/semaine/mois)
export type BassineHistoryGroup = {
  key: string;
  type: BassineHistoryGroupType;
  latestDate: string; // date la plus récente du groupe
  users: GroupedBassineUser[];
};

type TimeGroup = {
  type: BassineHistoryGroupType;
  latestDate: string;
  usersByEmail: Map<string, { user: BassineUserBasic; count: number }>;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const MONTH_MS = 30 * DAY_MS;

const buildMonthKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
};

const buildDayKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildWeekKey = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lundi comme début de semaine
  const monday = new Date(d.setDate(diff));
  return buildDayKey(monday);
};

const buildHourKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hour}`;
};

const groupByDate = (date: Date, now: Date) => {
  const diff = now.getTime() - date.getTime();

  if (diff < DAY_MS) {
    return { type: "hour" as BassineHistoryGroupType, key: buildHourKey(date) };
  }
  if (diff < WEEK_MS) {
    return { type: "day" as BassineHistoryGroupType, key: buildDayKey(date) };
  }
  if (diff < MONTH_MS) {
    return { type: "week" as BassineHistoryGroupType, key: buildWeekKey(date) };
  }
  return { type: "month" as BassineHistoryGroupType, key: buildMonthKey(date) };
};

const flattenUserEvents = (items: BassineHistoryItem[]) => {
  return items.flatMap((item) =>
    item.dates.map((iso) => ({
      dateIso: iso,
      user: {
        email: item.email,
        first_name: item.first_name,
        last_name: item.last_name,
        profile_picture: item.profile_picture,
      } satisfies BassineUserBasic,
    })),
  );
};

/**
 * Regroupe l'historique des bassines par date
 * - < 1 jour: groupé par heure
 * - < 1 semaine: groupé par jour
 * - < 1 mois: groupé par semaine
 * - ≥ 1 mois: groupé par mois
 */
export const useGroupedBassineHistory = () => {
  const { data, isPending, isError, error, refetch } = useBassineHistory();

  const groups = useMemo<BassineHistoryGroup[] | undefined>(() => {
    if (!data) return undefined;

    const now = new Date();
    const allEvents = flattenUserEvents(data);
    const groupMap = new Map<string, TimeGroup>();

    for (const { dateIso, user } of allEvents) {
      const date = new Date(dateIso);
      const { type, key } = groupByDate(date, now);

      let group = groupMap.get(key);
      // Crée un nouveau groupe de date si il n'existe pas
      if (!group) {
        group = { type, latestDate: dateIso, usersByEmail: new Map() };
        groupMap.set(key, group);
      }

      // Conserve la date la plus récente pour ce groupe
      if (new Date(group.latestDate).getTime() < date.getTime()) {
        group.latestDate = dateIso;
      }

      // Ajoute le nombre de bassines prises par l'utilisateur dans ce groupe
      const existing = group.usersByEmail.get(user.email);
      if (existing) {
        existing.count += 1;
      } else {
        group.usersByEmail.set(user.email, { user, count: 1 });
      }
    }

    const result: BassineHistoryGroup[] = Array.from(groupMap.entries()).map(
      ([key, g]) => ({
        key,
        type: g.type,
        latestDate: g.latestDate,
        users: Array.from(g.usersByEmail.values())
          .sort((a, b) => b.count - a.count)
          .map((u) => ({ user: u.user, count: u.count })),
      }),
    );

    // Trie des groupes par date la plus récente (décroissant)
    result.sort(
      (a, b) =>
        new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime(),
    );

    return result;
  }, [data]);

  return { groups, isPending, isError, error, refetch };
};

export default useGroupedBassineHistory;
