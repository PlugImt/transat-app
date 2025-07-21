export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  form_closing_date: string;
  form_closing_time: string;
  img_url: string;
  deleting?: boolean;
}