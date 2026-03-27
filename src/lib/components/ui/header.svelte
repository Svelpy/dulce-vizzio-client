<script lang="ts">
	import { BookIcon, UserIcon, UsersIcon, HomeDotIcon, XIcon, Menu2Icon } from '$lib/icons/outline';
	import { currentUser } from '$lib/stores/auth.store';
	import { canAccessPath } from '$lib/constants/roles';
	import { fade, slide } from 'svelte/transition';
	import { page } from '$app/stores';

	interface Props {
		onToggleSidebar: () => void;
	}

	let { onToggleSidebar }: Props = $props();

	let isMobileMenuOpen = $state(false);

	const menuItems = [
		{ label: 'Dashboard', href: '/app/dashboard', icon: HomeDotIcon },
		{ label: 'Mis Cursos', href: '/app/my-enrollments', icon: BookIcon },
		{ label: 'Cursos', href: '/app/courses', icon: BookIcon },
		{ label: 'Inscripciones', href: '/app/enrollments', icon: BookIcon },
		{ label: 'Usuarios', href: '/app/users', icon: UsersIcon },
		{ label: 'Mi Perfil', href: '/app/profile', icon: UserIcon }
	];

	const authorizedItems = $derived(
		menuItems.filter((item) => canAccessPath($currentUser?.role, item.href))
	);

	const isActive = (href: string) => {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
	};

	const user = $derived({
		name: $currentUser?.full_name || 'Usuario',
		avatar: '/api/placeholder/32/32'
	});
</script>

<header class="fixed top-0 z-50 w-full bg-light-two text-light-one shadow-lg">
	<div class="flex h-16 items-center justify-between px-4">
		<!-- Mobile Hamburger -->
		<button
			class="rounded-md p-2 transition-colors lg:hidden"
			onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
			aria-label="Toggle navigation"
		>
			{#if isMobileMenuOpen}
				<XIcon class="h-6 w-6" />
			{:else}
				<Menu2Icon class="h-6 w-6" />
			{/if}
		</button>

		<!-- Sidebar Toggle (Desktop Only) -->
		<button
			class="hidden rounded-md p-2 transition-colors lg:block"
			onclick={onToggleSidebar}
			aria-label="Toggle sidebar"
		>
			<Menu2Icon class="h-6 w-6" />
		</button>

		<div class="ml-4 flex-1">
			<h1 class="truncate text-lg font-semibold">¡Hola {user.name}!</h1>
		</div>

		<div class="flex items-center gap-2">
			<!-- Notifications, Settings, etc (Desktop only or collapsed) -->
			<div class="hidden items-center gap-2 sm:flex">
				<button
					class="rounded-full p-2 transition-colors hover:bg-light-five"
					aria-label="Notifications"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
						/>
					</svg>
				</button>
			</div>

			<button
				class="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-light-five"
			>
				<img
					src={user.avatar}
					alt="Avatar de {user.name}"
					class="h-8 w-8 rounded-full object-cover"
				/>
			</button>
		</div>
	</div>

	<!-- Mobile Dropdown Menu -->
	{#if isMobileMenuOpen}
		<div
			transition:fade={{ duration: 200 }}
			class="fixed inset-0 top-16 z-40 bg-black/50 lg:hidden"
			onclick={() => (isMobileMenuOpen = false)}
			role="button"
			tabindex="-1"
			onkeydown={(e) => e.key === 'Escape' && (isMobileMenuOpen = false)}
		></div>

		<div
			transition:slide={{ duration: 300 }}
			class="absolute top-16 left-0 z-50 w-full border-b border-light-five bg-light-two p-4 lg:hidden"
		>
			<nav class="space-y-2">
				{#each authorizedItems as item (item.href)}
					<a
						href={item.href}
						class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all {isActive(
							item.href
						)
							? 'bg-light-five font-bold'
							: 'hover:bg-light-five'}"
						onclick={() => (isMobileMenuOpen = false)}
					>
						<item.icon class="h-5 w-5" />
						<span>{item.label}</span>
					</a>
				{/each}
			</nav>
		</div>
	{/if}
</header>
