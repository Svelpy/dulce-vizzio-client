import type { Handle } from '@sveltejs/kit';

/**
 * Hook del servidor de SvelteKit.
 *
 * La protección de rutas se realiza en el cliente a través del
 * +layout.ts de /app, ya que el token está en localStorage.
 *
 * Este hook está preparado para una futura migración a cookies HTTP-only,
 * donde la protección server-side sería posible.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	return response;
};
