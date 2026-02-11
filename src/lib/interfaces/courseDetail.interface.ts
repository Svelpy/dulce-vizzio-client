export interface CourseMaterial {
	id: string;
	title: string;
	url: string;
	type: string;
}

export interface CourseLesson {
	title: string;
	summary: string;
	duration_seconds: number;
	is_preview: boolean;
	id: string;
	course_id: string;
	video_url: string;
	video_id: string;
	order: number;
	materials: CourseMaterial[];
	created_at: string;
	updated_at: string;
	created_by: string;
	updated_by: string | null;
}

export interface CourseDetail {
	title: string;
	description: string;
	category: string;
	subcategory: string;
	difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
	tags: string[];
	price: number;
	currency: string;
	whatsapp_group_url: string | null;
	id: string;
	slug: string;
	cover_image_url: string | null;
	status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
	rating_average: number | null;
	enrollment_count: number;
	is_enrolled: boolean;
	lessons_count: number;
	total_duration_hours: number;
	created_at: string;
	published_at: string;
	updated_at: string;
	created_by: string;
	updated_by: string;
	lessons: CourseLesson[];
}
