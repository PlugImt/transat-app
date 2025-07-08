import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string(),
  id: z.number(),
  average_rating: z.number().nullable(),
});

export const menuDataSchema = z.object({
  grilladesMidi: z.array(menuItemSchema),
  migrateurs: z.array(menuItemSchema),
  cibo: z.array(menuItemSchema),
  accompMidi: z.array(menuItemSchema),
  grilladesSoir: z.array(menuItemSchema),
  accompSoir: z.array(menuItemSchema),
  updated_date: z.date(),
});

export const restaurantReviewSchema = z.object({
  id_restaurant_articles: z.number(),
  first_time_served: z.string().nullable(),
  last_time_served: z.string().nullable(),
  name: z.string(),
  average_rating: z.number().nullable(),
  total_ratings: z.number(),
  times_served: z.number(),
  recent_reviews: z.array(z.any()).optional(), // TODO; Improve this 
});

export type MenuData = z.infer<typeof menuDataSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type RestaurantReview = z.infer<typeof restaurantReviewSchema>;