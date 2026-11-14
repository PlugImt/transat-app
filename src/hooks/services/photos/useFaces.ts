import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { File } from "expo-file-system";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  addFaceReference,
  deleteFaceData,
  getFaceStatus,
  getMyPhotos,
  giveFaceConsent,
  rejectMyPhoto,
} from "@/api";
import { ApiError } from "@/api/errors";
import { QUERY_KEYS } from "@/constants";
import type { FaceStatus, PhotosPage } from "@/dto";

/** What a backend without face recognition (older API, 404) means: the feature is simply hidden. */
const UNAVAILABLE: FaceStatus = {
  available: false,
  enabled: false,
  consent_version: null,
  current_consent_version: "",
  consented_at: null,
  references: 0,
  max_references: 0,
  matching: false,
  photo_count: 0,
  library_scanned: 0,
  library_total: 0,
};

const fetchFaceStatus = async () => {
  try {
    return await getFaceStatus();
  } catch (error) {
    if (ApiError.isApiError(error) && error.status === 404) return UNAVAILABLE;
    throw error;
  }
};

/** The opt-in status. Polled while the library is still being compared with a new selfie. */
export const useFaceStatus = () =>
  useQuery({
    queryKey: QUERY_KEYS.photos.faces,
    queryFn: fetchFaceStatus,
    refetchInterval: (query) => (query.state.data?.matching ? 5 * 1000 : false),
  });

/**
 * The user's own album. The matches are found in the background after a selfie (or when new photos are
 * analysed), so the album is refetched as soon as the status reports a different count or the end of matching.
 */
export const useMyPhotos = (enabled: boolean) => {
  const queryClient = useQueryClient();
  const queryKey = QUERY_KEYS.photos.mine;
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => getMyPhotos(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last: PhotosPage) => last.next_cursor ?? undefined,
    enabled,
  });

  const { data: status } = useFaceStatus();
  const progress = status && `${status.photo_count}:${status.matching}`;
  const seen = useRef(progress);
  useEffect(() => {
    if (progress === seen.current) return;
    const first = seen.current === undefined;
    seen.current = progress;
    if (!first) void queryClient.invalidateQueries({ queryKey, exact: true });
  }, [progress, queryClient, queryKey]);
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
    // The global mutation cache then refetches the status and the album.
    onSuccess: (status) => {
      if (status) queryClient.setQueryData(QUERY_KEYS.photos.faces, status);
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
    },
  });
};
