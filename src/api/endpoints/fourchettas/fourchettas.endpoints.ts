import type { Event } from "@/dto";
import { z } from "zod";

const api_url = "https://fourchettas.vercel.app";

export async function getUpcomingEventsWithPhoneOrder(
  phone: string,
): Promise<Event[]> {
  console.log(`[FOURCHETTAS API] GET /events/upcoming/phone/${phone}`);
  const response = await fetch(`${api_url}/api/events/upcoming/phone/${phone}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}

export async function getItemsFromEventId(id: number) {
  console.log(`[FOURCHETTAS API] GET /events/${id.toString()}/items`);
  const response = await fetch(`${api_url}/api/events/${id.toString()}/items`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}

const orderSchema = z.object({
  event_id: z.number().int().positive(),
  name: z.string().min(1),
  firstname: z.string().min(1),
  phone: z.string().min(10),
  dish_id: z.number().int().nonnegative(),
  side_id: z.number().int().nonnegative(),
  drink_id: z.number().int().nonnegative(),
});

export type orderData = z.infer<typeof orderSchema>;

export async function postOrderMutation(orderData: orderData) {
  console.log("[FOURCHETTAS API] POST /orders");
  const validatedData = orderSchema.safeParse(orderData);
  console.log(orderData);
  console.log(validatedData);
  if (!validatedData.success) {
    throw new Error("Invalid order data format");
  }

  const response = await fetch(`${api_url}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedData.data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const responseData = await response.json();
  console.log(responseData);
  return responseData;
}

const updateOrderSchema = z.object({
  phone: z.string().min(10),
  event_id: z.number().int().positive(),
  dish_id: z.number().int().nonnegative(),
  side_id: z.number().int().nonnegative(),
  drink_id: z.number().int().nonnegative(),
});

export async function updateOrderMutation(orderData: {
  phone: string;
  event_id: number;
  dish_id: number;
  side_id: number;
  drink_id: number;
}) {
  const { phone, event_id, ...payload } = orderData;
  console.log(`[FOURCHETTAS API] PUT /orders/update/${event_id}`);
  const validatedData = updateOrderSchema.safeParse(orderData);
  if (!validatedData.success) {
    throw new Error("Invalid order data format for update");
  }

  const response = await fetch(`${api_url}/api/orders/update/${event_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedData.data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export async function deleteOrderMutation(orderId: number) {
  console.log(`[FOURCHETTAS API] DELETE /orders/${orderId}`);
  const response = await fetch(`${api_url}/api/orders/${orderId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}
