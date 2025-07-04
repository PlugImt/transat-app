import { z } from "zod";

export const traqArticleSchema = z.object({
  id_traq: z.number(),
  name: z.string(),
  disabled: z.boolean(),
  limited: z.boolean(),
  alcohol: z.number(),
  outOfStock: z.boolean(),
  creation_date: z.date(),
  picture: z.string(),
  description: z.string(),
  price: z.number(),
  priceHalf: z.number(),
  traq_type: z.string(),
});

export type TraqArticle = z.infer<typeof traqArticleSchema>;
