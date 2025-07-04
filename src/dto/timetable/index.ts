import { z } from "zod";
import { courseSchema } from "../course";

export const timetableSchema = z.array(courseSchema);

export type Timetable = z.infer<typeof timetableSchema>;
