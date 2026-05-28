<script lang="ts">
	import { page } from '$app/state';
	import { Loader, MainLayout } from '$lib/components/ui';
	import { COURSE_CATEGORIES } from '$lib/data';
	import { ChevronRightIcon, EyeIcon, EyeOffIcon, MailIcon } from '$lib/icons/outline';
	import { ExclamationCircleIcon, LockIcon } from '$lib/icons/solid';
	import { authService } from '$lib/services/auth.service';
	import { getCurrentYear, redirect } from '$lib/utils';
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

<MainLayout
	title="Iniciar Sesión"
	description="Ingresá para continuar con tus clases"
	class="container m-auto flex min-h-dvh w-full items-center justify-center"
>
	<div class="flex h-full w-full max-w-md flex-col items-center gap-8">
		<!-- Título -->
		<div class="flex flex-col items-center gap-1 text-center">
			<h1
				class="font-['Fraunces'] text-[38px] leading-none font-light tracking-tight text-[#3d1a24]"
			>
				Dulce <em class="text-[#e9829a] italic">Vizzio</em>
			</h1>
			<p class="text-xs font-semibold tracking-[0.2em] text-[#e9829a] uppercase">
				Academia de Repostería
			</p>
		</div>

		<!-- Card del form -->
		<div
			class="w-full rounded-3xl border border-[#fce4ec] bg-white p-8 shadow-[0_4px_40px_rgba(233,130,154,0.10)]"
		>
			<div class="mb-6">
				<h2 class="font-['Fraunces'] text-2xl font-normal text-[#3d1a24]">
					Hola, <em class="text-[#e9829a] italic">bienvenida</em> 🌸
				</h2>
				<p class="mt-1 text-sm font-light text-[#b07080]">Ingresá para continuar con tus clases</p>
			</div>

			<form onsubmit={handleSubmit} class="flex flex-col gap-4">
				<!-- Email -->
				<div class="flex flex-col gap-1.5">
					<label
						for="email"
						class="text-[11px] font-semibold tracking-[0.15em] text-[#c9838f] uppercase"
					>
						Correo electrónico
					</label>
					<div class="relative">
						<div
							class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#e9829a]"
						>
							<MailIcon />
						</div>
						<input
							id="email"
							type="email"
							bind:value={email}
							placeholder="tu@correo.com"
							required
							disabled={loading}
							class="w-full rounded-2xl border border-[#fce4ec] bg-[#fff8fa] py-3.5 pr-4 pl-11 text-sm text-[#3d1a24] placeholder-[#e0b8c0] transition-all outline-none focus:border-[#e9829a] focus:bg-white focus:ring-2 focus:ring-[#e9829a]/10 disabled:opacity-60"
						/>
					</div>
				</div>

				<!-- Contraseña -->
				<div class="flex flex-col gap-1.5">
					<label
						for="password"
						class="text-[11px] font-semibold tracking-[0.15em] text-[#c9838f] uppercase"
					>
						Contraseña
					</label>
					<div class="relative">
						<div
							class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#e9829a]"
						>
							<LockIcon />
						</div>
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							placeholder="••••••••"
							required
							disabled={loading}
							class="w-full rounded-2xl border border-[#fce4ec] bg-[#fff8fa] py-3.5 pr-12 pl-11 text-sm text-[#3d1a24] placeholder-[#e0b8c0] transition-all outline-none focus:border-[#e9829a] focus:bg-white focus:ring-2 focus:ring-[#e9829a]/10 disabled:opacity-60"
						/>
						<button
							type="button"
							onclick={togglePasswordVisibility}
							disabled={loading}
							aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
							class="absolute inset-y-0 right-3.5 flex items-center text-[#e0b8c0] transition-colors hover:text-[#e9829a] disabled:opacity-60"
						>
							{#if showPassword}
								<EyeOffIcon />
							{:else}
								<EyeIcon />
							{/if}
						</button>
					</div>
					<div class="flex justify-end">
						<a
							href="/forgot-password"
							class="text-xs font-medium text-[#e9829a] opacity-80 transition-opacity hover:opacity-100"
						>
							¿Olvidaste tu contraseña?
						</a>
					</div>
				</div>

				<!-- Error -->
				{#if errorMessage}
					<div
						class="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3"
					>
						<ExclamationCircleIcon class="shrink-0 text-red-400" />
						<p class="text-xs text-red-500">{errorMessage}</p>
					</div>
				{/if}

				<!-- Botón -->
				<button
					type="submit"
					disabled={loading}
					class="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e9829a] py-4 text-sm font-semibold tracking-wide text-white transition-all hover:bg-[#e06882] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
				>
					{#if loading}
						<Loader />
						<span>Ingresando...</span>
					{:else}
						<span>Entrar a clase</span>
						<ChevronRightIcon />
					{/if}
				</button>
			</form>
		</div>

		<!-- Pasteles decorativos abajo -->
		<div class="flex items-center gap-3">
			{#each COURSE_CATEGORIES as category, index (index)}
				<div class="flex flex-col items-center gap-1">
					<div
						class="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#fce4ec] bg-white text-2xl shadow-sm"
					>
						{category.icon}
					</div>
					<span class="text-[9px] font-medium tracking-wider text-[#d4a0a8] uppercase"
						>{category.name}</span
					>
				</div>
			{/each}
		</div>

		<p class="text-[11px] tracking-wide text-[#d4a0a8]">© {getCurrentYear()} Dulce Vizzio</p>
	</div>
</MainLayout>
