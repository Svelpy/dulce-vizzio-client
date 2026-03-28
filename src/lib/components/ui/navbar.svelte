<script lang="ts">
	import { type Component } from 'svelte';
	import { page } from '$app/stores';
	import { currentUser, authStore } from '$lib/stores/auth.store';
	import { UserIcon, BookIcon, HomeDotIcon, UsersIcon, Menu2Icon, XIcon } from '$lib/icons/outline';
	import logoApp from '$lib/assets/images/logo_dulce_vizzio.png';

	import { canAccessPath } from '$lib/constants/roles';

	let mobileMenuOpen: boolean = $state(false);
	let userMenuOpen: boolean = $state(false);

	interface MenuItem {
		label: string;
		href: string;
		icon: Component<any>;
	}

	const originalMenuItems: MenuItem[] = [
		{ label: 'Dashboard', href: '/app/dashboard', icon: HomeDotIcon },
		{ label: 'Mis Cursos', href: '/app/my-enrollments', icon: BookIcon },
		{ label: 'Cursos', href: '/app/courses', icon: BookIcon },
		{ label: 'Inscripciones', href: '/app/enrollments', icon: BookIcon },
		{ label: 'Usuarios', href: '/app/users', icon: UsersIcon },
		{ label: 'Mi Perfil', href: '/app/profile', icon: UserIcon }
	];

	const originalAdminItems: MenuItem[] = [];

	const menuItems = $derived(
		originalMenuItems.filter((item) => canAccessPath($currentUser?.role, item.href))
	);

	const adminItems = $derived(
		originalAdminItems.filter((item) => canAccessPath($currentUser?.role, item.href))
	);

	const handleLogout = async () => {
		await authStore.logout();
		redirect('/auth/sign-in');
	};

	const isActive = (href: string) => {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
	};

	const toggleMobileMenu = () => {
		mobileMenuOpen = !mobileMenuOpen;
		userMenuOpen = false;
	};

	const toggleUserMenu = () => {
		userMenuOpen = !userMenuOpen;
	};

	// Close menus when clicking outside
	const handleClickOutside = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (!target.closest('.user-menu-container')) {
			userMenuOpen = false;
		}
	};

	import { onMount } from 'svelte';
	import { sidebarState } from '$lib/stores';
	import { redirect } from '$lib/utils';
	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	const toggleVisibility = () => {
		if ($sidebarState === 'hidden') {
			$sidebarState = 'icon-only';
		} else {
			$sidebarState = 'hidden';
		}
	};
</script>

<nav
	class="fixed top-0 right-0 z-50 flex bg-light-two transition-all duration-300 dark:bg-dark-two {$sidebarState ===
	'hidden'
		? 'left-0'
		: 'left-0'}"
