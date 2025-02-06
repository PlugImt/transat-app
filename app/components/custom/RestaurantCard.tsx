import theme from "@/app/themes";
import { Beef, ChefHat, Soup, Vegan } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, TouchableWithoutFeedback, View } from "react-native";

interface CardProps {
  title: string;
  meals?: string[];
  icon: string;
}

const RestaurantCard = ({ title, meals, icon }: CardProps) => {
  const { t } = useTranslation();

  function getIcon() {
    switch (icon) {
      case "Soup":
        return <Soup color={theme.primaryColor} />;
      case "Beef":
        return <Beef color={theme.primaryColor} />;
      case "Vegan":
        return <Vegan color={theme.primaryColor} />;
      case "ChefHat":
        return <ChefHat color={theme.primaryColor} />;
      default:
        return null;
    }
  }

  if (!meals) {
    return <Text>{t("services.restaurant.no_meal")}</Text>;
  }

  return (
    <TouchableWithoutFeedback accessible={true}>
      <View className="px-6 py-4 rounded-lg bg-card flex flex-col gap-6">
        <View className="flex flex-row items-center gap-2">
          {getIcon()}
          <Text className="text-lg font-bold text-primary text-ellipsis">
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
    </TouchableWithoutFeedback>
  );
};

export default RestaurantCard;
