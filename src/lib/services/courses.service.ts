import { apiAvicor } from '$lib/config/apiDulceVizzio.config';
import type { Course, CourseFilters, CourseListResponse, Lesson } from '$lib/interfaces';

export class CoursesService {
	private static readonly BASE_PATH = '/courses';

	/**
	 * Get all courses with pagination and filters
	 */
	static async getAll(filters: CourseFilters = {}): Promise<CourseListResponse> {
		const params = new URLSearchParams();

		if (filters.page) params.append('page', filters.page.toString());
		if (filters.limit) params.append('limit', filters.limit.toString());
		if (filters.category) params.append('category', filters.category);
		if (filters.difficulty) params.append('difficulty', filters.difficulty);
		if (filters.status) params.append('status', filters.status);
		if (filters.search) params.append('search', filters.search);

		const queryString = params.toString();
		const endpoint = queryString ? `${this.BASE_PATH}?${queryString}` : this.BASE_PATH;

		return apiAvicor.get<CourseListResponse>(endpoint);
	}

	/**
	 * Get a single course by slug
	 */
	static async getBySlug(slug: string): Promise<Course> {
		return apiAvicor.get<Course>(`${this.BASE_PATH}/${slug}`);
	}

	/**
	 * Get all lessons for a specific course
	 */
	static async getLessons(courseId: string): Promise<Lesson[]> {
		return apiAvicor.get<Lesson[]>(`${this.BASE_PATH}/${courseId}/lessons`);
	}

	/**
	 * Get a single lesson by ID
	 */
	static async getLessonById(lessonId: string): Promise<Lesson> {
		return apiAvicor.get<Lesson>(`/lessons/${lessonId}`);
	}
}
