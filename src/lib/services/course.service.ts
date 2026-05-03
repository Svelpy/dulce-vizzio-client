import { apiDulceVizzio } from '$lib/config';
import type {
	Course,
	CourseDetail,
	CourseFilters,
	CourseListResponse,
	Lesson,
	CreateCourseRequest,
	CourseMaterial,
	CreateLessonRequest,
	UpdateLessonRequest,
	UpdateCourseRequest
} from '$lib/interfaces';
const BASE_PATH = '/courses';
class CourseService {
	getAll(filters: CourseFilters = {}): Promise<CourseListResponse> {
		const params = new URLSearchParams();

		if (filters.page) params.append('page', filters.page.toString());
		if (filters.limit) params.append('limit', filters.limit.toString());
		if (filters.category) params.append('category', filters.category);
		if (filters.difficulty) params.append('difficulty', filters.difficulty);
		if (filters.search) params.append('search', filters.search);

		const queryString = params.toString();
		const endpoint = queryString ? `${BASE_PATH}?${queryString}` : BASE_PATH;

		return apiDulceVizzio.get<CourseListResponse>(endpoint);
	}

	create(data: CreateCourseRequest): Promise<Course> {
		return apiDulceVizzio.post<Course>(BASE_PATH, data);
	}

	update(courseId: string, data: UpdateCourseRequest): Promise<Course> {
		return apiDulceVizzio.put<Course>(`${BASE_PATH}/${courseId}`, data);
	}

	delete(courseId: string): Promise<string> {
		return apiDulceVizzio.delete<string>(`${BASE_PATH}/${courseId}`);
	}

	deleteLesson(lessonId: string): Promise<string> {
		return apiDulceVizzio.delete<string>(`/lessons/${lessonId}`);
	}

	reorderLesson(lessonId: string, order: number): Promise<Lesson[]> {
		return apiDulceVizzio.patch<Lesson[]>(`/lessons/${lessonId}/order`, { order });
	}

	deleteAllMaterials(lessonId: string): Promise<string> {
		return apiDulceVizzio.delete<string>(`/lessons/${lessonId}/materials`);
	}

	createLesson(courseId: string, data: CreateLessonRequest): Promise<Lesson> {
		return apiDulceVizzio.post<Lesson>(`${BASE_PATH}/${courseId}/lessons`, data);
	}

	updateLesson(lessonId: string, data: UpdateLessonRequest): Promise<Lesson> {
		return apiDulceVizzio.put<Lesson>(`/lessons/${lessonId}`, data);
	}

	getCourseBySlug(slug: string): Promise<CourseDetail> {
		return apiDulceVizzio.get<CourseDetail>(`${BASE_PATH}/${slug}`);
	}

	getLessons(courseId: string): Promise<Lesson[]> {
		return apiDulceVizzio.get<Lesson[]>(`${BASE_PATH}/${courseId}/lessons`);
	}

	getLessonById(lessonId: string): Promise<Lesson> {
		return apiDulceVizzio.get<Lesson>(`/lessons/${lessonId}`);
	}

	uploadMaterial(lessonId: string, data: FormData): Promise<CourseMaterial> {
		return apiDulceVizzio.post<CourseMaterial>(`/lessons/${lessonId}/materials`, data);
	}

	uploadCover(courseId: string, file: File): Promise<Course> {
		const formData = new FormData();
		formData.append('file', file);
		return apiDulceVizzio.patch<Course>(`${BASE_PATH}/${courseId}/cover`, formData);
	}

	updateStatus(courseId: string, status: string): Promise<Course> {
		return apiDulceVizzio.patch<Course>(`${BASE_PATH}/${courseId}/status`, { status });
	}

	deleteMaterial(lessonId: string, materialOrder: number): Promise<string> {
		return apiDulceVizzio.delete<string>(`/lessons/${lessonId}/materials/${materialOrder}`);
	}
}

export const courseService = new CourseService();
