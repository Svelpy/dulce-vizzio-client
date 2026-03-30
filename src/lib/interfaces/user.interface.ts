import type { UserRole } from './users.interface';

export interface User {
	id: string;
	email: string;
	full_name: string;
	username: string;
	phone_number: string;
	birth_date: string;
	role: UserRole;
	is_active: boolean;
	avatar_url: string | null;
	created_at: string;
	updated_at: string;
	created_by: string | null;
	updated_by: string | null;
}
