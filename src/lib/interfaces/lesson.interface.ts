import type { BaseDocument } from './base.interface';

// Embedded material in lessons
export interface LessonMaterial {
	title: string;
	resource_url: string;
	file_format?: string;
	is_downloadable: boolean;
	order: number;
	created_at: string;
	created_by?: string;
}

// Main Lesson interface
export interface Lesson extends BaseDocument {
	course_id: string;
	title: string;
	summary?: string;
	duration_seconds?: number;
	order: number;
	is_preview: boolean;
	video_url?: string;
	video_id?: string;
	materials: LessonMaterial[];
}
