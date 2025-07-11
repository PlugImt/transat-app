import { z } from "zod";
import { courseSchema } from "@/dto/course";

export const timetableSchema = z.array(courseSchema);

export type Timetable = z.infer<typeof timetableSchema>;
