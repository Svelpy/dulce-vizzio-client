<script lang="ts">
	import { page } from '$app/stores';
	import {
		BookIcon,
		UserIcon,
		UsersIcon,
		HomeDotIcon,
		Menu2Icon,
		PlusIcon,
		SidebarCollapseLeftIcon,
		SidebarCollapseRightIcon
	} from '$lib/icons/outline';
	import logoApp from '$lib/assets/images/logo_dulce_vizzio.png';
	import { currentUser } from '$lib/stores/auth.store';
	import { sidebarState } from '$lib/stores/sidebar.store';
	import { canAccessPath } from '$lib/constants/roles';

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
		originalMenuItems.filter((item) => canAccessPath($currentUser?.role, item.href))
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
	class="hidden flex-col overflow-hidden bg-light-two text-light-one transition-[width] duration-300 ease-in-out md:flex {getSidebarWidth()} {className}"
>
	<!-- Top Bar: Logo & Hamburger -->
	<div class="flex h-16 shrink-0 items-center justify-between px-4 pt-4 pb-2">
		{#if $sidebarState === 'expanded'}
			<div class="flex items-center gap-3 overflow-hidden">
				<img
					src={logoApp}
					alt="Logo Dulce Vizzio"
					class="h-8 w-auto brightness-[1.1] drop-shadow-md saturate-[.85] transition-all sm:h-9"
				/>
			</div>
		{/if}

		<button
			onclick={toggleExpansion}
			class="flex size-8 shrink-0 items-center justify-center rounded-lg text-light-one transition-colors hover:text-light-one_d {$sidebarState ===
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
					class="group flex items-center rounded-lg px-[10px] py-[7px] text-[13.5px] font-medium transition-all
					{isActive(item.href)
						? 'bg-light-three text-white'
						: 'hover:bg-light-three_d hover:text-light-one_d'} 
					{$sidebarState === 'icon-only' ? 'justify-center py-[9px]' : 'gap-3'}"
					title={$sidebarState === 'icon-only' ? item.label : ''}
				>
					<item.icon
						class="size-[20px] shrink-0 {isActive(item.href)
							? 'text-light-one'
							: 'text-light-one group-hover:text-light-one_d'}"
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
					<h3 class="mb-2 px-3 text-[11px] font-bold tracking-wider text-[#A2A0A2]/60 uppercase">
						Administración
					</h3>
				{:else}
					<div class="mx-auto my-3 w-8 border-t border-[#313234]"></div>
				{/if}
				<nav class="space-y-[3px]">
					{#each adminItems as item (item.href)}
						<a
							href={item.href}
							class="group flex items-center rounded-lg px-[10px] py-[7px] text-[13.5px] font-medium transition-all
							{isActive(item.href) ? 'bg-[#2A2B2D] text-white' : 'hover:bg-[#2A2B2D] hover:text-white'} 
							{$sidebarState === 'icon-only' ? 'justify-center py-[9px]' : 'gap-3'}"
							title={$sidebarState === 'icon-only' ? item.label : ''}
						>
							<item.icon
								class="size-[20px] shrink-0 {isActive(item.href)
									? 'text-white'
									: 'text-[#A2A0A2] group-hover:text-white'}"
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
