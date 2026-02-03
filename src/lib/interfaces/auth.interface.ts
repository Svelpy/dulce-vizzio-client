export interface LoginCredentials {
	email: string;
	password: string;
}

import type { User } from './user.interface';

export interface LoginResponse {
	access_token: string;
	token_type: string;
	user: User;
}

export interface AuthData {
	access_token: string;
	token_type: string;
	user: User;
}
