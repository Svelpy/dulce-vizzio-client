<script lang="ts">
	import type { User } from '$lib/interfaces';
	import { Button, Heading } from '$lib/components/ui';
	import { XIcon, KeyIcon } from '$lib/icons/outline';
	import { fade, fly } from 'svelte/transition';
	import { UsersService } from '$lib/services/users.service';

	interface Props {
		isOpen: boolean;
		user: User | null;
		onClose: () => void;
		onSuccess: () => void;
	}

	let { isOpen, user, onClose, onSuccess }: Props = $props();

	let password = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!user) return;

		if (password.length < 8) {
			error = 'La contraseña debe tener al menos 8 caracteres';
			return;
		}

		loading = true;
		error = null;

		try {
			await UsersService.resetPassword(user.id, password);
			password = '';
			onSuccess();
			onClose();
		} catch (err: unknown) {
			error = err instanceof Error ? err.message : 'Error al restablecer la contraseña';
		} finally {
			loading = false;
		}
	}

	function handleClose() {
		password = '';
		error = null;
		onClose();
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<div
			transition:fade={{ duration: 200 }}
			class="absolute inset-0 bg-black/50 backdrop-blur-sm"
			role="button"
			tabindex="-1"
			onclick={handleClose}
			onkeydown={(e) => e.key === 'Escape' && handleClose()}
		></div>

		<div
			transition:fly={{ y: 20, duration: 300 }}
			class="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b p-6">
				<div class="flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ce7576]/10 text-[#ce7576]"
					>
						<KeyIcon class="h-6 w-6" />
					</div>
					<div>
						<Heading level="h3">Restablecer Contraseña</Heading>
						<p class="text-sm text-gray-500">Para {user?.full_name}</p>
					</div>
				</div>
				<button
					onclick={handleClose}
					class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
				>
					<XIcon class="h-6 w-6" />
				</button>
			</div>

			<!-- Body -->
			<form onsubmit={handleSubmit} class="space-y-6 p-6">
				{#if error}
					<div class="animate-shake rounded-lg bg-red-50 p-4 text-sm text-red-600">
						{error}
					</div>
				{/if}

				<div class="space-y-2">
					<label for="password" class="block text-sm font-semibold text-gray-700">
						Nueva Contraseña
					</label>
					<div class="relative">
						<input
							type="password"
							id="password"
							bind:value={password}
							placeholder="Mínimo 8 caracteres"
							class="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 ring-rose-500/20 transition-all outline-none focus:border-rose-500 focus:bg-white focus:ring-4"
							required
							minlength="8"
						/>
					</div>
				</div>

				<div class="flex flex-col gap-3 pt-4 sm:flex-row-reverse">
					<Button
						type="submit"
						variant="primary"
						class="w-full px-8 sm:w-auto"
						{loading}
						style="background-color: #ce7576;"
					>
						Actualizar
					</Button>
					<Button
						type="button"
						variant="outline"
						class="w-full sm:w-auto"
						onclick={handleClose}
						disabled={loading}
					>
						Cancelar
					</Button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}
	.animate-shake {
		animation: shake 0.2s ease-in-out 0s 2;
	}
</style>
