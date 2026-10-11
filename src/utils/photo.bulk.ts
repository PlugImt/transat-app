export type BulkProgress<E extends string> = {
  total: number;
  /** Photos finished so far, saved or failed. */
  done: number;
  saved: string[];
  failed: Record<string, E>;
};

export type BulkOutcome<E extends string> = BulkProgress<E> & {
  /** Photos never attempted because the run was cancelled. */
  skipped: string[];
  cancelled: boolean;
};

type BulkOptions<E extends string> = {
  ids: string[];
  /** Downloads in flight at once. */
  concurrency: number;
  /** Saves one photo; rejects when it cannot. Only resolves once the photo really is in the library. */
  save: (id: string) => Promise<void>;
  classify: (error: unknown) => E;
  /** An error that makes every further attempt pointless (permission revoked, storage full). */
  isFatal?: (code: E) => boolean;
  /** Stop after this many failures in a row with the same code (network down). */
  stopAfterRepeated?: { code: E; count: number };
  shouldStop?: () => boolean;
  onProgress?: (progress: BulkProgress<E>) => void;
};

/**
 * Saves photos with bounded parallelism. Duplicated ids are saved once; a failure never stops the others unless
 * it is fatal or repeats; photos left over after such a stop are reported as failed with that cause, so nothing
 * is claimed saved that was not.
 */
export const runBulk = async <E extends string>({
  ids,
  concurrency,
  save,
  classify,
  isFatal,
  stopAfterRepeated,
  shouldStop,
  onProgress,
}: BulkOptions<E>): Promise<BulkOutcome<E>> => {
  const queue = [...new Set(ids)];
  const saved: string[] = [];
  const failed: Record<string, E> = {};
  let next = 0;
  let repeated = 0;
  let abortCode: E | null = null;
  let cancelled = false;

  const report = () =>
    onProgress?.({
      total: queue.length,
      done: saved.length + Object.keys(failed).length,
      saved: [...saved],
      failed: { ...failed },
    });

  const worker = async () => {
    while (abortCode === null) {
      if (shouldStop?.()) {
        cancelled = true;
        return;
      }
      const index = next++;
      if (index >= queue.length) return;
      const id = queue[index];
      try {
        await save(id);
        saved.push(id);
        repeated = 0;
      } catch (error) {
        const code = classify(error);
        failed[id] = code;
        repeated = stopAfterRepeated?.code === code ? repeated + 1 : 0;
        if (isFatal?.(code)) abortCode = code;
        else if (stopAfterRepeated && repeated >= stopAfterRepeated.count) {
          abortCode = code;
        }
      }
      report();
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, queue.length) }, worker),
  );

  const skipped = queue
    .slice(Math.min(next, queue.length))
    .filter((id) => !(id in failed) && !saved.includes(id));
  if (abortCode !== null) {
    for (const id of skipped) failed[id] = abortCode;
    report();
    return {
      total: queue.length,
      done: queue.length,
      saved,
      failed,
      skipped: [],
      cancelled: false,
    };
  }
  return {
    total: queue.length,
    done: saved.length + Object.keys(failed).length,
    saved,
    failed,
    skipped: cancelled ? skipped : [],
    cancelled,
  };
};
