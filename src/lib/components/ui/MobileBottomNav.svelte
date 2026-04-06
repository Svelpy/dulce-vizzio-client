<script lang="ts">
	import { page } from '$app/stores';
	import { HomeDotIcon, BookIcon, UserIcon, UsersIcon } from '$lib/icons/outline';
	import { currentUser } from '$lib/stores/auth.store';
	import { Role, canAccessPath } from '$lib/constants/roles';
	import { cn } from '$lib/utils';

	const allNavItems = [
		{ label: 'Inicio', href: '/app/dashboard', icon: HomeDotIcon },
		{ label: 'Mis Cursos', href: '/app/my-enrollments', icon: BookIcon },
		{ label: 'Cursos', href: '/app/courses', icon: BookIcon },
		{ label: 'Inscripciones', href: '/app/enrollments', icon: BookIcon },
		{ label: 'Usuarios', href: '/app/users', icon: UsersIcon },
		{ label: 'Perfil', href: '/app/profile', icon: UserIcon }
	];

	const navItems = $derived(
		allNavItems
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

	const isActive = (href: string) => {
		if (href === '#') return false;
		return (
			$page.url.pathname === href ||
			($page.url.pathname.startsWith(href) && href !== '/app/dashboard')
		);
	};
</script>

<div class="fixed bottom-0 left-0 z-50 w-full md:hidden">
	<nav
		class="flex h-16 w-full items-center justify-around rounded-2xl rounded-b-none border border-white/40 bg-light-two px-2 shadow-lg backdrop-blur-xl"
	>
		{#each navItems as item (item.href)}
			<a
				href={item.href}
				class="group flex flex-col items-center justify-center gap-1 transition-all duration-300"
			>
				<div
					class={cn(
						'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300',
						isActive(item.href)
							? 'bg-light-one text-sweet-pink-400 shadow-sm'
							: 'text-light-one group-hover:bg-light-one_d group-hover:text-stone-600'
					)}
				>
					<item.icon class="h-6 w-6" />
				</div>
				<span
					class={cn(
						'text-[10px] font-bold tracking-tight transition-all duration-300',
						isActive(item.href) ? 'text-light-one' : 'text-light-one group-hover:text-light-one_d'
					)}
				>
					{item.label}
				</span>
			</a>
		{/each}
	</nav>
</div>
