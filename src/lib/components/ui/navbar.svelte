<script lang="ts">
	import { type Component } from 'svelte';
	import { page } from '$app/stores';
	import { currentUser, authStore } from '$lib/stores/auth.store';
	import { UserIcon, BookIcon, HomeDotIcon, UsersIcon, Menu2Icon, XIcon } from '$lib/icons/outline';
	import logoApp from '$lib/assets/images/logo_dulce_vizzio.png';
	import { onMount } from 'svelte';
	import { redirect } from '$lib/utils';
	import { DropdownMenu } from '.';
	import { LogoutIcon } from '$lib/icons/solid';

	import { canAccessPath } from '$lib/constants/roles';

	let mobileMenuOpen: boolean = $state(false);
	let userMenuOpen: boolean = $state(false);
	let widthMenu: number = $state(190);

	interface MenuItem {
		label: string;
		href: string;
		icon: Component;
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

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	const optionsMenu = [
		{
			id: 'profile',
			label: 'Mi Perfil',
			icon: UserIcon,
			action: () => {
				redirect('/app/profile');
			}
		},
		{
			id: 'logout',
			label: 'Cerrar Sesión',
			icon: LogoutIcon,
			action: () => {
				handleLogout();
			},
			divider: true
		}
	];
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
</script>

<nav
	class="relative z-30 flex border-b border-light-four bg-light-one transition-colors duration-300"
>
	<div class="w-full px-4">
		<div class="flex h-16 w-full items-center justify-between">
			<!-- Mobile Hamburger -->
			<button
				onclick={toggleMobileMenu}
				class="mr-2 rounded-lg p-2 text-stone-600 hover:bg-stone-100 md:hidden dark:text-stone-400 dark:hover:bg-stone-800"
				aria-label="Toggle menu"
			>
				{#if mobileMenuOpen}
					<XIcon class="h-6 w-6" />
				{:else}
					<Menu2Icon class="h-6 w-6" />
				{/if}
			</button>

			<div class="flex flex-1 items-center">
				<div class="flex items-center md:hidden">
					<img src={logoApp} alt="Logo Dulce Vizzio" class="h-9 w-auto" />
				</div>
			</div>
			<div class="flex items-center gap-4">
				{#if $currentUser}
					<div class="user-menu-container relative">
						<div>
							<button
								onclick={() => toggleUserMenu()}
								aria-label="Acciones"
								class="flex size-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
							>
								<UserIcon class="h-5 w-5" />
							</button>
							<div class="relative">
								<DropdownMenu
									text={$currentUser.full_name}
									isOpen={userMenuOpen}
									options={optionsMenu}
									width={widthMenu}
									class="absolute top-full right-0 mt-2"
								/>
							</div>
						</div>
						<!-- <button
							onclick={toggleUserMenu}
							class="flex h-10 w-10 items-center justify-center rounded-full bg-light-five text-light-one transition-all hover:bg-light-five_d"
						>
							<UserIcon class="h-5 w-5" />
						</button> -->

						<!-- {#if userMenuOpen}
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
						{/if} -->
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
			class="absolute top-16 left-0 z-50 w-full border-b border-stone-200 bg-white p-4 shadow-lg lg:hidden dark:border-stone-800 dark:bg-stone-950"
		>
			<nav class="space-y-2">
				{#each menuItems as item (item.href)}
					<a
						href={item.href}
						onclick={() => (mobileMenuOpen = false)}
						class="flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all {isActive(
							item.href
						)
							? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-white'
							: 'text-stone-600 hover:bg-stone-50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900 dark:hover:text-white'}"
					>
						<item.icon class="h-5 w-5" />
						<span>{item.label}</span>
					</a>
				{/each}

				{#if adminItems.length > 0}
					<div class="mt-4 border-t border-stone-100 pt-4 dark:border-stone-800">
						<p class="mb-2 px-4 text-xs font-bold tracking-wider text-stone-400 uppercase">
							Administración
						</p>
						{#each adminItems as item (item.href)}
							<a
								href={item.href}
								onclick={() => (mobileMenuOpen = false)}
								class="flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all {isActive(
									item.href
								)
									? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-white'
									: 'text-stone-500 hover:bg-stone-50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900 dark:hover:text-white'}"
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
