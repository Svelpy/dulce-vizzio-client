<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { AuthService } from '$lib/services';
	import { UserIcon, BookIcon, HomeDotIcon } from '$lib/icons/outline';
	import { HomeIcon } from '$lib/icons/solid';

	let mobileMenuOpen = $state(false);
	let userMenuOpen = $state(false);
	let searchQuery = $state('');
	let user = $state<any>(null);

	onMount(() => {
		user = AuthService.getUser();
	});

	const navLinks = [
		{ label: 'Dashboard', href: '/app/dashboard', icon: HomeDotIcon },
		{ label: 'Cursos', href: '/app/courses', icon: BookIcon },
		{ label: 'Mis Cursos', href: '/app/my-courses', icon: BookIcon }
	];

	const handleSearch = (e: Event) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			goto(`/app/courses?search=${encodeURIComponent(searchQuery)}`);
			mobileMenuOpen = false;
		}
	};

	const handleLogout = () => {
		AuthService.logout();
		goto('/auth/sign-in');
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

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<nav class="fixed top-0 right-0 left-0 z-50 bg-light-two dark:bg-dark-two">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<div class="flex items-center">
				<div class="flex items-center">
					<img src="/images/logo_dulce_vizzio.png" alt="Logo Dulce Vizzio" class="h-12 w-16" />
				</div>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden items-center gap-6 md:flex">
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
			</div>

			<!-- Search Bar (Desktop) -->
			<div class="mx-8 hidden max-w-md flex-1 lg:block">
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
			</div>

			<!-- Right Side: User Menu -->
			<div class="flex items-center gap-4">
				{#if user}
					<div class="user-menu-container relative hidden md:block">
						<button
							onclick={toggleUserMenu}
							class="flex items-center gap-2 rounded-full bg-light-one px-3 py-2 text-sm text-light-black transition-colors hover:bg-gray-700"
						>
							<UserIcon class="h-6 w-6" />
							<span class="hidden lg:block">{user.name || 'Usuario'}</span>
						</button>

						{#if userMenuOpen}
							<div
								class="ring-opacity-5 absolute right-0 mt-2 w-48 rounded-lg bg-white py-2 shadow-xl ring-1 ring-black"
							>
								<a
									href="/app/profile"
									class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								>
									<UserIcon class="h-5 w-5" />
									Mi Perfil
								</a>
								<a
									href="/app/settings"
									class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									Configuración
								</a>
								<hr class="my-2" />
								<button
									onclick={handleLogout}
									class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
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
					<div class="hidden items-center gap-2 md:flex">
						<a
							href="/auth/sign-in"
							class="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
						>
							Iniciar Sesión
						</a>
						<!-- <a
							href="/auth/sign-up"
							class="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-600"
						>
							Registrarse
						</a> -->
					</div>
				{/if}

				<!-- Mobile Menu Button -->
				<button
					onclick={toggleMobileMenu}
					class="rounded-lg p-2 text-gray-300 hover:bg-gray-800 hover:text-white md:hidden"
					aria-label="Toggle menu"
				>
					{#if mobileMenuOpen}
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					{:else}
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<div class="border-t border-gray-800 bg-gray-900 md:hidden">
			<div class="space-y-1 px-4 pt-2 pb-3">
				<!-- Search (Mobile) -->
				<form onsubmit={handleSearch} class="relative mb-4">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Buscar cursos..."
						class="w-full rounded-lg bg-gray-800 px-4 py-2 pl-10 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-rose-400 focus:outline-none"
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

				<!-- Navigation Links -->
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={() => (mobileMenuOpen = false)}
						class="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors {isActive(
							link.href
						)
							? 'bg-gray-800 text-rose-400'
							: 'text-gray-300 hover:bg-gray-800 hover:text-white'}"
					>
						{#if link.icon}
							<link.icon class="h-5 w-5" />
						{/if}
						{link.label}
					</a>
				{/each}

				{#if user}
					<hr class="my-2 border-gray-800" />
					<a
						href="/app/profile"
						onclick={() => (mobileMenuOpen = false)}
						class="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
					>
						<UserIcon class="h-5 w-5" />
						Mi Perfil
					</a>
					<a
						href="/app/settings"
						onclick={() => (mobileMenuOpen = false)}
						class="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						Configuración
					</a>
					<button
						onclick={handleLogout}
						class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-base font-medium text-red-400 hover:bg-gray-800"
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
				{:else}
					<hr class="my-2 border-gray-800" />
					<a
						href="/auth/sign-in"
						onclick={() => (mobileMenuOpen = false)}
						class="block rounded-lg px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
					>
						Iniciar Sesión
					</a>
					<a
						href="/auth/sign-up"
						onclick={() => (mobileMenuOpen = false)}
						class="block rounded-lg bg-rose-500 px-3 py-2 text-base font-medium text-white hover:bg-rose-600"
					>
						Registrarse
					</a>
				{/if}
			</div>
		</div>
	{/if}
</nav>