>
	<div class="w-full px-4">
		<div class="flex h-16 w-full items-center justify-between">
			<button
				onclick={toggleVisibility}
				class="mr-2 hidden items-center justify-center bg-light-two p-2 text-light-one transition-all hover:text-light-one_d md:flex"
				aria-label="Toggle sidebar"
			>
				<Menu2Icon class="h-6 w-6" />
			</button>
			<!-- Mobile Hamburger -->
			<button
				onclick={toggleMobileMenu}
				class="mr-2 rounded-lg p-2 text-light-one hover:bg-light-five md:hidden"
				aria-label="Toggle menu"
			>
				{#if mobileMenuOpen}
					<XIcon class="h-6 w-6" />
				{:else}
					<Menu2Icon class="h-6 w-6" />
				{/if}
			</button>

			<div class="flex flex-1 items-center">
				<div class="flex items-center">
					<img src={logoApp} alt="Logo Dulce Vizzio" class="h-10 w-auto" />
				</div>
			</div>

			<!-- Desktop Navigation -->
			<!-- <div class="hidden items-center gap-6 md:flex">
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-sm font-medium transition-colors {isActive(link.href)
							? 'border-b-2 border-light-one font-extrabold text-light-one dark:border-dark-one dark:text-dark-one'
							: 'font-medium text-light-one hover:text-light-one_d dark:text-dark-one dark:hover:text-dark-one_d'}"
					>
						{link.label}
					</a>
				{/each}
			</div> -->

			<!-- Search Bar (Desktop) -->
			<!-- <div class="mx-8 hidden max-w-md flex-1 lg:block">
				<form onsubmit={handleSearch} class="relative">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="¿Qué quieres aprender hoy?"
						class="w-full rounded-full bg-light-one px-4 py-2 pl-10 text-sm text-light-black placeholder-gray-400 focus:ring-2 focus:ring-rose-400 focus:outline-none"
					/>
					<svg
						class="absolute top-2.5 left-3 h-5 w-5 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</form>
			</div> -->
			<!-- Right Side: User Menu -->
			<div class="flex items-center gap-4">
				{#if $currentUser}
					<div class="user-menu-container relative">
						<button
							onclick={toggleUserMenu}
							class="flex h-10 w-10 items-center justify-center rounded-full bg-light-five text-light-one transition-all hover:bg-light-five_d"
						>
							<UserIcon class="h-5 w-5" />
						</button>

						{#if userMenuOpen}
							<div
								class="absolute right-0 mt-3 w-56 origin-top-right rounded-xl border border-light-five bg-light-two p-2 shadow-2xl ring-1 ring-black/5"
							>
								<div class="mb-2 px-4 py-3">
									<p class="text-sm font-bold text-light-one">{$currentUser.full_name}</p>
									<p class="truncate text-xs text-gray-400">{$currentUser.email}</p>
								</div>
								<hr class="mb-1 border-light-five" />
								<a
									href="/app/profile"
									class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-light-one transition-all hover:bg-light-five"
									onclick={() => (userMenuOpen = false)}
								>
									<UserIcon class="h-5 w-5" />
									Mi Perfil
								</a>
								<button
									onclick={handleLogout}
									class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-50/10"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
										/>
									</svg>
									Cerrar Sesión
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<a
						href="/auth/sign-in"
						class="rounded-xl bg-light-one px-6 py-2.5 text-sm font-bold text-light-black transition-all hover:bg-light-one_d"
					>
						Entrar
					</a>
				{/if}
			</div>
		</div>
	</div>

	<!-- Mobile Dropdown Navigation -->
	{#if mobileMenuOpen}
		<div
			class="fixed inset-0 top-16 z-40 bg-black/50 lg:hidden"
			onclick={() => (mobileMenuOpen = false)}
			role="button"
			tabindex="-1"
			onkeydown={(e) => e.key === 'Escape' && (mobileMenuOpen = false)}
		></div>

		<div
			class="absolute top-16 left-0 z-50 w-full border-b border-light-five bg-light-two p-4 lg:hidden"
		>
			<nav class="space-y-2">
				{#each menuItems as item (item.href)}
					<a
						href={item.href}
						onclick={() => (mobileMenuOpen = false)}
						class="flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all {isActive(
							item.href
						)
							? 'bg-light-five text-light-one shadow-sm'
							: 'text-gray-400 hover:bg-light-five hover:text-light-one'}"
					>
						<item.icon class="h-5 w-5" />
						<span>{item.label}</span>
					</a>
				{/each}

				{#if adminItems.length > 0}
					<div class="mt-4 border-t border-light-five pt-4">
						<p class="mb-2 px-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
							Administración
						</p>
						{#each adminItems as item (item.href)}
							<a
								href={item.href}
								onclick={() => (mobileMenuOpen = false)}
								class="flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all {isActive(
									item.href
								)
									? 'bg-light-five text-light-one shadow-sm'
									: 'text-gray-400 hover:bg-light-five hover:text-light-one'}"
							>
								<item.icon class="h-5 w-5" />
								<span>{item.label}</span>
							</a>
						{/each}
					</div>
				{/if}
			</nav>
		</div>
	{/if}
</nav>
