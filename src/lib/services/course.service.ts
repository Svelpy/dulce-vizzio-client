import { apiAvicor } from '$lib/config/apiDulceVizzio.config';
import type { CourseDetail, CourseFilters, CourseListResponse, Lesson } from '$lib/interfaces';
const BASE_PATH = '/courses';
export class CoursesService {
	//	static BASE_PATH = '/courses';

	static async getAll(filters: CourseFilters = {}): Promise<CourseListResponse> {
		const params = new URLSearchParams();

		if (filters.page) params.append('page', filters.page.toString());
		if (filters.limit) params.append('limit', filters.limit.toString());
		if (filters.category) params.append('category', filters.category);
		if (filters.difficulty) params.append('difficulty', filters.difficulty);
		if (filters.status) params.append('status', filters.status);
		if (filters.search) params.append('search', filters.search);

		const queryString = params.toString();
		const endpoint = queryString ? `${BASE_PATH}?${queryString}` : BASE_PATH;

		return apiAvicor.get<CourseListResponse>(endpoint);
	}

	async getCourseBySlug(slug: string): Promise<CourseDetail> {
		return apiAvicor.get<CourseDetail>(`${BASE_PATH}/${slug}`);
	}

	static async getLessons(courseId: string): Promise<Lesson[]> {
		return apiAvicor.get<Lesson[]>(`${BASE_PATH}/${courseId}/lessons`);
	}

	static async getLessonById(lessonId: string): Promise<Lesson> {
		return apiAvicor.get<Lesson>(`/lessons/${lessonId}`);
	}
}

export const courseService = new CoursesService();
