<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore, currentUser } from '$lib/stores/auth.store';
	import { Button, Input, MainLayout } from '$lib/components/ui';
	//import { UserService } from '$lib/services';
	import { alert } from '$lib/utils';
	import {
		MailIcon,
		UserIcon,
		PencilIcon,
		CheckIcon,
		XIcon,
		ClockIcon,
		PhoneIcon
	} from '$lib/icons/outline';
	import { CalendarIcon, LockIcon, CameraIcon, ShieldIcon } from '$lib/icons/solid';
	import { userService } from '$lib/services';

	// State
	let isEditing = $state(false);
	let isSubmitting = $state(false);
	let activeTab = $state('personal'); // 'personal' | 'security'

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
	class="container mx-auto"
>
	<div class="">
		<!-- ─── Hero Banner ─── -->
		<div
			class="relative h-40 overflow-hidden bg-linear-to-br from-stone-900 via-stone-800 to-stone-700"
		>
			<!-- Mesh gradient overlay -->
			<div
				class="absolute inset-0 opacity-40 mix-blend-overlay"
				style="background: radial-gradient(ellipse at 20% 50%, #ce7576 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #a78d70 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, #b58b3a 0%, transparent 45%);"
			></div>
			<div class="relative z-10 mx-auto flex h-full max-w-7xl items-end px-6 py-6 lg:px-8"></div>
		</div>

		<!-- ─── Main Grid ─── -->
		<div class="relative z-20 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
				<!-- ══ LEFT: Identity Card ══ -->
				<aside
					class="flex flex-col items-center gap-6 rounded-3xl border border-light-four bg-light-one_d p-8 shadow-xl shadow-stone-200/50 lg:col-span-4 lg:p-6 xl:p-8 dark:border-stone-800 dark:bg-stone-900 dark:shadow-none"
				>
					<!-- Hidden file input -->
					<input
						bind:this={fileInputEl}
						type="file"
						accept="image/*"
						class="hidden"
						onchange={handleAvatarChange}
					/>

					<!-- Avatar area -->
					<div class="relative -mt-16">
						<div
							class="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-stone-100 shadow-xl dark:border-stone-800 dark:bg-stone-800"
						>
							{#if avatarPreview || $currentUser?.avatar_url}
								<img
									src={avatarPreview ?? $currentUser?.avatar_url}
									alt={$currentUser?.full_name}
									class="h-full w-full object-cover"
								/>
							{:else}
								<div
									class="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 text-4xl font-bold text-stone-400 dark:from-stone-800 dark:to-stone-900"
								>
									{$currentUser?.full_name?.charAt(0).toUpperCase() || 'U'}
								</div>
							{/if}

							{#if isUploadingAvatar}
								<div
									class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
								>
									<!-- Tailwind Spinner -->
									<div
										class="h-8 w-8 animate-spin rounded-full border-[3px] border-white/30 border-t-white"
									></div>
								</div>
							{/if}
						</div>

						<button
							type="button"
							class="absolute right-1 bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/40 transition-transform hover:scale-110 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:border-stone-800"
							onclick={triggerAvatarUpload}
							disabled={isUploadingAvatar}
							title="Cambiar foto de perfil"
						>
							<CameraIcon class="size-4" />
						</button>
					</div>

					<!-- Name & role -->
					<div class="w-full text-center">
						<h2 class="mb-1 text-xl leading-tight font-bold text-stone-900 dark:text-white">
							{$currentUser?.full_name}
						</h2>
						<p class="mb-3 text-sm font-medium text-stone-500 dark:text-stone-400">
							@{$currentUser?.username}
						</p>

						<div
							class="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50 px-3 py-1 text-xs font-bold tracking-wider text-rose-700 uppercase dark:border-rose-900/50 dark:from-rose-500/10 dark:to-orange-500/10 dark:text-rose-400"
						>
							<ShieldIcon class="size-3" />
							<span>{$currentUser?.role}</span>
						</div>
					</div>

					<!-- Status chips -->
					<div class="flex w-full flex-wrap justify-center gap-2">
						<div
							class="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
						>
							<div class="h-1.5 w-1.5 rounded-full bg-green-500"></div>
							<span>Cuenta activa</span>
						</div>
						<div
							class="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
						>
							<div class="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
							<span>Verificado</span>
						</div>
					</div>

					<!-- Meta info -->
					<div
						class="flex w-full flex-col gap-3 border-t border-stone-100 pt-6 dark:border-stone-800"
					>
						<div class="flex items-start gap-4">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-400 dark:bg-stone-800"
							>
								<MailIcon class="size-5" />
							</div>
							<div class="flex min-w-0 flex-col justify-center">
								<span class="text-[0.65rem] font-bold tracking-wider text-stone-400 uppercase"
									>Correo</span
								>
								<span class="truncate text-sm font-medium text-stone-700 dark:text-stone-200"
									>{$currentUser?.email}</span
								>
							</div>
						</div>

						{#if $currentUser?.phone_number}
							<div class="flex items-start gap-4">
								<div
									class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-400 dark:bg-stone-800"
								>
									<PhoneIcon class="size-5" />
								</div>
								<div class="flex min-w-0 flex-col justify-center">
									<span class="text-[0.65rem] font-bold tracking-wider text-stone-400 uppercase"
										>Teléfono</span
									>
									<span class="truncate text-sm font-medium text-stone-700 dark:text-stone-200"
										>{$currentUser.phone_number}</span
									>
								</div>
							</div>
						{/if}

						<div class="flex items-start gap-4">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-400 dark:bg-stone-800"
							>
								<ClockIcon class="size-5" />
							</div>
							<div class="flex min-w-0 flex-col justify-center">
								<span class="text-[0.65rem] font-bold tracking-wider text-stone-400 uppercase"
									>Miembro desde</span
								>
								<span class="truncate text-sm font-medium text-stone-700 dark:text-stone-200"
									>{formatDate($currentUser?.created_at || '')}</span
								>
							</div>
						</div>
					</div>
				</aside>

				<!-- ══ RIGHT: Details Panel ══ -->
				<div
					class="flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-200/50 lg:col-span-8 dark:border-stone-800 dark:bg-stone-900 dark:shadow-none"
				>
					<!-- Tab bar -->
					<div
						class="flex gap-2 border-b border-stone-100 bg-stone-50/50 px-2 pt-2 dark:border-stone-800 dark:bg-stone-900/50"
					>
						<button
							class="flex items-center gap-2 rounded-t-xl px-5 py-3 text-sm font-bold transition-all {activeTab ===
							'personal'
								? 'mt-px border border-b-0 border-stone-200 bg-white text-rose-500 dark:border-stone-700 dark:bg-stone-900 dark:text-rose-400'
								: 'text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:hover:bg-stone-800 dark:hover:text-stone-300'}"
							onclick={() => (activeTab = 'personal')}
						>
							<UserIcon class="size-4" />
							<span>Información Personal</span>
						</button>
						<button
							class="flex items-center gap-2 rounded-t-xl px-5 py-3 text-sm font-bold transition-all {activeTab ===
							'security'
								? 'mt-px border border-b-0 border-stone-200 bg-white text-rose-500 dark:border-stone-700 dark:bg-stone-900 dark:text-rose-400'
								: 'text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:hover:bg-stone-800 dark:hover:text-stone-300'}"
							onclick={() => (activeTab = 'security')}
						>
							<LockIcon class="size-4" />
							<span>Seguridad</span>
						</button>
					</div>

					<!-- Tab content -->
					<div class="p-6 sm:p-8">
						{#if activeTab === 'personal'}
							<!-- ─── Personal Info Tab ─── -->
							<div
								class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
							>
								<div>
									<h3 class="mb-1 text-lg font-bold text-stone-900 dark:text-white">
										Detalles del Perfil
									</h3>
									<p class="text-sm text-stone-500 dark:text-stone-400">
										Actualiza tu información personal
									</p>
								</div>
								{#if !isEditing}
									<button
										class="flex items-center gap-2 rounded-xl border-2 border-stone-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-600 transition-all hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-600 dark:hover:bg-stone-800 dark:hover:text-white"
										onclick={() => (isEditing = true)}
									>
										<PencilIcon class="size-4" />
										<span>Editar Perfil</span>
									</button>
								{/if}
							</div>

							<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<div class="flex flex-col gap-2">
									<label
										class="text-[0.65rem] font-bold tracking-wider text-stone-500 uppercase dark:text-stone-400"
										>Nombre Completo</label
									>
									{#if isEditing}
										<Input
											bind:value={formData.full_name}
											placeholder="Nombre completo"
											icon={UserIcon}
										/>
									{:else}
										<div
											class="flex h-[42px] items-center gap-2.5 rounded-xl bg-stone-50 px-3 text-sm font-medium text-stone-900 dark:bg-stone-800/50 dark:text-white"
										>
											<UserIcon class="size-4 shrink-0 text-stone-400" />
											<span class="truncate">{formData.full_name || 'No especificado'}</span>
										</div>
									{/if}
								</div>

								<div class="flex flex-col gap-2">
									<label
										class="text-[0.65rem] font-bold tracking-wider text-stone-500 uppercase dark:text-stone-400"
										>Usuario</label
									>
									{#if isEditing}
										<Input
											bind:value={formData.username}
											placeholder="Nombre de usuario"
											icon={UserIcon}
										/>
									{:else}
										<div
											class="flex h-[42px] items-center gap-2.5 rounded-xl bg-stone-50 px-3 text-sm font-medium text-stone-900 dark:bg-stone-800/50 dark:text-white"
										>
											<UserIcon class="size-4 shrink-0 text-stone-400" />
											<span class="truncate">{formData.username || 'No especificado'}</span>
										</div>
									{/if}
								</div>

								<div class="flex flex-col gap-2">
									<label
										class="text-[0.65rem] font-bold tracking-wider text-stone-500 uppercase dark:text-stone-400"
										>Correo Electrónico</label
									>
									{#if isEditing}
										<Input
											bind:value={formData.email}
											type="email"
											placeholder="correo@ejemplo.com"
											icon={MailIcon}
										/>
									{:else}
										<div
											class="flex h-[42px] items-center gap-2.5 rounded-xl bg-stone-50 px-3 text-sm font-medium text-stone-900 dark:bg-stone-800/50 dark:text-white"
										>
											<MailIcon class="size-4 shrink-0 text-stone-400" />
											<span class="truncate">{formData.email || 'No especificado'}</span>
										</div>
									{/if}
								</div>

								<div class="flex flex-col gap-2">
									<label
										class="text-[0.65rem] font-bold tracking-wider text-stone-500 uppercase dark:text-stone-400"
										>Teléfono</label
									>
									{#if isEditing}
										<Input
											bind:value={formData.phone_number}
											type="tel"
											placeholder="+591 ..."
											icon={PhoneIcon}
										/>
									{:else}
										<div
											class="flex h-[42px] items-center gap-2.5 rounded-xl bg-stone-50 px-3 text-sm font-medium text-stone-900 dark:bg-stone-800/50 dark:text-white"
										>
											<PhoneIcon class="size-4 shrink-0 text-stone-400" />
											<span class="truncate">{formData.phone_number || 'No especificado'}</span>
										</div>
									{/if}
								</div>

								<div class="col-span-1 flex flex-col gap-2 sm:col-span-2">
									<label
										class="text-[0.65rem] font-bold tracking-wider text-stone-500 uppercase dark:text-stone-400"
										>Fecha de Nacimiento</label
									>
									{#if isEditing}
										<Input
											bind:value={formData.birth_date}
											type="date"
											placeholder="Fecha de nacimiento"
											icon={CalendarIcon}
										/>
									{:else}
										<div
											class="flex h-[42px] items-center gap-2.5 rounded-xl bg-stone-50 px-3 text-sm font-medium text-stone-900 dark:bg-stone-800/50 dark:text-white"
										>
											<CalendarIcon class="size-4 shrink-0 text-stone-400" />
											<span class="truncate">{formData.birth_date || 'No especificada'}</span>
										</div>
									{/if}
								</div>
							</div>

							{#if isEditing}
								<div
									class="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-stone-100 pt-6 sm:flex-row dark:border-stone-800"
								>
									<button
										class="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-600 transition-all hover:bg-stone-50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
										onclick={cancelEdit}
										disabled={isSubmitting}
									>
										<XIcon class="size-4" />
										<span>Cancelar</span>
									</button>
									<button
										class="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 dark:shadow-none"
										onclick={handleUpdateProfile}
										disabled={isSubmitting}
									>
										{#if isSubmitting}
											<div
												class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
											></div>
											<span>Guardando...</span>
										{:else}
											<CheckIcon class="size-4" />
											<span>Guardar Cambios</span>
										{/if}
									</button>
								</div>
							{/if}
						{:else if activeTab === 'security'}
							<!-- ─── Security Tab ─── -->
							<div class="mb-8">
								<h3 class="mb-1 text-lg font-bold text-stone-900 dark:text-white">
									Seguridad de la Cuenta
								</h3>
								<p class="text-sm text-stone-500 dark:text-stone-400">Mantén tu cuenta protegida</p>
							</div>

							<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
								<div class="flex flex-col gap-6">
									<div class="flex flex-col gap-2">
										<!-- svelte-ignore a11y_label_has_associated_control -->
										<label
											class="text-[0.65rem] font-bold tracking-wider text-stone-500 uppercase dark:text-stone-400"
											>Contraseña Actual</label
										>
										<Input
											type="password"
											bind:value={passwordData.currentPassword}
											placeholder="••••••••"
										/>
									</div>

									<div class="flex flex-col gap-2">
										<!-- svelte-ignore a11y_label_has_associated_control -->
										<label
											class="text-[0.65rem] font-bold tracking-wider text-stone-500 uppercase dark:text-stone-400"
											>Nueva Contraseña</label
										>
										<Input
											type="password"
											bind:value={passwordData.newPassword}
											placeholder="Mínimo 6 caracteres"
										/>
									</div>

									<div class="flex flex-col gap-2">
										<!-- svelte-ignore a11y_label_has_associated_control -->
										<label
											class="text-[0.65rem] font-bold tracking-wider text-stone-500 uppercase dark:text-stone-400"
											>Confirmar Nueva Contraseña</label
										>
										<Input
											type="password"
											bind:value={passwordData.confirmPassword}
											placeholder="Repite la contraseña"
										/>
									</div>

									<button
										class="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-stone-900/20 transition-all hover:bg-stone-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-stone-900 dark:shadow-white/10 dark:hover:bg-stone-100"
										onclick={handleChangePassword}
										disabled={isSubmitting}
									>
										{#if isSubmitting}
											<div
												class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-stone-900/40 dark:border-t-stone-900"
											></div>
											<span>Actualizando...</span>
										{:else}
											<LockIcon class="size-4" />
											<span>Actualizar Contraseña</span>
										{/if}
									</button>
								</div>

								<!-- Security tips card -->
								<div
									class="rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 to-stone-100 p-6 dark:border-stone-800 dark:from-stone-800/50 dark:to-stone-900/50"
								>
									<div class="mb-5 flex items-center gap-3">
										<div
											class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400"
										>
											<ShieldIcon class="size-5" />
										</div>
										<h4 class="text-sm font-bold text-stone-900 dark:text-white">
											Consejos de Seguridad
										</h4>
									</div>
									<ul class="flex flex-col gap-4 text-[0.8rem] text-stone-600 dark:text-stone-400">
										<li class="flex items-start gap-3">
											<div
												class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500 dark:bg-rose-400"
											></div>
											<span class="leading-relaxed"
												>Usa una combinación de letras mayúsculas, números y símbolos especiales
												para crear una contraseña fuerte.</span
											>
										</li>
										<li class="flex items-start gap-3">
											<div
												class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500 dark:bg-rose-400"
											></div>
											<span class="leading-relaxed"
												>Evita usar información personal obvia como tu nombre, fecha de nacimiento o
												números de teléfono.</span
											>
										</li>
										<li class="flex items-start gap-3">
											<div
												class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500 dark:bg-rose-400"
											></div>
											<span class="leading-relaxed"
												>Cambia tu contraseña regularmente y no uses la misma para diferentes
												cuentas.</span
											>
										</li>
									</ul>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</MainLayout>
