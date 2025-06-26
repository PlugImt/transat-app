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
  start: string;
  end: string;
  teacher: string;
  rooms: string;
  groupe: string;
  created_at: string;
}
