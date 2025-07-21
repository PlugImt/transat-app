import type { Event } from '@/dto';

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
