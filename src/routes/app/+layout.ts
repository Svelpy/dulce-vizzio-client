import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { authStore } from '$lib/stores/auth.store';
import { canAccessPath, publicRoutes } from '$lib/constants/roles';
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

		// Verificar si es ruta pública
		const isPublicPath = publicRoutes.some(
			(route) => url.pathname === route || url.pathname.startsWith(route + '/')
		);

		// 1. Verificar Autenticación
		if (!state.isAuthenticated && !isPublicPath) {
			const redirectTo = url.pathname;
			throw redirect(302, `/auth/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`);
		}

		// 2. Verificar Permisos por Rol
		const user = state.user;
		if (!canAccessPath(user?.role, url.pathname)) {
			console.warn(`[RBAC] Acceso denegado para rol ${user?.role || 'Visitante'} a la ruta: ${url.pathname}`);
			if (!state.isAuthenticated) {
				throw redirect(302, `/auth/sign-in?redirectTo=${encodeURIComponent(url.pathname)}`);
			} else if (url.pathname !== '/app/dashboard') {
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
