import { apiDulceVizzio } from '$lib/config';
import type {
	Enrollment,
	EnrollmentFilters,
	EnrollmentListResponse,
	ProgressUpdate
} from '$lib/interfaces';

class EnrollmentService {
	getMyEnrollments(filters: EnrollmentFilters = {}): Promise<EnrollmentListResponse> {
		const params = new URLSearchParams();

		if (filters.status) params.append('status', filters.status);
		if (filters.search) params.append('search', filters.search);
		if (filters.page) params.append('page', filters.page.toString());
		if (filters.size) params.append('size', filters.size.toString());

		const queryString = params.toString();
		const endpoint = queryString ? `/enrollments/me?${queryString}` : `/enrollments/me`;

		return apiDulceVizzio.get<EnrollmentListResponse>(endpoint);
	}

	getAll(filters: EnrollmentFilters = {}): Promise<EnrollmentListResponse> {
		const params = new URLSearchParams();

		if (filters.user_id) params.append('user_id', filters.user_id);
		if (filters.course_id) params.append('course_id', filters.course_id);
		if (filters.status) params.append('status', filters.status);
		if (filters.search) params.append('search', filters.search);
		if (filters.page) params.append('page', filters.page.toString());
		if (filters.size) params.append('size', filters.size.toString());

		const queryString = params.toString();
		const endpoint = queryString ? `/enrollments?${queryString}` : `/enrollments`;

		return apiDulceVizzio.get<EnrollmentListResponse>(endpoint);
	}

	getById(enrollmentId: string): Promise<Enrollment> {
		return apiDulceVizzio.get<Enrollment>(`/enrollments/${enrollmentId}`);
	}

	updateProgress(enrollmentId: string, progress: ProgressUpdate): Promise<{ message: string }> {
		return apiDulceVizzio.patch<{ message: string }>(
			`/enrollments/${enrollmentId}/progress`,
			progress
		);
	}

	create(data: { user_id: string; course_id: string; notes?: string }): Promise<Enrollment> {
		return apiDulceVizzio.post<Enrollment>(`/enrollments`, data);
	}

	extend(enrollmentId: string, additionalDays: number): Promise<Enrollment> {
		return apiDulceVizzio.patch<Enrollment>(`/enrollments/${enrollmentId}/extend`, {
			additional_days: additionalDays
		});
	}

	cancel(enrollmentId: string): Promise<{ message: string }> {
		return apiDulceVizzio.delete<{ message: string }>(`/enrollments/${enrollmentId}`);
	}
}

export const enrollmentService = new EnrollmentService();
