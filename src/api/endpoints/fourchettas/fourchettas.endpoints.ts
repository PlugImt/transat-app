import type { Event } from "@/dto";

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
interface orderData {
  event_id: number;
  name: string;
  firstName: string;
  phone: string;
  dish_id: number;
  side_id: number;
  drink_id: number;
}

function orderJson({
  event_id,
  name,
  firstName,
  phone,
  dish_id,
  side_id,
  drink_id,
}: orderData) {
  return {
    event_id: event_id,
    name: name,
    firstname: firstName,
    phone: phone,
    dish_id: dish_id > 0 ? dish_id : null,
    side_id: side_id > 0 ? side_id : null,
    drink_id: drink_id > 0 ? drink_id : null,
  };
}

export async function postOrderMutation(orderData: orderData) {
  console.log("[FOURCHETTAS API] POST /orders");

  const response = await fetch(`${api_url}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderJson(orderData)),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export async function updateOrderMutation(orderData: {
  phone: string;
  event_id: number;
  dish_id: number;
  side_id: number;
  drink_id: number;
}) {
  const { phone, event_id, ...payload } = orderData;
  console.log(`[FOURCHETTAS API] PUT /orders/update/${event_id}`);

  const response = await fetch(`${api_url}/api/orders/update/${event_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone,
      dish_id: payload.dish_id > 0 ? payload.dish_id : null,
      side_id: payload.side_id > 0 ? payload.side_id : null,
      drink_id: payload.drink_id > 0 ? payload.drink_id : null,
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}
