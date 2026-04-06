<script lang="ts">
	import { page } from '$app/stores';
	import {
		BookIcon,
		UserIcon,
		UsersIcon,
		HomeDotIcon,
		SidebarCollapseLeftIcon,
		SidebarCollapseRightIcon
	} from '$lib/icons/outline';
	import logoApp from '$lib/assets/images/logo_dulce_vizzio.png';
	import { currentUser } from '$lib/stores/auth.store';
	import { sidebarState } from '$lib/stores/sidebar.store';
	import { Role, canAccessPath } from '$lib/constants/roles';

	let { class: className } = $props<{ class?: string }>();

	interface MenuItem {
		label: string;
		href: string;
		icon: import('svelte').Component;
	}

	const originalMenuItems: MenuItem[] = [
		{ label: 'Inicio', href: '/app/dashboard', icon: HomeDotIcon },
		{ label: 'Mis Cursos', href: '/app/my-enrollments', icon: BookIcon },
		{ label: 'Cursos', href: '/app/courses', icon: BookIcon },
		{ label: 'Inscripciones', href: '/app/enrollments', icon: BookIcon },
		{ label: 'Usuarios', href: '/app/users', icon: UsersIcon },
		{ label: 'Mi Perfil', href: '/app/profile', icon: UserIcon }
	];

	const originalAdminItems: MenuItem[] = [];

	const menuItems = $derived(
		originalMenuItems
			.filter((item) => canAccessPath($currentUser?.role, item.href))
			.map((item) => {
				if (item.href === '/app/courses') {
					const isAdmin =
						$currentUser?.role === Role.SUPERADMIN || $currentUser?.role === Role.ADMIN;
					return { ...item, label: isAdmin ? 'Cursos' : 'Explorar' };
				}
				return item;
			})
	);

	const adminItems = $derived(
		originalAdminItems.filter((item) => canAccessPath($currentUser?.role, item.href))
	);

	const isActive = (href: string) => {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
	};

	const showAdminSection = $derived(adminItems.length > 0);

	const toggleExpansion = () => {
		if ($sidebarState === 'icon-only') {
			$sidebarState = 'expanded';
		} else if ($sidebarState === 'expanded') {
			$sidebarState = 'icon-only';
		}
	};

	const getSidebarWidth = () => {
		if ($sidebarState === 'icon-only') return 'w-[64px]';
		return 'w-[240px]';
	};
</script>

<aside
	class="bg-light-on hidden flex-col overflow-hidden border-r-4 border-sweet-pink-100 text-sweet-brown transition-[width] duration-300 ease-in-out md:flex {getSidebarWidth()} {className}"
>
	<!-- Top Bar: Logo & Hamburger -->
	<div class="flex h-16 shrink-0 items-center justify-between px-4 pt-4 pb-2">
		{#if $sidebarState === 'expanded'}
			<div class="flex items-center gap-3 overflow-hidden">
				<img
					src={logoApp}
					alt="Logo Dulce Vizzio"
					class="h-8 w-auto saturate-[.85] transition-all sm:h-9"
				/>
			</div>
		{/if}

		<button
			onclick={toggleExpansion}
			class="flex size-8 shrink-0 items-center justify-center rounded-lg text-sweet-pink-400 transition-colors hover:bg-sweet-pink-50 hover:text-sweet-pink-500 {$sidebarState ===
			'icon-only'
				? 'mx-auto'
				: ''}"
			aria-label="Toggle sidebar"
			title="Colapsar menú"
		>
			{#if $sidebarState === 'expanded'}
				<SidebarCollapseLeftIcon class="size-5" />
			{:else}
				<SidebarCollapseRightIcon class="size-5" />
			{/if}
		</button>
	</div>

	<!-- Scrollable Navigation -->
	<div class="flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-3 pt-2">
		<!-- Main Navigation -->
		<nav class="space-y-[3px]">
			{#each menuItems as item (item.href)}
				<a
					href={item.href}
					class="group flex items-center rounded-xl px-[10px] py-[7px] text-[13.5px] font-bold transition-all
					{isActive(item.href)
						? 'bg-sweet-pink-100 text-sweet-pink-500'
						: 'hover:bg-sweet-pink-50 hover:text-sweet-pink-400'} 
					{$sidebarState === 'icon-only' ? 'justify-center py-[9px]' : 'gap-3'}"
					title={$sidebarState === 'icon-only' ? item.label : ''}
				>
					<item.icon
						class="size-[20px] shrink-0 {isActive(item.href)
							? 'text-sweet-pink-500'
							: 'text-sweet-pink-300 group-hover:text-sweet-pink-400'}"
					/>
					{#if $sidebarState === 'expanded'}
						<span class="whitespace-nowrap">{item.label}</span>
					{/if}
				</a>
			{/each}
		</nav>

		<!-- Admin Section -->
		{#if showAdminSection}
			<div class="mt-6">
				{#if $sidebarState === 'expanded'}
					<h3 class="mb-2 px-3 text-[11px] font-bold tracking-wider text-sweet-pink-200 uppercase">
						Administración
					</h3>
				{:else}
					<div class="mx-auto my-3 w-8 border-t border-sweet-pink-50"></div>
				{/if}
				<nav class="space-y-[3px]">
					{#each adminItems as item (item.href)}
						<a
							href={item.href}
							class="group flex items-center rounded-xl px-[10px] py-[7px] text-[13.5px] font-bold transition-all
							{isActive(item.href)
								? 'bg-sweet-pink-100 text-sweet-pink-500'
								: 'hover:bg-sweet-pink-50 hover:text-sweet-pink-400'} 
							{$sidebarState === 'icon-only' ? 'justify-center py-[9px]' : 'gap-3'}"
							title={$sidebarState === 'icon-only' ? item.label : ''}
						>
							<item.icon
								class="size-[20px] shrink-0 {isActive(item.href)
									? 'text-sweet-pink-500'
									: 'text-sweet-pink-300 group-hover:text-sweet-pink-400'}"
							/>
							{#if $sidebarState === 'expanded'}
								<span class="whitespace-nowrap">{item.label}</span>
							{/if}
						</a>
					{/each}
				</nav>
			</div>
		{/if}
	</div>
</aside>
