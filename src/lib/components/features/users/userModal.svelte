<script lang="ts">
	import { Button, Input, Select, BlurOverlay } from '$lib/components/ui';
	import { userService } from '$lib/services';
	import type { CreateUserRequest, UpdateUserRequest, User, UserRole } from '$lib/interfaces';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		onSuccess: () => void;
		user?: User | null;
	}

	let { isOpen, onClose, onSuccess, user = null }: Props = $props();

	let loading = $state(false);
	let error = $state<string | null>(null);
	let isEdit = $derived(!!user);

	let formData = $state({
		email: '',
		password: '',
		full_name: '',
		username: '',
		phone_number: '',
		birth_date: '',
		role: 'USER' as UserRole
	});

	// Pre-fill form when user changes
	$effect(() => {
		if (user) {
			formData = {
				email: user.email || '',
				password: '', // Password is not editable
				full_name: user.full_name || '',
				username: user.username || '',
				phone_number: user.phone_number || '',
				birth_date: user.birth_date ? user.birth_date.split('T')[0] : '',
				role: user.role as UserRole
			};
		} else {
			resetForm();
		}
	});

	const roles: { value: UserRole; label: string }[] = [
		{ value: 'ADMIN', label: 'Administrador' },
		{ value: 'MODERATOR', label: 'Moderador' },
		{ value: 'USER', label: 'Usuario' }
	];

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		error = null;

		try {
			if (isEdit && user) {
				const requestData: UpdateUserRequest = {
					email: formData.email,
					full_name: formData.full_name,
					username: formData.username || undefined,
					phone_number: formData.phone_number || undefined,
					birth_date: formData.birth_date || undefined
				};
				await userService.update(user.id, requestData);
			} else {
				const requestData: CreateUserRequest = {
					...formData,
					username: formData.username || undefined,
					phone_number: formData.phone_number || undefined,
					birth_date: formData.birth_date || undefined
				};
				await userService.create(requestData);
			}

			onSuccess();
			onClose();
		} catch (err: unknown) {
			const errorMsg =
				err instanceof Error
					? err.message
					: `Error al ${isEdit ? 'actualizar' : 'crear'} el usuario`;
			error = errorMsg;
			console.error(`Error ${isEdit ? 'updating' : 'creating'} user:`, err);
		} finally {
			loading = false;
		}
	}

	function resetForm() {
		formData = {
			email: '',
			password: '',
			full_name: '',
			username: '',
			phone_number: '',
			birth_date: '',
			role: 'USER'
		};
		error = null;
	}

	const colors = {
		cream: '#f4e9c4',
		taupe: '#a78d70',
		rose: '#ce7576',
		grey: '#cccccc',
		gold: '#b58b3a'
	};
</script>

{#if isOpen}
	<BlurOverlay>
		<div
			class="modal-content"
			transition:fly={{ y: 20, duration: 300 }}
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.key === 'Escape' && onClose()}
			tabindex="-1"
			aria-modal="true"
			role="dialog"
		>
			<div class="modal-header">
				<h2 style="color: {colors.taupe};">
					{isEdit ? 'Actualizar Usuario' : 'Crear Nuevo Usuario'}
				</h2>
				<button class="close-btn" onclick={onClose} aria-label="Cerrar">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>

			<form onsubmit={handleSubmit} class="modal-form">
				<div class="form-grid">
					<div class="form-group full-width">
						<label for="full_name">Nombre Completo *</label>
						<Input
							id="full_name"
							placeholder="Ej. Juan Pérez"
							bind:value={formData.full_name}
							required
						/>
					</div>

					<div class="form-group">
						<label for="email">Correo Electrónico *</label>
						<Input
							id="email"
							type="email"
							placeholder="usuario@ejemplo.com"
							bind:value={formData.email}
							required
						/>
					</div>

					{#if !isEdit}
						<div class="form-group">
							<label for="password">Contraseña *</label>
							<Input
								id="password"
								type="password"
								placeholder="Mínimo 8 caracteres"
								bind:value={formData.password}
								required
								minlength={8}
							/>
						</div>
					{/if}

					<div class="form-group">
						<label for="username">Username (Opcional)</label>
						<Input id="username" placeholder="juanperez" bind:value={formData.username} />
					</div>

					{#if !isEdit}
						<div class="form-group">
							<label for="role">Rol *</label>
							<Select id="role" bind:value={formData.role} required>
								{#each roles as role (role.value)}
									<option value={role.value}>{role.label}</option>
								{/each}
							</Select>
						</div>
					{:else}
						<div class="form-group">
							<label for="role-display">Rol</label>
							<Input id="role-display" value={formData.role} disabled />
						</div>
					{/if}

					<div class="form-group">
						<label for="phone_number">Teléfono (Opcional)</label>
						<Input
							id="phone_number"
							placeholder="+59170012345"
							bind:value={formData.phone_number}
						/>
					</div>

					<div class="form-group">
						<label for="birth_date">Fecha de Nacimiento (Opcional)</label>
						<Input id="birth_date" type="date" bind:value={formData.birth_date} />
					</div>
				</div>

				{#if error}
					<div class="error-message" transition:fade>
						{error}
					</div>
				{/if}

				<div class="modal-footer">
					<Button variant="outline" type="button" onclick={onClose} disabled={loading}>
						Cancelar
					</Button>
					<Button
						variant="primary"
						type="submit"
						disabled={loading}
						style="background-color: {colors.rose};"
					>
						{loading ? 'Procesando...' : isEdit ? 'Actualizar' : 'Crear Usuario'}
					</Button>
				</div>
			</form>
		</div>
	</BlurOverlay>
{/if}

<style>
	.modal-content {
		background: white;
		border-radius: 1rem;
		width: 100%;
		max-width: 600px;
		padding: 2rem;
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
		position: relative;
		margin: 1rem;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
	}

	.close-btn {
		background: none;
		border: none;
		color: #9ca3af;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 0.375rem;
		transition: all 0.2s;
	}

	.close-btn:hover {
		background-color: #f3f4f6;
		color: #4b5563;
	}

	.modal-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.full-width {
		grid-column: span 2;
	}

	label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #4b5563;
	}

	.error-message {
		color: #dc2626;
		font-size: 0.875rem;
		background-color: #fee2e2;
		padding: 0.75rem;
		border-radius: 0.375rem;
		border: 1px solid #fecaca;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 1rem;
	}

	@media (max-width: 640px) {
		.form-grid {
			grid-template-columns: 1fr;
		}
		.full-width {
			grid-column: span 1;
		}
		.modal-content {
			padding: 1.5rem;
			margin: 0.5rem;
		}
	}
</style>
