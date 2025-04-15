import { TextSkeleton } from "@/components/Skeleton";
import { useTheme } from "@/themes/useThemeProvider";
import { Beef, ChefHat, Soup, Vegan } from "lucide-react-native";
import { Text, View } from "react-native";

interface CardProps {
  title: string;
  meals?: string[];
  icon: string;
}

const RestaurantCard = ({ title, meals, icon }: CardProps) => {
  const theme = useTheme();

  function getIcon() {
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
  }

  if (!meals) {
    return <RestaurantCardLoading title={title} icon={getIcon()} />;
  }

  return (
    <View className="px-6 py-4 rounded-lg bg-card flex flex-col gap-6">
      <View className="flex flex-row items-center gap-2">
        {getIcon()}
        <Text className="text-lg font-bold text-primary" ellipsizeMode="tail">
          {title}
        </Text>
      </View>

      <View className="flex flex-col gap-4">
        {meals.map((item) => (
          <Text key={item} className="text-foreground">
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default RestaurantCard;

interface RestaurantCardLoadingProps {
  title: string;
  icon: JSX.Element | null;
}

export const RestaurantCardLoading = ({
  title,
  icon,
}: RestaurantCardLoadingProps) => {
  const skeletonCount = Math.floor(Math.random() * 3) + 1;
  return (
    <View className="px-6 py-4 rounded-lg bg-card flex flex-col gap-6">
      <View className="flex flex-row items-center gap-2">
        {icon}
        <Text className="text-lg font-bold text-primary" ellipsizeMode="tail">
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
