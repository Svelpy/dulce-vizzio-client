import { writable, derived } from 'svelte/store';
import { authService } from '../services/auth.service';
import type { AuthState, LoginCredentials } from '$lib/interfaces';
import type { User } from '$lib/interfaces';

// ─── Inicialización ───────────────────────────────────────────────────────────
// El estado inicial se reconstruye desde localStorage (solo en el cliente).
// En SSR, comienza como no autenticado.

async function getInitialState(): Promise<AuthState> {
	if (typeof localStorage === 'undefined') {
		return { user: null, isAuthenticated: false, isLoading: false };
	}
	const user = await authService.getUserProfile();
	const token = authService.getToken();
	return {
		user,
		isAuthenticated: token !== null && user !== null,
		isLoading: false
	};
}

// ─── Store interno ────────────────────────────────────────────────────────────

async function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>(await getInitialState());

	return {
		subscribe,

		/**
		 * Realiza el login: llama al service, persiste la sesión
		 * y actualiza el store reactivo.
		 */
		async login(credentials: LoginCredentials): Promise<void> {
			update((state) => ({ ...state, isLoading: true }));
			try {
				const response = await authService.login(credentials);
				set({
					user: response.user,
					isAuthenticated: true,
					isLoading: false
				});
			} catch (error) {
				set({ user: null, isAuthenticated: false, isLoading: false });
				throw error;
			}
		},

		/**
		 * Cierra la sesión: limpia localStorage y resetea el store.
		 */
		async logout(): Promise<void> {
			await authService.logout();
			set({ user: null, isAuthenticated: false, isLoading: false });
		},

		/**
		 * Actualiza el perfil del usuario en el store y en localStorage.
		 * Útil cuando el usuario edita su perfil.
		 */
		updateUser(user: User): void {
			authService.setUserProfile(user);
			update((state) => ({ ...state, user }));
		},

		/**
		 * Reinicializa el store desde localStorage.
		 * Llamar en el layout raíz al montar la app en el cliente.
		 */
		async initialize(): Promise<void> {
			set(await getInitialState());
		},

		setLoading(loading: boolean): void {
			update((state) => ({ ...state, isLoading: loading }));
		}
	};
}

// ─── Exports públicos ─────────────────────────────────────────────────────────

/** Store principal con todo el estado de autenticación */
export const authStore = await createAuthStore();

/** Usuario actual (null si no está autenticado) */
export const currentUser = derived(authStore, ($store) => $store.user);

/** true si el usuario tiene sesión activa */
export const isAuthenticated = derived(authStore, ($store) => $store.isAuthenticated);

/** true durante operaciones async (login, logout) */
export const isLoading = derived(authStore, ($store) => $store.isLoading);

// ─── Backward Compatibility ───────────────────────────────────────────────────
/**
 * @deprecated Usar currentUser en lugar de userStore.
 * Mantenido para no romper imports existentes.
 */
export const userStore = { subscribe: currentUser.subscribe };
