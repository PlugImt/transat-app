import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Beef, ChefHat, Soup, Vegan } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { Star } from "@/components/common/Star";
import { Text } from "@/components/common/Text";
import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import type { MenuItem } from "@/dto";

type NavigationProp = StackNavigationProp<{
  RestaurantReviews: { id: number };
}>;

interface CardProps {
  title: string;
  meals?: MenuItem[];
  icon: string;
}

const RestaurantCard = ({ title, meals, icon }: CardProps) => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const getIcon = () => {
    switch (icon) {
      case "Soup":
        return <Soup color={theme.primary} />;
      case "Beef":
        return <Beef color={theme.primary} />;
      case "Vegan":
        return <Vegan color={theme.primary} />;
      case "ChefHat":
        return <ChefHat color={theme.primary} />;
      default:
        return null;
    }
  };

  if (!meals) {
    return <RestaurantCardLoading title={title} icon={getIcon()} />;
  }

  return (
    <View
      style={{ backgroundColor: theme.card }}
      className="px-6 py-4 rounded-lg flex flex-col gap-6"
    >
      <View className="flex flex-row items-center gap-2">
        {getIcon()}
        <Text
          className="text-lg font-bold"
          style={{ color: theme.primary }}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>

      <View className="flex flex-col gap-4">
        {meals.map((item) => (
          <TouchableOpacity
            className="flex flex-row justify-between items-start gap-5"
            key={item.id}
            onPress={() =>
              navigation.navigate("RestaurantReviews", { id: item.id })
            }
          >
            <Text className="flex-1">{item.name}</Text>
            <Star
              max={5}
              value={item.average_rating || 0}
              layout={"filled"}
              size={"default"}
              disabled
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default RestaurantCard;

interface RestaurantCardLoadingProps {
  title: string;
  icon: React.ReactElement | null;
}

export const RestaurantCardLoading = ({
  title,
  icon,
}: RestaurantCardLoadingProps) => {
  const { theme } = useTheme();
  const skeletonCount = Math.floor(Math.random() * 3) + 1;
  return (
    <View
      style={{ backgroundColor: theme.card }}
      className="px-6 py-4 rounded-lg flex flex-col gap-6"
    >
      <View className="flex flex-row items-center gap-2">
        {icon}
        <Text
          className="text-lg font-bold"
          style={{ color: theme.primary }}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>

      <View className="flex flex-col gap-4">
        {[...Array(skeletonCount).keys()].map((index) => (
          <TextSkeleton key={index} lines={1} />
        ))}
      </View>
    </View>
  );
};
