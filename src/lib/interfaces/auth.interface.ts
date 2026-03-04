import type { User } from './user.interface';

// Re-export User como UserProfile para mayor claridad semántica en el contexto de auth
export type { User as UserProfile };

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface LoginResponse {
	access_token: string;
	token_type: string;
	user: User;
}

/**
 * Estado del auth store en memoria (reactivo).
 * No se persiste directamente — se reconstruye desde localStorage.
 */
export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}
