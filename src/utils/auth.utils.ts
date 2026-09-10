import { jwtDecode } from "jwt-decode";
import type { User } from "@/dto";

const IMT_EMAIL_DOMAINS = [
  "@imt-atlantique.net",
  "@imt-atlantique.fr",
] as const;

type JwtRolePayload = {
  role?: unknown;
  roles?: unknown;
};

export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

export const isImtEmail = (email: string): boolean => {
  const normalizedEmail = normalizeEmail(email);
  return IMT_EMAIL_DOMAINS.some((domain) => normalizedEmail.endsWith(domain));
};

const getStringRoles = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (!Array.isArray(value)) return [];
  return value.filter((role): role is string => typeof role === "string");
};

export const getRolesFromToken = (token: string): string[] => {
  try {
    const payload = jwtDecode<JwtRolePayload>(token);
    return [
      ...new Set([
        ...getStringRoles(payload.role),
        ...getStringRoles(payload.roles),
      ]),
    ];
  } catch {
    return [];
  }
};

export const addTokenRolesToUser = (user: User, token: string): User => ({
  ...user,
  roles: [...new Set([...(user.roles ?? []), ...getRolesFromToken(token)])],
});
