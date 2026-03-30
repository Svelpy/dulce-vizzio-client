<script lang="ts">
	import type { User, DropdownOption } from '$lib/interfaces';
	import { Badge, DropdownMenu } from '$lib/components/ui';
	import { LockIcon, ShieldIcon } from '$lib/icons/solid';
	import { PencilIcon, TrashIcon, DotsVerticalIcon } from '$lib/icons/outline';
	import { formatDate } from '$lib/utils';

	interface Props {
		user: User;
		onAction: (user: User) => void;
		onDelete: (user: User) => void;
		onResetPassword: (user: User) => void;
		onUpdateRole: (user: User) => void;
	}

	let { user, onAction, onDelete, onResetPassword, onUpdateRole }: Props = $props();

	let menuOpen = $state(false);

	const roleVariants: Record<
		string,
		'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
	> = {
		SUPERADMIN: 'destructive',
		ADMIN: 'warning',
		MODERATOR: 'secondary',
		USER: 'outline'
	};

	function getMenuOptions(): DropdownOption[] {
		return [
			{
				id: 'edit',
				label: 'Editar usuario',
				icon: PencilIcon,
				action: () => {
					onAction(user);
					menuOpen = false;
				}
			},
			{
				id: 'reset-password',
				label: 'Restablecer contraseña',
				icon: LockIcon,
				action: () => {
					onResetPassword(user);
					menuOpen = false;
				}
			},
			{
				id: 'change-role',
				label: 'Cambiar rol',
				icon: ShieldIcon,
				action: () => {
					onUpdateRole(user);
					menuOpen = false;
				}
			},
			{
				id: 'delete',
				label: 'Eliminar',
				icon: TrashIcon,
				variant: 'destructive',
				divider: true,
				action: () => {
					onDelete(user);
					menuOpen = false;
				}
			}
		];
	}
</script>

<div class="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-stone-800 dark:bg-stone-900">
	<!-- Header: Avatar, Name, Email and Actions Menu -->
	<div class="flex items-start justify-between">
		<div class="flex items-center gap-3 min-w-0">
			<!-- Avatar -->
			<div class="h-11 w-11 shrink-0">
				{#if user.avatar_url}
					<img
						src={user.avatar_url}
						alt={user.full_name}
						class="h-full w-full rounded-full object-cover ring-2 ring-stone-100 ring-offset-1 dark:ring-stone-800 dark:ring-offset-stone-900"
					/>
				{:else}
					<div
						class="flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-rose-100 to-stone-100 font-semibold text-stone-600 shadow-sm dark:from-stone-800 dark:to-stone-700 dark:text-stone-300"
					>
						{user.full_name.charAt(0).toUpperCase()}
					</div>
				{/if}
			</div>

			<!-- Info -->
			<div class="flex min-w-0 flex-col">
				<h3 class="truncate text-[0.95rem] font-bold leading-tight text-stone-900 dark:text-white">
					{user.full_name}
				</h3>
				<p class="truncate text-xs font-medium text-stone-500 dark:text-stone-400 mt-0.5">
					{user.email}
				</p>
			</div>
		</div>

		<!-- Actions Menu -->
		<div class="relative ml-2 shrink-0">
			<button
				class="flex size-8 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 shadow-sm transition-all hover:bg-stone-50 hover:text-stone-900 active:scale-95 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 dark:hover:text-white"
				onclick={() => (menuOpen = !menuOpen)}
				aria-label="Acciones"
			>
				<DotsVerticalIcon class="size-5" />
			</button>
			<DropdownMenu
				isOpen={menuOpen}
				options={getMenuOptions()}
				width={200}
				class="absolute right-0 top-full z-50 mt-1 shadow-lg border border-stone-100 dark:border-stone-800"
			/>
		</div>
	</div>

	<!-- Footer: Badges -->
	<div class="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-3 dark:border-stone-800/60">
		<div class="flex items-center gap-2">
			<!-- Role -->
			<Badge
				variant={roleVariants[user.role] || 'default'}
				class="uppercase tracking-wider px-2 py-0.5 text-[10px] font-bold"
			>
				{user.role}
			</Badge>
			
			<!-- Status -->
			<Badge variant={user.is_active ? 'success' : 'destructive'} class="px-2 py-0.5 text-[10px]">
				{user.is_active ? 'Activo' : 'Inactivo'}
			</Badge>
		</div>

		<span class="text-[11px] font-medium text-stone-400 dark:text-stone-500">
			{formatDate(user.created_at)}
		</span>
	</div>
</div>
