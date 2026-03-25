import { apiAvicor } from '$lib/config/apiDulceVizzio.config';
import type {
	CreateUserRequest,
	UpdateUserRequest,
	User,
	UsersFilters,
	UsersListResponse,
	UserRole
} from '$lib/interfaces';

export class UsersService {
	private static readonly BASE_PATH = '/users';

	/**
	 * Obtiene la lista de usuarios con paginación y filtros
	 */
	static async getAll(filters: UsersFilters = {}): Promise<UsersListResponse> {
		const params = new URLSearchParams();

		// Agregar parámetros de paginación
		if (filters.page) params.append('page', filters.page.toString());
		if (filters.per_page) params.append('per_page', filters.per_page.toString());

		// Agregar filtros opcionales
		if (filters.q) params.append('q', filters.q);
		if (filters.role) params.append('role', filters.role);
		if (filters.is_active !== null && filters.is_active !== undefined) {
			params.append('is_active', filters.is_active.toString());
		}

		const queryString = params.toString();
		const endpoint = queryString ? `${this.BASE_PATH}?${queryString}` : this.BASE_PATH;

		return apiAvicor.get<UsersListResponse>(endpoint);
	}

	/**
	 * Crea un nuevo usuario
	 */
	static async create(request: CreateUserRequest): Promise<User> {
		return apiAvicor.post<User>(this.BASE_PATH, request);
	}

	/**
	 * Actualiza un usuario existente
	 */
	static async update(id: string, request: UpdateUserRequest): Promise<User> {
		return apiAvicor.patch<User>(`${this.BASE_PATH}/${id}`, request);
	}

	/**
	 * Elimina un usuario (Físico o Lógico según el rol del que lo solicita)
	 */
	static async delete(id: string): Promise<void> {
		return apiAvicor.delete<void>(`${this.BASE_PATH}/${id}`);
	}

	/**
	 * Restablece la contraseña de un usuario (ADMIN o SUPERADMIN)
	 */
	static async resetPassword(id: string, password: string): Promise<void> {
		return apiAvicor.patch<void>(`${this.BASE_PATH}/${id}/password`, { password });
	}

	/**
	 * Cambia el rol de un usuario (SOLO SUPERADMIN)
	 */
	static async updateRole(id: string, new_role: UserRole): Promise<{ new_role: UserRole }> {
		return apiAvicor.patch<{ new_role: UserRole }>(`${this.BASE_PATH}/${id}/role`, { new_role });
	}
}

export const usersService = new UsersService();
