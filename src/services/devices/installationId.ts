import { randomUUID } from "expo-crypto";
import { storage } from "@/services/storage/asyncStorage";

// Never cleared at logout: the same installation is taken over by the next account instead of being duplicated.
const INSTALLATION_ID_KEY = "installationId";

let installationIdPromise: Promise<string> | null = null;

const loadInstallationId = async () => {
  const stored = await storage.get<string>(INSTALLATION_ID_KEY);
  if (stored) return stored;
  const created = randomUUID();
  await storage.set(INSTALLATION_ID_KEY, created);
  return created;
};

/** Identifies this installation; generated once and kept across logouts. */
export const getInstallationId = () => {
  installationIdPromise ??= loadInstallationId().catch((error) => {
    installationIdPromise = null;
    throw error;
  });
  return installationIdPromise;
};
