export interface User {
    first_name: string;
    last_name: string;
    campus: string;
    phone_number: string;
    email: string;
    graduation_year: string;
    profile_picture?: string;
    id_newf?: number;
    total_newf?: number;
    password_updated_date?: string;
}

export interface Password {
    email: string;
    password: string;
    new_password: string;
    confirm_password: string;
}