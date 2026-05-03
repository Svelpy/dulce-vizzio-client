<script lang="ts">
	import { BlurOverlay, Input, Button, Heading } from '$lib/components/ui';
	import { enrollmentService } from '$lib/services';
	import type { Enrollment } from '$lib/interfaces';
	import { alert } from '$lib/utils';
	import { ClockIcon, XIcon } from '$lib/icons/outline';
	import { fade, scale } from 'svelte/transition';

	interface Props {
		isOpen: boolean;
		enrollment: Enrollment | null;
		onClose: () => void;
		onSuccess: (updatedEnrollment: Enrollment) => void;
	}

	let { isOpen, enrollment, onClose, onSuccess }: Props = $props();

	let additionalDays = $state(30);
	let isSubmitting = $state(false);

	async function handleSubmit() {
		if (!enrollment) return;
		if (additionalDays <= 0) {
			alert('error', 'Los días adicionales deben ser mayores a 0');
			return;
		}

		isSubmitting = true;
		try {
			const updated = await enrollmentService.extend(enrollment.id, additionalDays);
			alert('success', `Inscripción extendida por ${additionalDays} días`);
			onSuccess(updated);
			onClose();
		} catch (error) {
			console.error('Error extending enrollment:', error);
			alert('error', 'Ocurrió un error al extender la inscripción');
		} finally {
			isSubmitting = false;
		}
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<BlurOverlay class="flex items-center justify-center p-4">
			<div
				class="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
				transition:scale={{ duration: 300, start: 0.95, opacity: 0 }}
				onclick={(e) => e.stopPropagation()}
			>
				<!-- Header -->
				<div class="bg-stone-900 px-6 py-5 text-white">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
								<ClockIcon class="h-6 w-6" />
							</div>
							<div>
								<h2 class="text-lg font-bold">Extender Inscripción</h2>
								<p class="text-[10px] font-medium tracking-widest text-stone-400 uppercase">
									Gestión de expiración
								</p>
							</div>
						</div>
						<button
							class="rounded-full p-2 transition-colors hover:bg-white/10"
							onclick={onClose}
						>
							<XIcon class="size-6" />
						</button>
					</div>
				</div>

				<!-- Content -->
				<div class="space-y-6 p-8">
					<p class="text-sm text-stone-500">
						Agrega días adicionales de acceso para <strong>{enrollment?.user?.full_name}</strong> en el curso <strong>{enrollment?.course?.title}</strong>.
					</p>

					<div class="space-y-2">
						<label for="days" class="text-sm font-bold text-stone-700">Días adicionales</label>
						<Input
							id="days"
							type="number"
							bind:value={additionalDays}
							min="1"
							placeholder="Ej. 30"
							class="transition-all focus:ring-2 focus:ring-stone-900/5"
						/>
					</div>

					{#if enrollment?.expires_at}
						<div class="rounded-2xl border border-stone-100 bg-stone-50 p-4">
							<p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Vencimiento actual</p>
							<p class="mt-1 text-sm font-black text-stone-700">
								{new Date(enrollment.expires_at).toLocaleDateString('es-ES', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</p>
						</div>
					{/if}
				</div>

				<!-- Footer -->
				<div class="flex flex-col gap-3 bg-stone-50 px-8 py-6 sm:flex-row">
					<Button variant="outline" class="flex-1 border-stone-200 py-4" onclick={onClose} disabled={isSubmitting}>
						Cancelar
					</Button>
					<Button
						class="flex-1 bg-stone-900 py-4 text-white shadow-lg shadow-stone-900/20 transition-all hover:bg-stone-800 active:scale-95"
						loading={isSubmitting}
						onclick={handleSubmit}
						disabled={isSubmitting}
					>
						Confirmar Extensión
					</Button>
				</div>
			</div>
		</BlurOverlay>
	</div>
{/if}

<style>
	/* Optional: styling for number input to remove arrows if desired */
	:global(input[type='number']::-webkit-inner-spin-button),
	:global(input[type='number']::-webkit-outer-spin-button) {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
