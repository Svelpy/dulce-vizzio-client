<script lang="ts">
	import type { User, UserRole } from '$lib/interfaces';
	import { Button, Heading } from '$lib/components/ui';
	import { XIcon, UsersIcon } from '$lib/icons/outline';
	import { fade, fly } from 'svelte/transition';
	import { UsersService } from '$lib/services/users.service';

	interface Props {
		isOpen: boolean;
		user: User | null;
		onClose: () => void;
		onSuccess: () => void;
	}

	let { isOpen, user, onClose, onSuccess }: Props = $props();

	let selectedRole = $state<UserRole | ''>('');
	let loading = $state(false);
	let error = $state<string | null>(null);

	const roles: { value: UserRole; label: string; description: string }[] = [
		{ value: 'ADMIN' as UserRole, label: 'Administrador', description: 'Gestión total del sistema' },
		{ value: 'MODERATOR' as UserRole, label: 'Moderador', description: 'Supervisión y gestión limitada' },
		{ value: 'USER' as UserRole, label: 'Usuario', description: 'Acceso estándar al sistema' }
	];

	$effect(() => {
		if (isOpen && user) {
			selectedRole = user.role;
		}
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!user || !selectedRole || selectedRole === 'SUPERADMIN') return;

		loading = true;
		error = null;

		try {
			await UsersService.updateRole(user.id, selectedRole);
			onSuccess();
			onClose();
		} catch (err: unknown) {
			error = err instanceof Error ? err.message : 'Error al actualizar el rol';
		} finally {
			loading = false;
		}
	}

	function handleClose() {
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
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a78d70]/10 text-[#a78d70]"
					>
						<UsersIcon class="h-6 w-6" />
					</div>
					<div>
						<Heading level="h3">Cambiar Rol</Heading>
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

				<div class="space-y-4">
					{#each roles as role}
						<label
							class="flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all hover:bg-gray-50 {selectedRole ===
							role.value
								? 'border-[#a78d70] bg-[#a78d70]/5 ring-1 ring-[#a78d70]'
								: 'border-gray-200'}"
						>
							<input
								type="radio"
								name="role"
								value={role.value}
								bind:group={selectedRole}
								class="mt-1 h-4 w-4 text-[#a78d70] border-gray-300 focus:ring-[#a78d70]"
							/>
							<div class="flex flex-col">
								<span class="font-semibold text-gray-900">{role.label}</span>
								<span class="text-sm text-gray-500">{role.description}</span>
							</div>
						</label>
					{/each}
				</div>

				<div class="flex flex-col gap-3 pt-4 sm:flex-row-reverse">
					<Button
						type="submit"
						variant="primary"
						class="w-full px-8 sm:w-auto"
						{loading}
						style="background-color: #a78d70;"
						disabled={selectedRole === user?.role || !selectedRole}
					>
						Guardar Cambios
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
