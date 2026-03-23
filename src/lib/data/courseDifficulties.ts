import type { CourseDifficulty } from '$lib/interfaces';

export const COURSE_DIFFICULTIES: { value: CourseDifficulty; label: string }[] = [
	{
		value: 'BEGINNER',
		label: 'Principiante'
	},
	{
		value: 'INTERMEDIATE',
		label: 'Intermedio'
	},
	{
		value: 'ADVANCED',
		label: 'Avanzado'
	}
];
