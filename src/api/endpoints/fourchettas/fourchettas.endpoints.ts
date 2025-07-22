import type { Event,Item,Order } from '@/dto';


const api_url = 'https://fourchettas.vercel.app';

export async function getEventsUpcoming(
    onRequestStart: () => void = () => {},
    onRequestEnd: () => void = () => {},
    onError: () => void = () => {},
    onSuccess: (data: Event[]) => void = () => {}
) {
    onRequestStart();

    try {
        console.log("[FOURCHETTAS API] GET /events/upcoming");
        const response = await fetch(`${api_url}/api/events/upcoming`);
        onRequestEnd();
        if (!response.ok) {
            onError();
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        onSuccess(data);

        //console.log(" ca va marcher maintenant a la inshalah", data);
    } catch (error) {
        onRequestEnd();
        onError();
        console.error('[FOURCHETTAS API] [Error] fetching upcoming events:', error);
    }
}



export async function getItemsFromEventId(
  id: number,
  setDishes: (items: Item[]) => void,
  setSides: (items: Item[]) => void,
  setDrinks: (items: Item[]) => void,
  onError: () => void = () => {},
  onSuccess: () => void = () => {}
) {
  try {
    console.log(`[FOURCHETTAS API] GET /events/${id.toString()}/items`);
    const response = await fetch(
      `${api_url}/api/events/${id.toString()}/items`
    );
    if (!response.ok) {
      onError();

      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setDishes(data.filter((item: Item) => item.type === "dish"));
    setSides(data.filter((item: Item) => item.type === "side"));
    setDrinks(data.filter((item: Item) => item.type === "drink"));
    onSuccess();
    //console.log(" ca va marcher maintenant a la inshalah", data);
  } catch (error) {
    onError();
    console.error(
      `[FOURCHETTAS API] [Error] fetching items for event ${id.toString()}:`,
      error
    );
  }
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
  let res_json = {
    event_id: event_id,
    name: name,
    firstname: firstName,
    phone: phone,
    dish_id: dish_id,
    side_id: side_id > 0 ? side_id : null,
    drink_id: drink_id > 0 ? drink_id : null,
  };

  return res_json;
}

interface postOrderProps extends orderData {
  onRequestStart?: () => void;
  onRequestEnd?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

export async function postOrder({
  event_id,
  name,
  firstName,
  phone,
  dish_id,
  side_id,
  drink_id,
  onRequestStart = () => {},
  onRequestEnd = () => {},
  onSuccess = () => {},
  onError = () => {},
}: postOrderProps) {
  onRequestStart();
  console.log("[FOURCHETTAS API] POST /orders");
  fetch(`${api_url}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      orderJson({
        event_id,
        name,
        firstName,
        phone,
        dish_id,
        side_id,
        drink_id,
      })
    ),
  })
    .then((response) => {
      onRequestEnd();
      if (!response.ok) {
        onError();
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      //console.log("Order submitted successfully:", data);
      onSuccess();
    })
    .catch((error) => {
      onRequestEnd();
      onError();
      console.error("[FOURCHETTAS API] [Error] submitting order:", error);
    });
}

export async function GetOrderByPhoneAndEvent(
  phone: string,
  event_id: number,
  onRequestStart: () => void = () => {},
  onRequestEnd: () => void = () => {},
  onError: () => void = () => {},
  onSuccess: (data: Order[]) => void = () => {}
) {
  onRequestStart();
  console.log(`[FOURCHETTAS API] GET /orders/phone/${phone}/event/${event_id}`);
  fetch(`${api_url}/api/orders/phone/${phone}/event/${event_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((response) => {
      onRequestEnd();
      if (!response.ok) {
        onError();
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      onSuccess(data);
    })
    .catch((error) => {
      onRequestEnd();
      onError();
      console.error("[FOURCHETTAS API] [Error] submitting order:", error);
    });
}

export async function updateOrderContentByPhoneAndEvent(
  phone: string,
  event_id: number,
  dish_id: number,
  side_id: number,
  drink_id: number,
  onRequestStart: () => void = () => {},
  onRequestEnd: () => void = () => {},
  onError: () => void = () => {},
  onSuccess: () => void = () => {}
) {
  onRequestStart();
  console.log(`[FOURCHETTAS API] PUT /orders/update/${event_id} with body: `, {
    phone,
    dish_id,
    side_id,
    drink_id,
  });
  fetch(`${api_url}/api/orders/update/${event_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone,
      dish_id,
      side_id,
      drink_id,
    }),
  })
    .then((response) => {
      onRequestEnd();
      if (!response.ok) {
        onError();
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      onSuccess();
    })
    .catch((error) => {
      onRequestEnd();
      onError();
      console.error("[FOURCHETTAS API] [Error] updating order:", error);
    });
}
