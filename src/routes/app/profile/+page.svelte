<script lang="ts">
	import { onMount } from 'svelte';
	import { AuthService } from '$lib/services';
	import { Button, Input } from '$lib/components/ui';
	import { UserIcon, MailIcon, KeyIcon } from '$lib/icons/outline';
	import type { User } from '$lib/interfaces';

	let user: User | null = $state(null);
	let loading = $state(true);

	// Form data
	let fullName = $state('');
	let username = $state('');
	let email = $state('');
	let phoneNumber = $state('');
	let birthDate = $state('');

	// Password change
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	const colors = {
		cream: '#f4e9c4',
		taupe: '#a78d70',
		rose: '#ce7576',
		grey: '#cccccc',
		gold: '#b58b3a'
	};

	onMount(() => {
		// Get user from localStorage (client-side only)
		user = AuthService.getUser();
		if (user) {
			fullName = user.full_name || '';
			username = user.username || '';
			email = user.email || '';
			phoneNumber = user.phone_number || '';
			birthDate = user.birth_date || '';
		}
		loading = false;
	});

	const handleUpdateProfile = async () => {
		// TODO: Implement profile update
		console.log('Update profile:', { fullName, username, email, phoneNumber, birthDate });
	};

	const handleChangePassword = async () => {
		if (newPassword !== confirmPassword) {
			alert('Las contraseñas no coinciden');
			return;
		}
		// TODO: Implement password change
		console.log('Change password');
	};
</script>

