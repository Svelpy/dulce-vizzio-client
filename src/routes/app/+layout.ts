import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { authStore } from '$lib/stores/auth.store';
import { canAccessPath } from '$lib/constants/roles';
import type { LayoutLoad } from './$types';

/**
 * Guard de rutas protegidas para /app/*.
 *
 * Verifica la autenticación y el rol del usuario para restringir el acceso.
 */
export const load: LayoutLoad = async ({ url }) => {
	if (browser) {
		// Forzar inicialización del store desde localStorage
		authStore.initialize();

		const state = get(authStore);

		// 1. Verificar Autenticación
		if (!state.isAuthenticated) {
			const redirectTo = url.pathname;
			throw redirect(302, `/auth/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`);
		}

		// 2. Verificar Permisos por Rol
		const user = state.user;
		if (user && !canAccessPath(user.role, url.pathname)) {
			console.warn(`[RBAC] Acceso denegado para rol ${user.role} a la ruta: ${url.pathname}`);
			// Si no tiene acceso, lo mandamos al dashboard (que sí tiene acceso)
			if (url.pathname !== '/app/dashboard') {
				throw redirect(302, '/app/dashboard');
			}
		}

		return {
			user
		};
	}

	// En SSR, dejar pasar (el cliente hará el check)
	return {};
};
