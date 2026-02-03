import type { BaseDocument } from './base.interface';

// Enrollment status
export type EnrollmentStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

// Main Enrollment interface
export interface Enrollment extends BaseDocument {
	user_id: string;
	course_id: string;
	status: EnrollmentStatus;
	enrolled_at: string;
	expires_at: string;
	last_accessed_lesson_id?: string;
	last_video_position_seconds?: number;
	last_accessed_at?: string;
	completed_at?: string;
	certificate_url?: string;
	notes?: string;
}

// Filters for enrollment listing
export interface EnrollmentFilters {
	status?: EnrollmentStatus;
	page?: number;
	size?: number;
	user_id?: string;
	course_id?: string;
}

// Paginated enrollment response
export interface EnrollmentListResponse {
	total: number;
	page: number;
	per_page: number;
	total_pages: number;
	data: Enrollment[];
}

// Progress update payload
export interface ProgressUpdate {
	lesson_id: string;
	video_position_seconds: number;
}
