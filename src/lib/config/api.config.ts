import { getEnvVariable } from '$lib/utils';

const API_BASE_URL = getEnvVariable('VITE_API_ENDPOINT');

export const defaultHeaders: HeadersInit = {
	'Content-Type': 'application/json'
};

export const API_CONFIG = {
	BASE_URL: API_BASE_URL,
	TIMEOUT: 50000,
	MAX_RETRIES: 3
} as const;
