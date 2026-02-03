import { writable } from 'svelte/store';

export type SidebarState = 'hidden' | 'icon-only' | 'expanded';

export const sidebarState = writable<SidebarState>('icon-only');
