import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { File } from "expo-file-system";
import { useCallback, useMemo } from "react";
import {
  addFaceReference,
  deleteFaceData,
  getFaceStatus,
  getMyPhotos,
  giveFaceConsent,
  rejectMyPhoto,
} from "@/api";
import { QUERY_KEYS } from "@/constants";
import type { FaceStatus, PhotosPage } from "@/dto";

/** The opt-in status. Polled while the library is still being compared with a new selfie. */
export const useFaceStatus = () =>
  useQuery({
    queryKey: QUERY_KEYS.photos.faces,
    queryFn: getFaceStatus,
    staleTime: 60 * 1000,
    refetchInterval: (query) =>
      query.state.data?.matching ? 15 * 1000 : false,
  });

/** The user's own album; refreshed whenever the status says new matches may exist. */
export const useMyPhotos = (enabled: boolean) => {
  const queryClient = useQueryClient();
  const queryKey = QUERY_KEYS.photos.mine;
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => getMyPhotos(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last: PhotosPage) => last.next_cursor ?? undefined,
    enabled,
    staleTime: 60 * 1000,
  });
  const photos = useMemo(
    () => query.data?.pages.flatMap((page) => page.photos) ?? [],
    [query.data],
  );
  const refresh = useCallback(
    () => queryClient.resetQueries({ queryKey, exact: true }),
    [queryClient, queryKey],
  );
  return { ...query, photos, refresh };
};

const useFaceMutation = <TVariables>(
  mutationFn: (variables: TVariables) => Promise<FaceStatus | undefined>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (status) => {
      if (status) queryClient.setQueryData(QUERY_KEYS.photos.faces, status);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.photos.faces });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.photos.mine });
    },
  });
};

export const useGiveFaceConsent = () => useFaceMutation(giveFaceConsent);

/** Uploads a selfie picked with expo-image-picker (local file URI). */
export const useAddFaceReference = () =>
  useFaceMutation((uri: string) =>
    // expo/fetch reads multipart parts from a File, not from `{ uri, name, type }`.
    addFaceReference(new File(uri) as unknown as Blob),
  );

export const useDeleteFaceData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFaceData,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.photos.mine });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.photos.faces });
    },
  });
};

export const useRejectMyPhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectMyPhoto,
    onSuccess: (_, photoId) => {
      // Drop the photo from the loaded pages right away instead of replaying them.
      queryClient.setQueryData<{ pages: PhotosPage[]; pageParams: unknown[] }>(
        QUERY_KEYS.photos.mine,
        (data) =>
          data && {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              photos: page.photos.filter((photo) => photo.id !== photoId),
            })),
          },
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.photos.faces });
    },
  });
};
