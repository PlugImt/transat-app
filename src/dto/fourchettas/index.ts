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
  orderuser?: Order;
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

export interface Order {
  id: number;
  name: string;
  firstname: string;
  phone: string;
  event_id: number;
  dish_id: number;
  side_id: number;
  drink_id: number;
  created_at: string;
  prepared: boolean;
  delivered: boolean;
  price?: number;
}
