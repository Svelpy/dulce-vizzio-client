import type { CourseStatus } from '$lib/interfaces';

export const COURSE_STATUS: { value: CourseStatus; label: string }[] = [
	{
		value: 'DRAFT',
		label: 'Borrador'
	},
	{
		value: 'REVIEW',
		label: 'En revisión'
	},
	{
		value: 'PUBLISHED',
		label: 'Publicado'
	},
	{
		value: 'ARCHIVED',
		label: 'Archivado'
	},
	{
		value: 'RETIRED',
		label: 'Retirado'
	}
];
