// src/lib/types/layout.ts

export type OgType = 'website' | 'article' | 'video.other' | 'profile';

export interface MainLayoutProps {
	/** Título de la página. Se concatena automáticamente con el nombre del sitio. */
	title: string;

	/** Meta description. Recomendado: 120–160 caracteres. */
	description?: string;

	/** Palabras clave para SEO (uso limitado hoy, pero útil para consistencia). */
	keywords?: string[];

	/**
	 * Imagen para Open Graph y Twitter Card.
	 * Puede ser ruta relativa ('/images/og-curso.png') o URL absoluta.
	 * Tamaño recomendado: 1200×630 px.
	 * Default: '/og-default.png'
	 */
	ogImage?: string;

	/** Tipo de contenido para Open Graph. Default: 'website' */
	ogType?: OgType;

	/**
	 * Ruta canónica de la página (e.g. '/courses/svelte-avanzado').
	 * Se concatena con SITE_URL automáticamente.
	 */
	canonicalUrl?: string;

	/** Si es true, agrega `noindex, nofollow` (útil para páginas de admin/preview). */
	noIndex?: boolean;

	/**
	 * Objeto JSON-LD para structured data (Schema.org).
	 * Ejemplo: Course, BreadcrumbList, Organization, etc.
	 */
	jsonLd?: Record<string, unknown> | null;
}
