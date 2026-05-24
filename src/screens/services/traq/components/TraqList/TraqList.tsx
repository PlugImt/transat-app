import { View } from "react-native";
import TraqCard from "@/components/custom/card/TraqCard";
import type { TraqArticle } from "@/dto/traq";

interface TraqListProps {
  items: TraqArticle[];
}

export const TraqList = ({ items }: TraqListProps) => {
  const renderArticles = () => {
    const cards = [];
    for (const item of items) {
      cards.push(
        <TraqCard
          key={item.id_traq}
          image={item.picture}
          description={item.description}
          name={item.name}
          price={item.price}
          limited={item.limited}
          outOfStock={item.outOfStock}
          alcohol={item.alcohol}
          priceHalf={item.priceHalf}
        />,
      );
    }
    return cards;
  };

  return <View className="gap-4">{renderArticles()}</View>;
};
