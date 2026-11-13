/**
 * Album share links: https://transat.dev/albums/<id>-<slug> (the slug is decoration and may be stale or missing).
 * On a phone with the app, the system opens the app with that URL (Universal Links / App Links); the album
 * screen lives at /photos/<id>.
 */
const ALBUM_HOSTS = new Set([
  "transat.dev",
  "www.transat.dev",
  "develop.transat.dev",
]);

const ALBUM_PATH = /^\/albums\/(\d{1,12})(?:-[^/]*)?\/?$/;

/** The album id of a share link (web or transat://albums/<id>), or null. */
export const albumIdFromLink = (link: string): number | null => {
  let url: URL;
  try {
    url = new URL(link, "https://transat.dev");
  } catch {
    return null;
  }
  let pathname = url.pathname;
  if (url.protocol === "transat:") {
    // transat://albums/42 parses with "albums" as the host.
    pathname = `/${url.host}${url.pathname}`;
  } else if (url.protocol !== "https:" || !ALBUM_HOSTS.has(url.hostname)) {
    return null;
  }
  const match = ALBUM_PATH.exec(pathname);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};
