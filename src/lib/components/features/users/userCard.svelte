<script lang="ts">
	import type { User, DropdownOption } from '$lib/interfaces';
	import { DropdownMenu } from '$lib/components/ui';

	interface Props {
		user: User;
		onAction?: (user: User) => void;
		onDelete?: (user: User) => void;
		onResetPassword?: (user: User) => void;
		onUpdateRole?: (user: User) => void;
	}

	let { user, onAction, onDelete, onResetPassword, onUpdateRole }: Props = $props();

	let isMenuOpen = $state(false);

	const menuOptions: DropdownOption[] = [
		{
			id: 'edit',
			label: 'Editar',
			icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
			action: () => onAction?.(user)
		},
		{
			id: 'delete',
			label: 'Eliminar',
			icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
			action: () => onDelete?.(user)
		},
		{
			id: 'reset-password',
			label: 'Restablecer Contraseña',
			icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
			action: () => onResetPassword?.(user)
		},
		{
			id: 'change-role',
			label: 'Cambiar Rol',
			icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
			action: () => onUpdateRole?.(user)
		}
	];

	const colors = {
		cream: '#f4e9c4',
		taupe: '#a78d70',
		rose: '#ce7576',
		grey: '#cccccc',
		gold: '#b58b3a'
	};
</script>

<div class="user-card" style="background-color: {colors.cream}; border-color: {colors.taupe};">
	<div class="user-card-header">
		<h3 class="user-name" style="color: {colors.taupe};">{user.full_name}</h3>
		<div class="user-status">
			{#if user.is_active}
				<span class="status-badge active">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
						<polyline points="22 4 12 14.01 9 11.01"></polyline>
					</svg>
					Activo
				</span>
			{:else}
				<span class="status-badge inactive">Inactivo</span>
			{/if}
			{#if onAction}
				<div class="relative">
					<button
						class="action-button"
						style="background-color: {colors.taupe};"
						onclick={() => (isMenuOpen = !isMenuOpen)}
						aria-label="Acciones"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<circle cx="12" cy="12" r="2"></circle>
							<circle cx="12" cy="5" r="2"></circle>
							<circle cx="12" cy="19" r="2"></circle>
						</svg>
					</button>

					<div class="dropdown-wrapper">
						<DropdownMenu
							isOpen={isMenuOpen}
							options={menuOptions}
							width="140px"
							class="absolute right-0 top-full mt-2"
						/>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="user-details">
		<div class="detail-row">
			<span class="detail-label" style="color: {colors.taupe};">Username:</span>
			<span class="detail-value">{user.username}</span>
		</div>
		<div class="detail-row">
			<span class="detail-label" style="color: {colors.taupe};">Email:</span>
			<span class="detail-value">{user.email}</span>
		</div>
		<div class="detail-row">
			<span class="detail-label" style="color: {colors.taupe};">Teléfono:</span>
			<span class="detail-value">{user.phone_number}</span>
		</div>
		<div class="detail-row">
			<span class="detail-label" style="color: {colors.taupe};">Rol:</span>
			<span class="detail-value role" style="color: {colors.gold}; font-weight: 600;"
				>{user.role}</span
			>
		</div>
	</div>
</div>

<style>
	.user-card {
		border-radius: 1rem;
		border: 2px solid;
		padding: 1.25rem;
		margin-bottom: 1rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.user-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.user-card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
		gap: 0.5rem;
	}

	.user-name {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
		flex: 1;
	}

	.user-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.status-badge.active {
		background-color: #d1fae5;
		color: #065f46;
	}

	.status-badge.inactive {
		background-color: #fee2e2;
		color: #991b1b;
	}

	.action-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 0.5rem;
		border: none;
		color: white;
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.action-button:hover {
		opacity: 0.8;
	}

	.dropdown-wrapper {
		position: absolute;
		right: 0;
		top: 100%;
		z-index: 50;
	}

	.user-details {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.detail-row {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.detail-label {
		font-size: 0.875rem;
		font-weight: 700;
	}

	.detail-value {
		font-size: 0.875rem;
		color: #374151;
	}

	.detail-value.role {
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
</style>
