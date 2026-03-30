<script lang="ts">
	import type { User, DropdownOption } from '$lib/interfaces';
	import { TableRow, TableCell, Badge, DropdownMenu } from '$lib/components/ui';
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
				label: 'Cambiar contraseña',
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

<TableRow class="group transition-colors duration-200 hover:bg-stone-50/50">
	<!-- User Profile & Info -->
	<TableCell>
		<div class="flex items-center gap-3">
			<div class="h-10 w-10 shrink-0">
				{#if user.avatar_url}
					<img
						src={user.avatar_url}
						alt={user.full_name}
						class="h-full w-full rounded-full object-cover ring-2 ring-stone-100 ring-offset-1"
					/>
				{:else}
					<div
						class="flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-rose-100 to-stone-100 text-sm font-semibold text-stone-600"
					>
						{user.full_name.charAt(0).toUpperCase()}
					</div>
				{/if}
			</div>
			<div class="flex min-w-0 flex-col">
				<span class="truncate text-sm font-semibold text-stone-800">{user.full_name}</span>
				<div class="mt-0.5 flex items-center gap-1.5 text-xs text-stone-400">
					<span class="truncate">{user.email}</span>
				</div>
			</div>
		</div>
	</TableCell>

	<!-- Role -->
	<TableCell class="hidden md:table-cell">
		<Badge
			variant={roleVariants[user.role] || 'default'}
			class="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase"
		>
			{user.role}
		</Badge>
	</TableCell>

	<!-- Registration Date -->
	<TableCell class="hidden lg:table-cell">
		<span class="text-xs text-stone-500">{formatDate(user.created_at)}</span>
	</TableCell>

	<!-- Status -->
	<TableCell>
		<Badge variant={user.is_active ? 'success' : 'destructive'} class="px-2 py-0.5 text-[10px]">
			{user.is_active ? 'Activo' : 'Inactivo'}
		</Badge>
	</TableCell>

	<!-- Actions: Dropdown -->
	<TableCell class="text-right">
		<div class="relative inline-block">
			<button
				class="ml-auto flex size-8 items-center justify-center rounded-lg border-[1.5px] border-stone-200 bg-white text-stone-500 transition-all duration-150 ease-out hover:border-amber-700/60 hover:bg-stone-50 hover:text-amber-700/60 active:scale-95 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:border-stone-500"
				onclick={() => (menuOpen = !menuOpen)}
				aria-label="Abrir acciones"
				title="Acciones"
			>
				<DotsVerticalIcon />
			</button>
			<DropdownMenu
				isOpen={menuOpen}
				options={getMenuOptions()}
				width={200}
				class="absolute top-full right-0 mt-1"
			/>
		</div>
	</TableCell>
</TableRow>
