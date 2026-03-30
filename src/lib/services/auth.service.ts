import { apiDulceVizzio } from '$lib/config';
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
class AuthService {
	// ─── Token Management ──────────────────────────────────────────────────────

	getToken(): string | null {
		try {
			return typeof localStorage !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
		} catch {
			return null;
		}
	}

	setToken(token: string): void {
		try {
			localStorage.setItem(AUTH_TOKEN_KEY, token);
		} catch (error) {
			console.warn('[AuthService] Error guardando token:', error);
		}
	}

	clearToken(): void {
		try {
			localStorage.removeItem(AUTH_TOKEN_KEY);
		} catch (error) {
			console.warn('[AuthService] Error limpiando token:', error);
		}
	}

	// ─── User Profile Management ───────────────────────────────────────────────

	async getUserProfile(): Promise<User | null> {
		try {
			if (typeof localStorage === 'undefined') return null;
			const raw = await localStorage.getItem(AUTH_USER_KEY);
			return raw ? (JSON.parse(raw) as User) : null;
		} catch (error) {
			console.warn('[AuthService] Error obteniendo perfil del usuario:', error);
			return null;
		}
	}

	setUserProfile(user: User): void {
		try {
			localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
		} catch (error) {
			console.warn('[AuthService] Error guardando perfil del usuario:', error);
		}
	}

	clearUserProfile(): void {
		try {
			localStorage.removeItem(AUTH_USER_KEY);
		} catch (error) {
			console.warn('[AuthService] Error limpiando perfil del usuario:', error);
		}
	}

	// ─── Auth State ────────────────────────────────────────────────────────────

	isAuthenticated(): boolean {
		return this.getToken() !== null;
	}

	/**
	 * Limpia toda la sesión: token + perfil del usuario.
	 * Llamar siempre este método en lugar de clearToken() solo.
	 */
	async clearSession(): Promise<void> {
		authService.clearToken();
		authService.clearUserProfile();
	}

	// ─── Auth Operations ───────────────────────────────────────────────────────

	/**
	 * Realiza el login contra la API y persiste el token y el perfil
	 * en keys separadas de localStorage.
	 */
	async login(credentials: LoginCredentials): Promise<LoginResponse> {
		try {
			console.log('Credenciales:', credentials);
			const response = await apiDulceVizzio.postPublic<LoginResponse>('/auth/login', credentials);

			// Persistir token y perfil en keys separadas
			authService.setToken(response.access_token);
			authService.setUserProfile(response.user);

			return response;
		} catch (error) {
			// Si falla, asegurar limpieza
			authService.clearSession();
			throw error;
		}
	}

	/**
	 * Cierra la sesión limpiando token y perfil del usuario.
	 */
	async logout(): Promise<void> {
		authService.clearSession();
	}

	// ─── Backward Compatibility ────────────────────────────────────────────────

	/**
	 * @deprecated Usar getUserProfile() en su lugar.
	 */
	async getUser(): Promise<User | null> {
		return authService.getUserProfile();
	}

	/**
	 * @deprecated Usar setUserProfile() en su lugar.
	 */
	setUser(user: User): void {
		authService.setUserProfile(user);
	}
}

export const authService = new AuthService();
