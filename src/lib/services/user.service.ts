import { apiDulceVizzio } from '$lib/config';
import type {
	CreateUserRequest,
	UpdateUserRequest,
	User,
	UsersFilters,
	UsersListResponse,
	UserRole
} from '$lib/interfaces';

class UserService {
	getAll(filters: UsersFilters = {}): Promise<UsersListResponse> {
		const params = new URLSearchParams();

		if (filters.page) params.append('page', filters.page.toString());
		if (filters.per_page) params.append('per_page', filters.per_page.toString());

		// Agregar filtros opcionales
		if (filters.q) params.append('q', filters.q);
		if (filters.role) params.append('role', filters.role);
		if (filters.is_active !== null && filters.is_active !== undefined) {
			params.append('is_active', filters.is_active.toString());
		}

		const queryString = params.toString();
		const endpoint = queryString ? `/users?${queryString}` : '/users';

		return apiDulceVizzio.get<UsersListResponse>(endpoint);
	}

	/**
	 * Crea un nuevo usuario
	 */
	create(request: CreateUserRequest): Promise<User> {
		return apiDulceVizzio.post<User>('/users', request);
	}

	/**
	 * Actualiza un usuario existente
	 */
	update(id: string, request: UpdateUserRequest): Promise<User> {
		return apiDulceVizzio.patch<User>(`/users/${id}`, request);
	}

	/**
	 * Elimina un usuario (Físico o Lógico según el rol del que lo solicita)
	 */
	delete(id: string): Promise<void> {
		return apiDulceVizzio.delete<void>(`/users/${id}`);
	}

	/**
	 * Restablece la contraseña de un usuario (ADMIN o SUPERADMIN)
	 */
	resetPassword(id: string, password: string): Promise<void> {
		return apiDulceVizzio.patch<void>(`/users/${id}/password`, { password });
	}

	/**
	 * Cambia el rol de un usuario (SOLO SUPERADMIN)
	 */
	updateRole(id: string, new_role: UserRole): Promise<{ new_role: UserRole }> {
		return apiDulceVizzio.patch<{ new_role: UserRole }>(`/users/${id}/role`, {
			new_role
		});
	}

	/**
	 * Actualiza el avatar del usuario autenticado (multipart/form-data)
	 */
	updateAvatar(file: File): Promise<User> {
		const formData = new FormData();
		formData.append('file', file);
		return apiDulceVizzio.patch<User>('/auth/me/avatar', formData);
	}
}

export const userService = new UserService();
