<script lang="ts">
	import type { User } from '$lib/interfaces';
	import {
		Table,
		TableHeader,
		TableRow,
		TableHead,
		TableBody,
		TableCell
	} from '$lib/components/ui';

	interface Props {
		users: User[];
		onAction?: (user: User) => void;
	}

	let { users, onAction }: Props = $props();

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
					<TableCell class="font-mono text-xs">{user.id.slice(0, 8)}...</TableCell>
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
							<button
								class="action-button"
								style="background-color: {colors.gold};"
								onclick={() => onAction?.(user)}
								aria-label="Acciones"
							>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
									<circle cx="12" cy="12" r="1"></circle>
									<circle cx="12" cy="5" r="1"></circle>
									<circle cx="12" cy="19" r="1"></circle>
								</svg>
							</button>
						{/if}
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>

<style>
	.table-container {
		overflow-x: auto;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
		background: white;
	}

	.role-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 700;
		color: white;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
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
</style>
