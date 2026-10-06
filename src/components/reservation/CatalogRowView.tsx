import { useTranslation } from "react-i18next";
import { Text } from "@/components/common/Text";
import type { CatalogRow } from "@/utils/reservation.utils";
import { CategoryCard, ItemCard } from "./CatalogCards";

export const CatalogRowView = ({ row }: { row: CatalogRow }) => {
  const { t } = useTranslation();

  switch (row.type) {
    case "header":
      return (
        <Text variant="lg" className="ml-1 mt-2">
          {t(`services.reservation.sections.${row.section}`)}
        </Text>
      );
    case "category":
      return <CategoryCard category={row.category} />;
    case "item":
      return <ItemCard item={row.item} availability={row.availability} />;
  }
};

export const catalogRowKey = (row: CatalogRow) =>
  row.type === "header"
    ? `header-${row.section}`
    : row.type === "category"
      ? `category-${row.category.id}`
      : `item-${row.item.id}`;
