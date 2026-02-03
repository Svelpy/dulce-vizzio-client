import { apiAvicor } from '$lib/config/apiDulceVizzio.config';
import type { LoginCredentials, LoginResponse, AuthData } from '$lib/interfaces';
import type { User } from '$lib/interfaces';
import { AUTH_DATA_KEY } from '$lib/constants';

export class AuthService {
	private static readonly AUTH_DATA_KEY = AUTH_DATA_KEY;

	static getAuthData(): AuthData | null {
		try {
			const authData = localStorage.getItem(this.AUTH_DATA_KEY);
			return authData ? JSON.parse(authData) : null;
		} catch (error) {
			console.warn('Error accediendo al localStorage:', error);
			return null;
		}
	}

	static setAuthData(authData: AuthData): void {
		try {
			localStorage.setItem(this.AUTH_DATA_KEY, JSON.stringify(authData));
		} catch (error) {
			console.warn('Error guardando datos de autenticación:', error);
		}
	}

	static getToken(): string | null {
		try {
			const authData = this.getAuthData();
			return authData ? authData.access_token : null;
		} catch (error) {
			console.warn('Error obteniendo token:', error);
			return null;
		}
	}

	static getUser(): User | null {
		try {
			const authData = this.getAuthData();
			return authData ? authData.user : null;
		} catch (error) {
			console.warn('Error obteniendo datos del usuario:', error);
			return null;
		}
	}

	static setUser(user: User): void {
		try {
			const authData = this.getAuthData();
			if (authData) {
				authData.user = user;
				this.setAuthData(authData);
			}
		} catch (error) {
			console.warn('Error actualizando datos del usuario:', error);
		}
	}

	static clearToken(): void {
		try {
			localStorage.removeItem(this.AUTH_DATA_KEY);
		} catch (error) {
			console.warn('Error limpiando datos de autenticación:', error);
		}
	}

	static isAuthenticated(): boolean {
		return this.getToken() !== null;
	}

	// Método para login
	static async login(credentials: LoginCredentials): Promise<LoginResponse> {
		try {
			const response = await apiAvicor.postPublic<LoginResponse>('/auth/login', credentials);

			// Guardar toda la respuesta en una sola key
			const authData: AuthData = {
				access_token: response.access_token,
				token_type: response.token_type,
				user: response.user
			};

			this.setAuthData(authData);

			return response;
		} catch (error) {
			this.clearToken();
			throw error;
		}
	}

	// Método para logout
	static async logout(): Promise<void> {
		try {
			this.clearToken();
		} catch (error) {
			this.clearToken();
			console.warn('Error durante el logout:', error);
		}
	}
}
