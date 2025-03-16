export interface TraqArticle {
  id_traq: number;
  name: string;
  disabled: boolean;
  limited: boolean;
  alcohol: number;
  outOfStock: boolean;
  creation_date: string;
  picture: string;
  description: string;
  price: number;
  priceHalf: number;
  traq_type: string;
}
