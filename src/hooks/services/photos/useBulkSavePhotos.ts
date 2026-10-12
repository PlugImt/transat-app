import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { type BulkOutcome, runBulk } from "@/utils/photo.bulk";
import {
  classifySaveError,
  requestSavePermission,
  type SaveError,
  savePhotoOriginal,
} from "./useSavePhoto";

export type BulkSaveState = {
  phase: "idle" | "running" | "done";
  total: number;
  /** Photos finished so far, saved or failed. */
  done: number;
  saved: number;
  failed: Record<string, SaveError>;
  cancelled: boolean;
};

const IDLE: BulkSaveState = {
  phase: "idle",
  total: 0,
  done: 0,
  saved: 0,
  failed: {},
  cancelled: false,
};

/** Two originals in flight: the second hides the first's network wait without piling up files on the phone. */
const CONCURRENCY = 2;
/** After this many network failures in a row the rest would only fail too. */
const NETWORK_FAILURES_BEFORE_STOP = 3;

// One batch at a time for the whole app, even if the user leaves the screen that started it.
let running = false;

const isFatal = (code: SaveError) =>
  code === "permission" || code === "permissionBlocked" || code === "storage";

/** Saves the originals of several photos to the library, one bounded batch at a time. */
export const useBulkSavePhotos = () => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<BulkSaveState>(IDLE);
  const cancelled = useRef(false);

  const start = useCallback(
    async (ids: string[]): Promise<BulkOutcome<SaveError> | null> => {
      if (running) return null;
      const unique = [...new Set(ids)];
      if (unique.length === 0) return null;
      running = true;
      cancelled.current = false;
      setState({ ...IDLE, phase: "running", total: unique.length });

      try {
        // Asked once for the batch, so a refusal costs nothing and never leaves a half-done run.
        try {
          await requestSavePermission();
        } catch (error) {
          const code = classifySaveError(error);
          const failed = Object.fromEntries(unique.map((id) => [id, code]));
          setState({
            phase: "done",
            total: unique.length,
            done: unique.length,
            saved: 0,
            failed,
            cancelled: false,
          });
          return {
            total: unique.length,
            done: unique.length,
            saved: [],
            failed,
            skipped: [],
            cancelled: false,
          };
        }

        const outcome = await runBulk<SaveError>({
          ids: unique,
          concurrency: CONCURRENCY,
          save: (id) =>
            savePhotoOriginal(queryClient, id, { askPermission: false }),
          classify: classifySaveError,
          isFatal,
          stopAfterRepeated: {
            code: "network",
            count: NETWORK_FAILURES_BEFORE_STOP,
          },
          shouldStop: () => cancelled.current,
          onProgress: (p) =>
            setState({
              phase: "running",
              total: p.total,
              done: p.done,
              saved: p.saved.length,
              failed: p.failed,
              cancelled: false,
            }),
        });
        setState({
          phase: "done",
          total: outcome.total,
          done: outcome.done,
          saved: outcome.saved.length,
          failed: outcome.failed,
          cancelled: outcome.cancelled,
        });
        return outcome;
      } finally {
        running = false;
      }
    },
    [queryClient],
  );

  /** Stops after the photos being saved right now; what was already saved stays saved. */
  const cancel = useCallback(() => {
    cancelled.current = true;
  }, []);

  const reset = useCallback(() => setState(IDLE), []);

  return { state, start, cancel, reset };
};
