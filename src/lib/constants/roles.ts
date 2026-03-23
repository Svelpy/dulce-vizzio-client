export enum Role {
	SUPERADMIN = 'SUPERADMIN',
	ADMIN = 'ADMIN',
	MODERATOR = 'MODERATOR',
	USER = 'USER'
}

/**
 * Explicit route permissions mapping.
 * Only roles listed for a path (or its parent) can access it.
 */
const routePermissions: Record<string, Role[]> = {
	'/app/dashboard': [Role.SUPERADMIN, Role.ADMIN, Role.MODERATOR, Role.USER],
	'/app/profile': [Role.SUPERADMIN, Role.ADMIN, Role.MODERATOR, Role.USER],
	'/app/courses': [Role.SUPERADMIN, Role.ADMIN, Role.MODERATOR, Role.USER],
	'/app/users': [Role.SUPERADMIN, Role.ADMIN],
	'/app/enrollments': [Role.SUPERADMIN, Role.ADMIN],
	'/app/my-enrollments': [Role.MODERATOR, Role.USER],
	'/app/my-courses': [Role.MODERATOR, Role.USER]
};

/**
 * Centrally managed role-based access control.
 * Verifies if a user role has permission to access a specific path.
 */
export const canAccessPath = (userRole: string | undefined, path: string): boolean => {
	if (!userRole) return false;

	// Normalize role
	const role = userRole.toUpperCase() as Role;

	// Find the matching route permission
	// We check for exact match or if the path starts with the route prefix
	// We sort keys by length descending to match the most specific route first
	const sortedRoutes = Object.keys(routePermissions).sort((a, b) => b.length - a.length);

	for (const route of sortedRoutes) {
		if (path === route || path.startsWith(route + '/')) {
			return routePermissions[route].includes(role);
		}
	}

	// Default: if no route matches or role not in list, deny access
	return false;
};
