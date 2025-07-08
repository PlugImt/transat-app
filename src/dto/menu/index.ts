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

export const reviewSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  profile_picture: z.string().url().nullable(),
  rating: z.number(),
  comment: z.string(),
  date: z.string(),
});

export const restaurantReviewSchema = z.object({
  id_restaurant_articles: z.number(),
  first_time_served: z.string().nullable(),
  last_time_served: z.string().nullable(),
  name: z.string(),
  average_rating: z.number().nullable(),
  total_ratings: z.number(),
  times_served: z.number(),
  recent_reviews: z.array(reviewSchema).optional(),
});

export type MenuData = z.infer<typeof menuDataSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type RestaurantReview = z.infer<typeof restaurantReviewSchema>;