<script lang="ts">
	import { page } from '$app/state';
	import { authService } from '$lib/services/auth.service';
	import { redirect } from '$lib/utils';
	import { onMount } from 'svelte';

	let email: string = $state('');
	let password: string = $state('');
	let showPassword: boolean = $state(false);
	let loading: boolean = $state(false);
	let errorMessage: string = $state('');

	onMount(() => {
		if (authService.isAuthenticated()) {
			const redirectTo = page.url.searchParams.get('redirectTo') || '/app/dashboard';
			redirect(redirectTo);
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		errorMessage = '';
		loading = true;

		try {
			await authService.login({ email, password });
			const redirectTo = page.url.searchParams.get('redirectTo') || '/app/dashboard';
			await redirect(redirectTo, true);
		} catch (error: unknown) {
			const err = error as { message?: string };
			errorMessage = err?.message || 'Credenciales inválidas. Por favor, intenta nuevamente.';
		} finally {
			loading = false;
		}
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
</script>

<svelte:head>
	<title>Iniciar Sesión — Dulce Vizzio</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Playball&family=Inter:wght@400;500;600;700;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Full-screen split layout -->
<div class="flex min-h-screen">
	<!-- ─── Left Panel: Branding ─── -->
	<div
		class="relative hidden flex-col items-center justify-center overflow-hidden bg-light-two lg:flex lg:w-1/2"
	>
		<!-- Background pattern -->
		<div class="pointer-events-none absolute inset-0">
			<div class="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5"></div>
			<div class="absolute -right-32 -bottom-32 h-[32rem] w-[32rem] rounded-full bg-white/5"></div>
			<div
				class="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sweet-pink-400/10"
			></div>
		</div>

		<!-- Emoji decoration -->
		<div
			class="pointer-events-none absolute inset-0 flex flex-wrap items-start justify-start gap-16 overflow-hidden p-12 opacity-10"
		>
			{#each { length: 12 } as _, i (i)}
				<span class="text-6xl">{['🍰', '🧁', '🍮', '🎂', '🥐', '🍩'][i % 6]}</span>
			{/each}
		</div>

		<!-- Main Brand Content -->
		<div class="relative z-10 flex flex-col items-center gap-8 px-16 text-center text-white">
			<div>
				<h1 class="font-['Playball'] text-5xl font-normal tracking-wide text-white">
					Dulce Vizzio
				</h1>
				<p class="mt-2 text-sm font-semibold tracking-[0.2em] text-white/60 uppercase">
					Academia de Repostería
				</p>
			</div>

			<!-- <div class="mt-4 max-w-xs space-y-3">
				{#each ['Aprende con maestras expertas', 'Lecciones en video HD', 'Acceso desde cualquier dispositivo'] as feature, index(index)}
					<div
						class="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 text-left text-sm font-semibold text-white/90 backdrop-blur-sm"
					>
						<span class="text-sweet-pink-300">✓</span>
						{feature}
					</div>
				{/each}
			</div> -->
		</div>
	</div>

	<!-- ─── Right Panel: Login Form ─── -->
	<div
		class="flex flex-1 flex-col items-center justify-center bg-sweet-pink-50/30 px-6 py-12 lg:px-16"
	>
		<!-- Mobile branding (only visible on small screens) -->
		<div class="mb-10 flex flex-col items-center lg:hidden">
			<h2 class="font-['Playball'] text-3xl text-sweet-brown">Dulce Vizzio</h2>
			<p class="mt-1 text-xs font-bold tracking-widest text-sweet-pink-400 uppercase">
				Academia de Repostería
			</p>
		</div>

		<!-- Card -->
		<div class="glass-card w-full max-w-md rounded-xl p-8 shadow-sweet sm:p-10">
			<!-- Form -->
			<form onsubmit={handleSubmit} class="space-y-5">
				<!-- Email -->
				<div class="space-y-1.5">
					<label for="email" class="block text-sm font-bold text-sweet-brown">
						Correo Electrónico
					</label>
					<div class="relative">
						<div
							class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sweet-pink-300"
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<rect x="2" y="4" width="20" height="16" rx="2" />
								<path d="m2 7 10 7 10-7" />
							</svg>
						</div>
						<input
							id="email"
							type="email"
							bind:value={email}
							placeholder="tu@correo.com"
							required
							disabled={loading}
							class="w-full rounded-2xl border border-sweet-pink-100 bg-white/80 py-3.5 pr-4 pl-12 text-sm font-medium text-sweet-brown placeholder-sweet-pink-200 shadow-sm backdrop-blur-sm transition-all focus:border-sweet-pink-300 focus:ring-2 focus:ring-sweet-pink-200/50 focus:outline-none disabled:opacity-60"
						/>
					</div>
				</div>

				<!-- Password -->
				<div class="space-y-1.5">
					<label for="password" class="block text-sm font-bold text-sweet-brown">
						Contraseña
					</label>
					<div class="relative">
						<div
							class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sweet-pink-300"
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
								<path d="M7 11V7a5 5 0 0 1 10 0v4" />
							</svg>
						</div>
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							placeholder="••••••••"
							required
							disabled={loading}
							class="w-full rounded-2xl border border-sweet-pink-100 bg-white/80 py-3.5 pr-12 pl-12 text-sm font-medium text-sweet-brown placeholder-sweet-pink-200 shadow-sm backdrop-blur-sm transition-all focus:border-sweet-pink-300 focus:ring-2 focus:ring-sweet-pink-200/50 focus:outline-none disabled:opacity-60"
						/>
						<button
							type="button"
							onclick={togglePasswordVisibility}
							disabled={loading}
							aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
							class="absolute inset-y-0 right-0 flex items-center pr-4 text-sweet-pink-300 transition-colors hover:text-sweet-pink-500 disabled:opacity-60"
						>
							{#if showPassword}
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
									/>
									<line x1="1" y1="1" x2="23" y2="23" />
								</svg>
							{:else}
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
									<circle cx="12" cy="12" r="3" />
								</svg>
							{/if}
						</button>
					</div>
				</div>

				<!-- Error Message -->
				{#if errorMessage}
					<div class="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4">
						<svg
							class="mt-0.5 h-5 w-5 shrink-0 text-rose-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
						<p class="text-sm font-medium text-rose-700">{errorMessage}</p>
					</div>
				{/if}

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={loading}
					class="sweet-gradient-intense flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-black text-white shadow-sweet transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
				>
					{#if loading}
						<svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							></path>
						</svg>
						<span>Ingresando...</span>
					{:else}
						<span>Entrar a Clase</span>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
						>
							<polyline points="9 18 15 12 9 6" />
						</svg>
					{/if}
				</button>
			</form>
		</div>
	</div>
</div>
