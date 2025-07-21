import type { Event,Item } from '@/dto';


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
    console.error("Error fetching upcoming events:", error);
  }
}
