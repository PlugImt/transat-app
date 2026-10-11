import { API_ROUTES } from "@/api/common";
import { Method } from "@/api/enums";
import { apiRequest } from "@/api/helpers";
import type { PhotoReportReason } from "@/constants";
import type {
  PhotoAlbum,
  PhotoAlbumsPage,
  PhotoDetail,
  PhotosPage,
} from "@/dto";

export const PHOTOS_PAGE_SIZE = 60;
export const ALBUMS_PAGE_SIZE = 50;

export const getPhotos = async (cursor?: string) => {
  return await apiRequest<PhotosPage>(
    API_ROUTES.photos,
    Method.GET,
    undefined,
    {
      params: { cursor, limit: PHOTOS_PAGE_SIZE },
    },
  );
};

export const getPhotoAlbums = async (cursor?: string) => {
  return await apiRequest<PhotoAlbumsPage>(
    API_ROUTES.photosAlbums,
    Method.GET,
    undefined,
    { params: { cursor, limit: ALBUMS_PAGE_SIZE } },
  );
};

export const getPhotoAlbum = async (id: number) => {
  return await apiRequest<PhotoAlbum>(
    API_ROUTES.photosAlbum.replace(":id", String(id)),
    Method.GET,
  );
};

export const getAlbumPhotos = async (id: number, cursor?: string) => {
  return await apiRequest<PhotosPage>(
    API_ROUTES.photosAlbumPhotos.replace(":id", String(id)),
    Method.GET,
    undefined,
    { params: { cursor, limit: PHOTOS_PAGE_SIZE } },
  );
};

export const getPhoto = async (id: string) => {
  return await apiRequest<PhotoDetail>(
    API_ROUTES.photosDetail.replace(":id", id),
    Method.GET,
  );
};

export type PhotoReportInput = {
  photoId: string;
  reason: PhotoReportReason;
  comment: string;
};

/** The reporter, the club and the recipients are worked out by the backend: only these three are sent. */
export const reportPhoto = async ({
  photoId,
  reason,
  comment,
}: PhotoReportInput) => {
  return await apiRequest<{ id: number; duplicate: boolean }>(
    API_ROUTES.photosReports,
    Method.POST,
    { photo_id: photoId, reason, comment },
  );
};
