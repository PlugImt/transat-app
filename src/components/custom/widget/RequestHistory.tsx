import { RequestHistorySkeleton } from "@/components/Skeleton";
import type { SupportRequest } from "@/lib/support";
import { useTheme } from "@/themes/useThemeProvider";
import { format } from "date-fns";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface RequestHistoryProps {
  requests: SupportRequest[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const RequestHistory = ({
  requests = [],
  isLoading = false,
}: RequestHistoryProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  const toggleRequest = (id: string) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "resolved":
        return {
          icon: <Check size={16} color={theme.success} />,
          text: t("settings.help.status.resolved"),
          color: theme.success,
        };
      case "in_progress":
        return {
          icon: <RefreshCw size={16} color={theme.warning} />,
          text: t("settings.help.status.in_progress"),
          color: theme.warning,
        };
      case "pending":
        return {
          icon: <Clock size={16} color={theme.muted} />,
          text: t("settings.help.status.pending"),
          color: theme.muted,
        };
      default:
        return {
          icon: <Clock size={16} color={theme.muted} />,
          text: t("settings.help.status.pending"),
          color: theme.muted,
        };
    }
  };

  if (isLoading) {
    return <RequestHistorySkeleton />;
  }

  if (requests.length === 0) {
    return (
      <View className="items-center justify-center py-8">
        <Text className="text-foreground/70 text-center">
          {t("settings.help.noRequests")}
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-4">
      {requests.map((request) => {
        const { icon, text, color } = getStatusInfo(request.status);
        const isExpanded = expandedRequest === request.id;
        const requestDate = new Date(request.created_at);

        return (
          <View key={request.id} className="bg-card rounded-lg p-4">
            <TouchableOpacity
              onPress={() => toggleRequest(request.id)}
              className="flex-row justify-between items-center"
            >
              <View className="flex-1">
                <Text className="text-foreground font-medium">
                  {request.subject}
                </Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <Text className="text-xs text-foreground/60">
                    {/*{format(requestDate, "MMM d, yyyy")}*/}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="flex-row items-center gap-1">
                  {icon}
                  <Text style={{ color }} className="text-xs">
                    {text}
                  </Text>
                </View>
                {isExpanded ? (
                  <ChevronUp size={18} color={theme.muted} />
                ) : (
                  <ChevronDown size={18} color={theme.muted} />
                )}
              </View>
            </TouchableOpacity>

            {isExpanded && (
              <View className="mt-3 pt-3 border-t border-border">
                <Text className="text-foreground/70 text-sm mb-2">
                  {request.message}
                </Text>

                {request.image_url && (
                  <View className="mb-3">
                    <View className="flex-row items-center gap-1 mb-1">
                      <ImageIcon size={14} color={theme.foreground} />
                      <Text className="text-xs text-foreground/60">
                        Screenshot:
                      </Text>
                    </View>
                    <Image
                      source={{ uri: request.image_url }}
                      className="w-full h-48 rounded-md mb-2"
                      resizeMode="contain"
                    />
                  </View>
                )}

                {request.response ? (
                  <View className="mt-2 bg-background/50 p-3 rounded-lg">
                    <Text className="text-sm font-medium text-foreground mb-1">
                      Response:
                    </Text>
                    <Text className="text-sm text-foreground/70">
                      {request.response}
                    </Text>
                  </View>
                ) : (
                  <View className="mt-2 bg-background/50 p-3 rounded-lg">
                    <Text className="text-sm text-foreground/70 italic">
                      Waiting for response...
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default RequestHistory;
