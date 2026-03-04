<script lang="ts">
	import { page } from '$app/stores';
	import {
		BookIcon,
		UserIcon,
		UsersIcon,
		HomeDotIcon,
		ChevronsRightIcon,
		ChevronsLeftIcon
	} from '$lib/icons/outline';
	import { currentUser } from '$lib/stores/auth.store';
	import { sidebarState } from '$lib/stores/sidebar.store';
	import { canAccessPath, Role } from '$lib/constants/roles';

	let isHovering = $state(false);

	interface MenuItem {
		label: string;
		href: string;
		icon: any;
	}

	const originalMenuItems: MenuItem[] = [
		{ label: 'Dashboard', href: '/app/dashboard', icon: HomeDotIcon },
		{ label: 'Cursos', href: '/app/courses', icon: BookIcon },
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

	const toggleVisibility = () => {
		if ($sidebarState === 'hidden') {
			$sidebarState = 'icon-only';
		} else {
			$sidebarState = 'hidden';
		}
	};

	const toggleExpansion = () => {
		if ($sidebarState === 'icon-only') {
			$sidebarState = 'expanded';
		} else if ($sidebarState === 'expanded') {
			$sidebarState = 'icon-only';
		}
	};

	const handleMouseEnter = () => {
		isHovering = true;
	};
	const handleMouseLeave = () => {
		isHovering = false;
		if ($sidebarState === 'expanded') {
			$sidebarState = 'icon-only';
		}
	};

	const getSidebarWidth = () => {
		if ($sidebarState === 'hidden') return 'w-0';
		if ($sidebarState === 'icon-only') return 'w-16';
		return 'w-64';
	};
</script>

<button
	onclick={toggleVisibility}
	class="fixed top-0 left-0 z-50 hidden h-16 w-16 items-center justify-center border-r border-b border-r-light-five border-b-light-five bg-light-two text-light-one transition-all hover:text-light-one_d md:flex"
	aria-label="Toggle sidebar"
>
	<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 6h16M4 12h16M4 18h16"
		/>
	</svg>
</button>

<aside
	class="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] border-r border-light-five bg-light-two transition-all duration-300 dark:bg-dark-two {getSidebarWidth()} {$sidebarState ===
	'hidden'
		? 'pointer-events-none -translate-x-full opacity-0'
		: 'translate-x-0 opacity-100'}"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
>
	<div
		class="flex h-full flex-col overflow-x-hidden overflow-y-auto py-4 {$sidebarState ===
		'icon-only'
			? 'px-2'
			: 'px-3'}"
	>
		<nav class="flex-1 space-y-2">
			{#each menuItems as item}
				<a
					href={item.href}
					class="flex items-center rounded-lg px-3 py-3 text-sm font-medium text-light-one transition-all {isActive(
						item.href
					)
						? 'bg-light-five dark:bg-dark-five'
						: ' hover:bg-light-five_d hover:text-light-one_d dark:hover:bg-dark-five_d'} {$sidebarState ===
					'icon-only'
						? 'justify-center'
						: 'gap-3'}"
					title={$sidebarState === 'icon-only' ? item.label : ''}
				>
					<item.icon class="h-6 w-6 flex-shrink-0" />
					{#if $sidebarState === 'expanded'}
						<span class="whitespace-nowrap">{item.label}</span>
					{/if}
				</a>
			{/each}

			<!-- Admin Section -->
			{#if showAdminSection}
				<div class="mt-6">
					{#if $sidebarState === 'expanded'}
						<h3 class="mb-2 px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
							Administración
						</h3>
					{:else}
						<div class="mx-auto my-3 w-8 border-t border-gray-600"></div>
					{/if}
					<div class="space-y-2">
						{#each adminItems as item}
							<a
								href={item.href}
								class="flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all {isActive(
									item.href
								)
									? 'bg-light-five dark:bg-dark-five'
									: ' hover:bg-light-five_d hover:text-light-one_d dark:hover:bg-dark-five_d'} {$sidebarState ===
								'icon-only'
									? 'justify-center'
									: 'gap-3'}"
								title={$sidebarState === 'icon-only' ? item.label : ''}
							>
								<item.icon class="h-6 w-6 flex-shrink-0" />
								{#if $sidebarState === 'expanded'}
									<span class="whitespace-nowrap">{item.label}</span>
								{/if}
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</nav>

		<!-- User Info and Expand/Collapse Button at Bottom -->
		{#if $sidebarState !== 'hidden'}
			<button
				onclick={toggleExpansion}
				class="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-light-five hover:text-light-one {$sidebarState ===
				'icon-only'
					? 'justify-center'
					: 'gap-3'}"
				title={$sidebarState === 'icon-only' ? 'Expandir sidebar' : 'Contraer sidebar'}
			>
				{#if $sidebarState === 'expanded'}
					<ChevronsLeftIcon />
				{:else}
					<ChevronsRightIcon />
				{/if}
				{#if $sidebarState === 'expanded'}
					<span class="whitespace-nowrap">Contraer</span>
				{/if}
			</button>
		{/if}
	</div>
</aside>
