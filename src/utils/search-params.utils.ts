export function parseNumberParam(
  value: string | string[] | undefined,
): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === undefined || raw === "") {
    return undefined;
  }

  const parsed = Number(raw);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function parseStringParam(
  value: string | string[] | undefined,
): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "" ? undefined : raw;
}

export function parseJsonParam<T>(
  value: string | string[] | undefined,
): T | undefined {
  const raw = parseStringParam(value);
  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}
