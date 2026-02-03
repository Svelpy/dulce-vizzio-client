import type { BaseDocument } from './base.interface';

// Course difficulty levels
export type CourseDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

// Course lifecycle status
export type CourseStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED' | 'RETIRED';

// Main Course interface
export interface Course extends BaseDocument {
	title: string;
	slug: string;
	description: string;
	category: string;
	subcategory?: string;
	tags: string[];
	difficulty: CourseDifficulty;
	cover_image_url?: string;
	price: number;
	currency: string;
	whatsapp_group_url?: string;
	status: CourseStatus;
	published_at?: string;
	rating_average?: number;
	enrollment_count: number;
	lessons_count: number;
	total_duration_hours: number;
}

// Filters for course listing
export interface CourseFilters {
	page?: number;
	limit?: number;
	category?: string;
	difficulty?: CourseDifficulty;
	status?: CourseStatus;
	search?: string;
}

// Paginated course response
export interface CourseListResponse {
	data: Course[];
	total: number;
	page: number;
	limit: number;
	pages: number;
}
