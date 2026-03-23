<script lang="ts">
	import { Button, BlurOverlay, Input, TextArea } from '$lib/components/ui';
	import { alert } from '$lib/utils';
	import { CoursesService } from '$lib/services';
	import { XIcon, BookIcon, ClockIcon, PlayerPlayIcon, WorldIcon, CodeIcon } from '$lib/icons/outline';
	import { scale } from 'svelte/transition';
	import type { CreateLessonRequest } from '$lib/interfaces';

	interface Props {
		isOpen: boolean;
		courseId: string;
		onClose: () => void;
		onSuccess: () => void;
	}

	let { isOpen, courseId, onClose, onSuccess }: Props = $props();

	// Form State
	let title = $state('');
	let summary = $state('');
	let durationSeconds = $state(0);
	let isPreview = $state(false);
	let videoUrl = $state('');
	let videoId = $state('');
	let isSubmitting = $state(false);

	// Reset state when modal opens/closes
	$effect(() => {
		if (!isOpen) {
			resetForm();
		}
	});

	async function handleSubmit() {
		if (!title || durationSeconds <= 0) {
			alert('error', 'Por favor, completa los campos obligatorios y asegúrate de que la duración sea mayor a 0');
			return;
		}

		isSubmitting = true;
		try {
			const lessonData: CreateLessonRequest = {
				title,
				summary: summary || undefined,
				duration_seconds: durationSeconds,
				is_preview: isPreview,
				video_url: videoUrl || undefined,
				video_id: videoId || undefined
			};

			await CoursesService.createLesson(courseId, lessonData);

			alert('success', 'Lección creada exitosamente');
			onSuccess();
			onClose();
		} catch (error) {
			console.error('Error creating lesson:', error);
			alert('error', 'Ocurrió un error al crear la lección');
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
	<div class="fixed inset-0 z-55 flex items-center justify-center p-4">
		<BlurOverlay class="flex items-center justify-center p-4">
			<div
				class="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
				transition:scale={{ duration: 300, start: 0.95, opacity: 0 }}
				role="button"
				tabindex="0"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.stopPropagation();
					}
				}}
			>
				<!-- Header -->
				<div class="bg-stone-900 px-6 py-5 text-white">
					<div class="flex items-center justify-between">
						<div>
							<h2 class="text-xl font-bold">Nueva Lección</h2>
							<p class="mt-1 text-xs font-medium tracking-widest text-stone-400 uppercase">
								Gestión de Contenido
							</p>
						</div>
						<button
							class="rounded-full p-2 transition-colors hover:bg-white/10"
							onclick={handleClose}
						>
							<XIcon class="size-6" />
						</button>
					</div>
				</div>

				<!-- Form Content -->
				<div class="custom-scrollbar max-h-[70vh] space-y-6 overflow-y-auto p-8">
					<!-- Title -->
					<div>
						<label class="mb-2 block text-sm font-bold text-stone-700" for="title">Título de la Lección *</label>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<BookIcon class="size-5 text-stone-400" />
							</div>
							<Input
								id="title"
								placeholder="Ej. Introducción a la masa"
								bind:value={title}
							/>
						</div>
					</div>

					<!-- Summary -->
					<div>
						<label class="mb-2 block text-sm font-bold text-stone-700" for="summary">Resumen (Opcional)</label>
						<TextArea
							id="summary"
							placeholder="Breve descripción de lo que se verá en esta lección..."
							bind:value={summary}
							rows={3}
						/>
					</div>

					<div class="grid gap-6 md:grid-cols-2">
						<!-- Duration -->
						<div>
							<label class="mb-2 block text-sm font-bold text-stone-700" for="duration">Duración (segundos) *</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<ClockIcon class="size-5 text-stone-400" />
								</div>
								<Input
									id="duration"
									type="number"
									placeholder="600"
									bind:value={durationSeconds}
								/>
							</div>
						</div>

						<!-- Is Preview Toggle -->
						<div class="flex flex-col">
							<span class="mb-2 text-sm font-bold text-stone-700">Vista Previa</span>
							<label class="relative inline-flex cursor-pointer items-center">
								<input type="checkbox" bind:checked={isPreview} class="peer sr-only" />
								<div class="peer h-6 w-11 rounded-full bg-stone-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-stone-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-rose-600 peer-checked:after:translate-x-full peer-checked:after:border-white focus:outline-none focus:ring-4 focus:ring-rose-300"></div>
								<span class="ml-3 text-sm font-medium text-stone-600">{isPreview ? 'Sí (Gratis)' : 'No (Solo inscritos)'}</span>
							</label>
						</div>
					</div>

					<div class="space-y-4 rounded-2xl bg-stone-50 p-4">
						<h3 class="flex items-center gap-2 text-sm font-bold text-stone-800">
							<PlayerPlayIcon class="size-4 text-stone-600" />
							Información de Video (Opcional)
						</h3>
						
						<!-- Video URL -->
						<div>
							<label class="mb-1 block text-xs font-bold text-stone-500 uppercase" for="videoUrl">URL del Video</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<WorldIcon class="size-4 text-stone-400" />
								</div>
								<Input
									id="videoUrl"
									placeholder="https://video.bunnycdn.com/..."
									bind:value={videoUrl}
								/>
							</div>
						</div>

						<!-- Video ID -->
						<div>
							<label class="mb-1 block text-xs font-bold text-stone-500 uppercase" for="videoId">ID del Video</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<CodeIcon class="size-4 text-stone-400" />
								</div>
								<Input
									id="videoId"
									placeholder="abc-123"
									bind:value={videoId}
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- Footer Actions -->
				<div class="flex flex-col gap-3 bg-stone-50 px-8 py-6 sm:flex-row">
					<Button variant="outline" class="flex-1 border-stone-200 py-4" onclick={handleClose}>
						Cancelar
					</Button>
					<Button
						class="flex-1 bg-stone-900 py-4 text-white shadow-lg shadow-stone-900/20 transition-all hover:bg-stone-800 active:scale-95"
						loading={isSubmitting}
						onclick={handleSubmit}
						disabled={isSubmitting}
					>
						Registrar Lección
					</Button>
				</div>
			</div>
		</BlurOverlay>
	</div>
{/if}

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #e7e5e4;
		border-radius: 10px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #d6d3d1;
	}
</style>
