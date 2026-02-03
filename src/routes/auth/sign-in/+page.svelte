<script lang="ts">
	import { goto } from '$app/navigation';
	import { AuthService } from '$lib/services/auth.service';
	import { authStore } from '$lib/stores/auth.store';
	import { onMount } from 'svelte';

	let email = '';
	let password = '';
	let showPassword = false;
	let loading = false;
	let errorMessage = '';

	// Paleta de colores Dulce Vizzio
	const colors = {
		cream: '#f4e9c4',
		taupe: '#a78d70',
		rose: '#ce7576',
		grey: '#cccccc',
		gold: '#b58b3a'
	};

	onMount(() => {
		// Si ya está autenticado, redirigir
		if (AuthService.isAuthenticated()) {
			goto('/app/dashboard');
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		errorMessage = '';
		loading = true;

		try {
			const response = await AuthService.login({ email, password });
			authStore.setUser(response.user);
			goto('/app/dashboard');
		} catch (error: any) {
			console.error('Error en login:', error);
			errorMessage = error?.message || 'Credenciales inválidas. Por favor, intenta nuevamente.';
		} finally {
			loading = false;
		}
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
</script>

<svelte:head>
	<title>Iniciar Sesión - Dulce Vizzio</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400&family=Playball&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="login-container" style="background-color: {colors.cream};">
	<div class="login-card">
		<!-- Decoración superior -->
		<div class="top-decoration" style="background-color: {colors.gold};"></div>

		<div class="card-content">
			<!-- Logo y Branding -->
			<div class="branding">
				<div class="logo-circle" style="border-color: {colors.gold};">
					<svg viewBox="0 0 100 100" class="monogram">
						<text x="20" y="65" font-size="45" fill={colors.taupe} class="letter-d">D</text>
						<text x="45" y="75" font-size="45" fill={colors.gold} class="letter-v">V</text>
					</svg>
				</div>
				<h1 class="brand-name" style="color: {colors.gold};">Dulce Vizzio</h1>
				<p class="brand-subtitle" style="color: {colors.taupe};">Academia de Repostería</p>
			</div>

			<!-- Formulario -->
			<form on:submit={handleSubmit} class="login-form">
				<!-- Email -->
				<div class="form-group">
					<label for="email" class="form-label" style="color: {colors.taupe};">
						Correo Electrónico
					</label>
					<div class="input-wrapper">
						<svg
							class="input-icon"
							style="color: {colors.grey};"
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
						<input
							id="email"
							type="email"
							bind:value={email}
							placeholder="ejemplo@dulce.com"
							required
							disabled={loading}
							class="form-input"
							style="border-color: {colors.grey};"
						/>
					</div>
				</div>

				<!-- Password -->
				<div class="form-group">
					<label for="password" class="form-label" style="color: {colors.taupe};">
						Contraseña
					</label>
					<div class="input-wrapper">
						<svg
							class="input-icon"
							style="color: {colors.grey};"
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
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							placeholder="••••••••"
							required
							disabled={loading}
							class="form-input"
							style="border-color: {colors.grey};"
						/>
						<button
							type="button"
							on:click={togglePasswordVisibility}
							class="password-toggle"
							disabled={loading}
							aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
						>
							{#if showPassword}
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									style="color: {colors.taupe};"
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
									style="color: {colors.taupe};"
								>
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
									<circle cx="12" cy="12" r="3" />
								</svg>
							{/if}
						</button>
					</div>
					<div class="forgot-password">
						<button type="button" class="forgot-link" style="color: {colors.taupe};">
							¿Olvidaste tu contraseña?
						</button>
					</div>
				</div>

				<!-- Error Message -->
				{#if errorMessage}
					<div class="error-message" style="color: {colors.rose};">
						{errorMessage}
					</div>
				{/if}

				<!-- Submit Button -->
				<button
					type="submit"
					class="submit-button"
					style="background-color: {colors.rose};"
					disabled={loading}
				>
					{#if loading}
						<span>Ingresando...</span>
					{:else}
						<span>Entrar a Clase</span>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<polyline points="9 18 15 12 9 6" />
						</svg>
					{/if}
				</button>
			</form>

			<!-- Footer -->
			<div class="footer">
				<p class="footer-text" style="color: {colors.taupe};">¿Aún no eres parte de la academia?</p>
				<button type="button" class="register-link" style="color: {colors.gold};">
					Crear una cuenta nueva
				</button>
			</div>
		</div>

		<!-- Decoración inferior -->
		<div class="bottom-decoration">
			{#each Array(3) as _, i}
				<div class="dot" style="background-color: {colors.gold};"></div>
			{/each}
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'PT Serif', serif;
	}

	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background-image: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
	}

	.login-card {
		width: 100%;
		max-width: 28rem;
		background: white;
		border-radius: 1.5rem;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		overflow: hidden;
		position: relative;
		border: 1px solid rgba(255, 255, 255, 0.5);
	}

	.top-decoration {
		height: 0.5rem;
		width: 100%;
	}

	.card-content {
		padding: 2.5rem;
	}

	/* Branding */
	.branding {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 2.5rem;
	}

	.logo-circle {
		width: 6rem;
		height: 6rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
		border: 2px solid;
		background: white;
	}

	.monogram {
		width: 4rem;
		height: 4rem;
	}

	.letter-d {
		font-family: 'PT Serif', serif;
		font-weight: 700;
	}

	.letter-v {
		font-family: 'Playball', cursive;
		transform: rotate(-10deg);
		transform-origin: center;
	}

	.brand-name {
		font-size: 2.25rem;
		font-family: 'Playball', cursive;
		text-align: center;
		margin: 0 0 0.25rem 0;
	}

	.brand-subtitle {
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-family: 'PT Serif', serif;
		margin: 0;
	}

	/* Form */
	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-label {
		font-size: 0.875rem;
		font-weight: 600;
		margin-left: 0.25rem;
		font-family: 'PT Serif', serif;
	}

	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.input-icon {
		position: absolute;
		left: 0.75rem;
		pointer-events: none;
	}

	.form-input {
		width: 100%;
		padding: 0.75rem 0.75rem 0.75rem 2.5rem;
		border: 1px solid;
		border-radius: 0.75rem;
		font-family: 'PT Serif', serif;
		font-size: 1rem;
		background-color: #fafafa;
		transition: all 0.3s ease;
		box-sizing: border-box;
	}

	.form-input:focus {
		outline: none;
		ring: 2px;
		border-color: #b58b3a;
	}

	.form-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.password-toggle {
		position: absolute;
		right: 0.75rem;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.password-toggle:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.forgot-password {
		display: flex;
		justify-content: flex-end;
	}

	.forgot-link {
		font-size: 0.75rem;
		font-style: italic;
		background: none;
		border: none;
		cursor: pointer;
		font-family: 'PT Serif', serif;
		padding: 0;
	}

	.forgot-link:hover {
		text-decoration: underline;
	}

	.error-message {
		padding: 0.75rem;
		background-color: rgba(206, 117, 118, 0.1);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		text-align: center;
		font-family: 'PT Serif', serif;
	}

	.submit-button {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 1rem;
		border-radius: 0.75rem;
		color: white;
		font-weight: 700;
		font-size: 1.125rem;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		transform: scale(1);
		transition: all 0.2s ease;
		font-family: 'PT Serif', serif;
		border: none;
		cursor: pointer;
	}

	.submit-button:hover:not(:disabled) {
		transform: scale(1.02);
		box-shadow: 0 15px 20px -3px rgba(0, 0, 0, 0.15);
	}

	.submit-button:active:not(:disabled) {
		transform: scale(0.98);
	}

	.submit-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	/* Footer */
	.footer {
		margin-top: 2.5rem;
		text-align: center;
	}

	.footer-text {
		font-size: 0.875rem;
		font-family: 'PT Serif', serif;
		margin: 0 0 0.5rem 0;
	}

	.register-link {
		font-weight: 700;
		background: none;
		border: none;
		cursor: pointer;
		font-family: 'PT Serif', serif;
		font-size: 0.875rem;
		padding: 0;
		transition: all 0.2s ease;
	}

	.register-link:hover {
		text-decoration: underline;
	}

	/* Bottom decoration */
	.bottom-decoration {
		display: flex;
		justify-content: center;
		padding-bottom: 1.5rem;
		opacity: 0.2;
		gap: 0.5rem;
	}

	.dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.card-content {
			padding: 2rem;
		}

		.brand-name {
			font-size: 2rem;
		}

		.logo-circle {
			width: 5rem;
			height: 5rem;
		}

		.monogram {
			width: 3.5rem;
			height: 3.5rem;
		}
	}
</style>
