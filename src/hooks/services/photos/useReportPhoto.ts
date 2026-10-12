import { useMutation } from "@tanstack/react-query";
import { reportPhoto } from "@/api";
import { ApiError } from "@/api/errors";

export type ReportError =
  | "rateLimited"
  | "photoGone"
  | "invalid"
  | "network"
  | "unknown";

export const classifyReportError = (error: unknown): ReportError => {
  if (!ApiError.isApiError(error)) return "unknown";
  if (error.status === undefined) return "network";
  if (error.status === 429) return "rateLimited";
  if (error.status === 404) return "photoGone";
  if (error.status === 400) return "invalid";
  return "unknown";
};

/** Sends one report. `isPending` is true until the backend has answered: callers use it to block a second tap. */
export const useReportPhoto = () => {
  const mutation = useMutation({ mutationFn: reportPhoto });
  return {
    submit: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.isError ? classifyReportError(mutation.error) : null,
    reset: mutation.reset,
  };
};
