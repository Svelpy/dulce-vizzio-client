import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
export const redirect = (url: string, replaceState: boolean = false): Promise<void> => {
	return goto(resolve(url), { replaceState });
};
