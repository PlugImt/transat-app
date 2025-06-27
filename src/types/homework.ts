import type { User } from '@/types/user';

export interface Homework {
  id: number;
  author: User["id_newf"];
  course_name: string;
  title: string;
  description: string;
  deadline: Date;
  done: boolean;
  created_at: Date;
  updated_at: Date;
}
