import type { BottomTabNavigationProp } from "expo-router/js-tabs";
import { useNavigation } from "expo-router/react-navigation";
import { ChevronRight, Clock, MapPin } from "lucide-react-native";
import { View } from "react-native";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { UserStack, UserStackSkeleton } from "@/components/custom";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import type { User, Covoiturage } from "@/dto";

type NavigationProp = BottomTabNavigationProp<{
  CovoiturageDetails: { id: number };
}>;

type CovoiturageCardProps = {
  covoiturage: Covoiturage;
};

export const CovoiturageCard = ({ covoiturage }: CovoiturageCardProps) => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const departure_time = new Date(covoiturage.time); 
  

  return (
    <Card
      className="flex-row items-center gap-0"
      onPress={() => {
        navigation.navigate("CovoiturageDetails", { id: covoiturage.id });
      }}
    >
      <View className="flex-1 flex-row items-center gap-4">
        <View className="gap-2 flex-1">
          <View>
            <Text variant="h3">{covoiturage.name}</Text>
            
              <Text variant="sm" color="primary">
                Date
              </Text>
          </View>
          <View className="flex-row items-center gap-x-2 flex-wrap">
            <View className="flex-row items-center gap-1">
              <MapPin color={theme.muted} size={14} />
              <Text variant="sm" color="muted">
                {covoiturage.departure} → {covoiturage.destination}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ChevronRight color={theme.muted} />
    </Card>
  );
};

export const CovoiturageCardSkeleton = () => {
  const { theme } = useTheme();
  return (
    <Card className="flex-row items-center gap-0">
      <View className="flex-1 flex-row items-center gap-4">
        <View className="gap-2 flex-1">
          <View>
            <TextSkeleton variant="h3" lastLineWidth="100%" />
            <TextSkeleton variant="sm" lastLineWidth={80} />
          </View>
          <View className="flex-row items-center gap-x-2 flex-wrap">
            <View className="flex-row items-center gap-1">
              <MapPin color={theme.muted} size={14} />
              <TextSkeleton variant="sm" lastLineWidth={60} />
            </View>
          </View>
          <UserStackSkeleton size="sm" borderColor="card" />
        </View>
      </View>
      <ChevronRight color={theme.muted} />
    </Card>
  );
};
