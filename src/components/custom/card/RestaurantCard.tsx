import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Beef, ChefHat, Soup, Vegan } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import Card from "@/components/common/Card";
import { Text } from "@/components/common/Text";
import { Stars } from "@/components/custom/star/Stars";
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
    const iconMap: { [key: string]: React.ReactElement } = {
      Soup: <Soup color={theme.text} />,
      Beef: <Beef color={theme.text} />,
      Vegan: <Vegan color={theme.text} />,
      ChefHat: <ChefHat color={theme.text} />,
    };

    return iconMap[icon] || null;
  };

  if (!meals) {
    return <RestaurantCardSkeleton title={title} icon={getIcon()} />;
  }

  return (
    <Card>
      <View className="flex-row items-center gap-2">
        {getIcon()}
        <Text variant="lg">{title}</Text>
      </View>

      <View className="flex-col gap-2">
        {meals.map((item) => (
          <TouchableOpacity
            className="flex-row justify-between gap-4 items-start"
            key={item.id}
            onPress={() =>
              navigation.navigate("RestaurantReviews", { id: item.id })
            }
          >
            <Text className="flex-1">{item.name}</Text>
            <View className="flex-row items-center gap-1">
              <Text color="primary">{item.average_rating}/5</Text>
              <Stars max={1} value={1} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );
};

export default RestaurantCard;

interface RestaurantCardSkeletonProps {
  title: string;
  icon: React.ReactElement | null;
}

export const RestaurantCardSkeleton = ({
  title,
  icon,
}: RestaurantCardSkeletonProps) => {
  const skeletonCount = Math.floor(Math.random() * 3) + 1;
  return (
    <Card>
      <View className="flex-row items-center gap-2">
        {icon}
        <Text variant="lg">{title}</Text>
      </View>

      <View className="flex flex-col gap-4">
        {[...Array(skeletonCount).keys()].map((index) => (
          <TextSkeleton key={index} />
        ))}
      </View>
    </Card>
  );
};
