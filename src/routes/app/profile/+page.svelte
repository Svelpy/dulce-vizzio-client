<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore, currentUser } from '$lib/stores/auth.store';
	import { Button, Input, MainLayout } from '$lib/components/ui';
	import { alert } from '$lib/utils';
	import {
		MailIcon,
		UserIcon,
		PhoneIcon,
		ClockIcon,
		SettingsIcon,
		CakeIcon,
		ChevronsRightIcon
	} from '$lib/icons/outline';
	import { userService } from '$lib/services';
	import { CalendarIcon, CameraIcon, LogoutIcon, ShieldCheckIcon } from '$lib/icons/solid';

	let isEditing = $state(false);
	let isEditingPassword = $state(false);
	let isSubmitting = $state(false);

	let canEdit = $derived($currentUser?.role === 'ADMIN' || $currentUser?.role === 'SUPERADMIN');

	// Avatar
	let isUploadingAvatar = $state(false);
	let avatarPreview = $state<string | null>(null);
	let fileInputEl = $state<HTMLInputElement | null>(null);

	// Form data (Personal Info)
	let formData = $state({
		full_name: '',
		username: '',
		email: '',
		phone_number: '',
		birth_date: ''
	});

	// Form data (Password)
	let passwordData = $state({
		current_password: '',
		new_password: '',
		confirm_password: ''
	});

	onMount(() => {
		resetForm();
	});

	function resetForm() {
		if ($currentUser) {
			formData = {
				full_name: $currentUser.full_name || '',
				username: $currentUser.username || '',
				email: $currentUser.email || '',
				phone_number: $currentUser.phone_number || '',
				birth_date: $currentUser.birth_date
					? new Date($currentUser.birth_date).toISOString().split('T')[0]
					: ''
			};
		}
	}

	async function handleUpdateProfile() {
		if (!$currentUser || !canEdit) return;

		if (!formData.full_name || !formData.username) {
			alert('error', 'Nombre y usuario son requeridos');
			return;
		}

		isSubmitting = true;
		try {
			const updatedUser = await userService.update($currentUser.id, formData);
			authStore.updateUser(updatedUser);
			alert('success', 'Perfil actualizado correctamente');
			isEditing = false;
		} catch (error) {
			console.error('Error updating profile:', error);
			alert('error', 'Error al actualizar el perfil');
		} finally {
			isSubmitting = false;
		}
	}

	async function handleChangePassword() {
		if (passwordData.new_password.length < 8) {
			alert('error', 'La nueva contraseña debe tener al menos 8 caracteres');
			return;
		}
		if (passwordData.new_password !== passwordData.confirm_password) {
			alert('error', 'Las contraseñas no coinciden');
			return;
		}

		isSubmitting = true;
		try {
			await userService.changePassword(passwordData);
			alert('success', 'Contraseña actualizada correctamente');
			passwordData = { current_password: '', new_password: '', confirm_password: '' };
			isEditingPassword = false;
		} catch (error) {
			console.error('Error changing password:', error);
			alert('error', 'Error al cambiar la contraseña. Verifica tu contraseña actual.');
		} finally {
			isSubmitting = false;
		}
	}

	function triggerAvatarUpload() {
		fileInputEl?.click();
	}

	async function handleAvatarChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			alert('error', 'Selecciona una imagen válida');
			return;
		}

		avatarPreview = URL.createObjectURL(file);
		isUploadingAvatar = true;

		try {
			const updatedUser = await userService.updateAvatar(file);
			authStore.updateUser(updatedUser);
			avatarPreview = null;
			alert('success', 'Foto de perfil actualizada');
		} catch (err) {
			console.error('Error updating avatar:', err);
			avatarPreview = null;
			alert('error', 'Error al actualizar la foto');
		} finally {
			isUploadingAvatar = false;
			if (input) input.value = '';
		}
	}

	const formatDate = (date: string | null | undefined) => {
		if (!date) return 'No especificada';
		return new Date(date).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	async function handleLogout() {
		await authStore.logout();
	}
</script>

<MainLayout title="Mi Perfil" description="Gestiona tu información de cuenta">
	<div class="mx-auto flex flex-col gap-8">
		<!-- Header Section -->
		<div class="px-2">
			<h1 class="flex items-center gap-2 text-3xl font-black text-sweet-brown">
				Mi Perfil <span class="animate-bounce">🖐️</span>
			</h1>
			<p class="mt-1 text-sm font-bold text-sweet-brown/40">
				Descubre deliciosos cursos de repostería
			</p>
		</div>

		<!-- ─── Main Content Area (Reading / Inline Editing) ─── -->
		{#if !isEditingPassword}
			<!-- Hero Profile Card (Always visible unless changing password) -->
			<div
				class="relative overflow-hidden rounded-[32px] bg-white p-8 shadow-sweet transition-all duration-300"
			>
				<!-- Subtle Background Decoration -->
				<div
					class="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-sweet-pink-50 opacity-50 blur-3xl"
				></div>

				<div class="relative flex flex-col items-center gap-6 sm:flex-row">
					<!-- Avatar Container -->
					<div class="relative">
						<div
							class="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-sweet-pink-50 shadow-md sm:h-36 sm:w-36"
						>
							{#if avatarPreview || $currentUser?.avatar_url}
								<img
									src={avatarPreview ?? $currentUser?.avatar_url}
									alt={$currentUser?.full_name}
									class="h-full w-full object-cover"
								/>
							{:else}
								<div class="flex h-full w-full items-center justify-center text-sweet-pink-200">
									<UserIcon class="h-16 w-16" />
								</div>
							{/if}

							{#if isUploadingAvatar}
								<div
									class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
								>
									<div
										class="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"
									></div>
								</div>
							{/if}
						</div>

						<!-- Camera Button -->
						<button
							onclick={triggerAvatarUpload}
							disabled={isUploadingAvatar}
							class="absolute right-2 bottom-2 flex h-10 w-10 items-center justify-center rounded-full bg-sweet-pink-400 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
						>
							<CameraIcon class="h-5 w-5" />
						</button>
						<input
							bind:this={fileInputEl}
							type="file"
							accept="image/*"
							class="hidden"
							onchange={handleAvatarChange}
						/>
					</div>

					<!-- User Info Summary -->
					<div class="flex-1 text-center sm:text-left">
						<div class="flex flex-col items-center gap-1 sm:items-start">
							<h2 class="text-2xl font-black text-sweet-brown">
								{$currentUser?.full_name || 'Nombre no definido'}
							</h2>
							<span class="text-sm font-bold text-sweet-brown/40">
								@{$currentUser?.username || 'usuario'}
							</span>
							<div
								class="mt-2 flex items-center gap-2 rounded-full bg-sweet-pink-50 px-4 py-1.5 text-xs font-black text-sweet-pink-500"
							>
								<UserIcon class="h-3.5 w-3.5" />
								{#if $currentUser?.role === 'SUPERADMIN'}
									Super Admin
								{:else}
									{$currentUser?.role === 'ADMIN'
										? 'Administrador'
										: $currentUser?.role === 'MODERATOR'
											? 'Moderador'
											: 'Usuario'}
								{/if}
							</div>

							{#if !isEditing && canEdit}
								<Button
									onclick={() => (isEditing = true)}
									class="sweet-gradient-intense mt-4 h-11 rounded-2xl px-10 text-sm font-black text-white shadow-sweet"
								>
									Editar Perfil
								</Button>
							{/if}
						</div>
					</div>

					<!-- Settings Button -->
					<div class="absolute top-0 right-0">
						<button
							onclick={() => {
								isEditingPassword = true;
								isEditing = false;
							}}
							class="flex h-10 w-10 items-center justify-center rounded-2xl bg-sweet-pink-50 text-sweet-pink-300 transition-colors hover:bg-sweet-pink-100 hover:text-sweet-pink-500"
						>
							<SettingsIcon class="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>

			<!-- Account Details Card (With Inline Editing) -->
			<div class="flex flex-col gap-6 px-1">
				<div class="flex items-center gap-2">
					<div class="h-1.5 w-1.5 rounded-full bg-sweet-pink-300"></div>
					<h3 class="text-lg font-black text-sweet-brown">Información de la cuenta</h3>
					<div class="h-1.5 w-1.5 rounded-full bg-sweet-pink-300"></div>
				</div>

				<div class="divide-y divide-sweet-pink-50 rounded-[32px] bg-white p-2 shadow-sweet">
					<!-- Full Name Row -->
					<div class="flex min-h-[72px] items-center justify-between gap-4 p-4 px-6">
						<div class="flex flex-1 items-center gap-4">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sweet-pink-50"
							>
								<UserIcon class="h-5 w-5 text-sweet-pink-400" />
							</div>
							<span class="text-sm font-bold text-sweet-brown/60">Nombre completo</span>
						</div>
						<div class="flex-1 text-right">
							{#if isEditing}
								<Input
									bind:value={formData.full_name}
									class="h-10 border-sweet-pink-100 bg-sweet-pink-50/20 text-right font-bold"
								/>
							{:else}
								<span class="text-sm font-black text-sweet-brown">{$currentUser?.full_name}</span>
							{/if}
						</div>
					</div>

					<!-- Username Row -->
					<div class="flex min-h-[72px] items-center justify-between gap-4 p-4 px-6">
						<div class="flex flex-1 items-center gap-4">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sweet-pink-50"
							>
								<CakeIcon class="h-5 w-5 text-sweet-pink-400" />
							</div>
							<span class="text-sm font-bold text-sweet-brown/60">Nombre de usuario</span>
						</div>
						<div class="flex-1 text-right">
							{#if isEditing}
								<Input
									bind:value={formData.username}
									class="h-10 border-sweet-pink-100 bg-sweet-pink-50/20 text-right font-bold"
								/>
							{:else}
								<span class="text-sm font-black text-sweet-brown">@{$currentUser?.username}</span>
							{/if}
						</div>
					</div>

					<!-- Birth Date Row -->
					<div class="flex min-h-[72px] items-center justify-between gap-4 p-4 px-6">
						<div class="flex flex-1 items-center gap-4">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sweet-pink-50"
							>
								<CalendarIcon class="h-5 w-5 text-sweet-pink-400" />
							</div>
							<span class="text-sm font-bold text-sweet-brown/60">Fecha de nacimiento</span>
						</div>
						<div class="flex-1 text-right">
							{#if isEditing}
								<Input
									type="date"
									bind:value={formData.birth_date}
									class="h-10 border-sweet-pink-100 bg-sweet-pink-50/20 text-right font-bold"
								/>
							{:else}
								<div
									class="flex items-center justify-end gap-1 text-sm font-black text-sweet-brown"
								>
									{formatDate($currentUser?.birth_date)}
									<ChevronsRightIcon class="h-4 w-4" />
								</div>
							{/if}
						</div>
					</div>

					<!-- Email Row -->
					<div class="flex min-h-[72px] items-center justify-between gap-4 p-4 px-6">
						<div class="flex flex-1 items-center gap-4">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sweet-pink-50"
							>
								<MailIcon class="h-5 w-5 text-sweet-pink-400" />
							</div>
							<span class="text-sm font-bold text-sweet-brown/60">Correo electrónico</span>
						</div>
						<div class="flex-1 text-right">
							{#if isEditing}
								<Input
									type="email"
									bind:value={formData.email}
									class="h-10 border-sweet-pink-100 bg-sweet-pink-50/20 text-right font-bold"
								/>
							{:else}
								<div
									class="flex items-center justify-end gap-1 text-sm font-black text-sweet-brown"
								>
									{$currentUser?.email}
									<ChevronsRightIcon class="h-4 w-4" />
								</div>
							{/if}
						</div>
					</div>

					<!-- Phone Row -->
					<div class="flex min-h-[72px] items-center justify-between gap-4 p-4 px-6">
						<div class="flex flex-1 items-center gap-4">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sweet-pink-50"
							>
								<PhoneIcon class="h-5 w-5 text-sweet-pink-400" />
							</div>
							<span class="text-sm font-bold text-sweet-brown/60">Número de teléfono</span>
						</div>
						<div class="flex-1 text-right">
							{#if isEditing}
								<Input
									type="tel"
									bind:value={formData.phone_number}
									class="h-10 border-sweet-pink-100 bg-sweet-pink-50/20 text-right font-bold"
								/>
							{:else}
								<div
									class="flex items-center justify-end gap-1 text-sm font-black text-sweet-brown"
								>
									{$currentUser?.phone_number || 'No especificado'}
									<ChevronsRightIcon class="h-4 w-4" />
								</div>
							{/if}
						</div>
					</div>

					<!-- Registration Date (Read Only) Row -->
					<div class="flex min-h-[72px] items-center justify-between gap-4 p-4 px-6">
						<div class="flex flex-1 items-center gap-4">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sweet-pink-50"
							>
								<ClockIcon class="h-5 w-5 text-sweet-pink-400" />
							</div>
							<span class="text-sm font-bold text-sweet-brown/60">Fecha de registro</span>
						</div>
						<div class="flex items-center justify-end gap-1 text-sm font-black text-sweet-brown">
							{formatDate($currentUser?.created_at)}
							<ChevronsRightIcon class="h-4 w-4" />
						</div>
					</div>

					{#if isEditing}
						<!-- Inline Editor Actions -->
						<div class="flex items-center gap-3 p-6 px-6">
							<Button
								variant="outline"
								onclick={() => {
									isEditing = false;
									resetForm();
								}}
								class="h-11 flex-1 rounded-2xl border-2 border-sweet-pink-100 font-black text-sweet-pink-400 hover:bg-sweet-pink-50"
							>
								Cancelar
							</Button>
							<Button
								onclick={handleUpdateProfile}
								disabled={isSubmitting}
								loading={isSubmitting}
								class="sweet-gradient-intense h-11 flex-1 rounded-2xl font-black text-white shadow-md active:scale-95"
							>
								Guardar
							</Button>
						</div>
					{:else}
						<!-- Footer status -->
						<div class="flex items-center justify-center p-4">
							<div class="flex items-center gap-2 text-xs font-bold text-sweet-brown/30">
								<ClockIcon class="h-3 w-3" />
								<span>Perfil verificado y activo</span>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Logout Button -->
			<div class="mt-4 flex flex-col gap-4">
				<Button onclick={handleLogout} class="mx-auto">
					{#snippet leftIcon()}
						<LogoutIcon class="h-6 w-6" />
					{/snippet}
					Cerrar Sesión
				</Button>
			</div>
		{:else}
			<!-- ─── Edit Password Mode (Separate Block) ─── -->
			<div class="rounded-[32px] bg-white p-8 shadow-sweet">
				<div class="mb-2 flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-sweet-pink-50">
						<ShieldCheckIcon class="h-6 w-6 text-sweet-pink-400" />
					</div>
					<h2 class="text-xl font-black text-sweet-brown">Seguridad</h2>
				</div>
				<p class="mb-8 text-sm font-bold text-sweet-brown/40">
					Actualiza tu contraseña para mantener tu cuenta segura.
				</p>

				<div class="flex flex-col gap-6">
					<div class="space-y-4">
						<div class="flex flex-col gap-1.5">
							<!-- svelte-ignore a11y_label_has_associated_control -->
							<label class="px-1 text-xs font-black text-sweet-brown/40">Contraseña Actual</label>
							<Input
								type="password"
								bind:value={passwordData.current_password}
								placeholder="Tu contraseña actual"
								class="h-14 rounded-2xl border-none bg-sweet-pink-50/50 px-6 font-bold focus:ring-sweet-pink-200"
							/>
						</div>

						<div class="flex flex-col gap-1.5">
							<!-- svelte-ignore a11y_label_has_associated_control -->
							<label class="px-1 text-xs font-black text-sweet-brown/40">Nueva Contraseña</label>
							<Input
								type="password"
								bind:value={passwordData.new_password}
								placeholder="Mínimo 8 caracteres"
								class="h-14 rounded-2xl border-none bg-sweet-pink-50/50 px-6 font-bold focus:ring-sweet-pink-200"
							/>
						</div>

						<div class="flex flex-col gap-1.5">
							<!-- svelte-ignore a11y_label_has_associated_control -->
							<label class="px-1 text-xs font-black text-sweet-brown/40">Confirmar Contraseña</label
							>
							<Input
								type="password"
								bind:value={passwordData.confirm_password}
								placeholder="Repite tu nueva contraseña"
								class="h-14 rounded-2xl border-none bg-sweet-pink-50/50 px-6 font-bold focus:ring-sweet-pink-200"
							/>
						</div>
					</div>

					<div class="mt-4 flex flex-col gap-3 sm:flex-row">
						<Button
							variant="outline"
							onclick={() => (isEditingPassword = false)}
							class="h-12 flex-1 rounded-2xl border-2 border-sweet-pink-100 font-black text-sweet-pink-400 hover:bg-sweet-pink-50"
						>
							Cancelar
						</Button>
						<Button
							onclick={handleChangePassword}
							disabled={isSubmitting}
							loading={isSubmitting}
							class="sweet-gradient-intense h-12 flex-1 rounded-2xl font-black text-white shadow-md active:scale-95"
						>
							Actualizar Contraseña
						</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</MainLayout>
