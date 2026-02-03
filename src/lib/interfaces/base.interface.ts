// Base interface inherited by all entities
export interface BaseDocument {
	id: string;
	created_at: string;
	updated_at: string;
	created_by?: string;
	updated_by?: string;
	revision_id?: string;
	is_deleted: boolean;
	deleted_at?: string;
}
