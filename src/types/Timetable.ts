import type { User } from '@/types/user';

export interface Timetable {
  courses: Course[];
  user_email: User['email'];
  created_at: string;
}

export interface Course {
  id: number;
  date: Date;
  title: string;
  start_time: string;
  end_time: string;
  teacher: string;
  room: string;
  groupe: string;
  created_at: string;
}
