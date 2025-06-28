import { z } from "zod";
import { userSchema } from "@/dto";

const idNewfSchema = userSchema.shape.id_newf;

export const homeworkSchema = z.object({
  id: z.number(),
  author: idNewfSchema,
  course_name: z.string(),
  title: z.string(),
  description: z.string(),
  deadline: z.coerce.date(),
  done: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Homework = z.infer<typeof homeworkSchema>;
