import { apiAvicor } from '$lib/config/apiDulceVizzio.config';
import type { UsersFilters, UsersListResponse } from '$lib/interfaces';

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
}
