import { apiAvicor } from '$lib/config/apiDulceVizzio.config';
import type {
	Enrollment,
	EnrollmentFilters,
	EnrollmentListResponse,
	ProgressUpdate
} from '$lib/interfaces';

export class EnrollmentsService {
	private static readonly BASE_PATH = '/enrollments';

	/**
	 * Get my enrollments (for authenticated user)
	 */
	static async getMyEnrollments(filters: EnrollmentFilters = {}): Promise<EnrollmentListResponse> {
		const params = new URLSearchParams();

		if (filters.status) params.append('status', filters.status);
		if (filters.page) params.append('page', filters.page.toString());
		if (filters.size) params.append('size', filters.size.toString());

		const queryString = params.toString();
		const endpoint = queryString ? `${this.BASE_PATH}/me?${queryString}` : `${this.BASE_PATH}/me`;

		return apiAvicor.get<EnrollmentListResponse>(endpoint);
	}

	/**
	 * Get all enrollments (admin only)
	 */
	static async getAll(filters: EnrollmentFilters = {}): Promise<EnrollmentListResponse> {
		const params = new URLSearchParams();

		if (filters.user_id) params.append('user_id', filters.user_id);
		if (filters.course_id) params.append('course_id', filters.course_id);
		if (filters.status) params.append('status', filters.status);
		if (filters.page) params.append('page', filters.page.toString());
		if (filters.size) params.append('size', filters.size.toString());

		const queryString = params.toString();
		const endpoint = queryString ? `${this.BASE_PATH}?${queryString}` : this.BASE_PATH;

		return apiAvicor.get<EnrollmentListResponse>(endpoint);
	}

	/**
	 * Get a single enrollment by ID
	 */
	static async getById(enrollmentId: string): Promise<Enrollment> {
		return apiAvicor.get<Enrollment>(`${this.BASE_PATH}/${enrollmentId}`);
	}

	/**
	 * Update video progress for an enrollment
	 */
	static async updateProgress(
		enrollmentId: string,
		progress: ProgressUpdate
	): Promise<{ message: string }> {
		return apiAvicor.patch<{ message: string }>(
			`${this.BASE_PATH}/${enrollmentId}/progress`,
			progress
		);
	}

	/**
	 * Create a new enrollment (admin only)
	 */
	static async create(data: {
		user_id: string;
		course_id: string;
		notes?: string;
	}): Promise<Enrollment> {
		return apiAvicor.post<Enrollment>(this.BASE_PATH, data);
	}

	/**
	 * Extend enrollment expiration (admin only)
	 */
	static async extend(enrollmentId: string, additionalDays: number): Promise<Enrollment> {
		return apiAvicor.patch<Enrollment>(`${this.BASE_PATH}/${enrollmentId}/extend`, {
			additional_days: additionalDays
		});
	}

	/**
	 * Cancel enrollment (admin only)
	 */
	static async cancel(enrollmentId: string): Promise<{ message: string }> {
		return apiAvicor.delete<{ message: string }>(`${this.BASE_PATH}/${enrollmentId}`);
	}
}
