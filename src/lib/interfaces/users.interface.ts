import type { User } from './user.interface';

// Tipos de roles disponibles
export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'MODERATOR' | 'USER';

// Parámetros para filtrar usuarios
export interface UsersFilters {
	page?: number;
	per_page?: number;
	q?: string;
	role?: UserRole | null;
	is_active?: boolean | null;
}

// Respuesta paginada de usuarios
export interface UsersListResponse {
	total: number;
	page: number;
	per_page: number;
	total_pages: number;
	data: User[];
}
