export interface TraqArticle {
  id_traq: number;
  name: string;
  disabled: boolean;
  limited: boolean;
  alcohol: number;
  out_of_stock: boolean;
  creation_date: string;
  picture: string;
  description: string;
  price: number;
  price_half: number;
  traq_type: string;
}
