import type { User } from '@/types/user';

export type Timetable = Course[];

export interface Course {
  created_at: string;
  date: Date;
  end_time: string;
  group: string;
  id: number;
  room: string;
  start_time: string;
  teacher: string;
  title: string;
  user_email: string;
}
