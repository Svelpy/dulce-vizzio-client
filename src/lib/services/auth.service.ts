import { apiAvicor } from '$lib/config/apiDulceVizzio.config';
import type { LoginCredentials, LoginResponse } from '$lib/interfaces';
import type { User } from '$lib/interfaces';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '$lib/constants';

/**
 * AuthService: responsable de la persistencia de autenticación en localStorage.
 *
 * Responsabilidades separadas:
 *  - Token management (credencial de acceso)
 *  - User profile management (datos del usuario)
 *  - Operaciones de auth (login, logout)
 *
 * NO maneja estado reactivo — eso es responsabilidad del authStore.
 */
export class AuthService {
	// ─── Token Management ──────────────────────────────────────────────────────

	static getToken(): string | null {
		try {
			return typeof localStorage !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
		} catch {
			return null;
		}
	}

	static setToken(token: string): void {
		try {
			localStorage.setItem(AUTH_TOKEN_KEY, token);
		} catch (error) {
			console.warn('[AuthService] Error guardando token:', error);
		}
	}

	static clearToken(): void {
		try {
			localStorage.removeItem(AUTH_TOKEN_KEY);
		} catch (error) {
			console.warn('[AuthService] Error limpiando token:', error);
		}
	}

	// ─── User Profile Management ───────────────────────────────────────────────

	static getUserProfile(): User | null {
		try {
			if (typeof localStorage === 'undefined') return null;
			const raw = localStorage.getItem(AUTH_USER_KEY);
			return raw ? (JSON.parse(raw) as User) : null;
		} catch (error) {
			console.warn('[AuthService] Error obteniendo perfil del usuario:', error);
			return null;
		}
	}

	static setUserProfile(user: User): void {
		try {
			localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
		} catch (error) {
			console.warn('[AuthService] Error guardando perfil del usuario:', error);
		}
	}

	static clearUserProfile(): void {
		try {
			localStorage.removeItem(AUTH_USER_KEY);
		} catch (error) {
			console.warn('[AuthService] Error limpiando perfil del usuario:', error);
		}
	}

	// ─── Auth State ────────────────────────────────────────────────────────────

	static isAuthenticated(): boolean {
		return this.getToken() !== null;
	}

	/**
	 * Limpia toda la sesión: token + perfil del usuario.
	 * Llamar siempre este método en lugar de clearToken() solo.
	 */
	static clearSession(): void {
		this.clearToken();
		this.clearUserProfile();
	}

	// ─── Auth Operations ───────────────────────────────────────────────────────

	/**
	 * Realiza el login contra la API y persiste el token y el perfil
	 * en keys separadas de localStorage.
	 */
	static async login(credentials: LoginCredentials): Promise<LoginResponse> {
		try {
			const response = await apiAvicor.postPublic<LoginResponse>('/auth/login', credentials);

			// Persistir token y perfil en keys separadas
			this.setToken(response.access_token);
			this.setUserProfile(response.user);

			return response;
		} catch (error) {
			// Si falla, asegurar limpieza
			this.clearSession();
			throw error;
		}
	}

	/**
	 * Cierra la sesión limpiando token y perfil del usuario.
	 */
	static async logout(): Promise<void> {
		this.clearSession();
	}

	// ─── Backward Compatibility ────────────────────────────────────────────────

	/**
	 * @deprecated Usar getUserProfile() en su lugar.
	 */
	static getUser(): User | null {
		return this.getUserProfile();
	}

	/**
	 * @deprecated Usar setUserProfile() en su lugar.
	 */
	static setUser(user: User): void {
		this.setUserProfile(user);
	}
}