<div class="profile-page">
	<!-- Header -->
	<div class="page-header">
		<h1 class="page-title" style="color: {colors.taupe};">Mi Perfil</h1>
	</div>

	{#if loading}
		<div class="loading-container">
			<div class="spinner"></div>
			<p style="color: {colors.taupe};">Cargando perfil...</p>
		</div>
	{:else if user}
		<div class="profile-grid">
			<!-- Profile Info Card -->
			<div class="profile-card">
				<div
					class="card-header"
					style="background: linear-gradient(135deg, {colors.rose}, {colors.gold});"
				>
					<div class="avatar-container">
						{#if user.avatar_url}
							<img src={user.avatar_url} alt={user.full_name} class="avatar" />
						{:else}
							<div
								class="avatar-placeholder"
								style="background-color: {colors.cream}; color: {colors.taupe};"
							>
								{user.full_name?.charAt(0) || 'U'}
							</div>
						{/if}
					</div>
					<h2 class="user-name">{user.full_name}</h2>
					<p class="user-role" style="color: {colors.cream};">@{user.username}</p>
					<span class="role-badge" style="background-color: {colors.gold};">
						{user.role}
					</span>
				</div>

				<div class="card-body">
					<div class="info-row">
						<MailIcon class="info-icon" />
						<span>{user.email}</span>
					</div>
					{#if user.phone_number}
						<div class="info-row">
							<span style="color: {colors.taupe};">📱</span>
							<span>{user.phone_number}</span>
						</div>
					{/if}
					{#if user.birth_date}
						<div class="info-row">
							<span style="color: {colors.taupe};">🎂</span>
							<span>{new Date(user.birth_date).toLocaleDateString()}</span>
						</div>
					{/if}
					<div class="info-row">
						<span style="color: {colors.taupe};">📅</span>
						<span>Miembro desde {new Date(user.created_at).toLocaleDateString()}</span>
					</div>
				</div>
			</div>

			<!-- Edit Profile Form -->
			<div class="form-card">
				<h3 class="form-title" style="color: {colors.taupe};">Editar Información</h3>
				<form
					class="profile-form"
					onsubmit={(e) => {
						e.preventDefault();
						handleUpdateProfile();
					}}
				>
					<div class="form-group">
						<label for="fullName">Nombre Completo</label>
						<Input id="fullName" bind:value={fullName} placeholder="Tu nombre completo">
							{#snippet leftIcon()}
								<UserIcon class="h-4 w-4" />
							{/snippet}
						</Input>
					</div>

					<div class="form-group">
						<label for="username">Nombre de Usuario</label>
						<Input id="username" bind:value={username} placeholder="Tu nombre de usuario" />
					</div>

					<div class="form-group">
						<label for="email">Correo Electrónico</label>
						<Input id="email" type="email" bind:value={email} placeholder="tu@email.com">
							{#snippet leftIcon()}
								<MailIcon class="h-4 w-4" />
							{/snippet}
						</Input>
					</div>

					<div class="form-group">
						<label for="phone">Teléfono</label>
						<Input id="phone" type="tel" bind:value={phoneNumber} placeholder="+1234567890" />
					</div>

					<div class="form-group">
						<label for="birthDate">Fecha de Nacimiento</label>
						<Input id="birthDate" type="date" bind:value={birthDate} />
					</div>

					<Button
						type="submit"
						variant="primary"
						fullWidth
						style="background-color: {colors.rose};"
					>
						Guardar Cambios
					</Button>
				</form>
			</div>

			<!-- Change Password Form -->
			<div class="form-card">
				<h3 class="form-title" style="color: {colors.taupe};">Cambiar Contraseña</h3>
				<form
					class="profile-form"
					onsubmit={(e) => {
						e.preventDefault();
						handleChangePassword();
					}}
				>
					<div class="form-group">
						<label for="currentPassword">Contraseña Actual</label>
						<Input
							id="currentPassword"
							type="password"
							bind:value={currentPassword}
							placeholder="••••••••"
							icon={KeyIcon}
						/>
					</div>

					<div class="form-group">
						<label for="newPassword">Nueva Contraseña</label>
						<Input id="newPassword" type="password" bind:value={newPassword} placeholder="••••••••">
							{#snippet leftIcon()}
								<KeyIcon class="h-4 w-4" />
							{/snippet}
						</Input>
					</div>

					<div class="form-group">
						<label for="confirmPassword">Confirmar Contraseña</label>
						<Input
							id="confirmPassword"
							type="password"
							bind:value={confirmPassword}
							placeholder="••••••••"
						>
							{#snippet leftIcon()}
								<KeyIcon class="h-4 w-4" />
							{/snippet}
						</Input>
					</div>

					<Button
						type="submit"
						variant="outline"
						fullWidth
						style="border-color: {colors.taupe}; color: {colors.taupe};"
					>
						Cambiar Contraseña
					</Button>
				</form>
			</div>
		</div>
	{:else}
		<div class="error-container" style="background-color: {colors.rose};">
			<p>No se pudo cargar la información del perfil</p>
		</div>
	{/if}
</div>

<style>
	.profile-page {
		padding: 1.5rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.page-title {
		font-size: 2rem;
		font-weight: 700;
		margin: 0;
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		gap: 1rem;
	}

	.spinner {
		width: 3rem;
		height: 3rem;
		border: 4px solid #f3f4f6;
		border-top-color: #a78d70;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.profile-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	@media (min-width: 1024px) {
		.profile-grid {
			grid-template-columns: 350px 1fr;
		}
	}

	.profile-card {
		background: white;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		height: fit-content;
	}

	.card-header {
		padding: 2rem;
		text-align: center;
		color: white;
	}

	.avatar-container {
		margin-bottom: 1rem;
		display: flex;
		justify-content: center;
	}

	.avatar {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		object-fit: cover;
		border: 4px solid white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.avatar-placeholder {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3rem;
		font-weight: 700;
		border: 4px solid white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.user-name {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
	}

	.user-role {
		font-size: 0.875rem;
		margin: 0 0 1rem 0;
		opacity: 0.9;
	}

	.role-badge {
		display: inline-block;
		padding: 0.375rem 1rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		color: white;
	}

	.card-body {
		padding: 1.5rem;
	}

	.info-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 0;
		border-bottom: 1px solid #f3f4f6;
		color: #4b5563;
	}

	.info-row:last-child {
		border-bottom: none;
	}

	.info-icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	.form-card {
		background: white;
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		height: fit-content;
	}

	.form-title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0 0 1.5rem 0;
	}

	.profile-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #4b5563;
	}

	.error-container {
		padding: 1rem;
		border-radius: 0.5rem;
		color: white;
		text-align: center;
	}

	@media (max-width: 768px) {
		.profile-page {
			padding: 1rem;
		}

		.page-title {
			font-size: 1.5rem;
		}
	}
</style>
