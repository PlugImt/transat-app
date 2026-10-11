export type PhotoMediaType = "image" | "video";

export type Photo = {
  id: string;
  media_type: PhotoMediaType;
  width: number;
  height: number;
  sort_at: string;
  album_id: number | null;
  /** The event's name, from the same album as `album_id`: null when the photo has no published event. */
  album_title: string | null;
  /** Null when Drive has no thumbnail for the file: show a placeholder. */
  thumbnail_url: string | null;
  thumbnail_fallback_url: string | null;
  preview_url: string | null;
  /** Opens the original in Google Drive; videos are never played in the app. */
  drive_url: string;
};

export type PhotosPage = {
  photos: Photo[];
  next_cursor: string | null;
};

export type PhotoAlbumsPage = {
  albums: PhotoAlbum[];
  next_cursor: string | null;
};

export type PhotoAlbum = {
  id: number;
  parent_id: number | null;
  title: string;
  event_date: string | null;
  academic_year: string;
  category: string;
  photo_count: number;
  cover_url: string | null;
  first_taken_at: string | null;
  last_taken_at: string | null;
  drive_url: string;
};

export type PhotoDetail = Photo & {
  name: string;
  mime_type: string;
  size_bytes: number;
  taken_at: string | null;
  taken_at_source: string;
  /** Logical path of the photo's own folder in the Drive. */
  path: string;
  /** Path below the event root (e.g. "Photobooth"); empty for files at the root. */
  section: string;
  /** The photo's direct folder, not necessarily the event root. */
  folder_url: string;
  download_url: string;
  thumbnail_template: string;
  thumbnail_fallback_template: string;
  album: { id: number; title: string; drive_url: string } | null;
};
