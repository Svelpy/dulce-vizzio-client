<script lang="ts">
	import type { User, DropdownOption } from '$lib/interfaces';
	import {
		Table,
		TableHeader,
		TableRow,
		TableHead,
		TableBody,
		TableCell,
		DropdownMenu
	} from '$lib/components/ui';

	interface Props {
		users: User[];
		onAction?: (user: User) => void;
		onDelete?: (user: User) => void;
		onResetPassword?: (user: User) => void;
		onUpdateRole?: (user: User) => void;
	}

	let { users, onAction, onDelete, onResetPassword, onUpdateRole }: Props = $props();

	// State to track which menu is open
	let openMenuId = $state<string | null>(null);

	function toggleMenu(id: string) {
		openMenuId = openMenuId === id ? null : id;
	}

	function getMenuOptions(user: User): DropdownOption[] {
		return [
			{
				id: 'edit',
				label: 'Editar',
				icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
				action: () => {
					onAction?.(user);
					openMenuId = null;
				}
			},
			{
				id: 'delete',
				label: 'Eliminar',
				icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
				action: () => {
					onDelete?.(user);
					openMenuId = null;
				}
			},
			{
				id: 'reset-password',
				label: 'Restablecer Contraseña',
				icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
				action: () => {
					onResetPassword?.(user);
					openMenuId = null;
				}
			},
			{
				id: 'change-role',
				label: 'Cambiar Rol',
				icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
				action: () => {
					onUpdateRole?.(user);
					openMenuId = null;
				}
			}
		];
	}

	const colors = {
		cream: '#f4e9c4',
		taupe: '#a78d70',
		rose: '#ce7576',
		grey: '#cccccc',
		gold: '#b58b3a'
	};

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="table-container">
	<Table>
		<TableHeader style="background-color: {colors.taupe};">
			<TableRow>
				<TableHead class="text-white">ID</TableHead>
				<TableHead class="text-white">Usuario</TableHead>
				<TableHead class="text-white">Email</TableHead>
				<TableHead class="text-white">Nombre Completo</TableHead>
				<TableHead class="text-white">Teléfono</TableHead>
				<TableHead class="text-white">Rol</TableHead>
				<TableHead class="text-white">Activo</TableHead>
				<TableHead class="text-white">Creado</TableHead>
				<TableHead class="text-white">Actualizado</TableHead>
				<TableHead class="text-white">Acciones</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each users as user (user.id)}
				<TableRow class="hover:bg-light-one_d">
					<TableCell class="font-mono text-xs">{user.id}</TableCell>
					<TableCell class="font-medium">{user.username}</TableCell>
					<TableCell>{user.email}</TableCell>
					<TableCell>{user.full_name}</TableCell>
					<TableCell>{user.phone_number}</TableCell>
					<TableCell>
						<span
							class="role-badge"
							style="background-color: {user.role === 'SUPERADMIN'
								? colors.rose
								: user.role === 'ADMIN'
									? colors.gold
									: user.role === 'MODERATOR'
										? colors.taupe
										: colors.grey};"
						>
							{user.role}
						</span>
					</TableCell>
					<TableCell>
						{#if user.is_active}
							<span class="status-badge active">
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
									<polyline points="22 4 12 14.01 9 11.01"></polyline>
								</svg>
								Sí
							</span>
						{:else}
							<span class="status-badge inactive">Inactive</span>
						{/if}
					</TableCell>
					<TableCell class="text-sm text-light-two_d">{formatDate(user.created_at)}</TableCell>
					<TableCell class="text-sm text-light-two_d">{formatDate(user.updated_at)}</TableCell>
					<TableCell>
						{#if onAction}
							<div class="relative">
								<button
									class="action-button"
									style="background-color: {colors.gold};"
									onclick={() => toggleMenu(user.id)}
									aria-label="Acciones"
								>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
										<circle cx="12" cy="12" r="2"></circle>
										<circle cx="12" cy="5" r="2"></circle>
										<circle cx="12" cy="19" r="2"></circle>
									</svg>
								</button>
								<div class="dropdown-wrapper">
									<DropdownMenu
										isOpen={openMenuId === user.id}
										options={getMenuOptions(user)}
										width="140px"
										class="absolute top-full right-0 mt-2"
									/>
								</div>
							</div>
						{/if}
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
