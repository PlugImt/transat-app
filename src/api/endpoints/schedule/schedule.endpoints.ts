import axios from "axios";
import { t } from "i18next";
import { API_ROUTES } from "@/api/common";
import { Method } from "@/api/enums";
import { apiRequest } from "@/api/helpers";
import { getApiInstance } from "@/api/helpers/api-instance";
import type { UpdateUserSchedule, UserSchedule } from "@/dto";

export const getMySchedule = async (): Promise<UserSchedule | null> => {
  const api = await getApiInstance();

  try {
    const response = await api.request<UserSchedule>({
      url: API_ROUTES.schedule_me,
      method: Method.GET,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw new Error(t("common.errors.occurred"));
  }
};

export const updateMySchedule = async (
  data: UpdateUserSchedule,
): Promise<UserSchedule> => {
  return apiRequest<UserSchedule>(API_ROUTES.schedule_me, Method.PATCH, data);
};

export const deleteMySchedule = async (): Promise<void> => {
  const api = await getApiInstance();

  try {
    await api.request({
      url: API_ROUTES.schedule_me,
      method: Method.DELETE,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return;
    }

    throw new Error(t("common.errors.occurred"));
  }
};

export const fetchSchedule = async (): Promise<UpdateUserSchedule> => {
  const data = await apiRequest<UpdateUserSchedule>(API_ROUTES.schedule_me, Method.GET);
  return data;
};