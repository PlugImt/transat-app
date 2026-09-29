import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/api/queries/user-query";

export const useUser = () => useQuery(userQueryOptions);
