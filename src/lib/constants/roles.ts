export enum Role {
	SUPERADMIN = 'SUPERADMIN',
	ADMIN = 'ADMIN',
	MODERATOR = 'MODERATOR',
	USER = 'USER'
}

/**
 * Centrally managed role-based access control.
 * Scalable for new roles and new paths (just update the arrays).
 */
export const canAccessPath = (userRole: string | undefined, path: string): boolean => {
	if (!userRole) return false;

	// Normalizamos a MAYÚSCULAS para que sea insensible a la fuente (DB o API)
	const role = userRole.toUpperCase();

	// 1. Roles con ACCESO TOTAL a /app (Escalable: añade nuevos roles de gestión aquí)
	const fullAccessRoles: string[] = [Role.SUPERADMIN, Role.ADMIN];
	if (fullAccessRoles.includes(role) && path.startsWith('/app')) {
		return true;
	}

	// 2. Permisos para roles RESTRINGIDOS (Escalable: añade nuevas rutas permitidas aquí)
	// Como pediste: MODERATOR y USER solo ven dashboard y courses (+ su perfil)
	const restrictedPaths = ['/app/dashboard', '/app/courses', '/app/profile', '/app/my-courses'];

	if (role === Role.MODERATOR || role === Role.USER) {
		return restrictedPaths.some((allowed) => path.startsWith(allowed));
	}

	return false;
};
