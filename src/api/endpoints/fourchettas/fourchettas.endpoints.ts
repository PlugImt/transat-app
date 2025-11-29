import type { FourchettasEvent } from "@/dto";
import type { orderData, updateOrderData } from "@/dto/fourchettas";
import { orderSchema, updateOrderSchema } from "@/dto/fourchettas";

const api_url = "https://fourchettas.vercel.app";

export async function getUpcomingEventsWithPhoneOrder(
  phone: string,
): Promise<FourchettasEvent[]> {
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

export async function getTypesFromEventId(id: number) {
  console.log(`[FOURCHETTAS API] GET /events/${id.toString()}/types`);
  const response = await fetch(`${api_url}/api/events/${id.toString()}/types`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}

export async function postOrderMutation(orderData: orderData) {
  console.log("[FOURCHETTAS API] POST /orders");
  const validatedData = orderSchema.safeParse(orderData);
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
  return responseData;
}

export async function updateOrderMutation(orderData: updateOrderData) {
  const { event_id } = orderData;
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

export async function deleteOrderMutation(event_id: number, phone: string) {
  console.log(
    `[FOURCHETTAS API] DELETE api/orders/phone/${phone}/event/${event_id}`,
  );
  const response = await fetch(
    `${api_url}/api/orders/phone/${phone}/event/${event_id}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}
