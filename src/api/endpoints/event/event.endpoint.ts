import { API_ROUTES, apiRequest, Method } from "@/api";
import type { Event, EventDetails, EventMembers } from "@/dto/event";
import type { AddEventFormData } from "@/hooks/services/event/types";

export type EventTimeFilter = "upcoming" | "past" | "all";

export const getEvents = async (time: EventTimeFilter = "upcoming") => {
  return await apiRequest<Event[]>(
    `${API_ROUTES.event}?time=${time}`,
    Method.GET,
  );
};

export const getEventDetails = async (id: number) => {
  return await apiRequest<EventDetails>(
    API_ROUTES.eventDetails.replace(":id", id.toString()),
    Method.GET,
  );
};

export const joinEvent = async (id: number) => {
  return await apiRequest<void>(
    API_ROUTES.eventJoin.replace(":id", id.toString()),
    Method.POST,
  );
};

export const leaveEvent = async (id: number) => {
  return await apiRequest<void>(
    API_ROUTES.eventLeave.replace(":id", id.toString()),
    Method.POST,
  );
};

export const getEventMembers = async (id: number) => {
  return await apiRequest<EventMembers>(
    API_ROUTES.eventMembers.replace(":id", id.toString()),
    Method.GET,
  );
};

export const addEvent = async (data: AddEventFormData) => {
  return await apiRequest<Event>(API_ROUTES.event, Method.POST, data);
};
