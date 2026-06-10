import { API_ROUTES } from "@/api/common";
import { Method } from "@/api/enums";
import { apiRequest } from "@/api/helpers";
import type { Association, AssociationDetails, AssociationMembers } from "@/dto/association";

export const getAssociations = async () => {
  return await apiRequest<Association[]>(`${API_ROUTES.association}`, Method.GET);
};

export const getAssociationDetails = async (id: number) => {
  return await apiRequest<AssociationDetails>(
    API_ROUTES.associationDetails.replace(":id", id.toString()),
    Method.GET,
  );
};

export const joinAssociation = async (id: number) => {
  return await apiRequest<void>(
    API_ROUTES.associationJoin.replace(":id", id.toString()),
    Method.POST,
  );
};

export const leaveAssociation = async (id: number) => {
  return await apiRequest<void>(
    API_ROUTES.associationLeave.replace(":id", id.toString()),
    Method.POST,
  );
};

export const getAssociationMembers = async (id: number) => {
  return await apiRequest<AssociationMembers>(
    API_ROUTES.associationMembers.replace(":id", id.toString()),
    Method.GET,
  );
};
