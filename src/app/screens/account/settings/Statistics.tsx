import { Button } from "@/components/common/Button";
import Page from "@/components/common/Page";
import { useTheme } from "@/contexts/ThemeContext";
import { Activity, Server, Users } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

// Types for the statistics data
interface UserStatistic {
  email: string;
  request_count: number;
  avg_duration_ms: number;
  success_rate_percent: number;
  first_request: string;
  last_request: string;
}

interface GlobalStatistic {
  total_request_count: number;
  global_avg_duration_ms: number;
  global_min_duration_ms: number;
  global_max_duration_ms: number;
  global_success_rate_percent: number;
  first_request: string;
  last_request: string;
  success_count: number;
  error_count: number;
}

interface ServerStatus {
  status: "online" | "offline";
  latency: number;
  timestamp: string;
}

// Define API base URL
const API_BASE_URL = "https://transat.destimt.fr";

export const Statistics = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [globalStats, setGlobalStats] = useState<GlobalStatistic | null>(null);
  const [topUsers, setTopUsers] = useState<UserStatistic[]>([]);
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    status: "offline",
    latency: 0,
    timestamp: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [statsLastLoaded, setStatsLastLoaded] = useState<string>(
    new Date().toISOString(),
  );

  // Function to fetch server status
  const checkServerStatus = useCallback(async () => {
    const startTime = Date.now();
    try {
      const response = await fetch(`${API_BASE_URL}/status`, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
      });
      const endTime = Date.now();
      const latency = endTime - startTime;

      setServerStatus({
        status: response.ok ? "online" : "offline",
        latency,
        timestamp: new Date().toISOString(),
      });

      return response.ok;
    } catch (_err) {
      setServerStatus({
        status: "offline",
        latency: 0,
        timestamp: new Date().toISOString(),
      });
      return false;
    }
  }, []);

  // Function to fetch statistics
  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check server status first
      const isServerOnline = await checkServerStatus();

      if (!isServerOnline) {
        setLoading(false);
        setError("Server is offline. Cannot fetch statistics.");
        return;
      }

      // Fetch global statistics
      const globalResponse = await fetch(
        `${API_BASE_URL}/statistics/global`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!globalResponse.ok) {
        throw new Error(
          `Failed to fetch global statistics: ${globalResponse.status}`,
        );
      }

      const globalData = await globalResponse.json();
      setGlobalStats(globalData.statistics);

      // Fetch top users statistics
      const topUsersResponse = await fetch(
        `${API_BASE_URL}/statistics/top-users`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!topUsersResponse.ok) {
        throw new Error(
          `Failed to fetch top users statistics: ${topUsersResponse.status}`,
        );
      }

      const topUsersData = await topUsersResponse.json();
      setTopUsers(topUsersData.statistics);

      setStatsLastLoaded(new Date().toISOString());
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(
        `Failed to fetch statistics: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }, [checkServerStatus]);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format email to display as "First Name + First Letter of Last Name"
  const formatEmail = (email: string) => {
    if (!email) return "Anonymous";

    // Split email to get the name part (before @)
    const namePart = email.split("@")[0];
    if (!namePart || !email.includes("@imt-atlantique.net")) {
      return "User"; // Default if not following expected pattern
    }

    // Split name part by dot to get first name and last name
    const nameParts = namePart.split(".");
    if (nameParts.length < 2) {
      return nameParts[0]; // If there's no dot, just return the name part
    }

    // Format as "First Name + First Letter of Last Name."
    const firstName =
      nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
    const lastNameInitial = nameParts[1].charAt(0).toUpperCase();

    return `${firstName} ${lastNameInitial}.`;
  };

  useEffect(() => {
    fetchStatistics().then((r) => r);

    // Set up periodic status checks
    const statusCheckInterval = setInterval(() => {
      checkServerStatus().then((r) => r);
    }, 10000); // Check every 10 seconds

    return () => {
      clearInterval(statusCheckInterval);
    };
  }, [fetchStatistics, checkServerStatus]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStatistics();
    setRefreshing(false);
  };

  return (
    <Page
      goBack
      refreshing={refreshing}
      onRefresh={onRefresh}
      title={t("statistics.title", "Statistics")}
    >
      <View className="flex flex-col gap-8">
        <View className="flex flex-col gap-4">
          {/* Server Status Card */}
          <View className="flex-row items-center">
            <Server color={theme.text} size={22} />
            <Text className="h3 ml-2" style={{ color: theme.text }}>
              {t("statistics.serverStatus", "Server Status")}
            </Text>
          </View>
          <View
            className=" rounded-lg p-4 mb-4"
            style={{ backgroundColor: theme.card }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <View
                  className={`h-3 w-3 rounded-full mr-2 ${
                    serverStatus.status === "online"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
                <Text style={{ color: theme.text }}>
                  {serverStatus.status === "online"
                    ? t("statistics.online", "Online")
                    : t("statistics.offline", "Offline")}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between mt-2">
              <View>
                <Text
                  className="text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  {t("statistics.latency", "Latency")}
                </Text>
                <Text className="font-medium" style={{ color: theme.text }}>
                  {serverStatus.latency} ms
                </Text>
              </View>
              <View>
                <Text
                  className=" text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  {t("statistics.lastChecked", "Last Checked")}
                </Text>
                <Text className=" font-medium" style={{ color: theme.text }}>
                  {formatDate(serverStatus.timestamp)}
                </Text>
              </View>
            </View>
          </View>

          {/* Error display */}
          {error && (
            <View className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-md mb-4">
              <Text className="text-red-500 font-medium">{error}</Text>
            </View>
          )}

          {/* Loading state */}
          {loading ? (
            <View
              className=" rounded-lg p-8 items-center justify-center mb-4"
              style={{ backgroundColor: theme.card }}
            >
              <Activity size={32} color={theme.primary} className="mb-4" />
              <Text style={{ color: theme.textSecondary }}>
                {t("statistics.loading", "Loading statistics...")}
              </Text>
            </View>
          ) : (
            globalStats && (
              <>
                {/* Global Stats Card */}
                <Text className="h3 ml-4" style={{ color: theme.text }}>
                  {t("statistics.globalStats", "Global Statistics")}
                </Text>

                <View
                  className=" rounded-lg p-4 mb-4"
                  style={{ backgroundColor: theme.card }}
                >
                  <View className="flex-row flex-wrap justify-between mb-4">
                    <View className="w-[48%] bg-background/20 rounded-lg p-3 mb-2">
                      <Text
                        className=" text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        {t("statistics.totalRequests", "Total Requests")}
                      </Text>
                      <Text
                        className=" text-xl font-bold"
                        style={{ color: theme.primary }}
                      >
                        {globalStats.total_request_count}
                      </Text>
                    </View>

                    <View className="w-[48%] bg-background/20 rounded-lg p-3 mb-2">
                      <Text
                        className=" text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        {t("statistics.successRate", "Success Rate")}
                      </Text>
                      <Text
                        className={`text-xl font-bold ${
                          globalStats.global_success_rate_percent > 95
                            ? "text-green-500"
                            : globalStats.global_success_rate_percent > 80
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      >
                        {globalStats.global_success_rate_percent.toFixed(1)}%
                      </Text>
                    </View>

                    <View className="w-[48%] bg-background/20 rounded-lg p-3 mb-2">
                      <Text
                        className=" text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        {t("statistics.avgResponseTime", "Avg Response Time")}
                      </Text>
                      <Text
                        className=" text-xl font-bold"
                        style={{ color: theme.primary }}
                      >
                        {globalStats.global_avg_duration_ms.toFixed(1)}{" "}
                        <Text
                          className="text-xs  "
                          style={{ color: theme.textSecondary }}
                        >
                          ms
                        </Text>
                      </Text>
                    </View>

                    <View className="w-[48%] bg-background/20 rounded-lg p-3 mb-2">
                      <Text
                        className=" text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        {t("statistics.maxResponseTime", "Max Response Time")}
                      </Text>
                      <Text
                        className={`text-xl font-bold ${
                          globalStats.global_max_duration_ms < 500
                            ? "text-amber-500"
                            : "text-red-500"
                        }`}
                      >
                        {globalStats.global_max_duration_ms}{" "}
                        <Text
                          className="text-xs  "
                          style={{ color: theme.textSecondary }}
                        >
                          ms
                        </Text>
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between mb-4">
                    <View className="w-[48%] bg-background/20 rounded-lg p-3">
                      <Text style={{ color: theme.textSecondary }}>
                        {t(
                          "statistics.successfulRequests",
                          "Successful Requests",
                        )}
                      </Text>
                      <Text className="text-green-500 text-xl font-bold">
                        {globalStats.success_count}
                      </Text>
                    </View>

                    <View className="w-[48%] bg-background/20 rounded-lg p-3">
                      <Text style={{ color: theme.textSecondary }}>
                        {t("statistics.errorRequests", "Error Requests")}
                      </Text>
                      <Text className="text-red-500 text-xl font-bold">
                        {globalStats.error_count}
                      </Text>
                    </View>
                  </View>

                  {/* First Request */}
                  <View className="items-center mt-4">
                    <Text
                      className=" text-xs mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      {t("statistics.firstRequest", "First Request")}
                    </Text>
                    <Text style={{ color: theme.text }}>
                      {formatDate(globalStats.first_request)}
                    </Text>
                  </View>
                </View>

                {/* Top Users Card */}
                {topUsers.length > 0 && (
                  <>
                    <View className="flex-row items-center mb-4">
                      <Users color={theme.text} size={22} />
                      <Text className="h3 ml-2 " style={{ color: theme.text }}>
                        {t("statistics.topUsers.title", "Top 10 Users")}
                      </Text>
                    </View>
                    <View
                      className=" rounded-lg p-4 mb-4"
                      style={{ backgroundColor: theme.card }}
                    >
                      {topUsers.map((user, index) => (
                        <View
                          key={user.email}
                          className="bg-background/20 rounded-lg p-3 mb-2"
                        >
                          <View className="flex-row justify-between items-center mb-2">
                            <View className="flex-row items-center">
                              <Text
                                className=" font-bold mr-2"
                                style={{ color: theme.primary }}
                              >
                                #{index + 1}
                              </Text>
                              <Text
                                className=" font-medium"
                                style={{ color: theme.text }}
                              >
                                {formatEmail(user.email)}
                              </Text>
                            </View>
                            <Text
                              className=" font-bold"
                              style={{ color: theme.text }}
                            >
                              {user.request_count}{" "}
                              {t("statistics.topUsers.requests", "requests")}
                            </Text>
                          </View>

                          <View className="flex-row justify-between mb-2">
                            <View>
                              <Text style={{ color: theme.textSecondary }}>
                                {t(
                                  "statistics.topUsers.avgTime",
                                  "Avg Response Time",
                                )}
                              </Text>
                              <Text style={{ color: theme.text }}>
                                {user.avg_duration_ms.toFixed(2)} ms
                              </Text>
                            </View>

                            <View>
                              <Text style={{ color: theme.textSecondary }}>
                                {t(
                                  "statistics.topUsers.successRate",
                                  "Success Rate",
                                )}
                              </Text>
                              <Text
                                className={`${
                                  user.success_rate_percent > 90
                                    ? "text-green-500"
                                    : user.success_rate_percent > 75
                                      ? "text-amber-500"
                                      : "text-red-500"
                                }`}
                                style={{ color: theme.textSecondary }}
                              >
                                {user.success_rate_percent.toFixed(1)}%
                              </Text>
                            </View>
                          </View>

                          <View className="flex-row justify-between">
                            <View>
                              <Text style={{ color: theme.textSecondary }}>
                                {t(
                                  "statistics.topUsers.firstSeen",
                                  "First Seen",
                                )}
                              </Text>
                              <Text
                                className="text-xs"
                                style={{ color: theme.textSecondary }}
                              >
                                {formatDate(user.first_request)}
                              </Text>
                            </View>

                            <View>
                              <Text style={{ color: theme.textSecondary }}>
                                {t("statistics.topUsers.lastSeen", "Last Seen")}
                              </Text>
                              <Text
                                className="text-xs"
                                style={{ color: theme.textSecondary }}
                              >
                                {formatDate(user.last_request)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                <Text
                  className="text-center text-xs mb-4"
                  style={{ color: theme.textSecondary }}
                >
                  {t("statistics.lastUpdated", "Statistics last updated:")}{" "}
                  {formatDate(statsLastLoaded)}
                </Text>
              </>
            )
          )}

          <Button
            label={t("statistics.refresh", "Refresh Statistics")}
            onPress={onRefresh}
            disabled={refreshing}
            loading={refreshing}
            className="mb-8"
          />
        </View>
      </View>
    </Page>
  );
};

export default Statistics;
