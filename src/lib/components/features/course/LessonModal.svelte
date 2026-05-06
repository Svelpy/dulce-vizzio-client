<script lang="ts">
	import { Button, BlurOverlay, Input, TextArea } from '$lib/components/ui';
	import { alert } from '$lib/utils';
	import { courseService } from '$lib/services';
	import {
		XIcon,
		BookIcon,
		PlayerPlayIcon,
		WorldIcon,
		CodeIcon,
		ClockIcon
	} from '$lib/icons/outline';
	import { scale } from 'svelte/transition';
	import type { CourseLesson, CreateLessonRequest, UpdateLessonRequest } from '$lib/interfaces';

	interface Props {
		isOpen: boolean;
		courseId: string;
		lesson?: CourseLesson | null;
		onClose: () => void;
		onSuccess: () => void;
	}

	let { isOpen, courseId, lesson = null, onClose, onSuccess }: Props = $props();

	// Form State
	let title = $state('');
	let summary = $state('');
	let durationSeconds = $state(0);
	let isPreview = $state(false);
	let videoUrl = $state('');
	let videoId = $state('');
	let isSubmitting = $state(false);

	const isEdit = $derived(!!lesson);

	// Reset/Populate state when modal opens
	$effect(() => {
		if (isOpen) {
			if (lesson) {
				title = lesson.title;
				summary = lesson.summary || '';
				durationSeconds = lesson.duration_seconds;
				isPreview = lesson.is_preview;
				videoUrl = lesson.video_url || '';
				videoId = lesson.video_id || '';
			} else {
				resetForm();
			}
		}
	});

	async function handleSubmit() {
		if (!title || durationSeconds <= 0) {
			alert(
				'error',
				'Por favor, completa los campos obligatorios y asegúrate de que la duración sea mayor a 0'
			);
			return;
		}

		isSubmitting = true;
		try {
			if (isEdit && lesson) {
				const updateData: UpdateLessonRequest = {
					title,
					summary: summary || undefined,
					duration_seconds: durationSeconds,
					is_preview: isPreview,
					video_url: videoUrl || undefined,
					video_id: videoId || undefined
				};
				await courseService.updateLesson(lesson.id, updateData);
				alert('success', 'Lección actualizada exitosamente');
			} else {
				const createData: CreateLessonRequest = {
					title,
					summary: summary || undefined,
					duration_seconds: durationSeconds,
					is_preview: isPreview,
					video_url: videoUrl || undefined,
					video_id: videoId || undefined
				};
				await courseService.createLesson(courseId, createData);
				alert('success', 'Lección creada exitosamente');
			}

			onSuccess();
			onClose();
		} catch (error) {
			console.error(`Error ${isEdit ? 'updating' : 'creating'} lesson:`, error);
			alert('error', `Ocurrió un error al ${isEdit ? 'actualizar' : 'crear'} la lección`);
		} finally {
			isSubmitting = false;
		}
	}

	function resetForm() {
		title = '';
		summary = '';
		durationSeconds = 0;
		isPreview = false;
		videoUrl = '';
		videoId = '';
	}

	function handleClose() {
		onClose();
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-40 flex items-center justify-center p-4">
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
							<h2 class="text-2xl font-black">{isEdit ? 'Editar Lección' : 'Nueva Lección'}</h2>
							<p class="mt-1 text-xs font-bold tracking-[0.2em] text-stone-400 uppercase">
								{isEdit ? 'Actualizar Contenido' : 'Gestión de Contenido'}
							</p>
						</div>
						<button
							class="rounded-full p-2 transition-all hover:bg-white/10 active:scale-90"
							onclick={handleClose}
							aria-label="Cerrar"
						>
							<XIcon class="size-6" />
						</button>
					</div>
				</div>

				<!-- Form Content -->
				<div class="custom-scrollbar max-h-[70vh] space-y-6 overflow-y-auto p-8">
					<!-- Title -->
					<div class="space-y-2">
						<label class="block text-sm font-black text-stone-700" for="title">
							Título de la Lección *
						</label>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
								<BookIcon class="size-5 text-stone-400" />
							</div>
							<Input
								id="title"
								placeholder="Ej. Introducción a la masa"
								bind:value={title}
								class="h-12 rounded-2xl border-stone-100 bg-stone-50/50 pl-11 focus:bg-white"
							/>
						</div>
					</div>

					<!-- Summary -->
					<div class="space-y-2">
						<label class="block text-sm font-black text-stone-700" for="summary">
							Resumen (Opcional)
						</label>
						<TextArea
							id="summary"
							placeholder="Breve descripción de lo que se verá en esta lección..."
							bind:value={summary}
							rows={3}
							class="rounded-2xl border-stone-100 bg-stone-50/50 p-4 focus:bg-white"
						/>
					</div>

					<div class="grid gap-6 md:grid-cols-2">
						<!-- Duration -->
						<div class="space-y-2">
							<label class="block text-sm font-black text-stone-700" for="duration">
								Duración (segundos) *
							</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
									<ClockIcon class="size-5 text-stone-400" />
								</div>
								<Input
									id="duration"
									type="number"
									placeholder="600"
									bind:value={durationSeconds}
									class="h-12 rounded-2xl border-stone-100 bg-stone-50/50 pl-11 focus:bg-white"
								/>
							</div>
						</div>

						<!-- Is Preview Toggle -->
						<div class="flex flex-col space-y-2">
							<span class="text-sm font-black text-stone-700">Vista Previa</span>
							<label class="relative inline-flex cursor-pointer items-center py-2">
								<input type="checkbox" bind:checked={isPreview} class="peer sr-only" />
								<div
									class="peer h-7 w-12 rounded-full bg-stone-200 peer-checked:bg-stone-900 after:absolute after:top-[10px] after:left-[4px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full focus:outline-none"
								></div>
								<span class="ml-3 text-xs font-bold tracking-wider text-stone-500 uppercase"
									>{isPreview ? 'Gratis' : 'Premium'}</span
								>
							</label>
						</div>
					</div>

					<div class="space-y-4 rounded-2xl border border-stone-100 bg-stone-50/50 p-6">
						<h3
							class="flex items-center gap-2 text-xs font-black tracking-widest text-stone-400 uppercase"
						>
							<PlayerPlayIcon class="size-4" />
							Configuración de Video
						</h3>

						<div class="grid gap-4 sm:grid-cols-2">
							<!-- Video URL -->
							<div class="space-y-1.5">
								<label
									class="block text-[10px] font-black tracking-widest text-stone-400 uppercase"
									for="videoUrl"
								>
									URL del Video
								</label>
								<div class="relative">
									<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
										<WorldIcon class="size-4 text-stone-300" />
									</div>
									<Input
										id="videoUrl"
										placeholder="BunnyCDN URL..."
										bind:value={videoUrl}
										class="h-10 rounded-xl border-stone-200 pl-9 text-sm"
									/>
								</div>
							</div>

							<!-- Video ID -->
							<div class="space-y-1.5">
								<label
									class="block text-[10px] font-black tracking-widest text-stone-400 uppercase"
									for="videoId"
								>
									ID del Video
								</label>
								<div class="relative">
									<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
										<CodeIcon class="size-4 text-stone-300" />
									</div>
									<Input
										id="videoId"
										placeholder="ID..."
										bind:value={videoId}
										class="h-10 rounded-xl border-stone-200 pl-9 text-sm"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Footer Actions -->
				<div
					class="flex flex-col gap-3 border-t border-stone-50 bg-stone-50/50 px-8 py-6 sm:flex-row"
				>
					<Button
						variant="outline"
						class="order-2 flex-1 border-stone-200 py-4 font-bold sm:order-1"
						onclick={handleClose}
					>
						Cancelar
					</Button>
					<Button
						class="order-1 flex-1 bg-stone-900 py-4 font-bold text-white shadow-lg shadow-stone-900/20 transition-all hover:bg-stone-800 active:scale-95 sm:order-2"
						loading={isSubmitting}
						onclick={handleSubmit}
						disabled={isSubmitting}
					>
						{isEdit ? 'Guardar Cambios' : 'Crear Lección'}
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
