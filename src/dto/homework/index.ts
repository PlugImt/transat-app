import { z } from "zod";

// TODO : Use useSchema here in order to set the author
export const homeworkSchema = z.object({
  id: z.number(),
  author: z.number().optional(),
  course_name: z.string(),
  title: z.string(),
  description: z.string(),
  deadline: z.coerce.date(),
  done: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Homework = z.infer<typeof homeworkSchema>;
