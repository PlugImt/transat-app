import { useCallback, useRef, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/common/Toast";
import { PHOTO_SELECTION_LIMIT } from "@/constants";

/** What a tile shows: bit 1 selected, bit 2 selection mode on, bit 4 failed to save. */
export const TILE_SELECTED = 1;
export const TILE_MODE = 2;
export const TILE_FAILED = 4;

type Listener = () => void;

/**
 * Selection by stable photo id, outside React state: toggling one photo notifies only that photo's tile, so a
 * selection never re-renders the rest of the grid. Ids survive pagination, layout changes and list refreshes.
 */
export class PhotoSelectionStore {
  private selected = new Set<string>();
  private failed = new Set<string>();
  private modeOn = false;
  /** Entered from the menu: the mode stays on with nothing selected, until it is left explicitly. */
  private pinned = false;
  private cached = { mode: false, count: 0 };
  private byId = new Map<string, Set<Listener>>();
  private tiles = new Set<Listener>();
  private summaryListeners = new Set<Listener>();

  /** Set while a batch is being saved: the selection it was started with must not change under it. */
  locked = false;

  constructor(readonly limit: number) {}

  get mode() {
    return this.modeOn;
  }

  get size() {
    return this.selected.size;
  }

  ids() {
    return [...this.selected];
  }

  has(id: string) {
    return this.selected.has(id);
  }

  tileState(id: string) {
    return (
      (this.selected.has(id) ? TILE_SELECTED : 0) |
      (this.modeOn ? TILE_MODE : 0) |
      (this.failed.has(id) ? TILE_FAILED : 0)
    );
  }

  /** Snapshot of the mode and count for the bar: stable between changes, as useSyncExternalStore requires. */
  summary() {
    return this.cached;
  }

  subscribe(listener: Listener) {
    this.summaryListeners.add(listener);
    return () => this.summaryListeners.delete(listener);
  }

  /** For tiles: called when this photo changes, or when selection mode starts or ends. */
  subscribeTile(id: string, listener: Listener) {
    const set = this.byId.get(id) ?? new Set<Listener>();
    this.byId.set(id, set);
    set.add(listener);
    this.tiles.add(listener);
    return () => {
      set.delete(listener);
      if (set.size === 0) this.byId.delete(id);
      this.tiles.delete(listener);
    };
  }

  /** From the menu: selection mode with nothing selected yet. */
  enter() {
    if (this.locked || this.modeOn) return;
    this.pinned = true;
    this.modeOn = true;
    this.commit("all");
  }

  /** Long press: starts selection mode with this photo. Returns false when the limit is reached. */
  start(id: string) {
    if (this.locked) return true;
    const wasOn = this.modeOn;
    this.modeOn = true;
    if (!this.selected.has(id)) {
      if (this.selected.size >= this.limit) {
        if (!wasOn) this.modeOn = false;
        return false;
      }
      this.selected.add(id);
    }
    this.failed.delete(id);
    this.commit(wasOn ? [id] : "all");
    return true;
  }

  /** Returns false when adding would exceed the limit. Deselecting the last photo ends selection mode. */
  toggle(id: string) {
    if (this.locked) return true;
    if (this.selected.has(id)) {
      this.selected.delete(id);
      this.failed.delete(id);
      if (this.selected.size === 0 && !this.pinned) {
        this.modeOn = false;
        this.commit("all");
      } else {
        this.commit([id]);
      }
      return true;
    }
    if (this.selected.size >= this.limit) return false;
    this.selected.add(id);
    this.failed.delete(id);
    this.commit([id]);
    return true;
  }

  /** Keeps only the photos that failed, marked as such, so the user sees what still needs saving. */
  keepFailed(ids: string[]) {
    const touched = [...this.selected];
    this.selected = new Set(ids);
    this.failed = new Set(ids);
    this.modeOn = ids.length > 0;
    this.pinned = false;
    this.commit(this.modeOn ? touched.concat(ids) : "all");
  }

  clear() {
    if (!this.modeOn && this.selected.size === 0) return;
    this.selected.clear();
    this.failed.clear();
    this.modeOn = false;
    this.pinned = false;
    this.commit("all");
  }

  private commit(changed: string[] | "all") {
    this.cached = { mode: this.modeOn, count: this.selected.size };
    // Collected first: a listener may subscribe or unsubscribe while it runs.
    const run = new Set<Listener>(this.summaryListeners);
    if (changed === "all") {
      for (const l of this.tiles) run.add(l);
    } else {
      for (const id of changed) {
        for (const l of this.byId.get(id) ?? []) run.add(l);
      }
    }
    for (const l of run) l();
  }
}

/** A screen's selection, with the message shown when the limit is reached. */
export const usePhotoSelection = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const ref = useRef<PhotoSelectionStore | null>(null);
  if (!ref.current)
    ref.current = new PhotoSelectionStore(PHOTO_SELECTION_LIMIT);

  // Kept in a ref so the callback, and with it every tile, keeps one identity when the toast context changes.
  const toastRef = useRef(toast);
  toastRef.current = toast;
  const onLimit = useCallback(
    () =>
      toastRef.current(
        t("photos.selection.limit", { count: PHOTO_SELECTION_LIMIT }),
        "info",
      ),
    [t],
  );

  return { store: ref.current, onLimit };
};

/** Mode and count, for the floating bar and anything that must follow them. */
export const useSelectionSummary = (store: PhotoSelectionStore) =>
  useSyncExternalStore(
    useCallback((listener) => store.subscribe(listener), [store]),
    () => store.summary(),
  );

/** Only whether selection is on: unlike the summary it does not change on every toggle. */
export const useSelectionMode = (store: PhotoSelectionStore | undefined) =>
  useSyncExternalStore(
    useCallback(
      (listener) => (store ? store.subscribe(listener) : () => {}),
      [store],
    ),
    () => store?.mode ?? false,
  );

/** One tile's state: re-renders only when this photo, or the mode, changes. */
export const useTileSelection = (
  store: PhotoSelectionStore | undefined,
  id: string,
) => {
  const subscribe = useCallback(
    (listener: () => void) =>
      store ? store.subscribeTile(id, listener) : () => {},
    [store, id],
  );
  return useSyncExternalStore(subscribe, () =>
    store ? store.tileState(id) : 0,
  );
};
