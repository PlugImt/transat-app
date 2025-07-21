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

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  type: string;
  quantity: number;
  img_url: string;
  event_id: number;
}