<script lang="ts">
	import { page } from '$app/state';
	import { Loader, MainLayout } from '$lib/components/ui';
	import { COURSE_CATEGORIES } from '$lib/data';
	import { ChevronRightIcon, MailIcon, UserIcon, PhoneIcon, CakeIcon } from '$lib/icons/outline';
	import { ExclamationCircleIcon } from '$lib/icons/solid';
	import { authService } from '$lib/services/auth.service';
	import { getCurrentYear, redirect } from '$lib/utils';
	import { alert } from '$lib/utils/alert';
	import { onMount } from 'svelte';

	let full_name: string = $state('');
	let email: string = $state('');
	let country_code: string = $state('+591');
	let local_phone_number: string = $state('');
	let birth_date: string = $state('');

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
			await authService.register({
				full_name,
				email,
				phone_number: `${country_code.startsWith('+') ? '' : '+'}${country_code}${local_phone_number}`,
				birth_date
			});

			alert('success', 'Registro exitoso. ¡Bienvenido a Dulce Vizzio!');
			// Redirigir a login después de un registro exitoso
			await redirect('/auth/sign-in', true);
		} catch (error: unknown) {
			const err = error as { message?: string };
			errorMessage = err?.message || 'Error al registrar. Por favor, intenta nuevamente.';
		} finally {
			loading = false;
		}
	}
</script>

<MainLayout
	title="Crear Cuenta"
	description="Registrate para comenzar con tus clases"
	class="container m-auto flex min-h-dvh w-full items-center justify-center py-8"
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
					Crear <em class="text-[#e9829a] italic">cuenta</em> ✨
				</h2>
				<p class="mt-1 text-sm font-light text-[#b07080]">Completá tus datos para sumarte</p>
			</div>

			<form onsubmit={handleSubmit} class="flex flex-col gap-4">
				<!-- Nombre Completo -->
				<div class="flex flex-col gap-1.5">
					<label
						for="full_name"
						class="text-[11px] font-semibold tracking-[0.15em] text-[#c9838f] uppercase"
					>
						Nombre y Apellido
					</label>
					<div class="relative">
						<div
							class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#e9829a]"
						>
							<UserIcon />
						</div>
						<input
							id="full_name"
							type="text"
							bind:value={full_name}
							placeholder="Tu nombre completo"
							required
							disabled={loading}
							class="w-full rounded-2xl border border-[#fce4ec] bg-[#fff8fa] py-3.5 pr-4 pl-11 text-sm text-[#3d1a24] placeholder-[#e0b8c0] transition-all outline-none focus:border-[#e9829a] focus:bg-white focus:ring-2 focus:ring-[#e9829a]/10 disabled:opacity-60"
						/>
					</div>
				</div>

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

				<!-- Phone Number -->
				<div class="flex flex-col gap-1.5">
					<label
						for="local_phone_number"
						class="text-[11px] font-semibold tracking-[0.15em] text-[#c9838f] uppercase"
					>
						Teléfono
					</label>
					<div class="flex gap-2">
						<div class="relative w-24 shrink-0">
							<input
								id="country_code"
								type="text"
								bind:value={country_code}
								placeholder="+54"
								required
								disabled={loading}
								class="w-full rounded-2xl border border-[#fce4ec] bg-[#fff8fa] px-4 py-3.5 text-center text-sm text-[#3d1a24] placeholder-[#e0b8c0] transition-all outline-none focus:border-[#e9829a] focus:bg-white focus:ring-2 focus:ring-[#e9829a]/10 disabled:opacity-60"
							/>
						</div>
						<div class="relative flex-1">
							<div
								class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#e9829a]"
							>
								<PhoneIcon />
							</div>
							<input
								id="local_phone_number"
								type="tel"
								bind:value={local_phone_number}
								placeholder="67787486"
								required
								disabled={loading}
								class="w-full rounded-2xl border border-[#fce4ec] bg-[#fff8fa] py-3.5 pr-4 pl-11 text-sm text-[#3d1a24] placeholder-[#e0b8c0] transition-all outline-none focus:border-[#e9829a] focus:bg-white focus:ring-2 focus:ring-[#e9829a]/10 disabled:opacity-60"
							/>
						</div>
					</div>
				</div>

				<!-- Birth Date -->
				<div class="flex flex-col gap-1.5">
					<label
						for="birth_date"
						class="text-[11px] font-semibold tracking-[0.15em] text-[#c9838f] uppercase"
					>
						Fecha de nacimiento
					</label>
					<div class="relative">
						<div
							class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#e9829a]"
						>
							<CakeIcon />
						</div>
						<input
							id="birth_date"
							type="date"
							bind:value={birth_date}
							required
							disabled={loading}
							class="w-full rounded-2xl border border-[#fce4ec] bg-[#fff8fa] py-3.5 pr-4 pl-11 text-sm text-[#3d1a24] placeholder-[#e0b8c0] transition-all outline-none focus:border-[#e9829a] focus:bg-white focus:ring-2 focus:ring-[#e9829a]/10 disabled:opacity-60"
						/>
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
						<span>Registrando...</span>
					{:else}
						<span>Crear cuenta</span>
						<ChevronRightIcon />
					{/if}
				</button>

				<div class="mt-4 flex justify-center">
					<p class="text-sm text-[#b07080]">
						¿Ya tienes una cuenta?
						<a
							href="/auth/sign-in"
							class="font-medium text-[#e9829a] transition-colors hover:text-[#e06882]"
						>
							Iniciar sesión
						</a>
					</p>
				</div>
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
