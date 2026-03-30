<script lang="ts">
	import type { User, DropdownOption } from '$lib/interfaces';
	import { DropdownMenu } from '$lib/components/ui';
	import { KeyIcon, PencilIcon, TrashIcon } from '$lib/icons/outline';
	import { ShieldIcon } from '$lib/icons/solid';

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
			icon: PencilIcon,
			action: () => onAction?.(user)
		},
		{
			id: 'delete',
			label: 'Eliminar',
			icon: TrashIcon,
			action: () => onDelete?.(user)
		},
		{
			id: 'reset-password',
			label: 'Restablecer Contraseña',
			icon: KeyIcon,
			action: () => onResetPassword?.(user)
		},
		{
			id: 'change-role',
			label: 'Cambiar Rol',
			icon: ShieldIcon,
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
							width={140}
							class="absolute top-full right-0 mt-2"
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
