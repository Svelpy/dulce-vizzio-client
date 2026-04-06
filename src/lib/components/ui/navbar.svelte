<script lang="ts">
	import { currentUser, authStore } from '$lib/stores/auth.store';
	import { UserIcon, BellIcon } from '$lib/icons/outline';
	import logoApp from '$lib/assets/images/logo_dulce_vizzio.png';
	import { onMount } from 'svelte';
	import { redirect } from '$lib/utils';
	import { DropdownMenu } from '.';
	import { LogoutIcon } from '$lib/icons/solid';

	let userMenuOpen = $state(false);
	let widthMenu = $state(190);

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

	const toggleUserMenu = () => {
		userMenuOpen = !userMenuOpen;
	};

	const handleClickOutside = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (!target.closest('.user-menu-container')) {
			userMenuOpen = false;
		}
	};
</script>

<nav
	class="relative z-30 border-b-4 border-sweet-pink-100 bg-light-one backdrop-blur-md transition-colors duration-300"
>
	<div class="w-full px-4">
		<div class="flex h-16 w-full items-center justify-between">
			<!-- Logo Section -->
			<div class="flex items-center gap-2">
				<img src={logoApp} alt="Logo Dulce Vizzio" class="h-9 w-auto" />
			</div>

			<!-- Right Actions -->
			<div class="flex items-center gap-3">
				<!-- Notification Bell -->
				<!-- <button
					class="relative flex h-10 w-10 items-center justify-center rounded-full bg-sweet-pink-50 text-sweet-pink-400 transition-all hover:bg-sweet-pink-100"
				>
					<BellIcon class="h-6 w-6" />
					<span
						class="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-sweet-pink-400 text-[10px] font-bold text-white ring-2 ring-white"
					>
						3
					</span>
				</button> -->

				{#if $currentUser}
					<div class="user-menu-container relative">
						<button
							onclick={() => toggleUserMenu()}
							aria-label="Acciones de usuario"
							class="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full ring-2 ring-sweet-pink-100 transition-all hover:ring-sweet-pink-300"
						>
							{#if $currentUser.avatar_url}
								<img
									src={$currentUser.avatar_url}
									alt={$currentUser.full_name}
									class="h-full w-full object-cover"
								/>
							{:else}
								<div
									class="flex h-full w-full items-center justify-center bg-sweet-pink-100 text-sweet-pink-400"
								>
									<UserIcon class="h-6 w-6" />
								</div>
							{/if}
						</button>
						<div class="relative">
							<DropdownMenu
								text={$currentUser.full_name}
								isOpen={userMenuOpen}
								options={optionsMenu}
								width={widthMenu}
								class="absolute top-full right-0 mt-3"
							/>
						</div>
					</div>
				{:else}
					<a
						href="/auth/sign-in"
						class="rounded-full bg-sweet-pink-400 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-sweet-pink-500"
					>
						Entrar
					</a>
				{/if}
			</div>
		</div>
	</div>
</nav>
