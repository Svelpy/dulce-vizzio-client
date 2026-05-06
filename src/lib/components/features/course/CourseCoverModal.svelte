<script lang="ts">
	import { Button, BlurOverlay } from '$lib/components/ui';
	import { XIcon, PhotoIcon } from '$lib/icons/outline';
	import { scale } from 'svelte/transition';
	import type { Course } from '$lib/interfaces';
	import { alert } from '$lib/utils';
	import { courseService } from '$lib/services';

	interface Props {
		isOpen: boolean;
		course: Course | null;
		onClose: () => void;
		onSuccess: (updatedCourse: Course) => void;
	}

	let { isOpen, course, onClose, onSuccess }: Props = $props();

	let fileInput = $state<HTMLInputElement | null>(null);
	let selectedFile = $state<File | null>(null);
	let previewUrl = $state<string | null>(null);
	let isSubmitting = $state(false);

	$effect(() => {
		if (isOpen && course) {
			previewUrl = course.cover_image_url || null;
		} else if (!isOpen) {
			resetForm();
		}
	});

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const file = target.files[0];
			if (file.type.startsWith('image/')) {
				selectedFile = file;
				previewUrl = URL.createObjectURL(file);
			} else {
				alert('error', 'Por favor, selecciona un archivo de imagen válido');
			}
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
			const file = event.dataTransfer.files[0];
			if (file.type.startsWith('image/')) {
				selectedFile = file;
				previewUrl = URL.createObjectURL(file);
			} else {
				alert('error', 'Por favor, selecciona un archivo de imagen válido');
			}
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function resetForm() {
		selectedFile = null;
		previewUrl = null;
		if (fileInput) fileInput.value = '';
	}

	async function handleSubmit() {
		if (!course || !selectedFile) return;

		isSubmitting = true;
		try {
			const updatedCourse = await courseService.uploadCover(course.id, selectedFile);
			alert('success', 'Portada actualizada exitosamente');
			onSuccess(updatedCourse);
			onClose();
		} catch (error) {
			console.error('Error uploading cover:', error);
			alert('error', 'Ocurrió un error al subir la portada');
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
				onkeydown={(e) => e.stopPropagation()}
				role="presentation"
			>
				<!-- Header -->
				<div class="bg-stone-900 px-6 py-5 text-white">
					<div class="flex items-center justify-between">
						<div>
							<h2 class="text-xl font-bold">Subir Portada</h2>
							<p class="mt-1 text-xs font-medium tracking-widest text-stone-400 uppercase">
								{course?.title}
							</p>
						</div>
						<button
							class="rounded-full p-2 transition-colors hover:bg-white/10"
							onclick={onClose}
							aria-label="Cerrar"
						>
							<XIcon class="size-6" />
						</button>
					</div>
				</div>

				<!-- Content -->
				<div class="p-8">
					<p class="mb-4 text-sm text-stone-600">
						Selecciona una imagen atractiva que represente el contenido del curso.
					</p>

					<div
						class="group relative flex h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 transition-all hover:border-rose-300 hover:bg-rose-50"
						role="button"
						tabindex="0"
						onclick={() => fileInput?.click()}
						onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInput?.click()}
						ondrop={handleDrop}
						ondragover={handleDragOver}
					>
						{#if previewUrl}
							<img src={previewUrl} alt="Preview" class="h-full w-full object-cover" />
							<div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
								<span class="font-bold text-white">Cambiar imagen</span>
							</div>
						{:else}
							<div class="flex flex-col items-center gap-3 text-stone-400 group-hover:text-rose-400">
								<PhotoIcon class="size-12" />
								<div class="text-center">
									<p class="font-bold">Haz clic o arrastra una imagen</p>
									<p class="text-xs text-stone-500">PNG, JPG hasta 5MB</p>
								</div>
							</div>
						{/if}
						<input
							type="file"
							accept="image/*"
							class="hidden"
							bind:this={fileInput}
							onchange={handleFileSelect}
						/>
					</div>
				</div>

				<!-- Footer -->
				<div class="flex gap-3 bg-stone-50 px-8 py-6">
					<Button variant="outline" class="flex-1 border-stone-200" onclick={onClose}>
						Cancelar
					</Button>
					<Button
						class="flex-1 bg-rose-600 text-white shadow-lg transition-all hover:bg-rose-700 disabled:opacity-50"
						loading={isSubmitting}
						disabled={!selectedFile || isSubmitting}
						onclick={handleSubmit}
					>
						Subir Imagen
					</Button>
				</div>
			</div>
		</BlurOverlay>
	</div>
{/if}
