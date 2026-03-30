<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore, currentUser } from '$lib/stores/auth.store';
	import { Button, Input, MainLayout } from '$lib/components/ui';
	//import { UserService } from '$lib/services';
	import { alert } from '$lib/utils';
	import { MailIcon, UserIcon, CheckIcon, ClockIcon, PhoneIcon } from '$lib/icons/outline';
	import { CalendarIcon, LockIcon, CameraIcon, ShieldIcon } from '$lib/icons/solid';
	import { userService } from '$lib/services';

	let isEditing = $state(false);
	let isEditingPassword = $state(false);
	let isSubmitting = $state(false);

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
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
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
		if (!$currentUser) return;

		// Basic validation
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
		if (!passwordData.currentPassword) {
			alert('error', 'Ingresa tu contraseña actual');
			return;
		}
		if (passwordData.newPassword.length < 6) {
			alert('error', 'La contraseña debe tener al menos 6 caracteres');
			return;
		}
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			alert('error', 'Las contraseñas no coinciden');
			return;
		}

		isSubmitting = true;
		try {
			// Assuming resetPassword or similar update password method
			await userService.resetPassword($currentUser!.id, passwordData.newPassword);
			alert('success', 'Contraseña actualizada correctamente');
			passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
			isEditingPassword = false;
		} catch (error) {
			console.error('Error changing password:', error);
			alert('error', 'Error al cambiar la contraseña');
		} finally {
			isSubmitting = false;
		}
	}

	function cancelEdit() {
		resetForm();
		isEditing = false;
	}

	function triggerAvatarUpload() {
		fileInputEl?.click();
	}

	async function handleAvatarChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			alert('error', 'Por favor selecciona una imagen válida');
			return;
		}

		// Validate max size: 5MB
		if (file.size > 5 * 1024 * 1024) {
			alert('error', 'La imagen no puede superar los 5MB');
			return;
		}

		// Preview locally while uploading
		avatarPreview = URL.createObjectURL(file);

		isUploadingAvatar = true;
		try {
			const updatedUser = await userService.updateAvatar(file);
			authStore.updateUser(updatedUser);
			avatarPreview = null; // Use the server URL now
			alert('success', 'Foto de perfil actualizada correctamente');
		} catch (err) {
			console.error('Error updating avatar:', err);
			avatarPreview = null;
			alert('error', 'Error al actualizar la foto de perfil');
		} finally {
			isUploadingAvatar = false;
			// Reset input so the same file can be re-selected if needed
			if (input) input.value = '';
		}
	}

	const formatDate = (date: string) => {
		if (!date) return 'No especificada';
		// Prevenir errores de parseo con UTC para consistencia
		const d = new Date(date);
		return d.toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
</script>

<MainLayout
	title="Mi Perfil"
	description="Gestiona tu información personal y seguridad"
	class=" container mx-auto"
>
	<div class="mx-auto my-4 flex w-full max-w-[1200px] flex-col gap-6 px-2 sm:px-6">
		<!-- ─── Header Area ─── -->
		<div
			class="flex flex-col items-center gap-6 bg-transparent py-4 sm:flex-row sm:justify-between sm:gap-8"
		>
			<div class="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
				<!-- Avatar -->
				<div
					class="relative flex h-32 w-32 shrink-0 overflow-hidden rounded-full border border-stone-200/50 bg-stone-100 sm:h-[110px] sm:w-[110px] dark:border-stone-700 dark:bg-stone-800"
				>
					{#if avatarPreview || $currentUser?.avatar_url}
						<img
							src={avatarPreview ?? $currentUser?.avatar_url}
							alt={$currentUser?.full_name}
							class="h-full w-full object-cover"
						/>
					{:else}
						<div
							class="flex h-full w-full items-center justify-center bg-[#EFD68B] text-[40px] font-medium text-stone-800"
						>
							{$currentUser?.full_name?.substring(0, 2).toUpperCase() || 'U'}
						</div>
					{/if}

					{#if isUploadingAvatar}
						<div
							class="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
						>
							<div
								class="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white"
							></div>
						</div>
					{/if}
				</div>

				<!-- Hidden file input -->
				<input
					bind:this={fileInputEl}
					type="file"
					accept="image/*"
					class="hidden"
					onchange={handleAvatarChange}
				/>

				<!-- Info Details -->
				<div class="flex flex-col items-center text-center sm:items-start sm:text-left">
					<div class="flex items-center gap-3">
						<h1 class="text-[28px] font-medium tracking-tight text-stone-900 dark:text-white">
							{$currentUser?.full_name}
						</h1>
						<button
							class="mt-1 flex size-6 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800"
							onclick={triggerAvatarUpload}
							title="Cambiar foto de perfil"
							disabled={isUploadingAvatar}
						>
							<CameraIcon class="size-3.5" />
						</button>
					</div>
					<div
						class="mt-1 flex flex-wrap items-center justify-center gap-4 text-[13px] text-stone-500 sm:justify-start"
					>
						<div class="flex items-center gap-1.5">
							<ClockIcon class="size-3.5" />
							<span>Miembro desde {formatDate($currentUser?.created_at || '')}</span>
						</div>
						<div class="flex items-center gap-1.5">
							<MailIcon class="size-3.5" />
							<span>{$currentUser?.email}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Quick Actions -->
			<div class="mt-2 flex shrink-0 items-center gap-2.5 sm:mt-0">
				<Button
					class="h-[32px] rounded-[4px] border-none bg-[#5361D4] px-3 text-[13px] font-medium text-white shadow-none hover:bg-[#4652B6]"
					onclick={() => (isEditing = true)}
				>
					Editar perfil
				</Button>
			</div>
		</div>

		<!-- ─── Main Grid Layout ─── -->
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
			<!-- ══ Lado Izquierdo (Ancho) ══ -->
			<div class="flex flex-col gap-6 lg:col-span-8">
				<!-- Tarjeta Principal: Información Personal -->
				<div
					class="flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900"
				>
					<!-- Header -->
					<div
						class="flex items-center justify-between border-b border-stone-100 px-6 py-4 dark:border-stone-800"
					>
						<h2
							class="flex items-center gap-2 text-base font-semibold text-stone-900 dark:text-white"
						>
							Información Personal <LockIcon class="size-3 text-stone-400" />
						</h2>
						<!-- {#if !isEditing}
							<Button
								variant="outline"
								class="h-[28px] rounded-[4px] border-stone-200 bg-white px-3 text-[12px] font-medium"
								onclick={() => (isEditing = true)}
							>
								Ver todo
							</Button>
						{/if} -->
					</div>

					<!-- Form / View Content -->
					<div class="p-6">
						{#if isEditing}
							<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<!-- Inputs -->
								<div class="flex flex-col gap-1.5">
									<!-- svelte-ignore a11y_label_has_associated_control -->
									<label class="text-[12px] font-semibold text-stone-600 dark:text-stone-400"
										>Nombre Completo</label
									>
									<Input
										bind:value={formData.full_name}
										placeholder="Nombre completo"
										icon={UserIcon}
										class="h-[36px] rounded-[4px] text-sm"
									/>
								</div>
								<div class="flex flex-col gap-1.5">
									<!-- svelte-ignore a11y_label_has_associated_control -->
									<label class="text-[12px] font-semibold text-stone-600 dark:text-stone-400"
										>Usuario</label
									>
									<Input
										bind:value={formData.username}
										placeholder="Nombre de usuario"
										icon={UserIcon}
										class="h-[36px] rounded-[4px] text-sm"
									/>
								</div>
								<div class="flex flex-col gap-1.5">
									<!-- svelte-ignore a11y_label_has_associated_control -->
									<label class="text-[12px] font-semibold text-stone-600 dark:text-stone-400"
										>Correo Electrónico</label
									>
									<Input
										bind:value={formData.email}
										type="email"
										placeholder="correo@ejemplo.com"
										icon={MailIcon}
										class="h-[36px] rounded-[4px] text-sm"
									/>
								</div>
								<div class="flex flex-col gap-1.5">
									<!-- svelte-ignore a11y_label_has_associated_control -->
									<label class="text-[12px] font-semibold text-stone-600 dark:text-stone-400"
										>Teléfono</label
									>
									<Input
										bind:value={formData.phone_number}
										type="tel"
										placeholder="+..."
										icon={PhoneIcon}
										class="h-[36px] rounded-[4px] text-sm"
									/>
								</div>
								<div class="col-span-1 flex flex-col gap-1.5 sm:col-span-2">
									<!-- svelte-ignore a11y_label_has_associated_control -->
									<label class="text-[12px] font-semibold text-stone-600 dark:text-stone-400"
										>Fecha de Nacimiento</label
									>
									<Input
										bind:value={formData.birth_date}
										type="date"
										icon={CalendarIcon}
										class="h-[36px] rounded-[4px] text-sm"
									/>
								</div>
							</div>

							<!-- Acciones Form -->
							<div
								class="mt-8 flex justify-end gap-3 border-t border-stone-100 pt-5 dark:border-stone-800"
							>
								<Button
									variant="outline"
									class="h-[32px] rounded-[4px] px-4 text-[13px] font-medium"
									onclick={cancelEdit}
									disabled={isSubmitting}
								>
									Cancelar
								</Button>
								<Button
									class="h-[32px] rounded-[4px] bg-stone-900 px-4 text-[13px] font-medium text-white hover:bg-stone-800"
									onclick={handleUpdateProfile}
									disabled={isSubmitting}
									loading={isSubmitting}
								>
									Guardar Cambios
								</Button>
							</div>
						{:else}
							<!-- Vista Modo Lista Estilo "My Tasks" -->
							<div class="flex flex-col">
								<!-- Info Row -->
								<div
									class="flex items-center justify-between border-b border-stone-100 py-3 dark:border-stone-800/60"
								>
									<div class="flex items-center gap-3">
										<span class="text-[13px] font-medium text-stone-800 dark:text-stone-200"
											>{$currentUser?.full_name || 'No especificado'}</span
										>
									</div>
									<div
										class="rounded-full border border-stone-200/50 bg-stone-100/80 px-2.5 py-0.5 text-[11px] font-medium text-stone-500 dark:border-stone-700/50 dark:bg-stone-800"
									>
										Nombre Completo
									</div>
								</div>

								<div
									class="flex items-center justify-between border-b border-stone-100 py-3 dark:border-stone-800/60"
								>
									<div class="flex items-center gap-3">
										<span class="text-[13px] font-medium text-stone-800 dark:text-stone-200"
											>{$currentUser?.username || 'No especificado'}</span
										>
									</div>
									<div
										class="rounded-full border border-stone-200/50 bg-stone-100/80 px-2.5 py-0.5 text-[11px] font-medium text-stone-500 dark:border-stone-700/50 dark:bg-stone-800"
									>
										Usuario
									</div>
								</div>

								<div
									class="flex items-center justify-between border-b border-stone-100 py-3 dark:border-stone-800/60"
								>
									<div class="flex items-center gap-3">
										<span class="text-[13px] font-medium text-stone-800 dark:text-stone-200"
											>{$currentUser?.email || 'No especificado'}</span
										>
									</div>
									<div
										class="rounded-full border border-stone-200/50 bg-stone-100/80 px-2.5 py-0.5 text-[11px] font-medium text-stone-500 dark:border-stone-700/50 dark:bg-stone-800"
									>
										Correo
									</div>
								</div>

								<div
									class="flex items-center justify-between border-b border-stone-100 py-3 dark:border-stone-800/60"
								>
									<div class="flex items-center gap-3">
										<span class="text-[13px] font-medium text-stone-800 dark:text-stone-200"
											>{$currentUser?.phone_number || 'No especificado'}</span
										>
									</div>
									<div
										class="rounded-full border-[#A8D7C2] bg-[#E7F3ED] bg-stone-100/80 px-2.5 py-0.5 text-[11px] font-medium text-[#468C6A]"
									>
										Teléfono
									</div>
								</div>

								<div class="flex items-center justify-between py-3">
									<div class="flex items-center gap-3">
										<span class="text-[13px] font-medium text-stone-800 dark:text-stone-200"
											>{$currentUser?.birth_date
												? formatDate($currentUser?.birth_date)
												: 'No especificada'}</span
										>
									</div>
									<div
										class="rounded-full border border-stone-200/50 bg-stone-100/80 px-2.5 py-0.5 text-[11px] font-medium text-stone-500 dark:border-stone-700/50 dark:bg-stone-800"
									>
										Nacimiento
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Tarjeta Secundaria: Cambiar Contraseña -->
				<div
					class="mt-2 flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900"
				>
					<div
						class="flex items-center justify-between border-b border-stone-100 px-6 py-4 dark:border-stone-800"
					>
						<h2 class="text-base font-semibold text-stone-900 dark:text-white">
							Seguridad de la Cuenta
						</h2>
					</div>
					<div class="p-6">
						{#if !isEditingPassword}
							<div
								class="flex flex-col gap-4 rounded-lg border border-stone-100 bg-stone-50/50 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-800/20"
							>
								<div class="flex flex-col gap-1.5">
									<div class="flex items-center gap-2">
										<LockIcon class="size-4 text-stone-400" />
										<span class="text-[14px] font-semibold text-stone-800 dark:text-stone-200"
											>Contraseña de acceso</span
										>
									</div>
									<span class="pl-6 text-[13px] text-stone-500 dark:text-stone-400">
										Es recomendable usar una contraseña fuerte y única para proteger tu cuenta.
									</span>
								</div>
								<Button
									variant="outline"
									class="ml-6 h-[32px] shrink-0 rounded-[4px] border-stone-200 bg-white px-4 text-[13px] font-medium transition-colors hover:bg-stone-50 sm:ml-0 dark:border-stone-700 dark:bg-stone-900 dark:hover:bg-stone-800"
									onclick={() => (isEditingPassword = true)}
								>
									Cambiar contraseña
								</Button>
							</div>
						{:else}
							<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
								<div class="flex flex-col gap-4">
									<div class="flex flex-col gap-1.5">
										<!-- svelte-ignore a11y_label_has_associated_control -->
										<label class="text-[12px] font-semibold text-stone-600 dark:text-stone-400"
											>Contraseña Actual</label
										>
										<Input
											type="password"
											bind:value={passwordData.currentPassword}
											placeholder="••••••••"
											class="h-[36px] rounded-[4px] text-sm"
										/>
									</div>
									<div class="flex flex-col gap-1.5">
										<!-- svelte-ignore a11y_label_has_associated_control -->
										<label class="text-[12px] font-semibold text-stone-600 dark:text-stone-400"
											>Nueva Contraseña</label
										>
										<Input
											type="password"
											bind:value={passwordData.newPassword}
											placeholder="Mínimo 6 caracteres"
											class="h-[36px] rounded-[4px] text-sm"
										/>
									</div>
									<div class="flex flex-col gap-1.5">
										<!-- svelte-ignore a11y_label_has_associated_control -->
										<label class="text-[12px] font-semibold text-stone-600 dark:text-stone-400"
											>Confirmar Contraseña</label
										>
										<Input
											type="password"
											bind:value={passwordData.confirmPassword}
											placeholder="Repite la contraseña"
											class="h-[36px] rounded-[4px] text-sm"
										/>
									</div>

									<div class="mt-4 flex flex-col-reverse justify-end gap-3 sm:flex-row">
										<Button
											variant="outline"
											class="h-[32px] w-full rounded-[4px] px-4 text-[13px] font-medium sm:w-auto"
											onclick={() => {
												isEditingPassword = false;
												passwordData = {
													currentPassword: '',
													newPassword: '',
													confirmPassword: ''
												};
											}}
											disabled={isSubmitting}
										>
											Cancelar
										</Button>
										<Button
											class="h-[32px] w-full rounded-[4px] bg-stone-900 px-4 text-[13px] font-medium text-white hover:bg-stone-800 sm:w-auto dark:bg-white dark:text-stone-900"
											onclick={handleChangePassword}
											disabled={isSubmitting}
											loading={isSubmitting}
										>
											Actualizar Contraseña
										</Button>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- ══ Lado Derecho (Estrecho) ══ -->
			<div class="flex flex-col gap-6 lg:col-span-4 lg:mt-0">
				<!-- Tarjeta About Me -->
				<div
					class="flex flex-col rounded-lg border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900"
				>
					<h3 class="mb-3 text-base font-semibold text-stone-900 dark:text-white">
						Información de Cuenta
					</h3>
					<p class="mb-5 text-[13px] leading-relaxed text-stone-500 dark:text-stone-400">
						Detalles administrativos de tu perfil como nivel de permisos y estado actual de uso.
					</p>

					<div class="flex flex-col gap-4">
						<div
							class="flex items-center justify-between border-t border-stone-100 pt-4 dark:border-stone-800/60"
						>
							<span class="text-[13px] text-stone-600 dark:text-stone-300">Estado</span>
							<div class="flex flex-wrap items-center gap-1.5">
								<div class="h-1.5 w-1.5 rounded-full bg-green-500"></div>
								<span class="text-[12px] font-medium text-stone-700 dark:text-stone-200"
									>Activo</span
								>
							</div>
						</div>

						<div
							class="flex items-center justify-between border-t border-stone-100 pt-4 dark:border-stone-800/60"
						>
							<span class="text-[13px] text-stone-600 dark:text-stone-300">Rol asignado</span>
							<span
								class="rounded border border-stone-200 bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-600 uppercase dark:border-stone-700 dark:bg-stone-800"
							>
								{$currentUser?.role}
							</span>
						</div>

						<div
							class="flex items-center justify-between border-t border-stone-100 pt-4 dark:border-stone-800/60"
						>
							<span class="text-[13px] text-stone-600 dark:text-stone-300">Verificación</span>
							<div class="flex flex-wrap items-center gap-1.5">
								<div class="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
								<span class="text-[12px] font-medium text-stone-700 dark:text-stone-200"
									>Verificado</span
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</MainLayout>
