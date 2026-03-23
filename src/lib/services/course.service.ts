import { apiAvicor } from '$lib/config/apiDulceVizzio.config';
import type {
	Course,
	CourseDetail,
	CourseFilters,
	CourseListResponse,
	Lesson,
	CreateCourseRequest,
	CourseMaterial,
	CreateLessonRequest,
	UpdateLessonRequest
} from '$lib/interfaces';
const BASE_PATH = '/courses';
export class CoursesService {
	//	static BASE_PATH = '/courses';

	static async getAll(filters: CourseFilters = {}): Promise<CourseListResponse> {
		const params = new URLSearchParams();

		if (filters.page) params.append('page', filters.page.toString());
		if (filters.limit) params.append('limit', filters.limit.toString());
		if (filters.category) params.append('category', filters.category);
		if (filters.difficulty) params.append('difficulty', filters.difficulty);
		if (filters.search) params.append('search', filters.search);
		// NOTE: 'status' is NOT sent — the backend resolves it based on the user's role

		const queryString = params.toString();
		const endpoint = queryString ? `${BASE_PATH}?${queryString}` : BASE_PATH;

		return apiAvicor.get<CourseListResponse>(endpoint);
	}

	static async create(data: CreateCourseRequest): Promise<Course> {
		return apiAvicor.post<Course>(BASE_PATH, data);
	}

	static async createLesson(courseId: string, data: CreateLessonRequest): Promise<Lesson> {
		return apiAvicor.post<Lesson>(`${BASE_PATH}/${courseId}/lessons`, data);
	}

	static async updateLesson(lessonId: string, data: UpdateLessonRequest): Promise<Lesson> {
		return apiAvicor.put<Lesson>(`/lessons/${lessonId}`, data);
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

	async uploadMaterial(lessonId: string, data: FormData): Promise<CourseMaterial> {
		return apiAvicor.post<CourseMaterial>(`/lessons/${lessonId}/materials`, data);
	}
}

export const courseService = new CoursesService();
