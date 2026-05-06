<script lang="ts">
	import { Button, BlurOverlay } from '$lib/components/ui';
	import {
		XIcon,
		PencilIcon,
		WorldIcon,
		TrashIcon,
		CheckIcon,
		ClockIcon
	} from '$lib/icons/outline';
	import { LockIcon } from '$lib/icons/solid';
	import { scale, fade } from 'svelte/transition';
	import type { Course, CourseStatus } from '$lib/interfaces';
	import { alert } from '$lib/utils';
	import { courseService } from '$lib/services';
	import { cn } from '$lib/utils';
	import type { Component } from 'svelte';

	interface Props {
		isOpen: boolean;
		course: Course | null;
		onClose: () => void;
		onSuccess: (updatedCourse: Course) => void;
	}

	let { isOpen, course, onClose, onSuccess }: Props = $props();

	let selectedStatus = $state<CourseStatus | ''>('');
	let isSubmitting = $state(false);

	const statusMetadata: Record<
		CourseStatus,
		{
			label: string;
			description: string;
			icon: Component;
			color: string;
			bgColor: string;
			borderColor: string;
		}
	> = {
		DRAFT: {
			label: 'Borrador',
			description: 'Solo visible para admins. En fase de edición.',
			icon: PencilIcon,
			color: 'text-stone-500',
			bgColor: 'bg-stone-50',
			borderColor: 'border-stone-200'
		},
		REVIEW: {
			label: 'En Revisión',
			description: 'Listo para control de calidad antes de publicar.',
			icon: ClockIcon,
			color: 'text-amber-600',
			bgColor: 'bg-amber-50',
			borderColor: 'border-amber-200'
		},
		PUBLISHED: {
			label: 'Publicado',
			description: 'Visible en la tienda para todos los estudiantes.',
			icon: WorldIcon,
			color: 'text-emerald-600',
			bgColor: 'bg-emerald-50',
			borderColor: 'border-emerald-200'
		},
		ARCHIVED: {
			label: 'Archivado',
			description: 'No disponible para compra. Alumnos mantienen acceso.',
			icon: LockIcon,
			color: 'text-blue-600',
			bgColor: 'bg-blue-50',
			borderColor: 'border-blue-200'
		},
		RETIRED: {
			label: 'Retirado',
			description: 'Fuera de línea. Nadie tiene acceso al curso.',
			icon: TrashIcon,
			color: 'text-rose-600',
			bgColor: 'bg-rose-50',
			borderColor: 'border-rose-200'
		}
	};

	$effect(() => {
		if (isOpen && course) {
			selectedStatus = course.status;
		} else if (!isOpen) {
			selectedStatus = '';
		}
	});

	async function handleSubmit() {
		if (!course || !selectedStatus) return;

		if (selectedStatus === course.status) {
			onClose();
			return;
		}

		isSubmitting = true;
		try {
			const updatedCourse = await courseService.updateStatus(course.id, selectedStatus);
			alert('success', 'Estado del curso actualizado con éxito');
			onSuccess(updatedCourse);
			onClose();
		} catch (error) {
			console.error('Error updating status:', error);
			alert('error', 'Ocurrió un error al cambiar el estado');
		} finally {
			isSubmitting = false;
		}
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<BlurOverlay class="flex items-center justify-center p-4">
			<div
				class="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
				transition:scale={{ duration: 300, start: 0.95, opacity: 0 }}
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
				role="presentation"
			>
				<!-- Header -->
				<div class="bg-stone-900 px-8 py-7 text-white">
					<div class="flex items-center justify-between">
						<div>
							<h2 class="text-2xl font-black">Gestionar Estado</h2>
							<p class="mt-1 text-xs font-bold tracking-[0.2em] text-stone-400 uppercase">
								{course?.title}
							</p>
						</div>
						<button
							class="rounded-full p-2 transition-all hover:bg-white/10 active:scale-90"
							onclick={onClose}
							aria-label="Cerrar"
						>
							<XIcon class="size-6" />
						</button>
					</div>
				</div>

				<!-- Content -->
				<div class="custom-scrollbar max-h-[60vh] space-y-3 overflow-y-auto p-8">
					{#each Object.entries(statusMetadata) as [key, meta], index (index)}
						{@const isSelected = selectedStatus === key}
						{@const isCurrent = course?.status === key}

						<button
							class={cn(
								'relative flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200',
								isSelected
									? `${meta.borderColor} ${meta.bgColor} scale-[1.02] ring-4 ring-stone-900/5`
									: 'border-stone-100 bg-white hover:border-stone-200 hover:bg-stone-50/50'
							)}
							onclick={() => (selectedStatus = key as CourseStatus)}
						>
							<div
								class={cn(
									'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all',
									isSelected
										? `${meta.bgColor} ${meta.color} shadow-sm`
										: 'bg-stone-100 text-stone-400'
								)}
							>
								<meta.icon class="h-6 w-6" />
							</div>

							<div class="flex-1 pr-6">
								<div class="flex items-center gap-2">
									<h3
										class={cn(
											'font-black transition-colors',
											isSelected ? 'text-stone-900' : 'text-stone-700'
										)}
									>
										{meta.label}
									</h3>
									{#if isCurrent}
										<span
											class="rounded-full bg-stone-900 px-2 py-0.5 text-[8px] font-black tracking-widest text-white uppercase"
										>
											Actual
										</span>
									{/if}
								</div>
								<p class="mt-1 text-xs leading-relaxed font-medium text-stone-500">
									{meta.description}
								</p>
							</div>

							{#if isSelected}
								<div class="absolute top-5 right-5" transition:fade>
									<div
										class={cn(
											'flex h-6 w-6 items-center justify-center rounded-full text-white',
											meta.bgColor.replace('bg-', 'bg-').replace('-50', '-500')
										)}
									>
										<CheckIcon class="h-4 w-4" />
									</div>
								</div>
							{/if}
						</button>
					{/each}
				</div>

				<!-- Footer -->
				<div
					class="flex flex-col gap-3 border-t border-stone-50 bg-stone-50/50 px-8 py-6 sm:flex-row"
				>
					<Button
						variant="outline"
						class="order-2 flex-1 border-stone-200 py-4 font-bold sm:order-1"
						onclick={onClose}
					>
						Cancelar
					</Button>
					<Button
						class="order-1 flex-1 bg-stone-900 py-4 font-bold text-white shadow-lg shadow-stone-900/20 transition-all hover:bg-stone-800 active:scale-95 sm:order-2"
						loading={isSubmitting}
						disabled={!selectedStatus ||
							(course && selectedStatus === course.status) ||
							isSubmitting}
						onclick={handleSubmit}
					>
						Confirmar Cambio
					</Button>
				</div>
			</div>
		</BlurOverlay>
	</div>
{/if}

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #e7e5e4;
		border-radius: 10px;
	}
</style>
