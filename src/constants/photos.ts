/** Photo grid densities, densest to most spacious. The first two change the tile size, the last is a mosaic. */
export const LAYOUT_LEVELS = ["compact", "standard", "mosaic"] as const;
export type LayoutLevel = (typeof LAYOUT_LEVELS)[number];

/** Photos that can be selected, and so saved, in one go: bounds the time and the phone storage a batch takes. */
export const PHOTO_SELECTION_LIMIT = 50;

/** Why a photo can be reported; the values are the ones the backend accepts. */
export const PHOTO_REPORT_REASONS = [
  "appears_in_photo",
  "inappropriate",
  "poor_quality",
  "other",
] as const;
export type PhotoReportReason = (typeof PHOTO_REPORT_REASONS)[number];

/** The backend enforces the same limit. */
export const PHOTO_REPORT_COMMENT_MAX = 1000;
