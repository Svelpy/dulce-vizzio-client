import type { EnrollmentStatus } from '$lib/interfaces';

export const ENROLLMENT_STATUS: { value: EnrollmentStatus; label: string }[] = [
	{
		value: 'ACTIVE',
		label: 'Activo'
	},
	{
		value: 'EXPIRED',
		label: 'Finalizado'
	},
	{
		value: 'CANCELLED',
		label: 'Cancelado'
	}
];
