export type NotLoggedIn = null;
export type Loading = undefined;

export interface User {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  scolarity?: Scolarity;
  graduation_year?: number;
  profile_picture?: string;
  id_newf?: number;
  total_newf?: number;
  password_updated_date?: string;
  language?: string;
  pass_id?: number;
}

export interface Password {
  email: string;
  password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface Scolarity {
  graduation_year: number;
  branch: typeof branch;
  group: string;
}

export const branch = {
  fise: "FISE",
  fil: "FIL",
  fit: "FIT",
  fip: "FIP",
};
