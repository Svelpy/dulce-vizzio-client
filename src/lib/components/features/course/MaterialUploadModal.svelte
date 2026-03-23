<script lang="ts">
	import { XIcon, DownloadIcon } from '$lib/icons/outline';
	import { Button, Heading, Input, BlurOverlay } from '$lib/components/ui';
	import { courseService } from '$lib/services';
	import { alert } from '$lib/utils/alert';

	interface Props {
		isOpen: boolean;
		lessonId: string;
		onClose: () => void;
		onSuccess: () => void;
	}

	let { isOpen, lessonId, onClose, onSuccess }: Props = $props();

	let title = $state('');
	let isDownloadable = $state(true);
	let file = $state<File | null>(null);
	let uploading = $state(false);

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			file = target.files[0];
			if (!title) {
				// Auto-fill title with filename (without extension)
				title = file.name.replace(/\.[^/.]+$/, '');
			}
		}
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!file || !title) {
			alert('error', 'Por favor, completa todos los campos obligatorios');
			return;
		}

		uploading = true;
		try {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('file', file);
			formData.append('is_downloadable', String(isDownloadable));

			await courseService.uploadMaterial(lessonId, formData);
			alert('success', 'Material cargado correctamente');
			onSuccess();
			resetForm();
			onClose();
		} catch (error) {
			console.error('Error uploading material:', error);
			alert('error', 'Error al cargar el material');
		} finally {
			uploading = false;
		}
	}

	function resetForm() {
		title = '';
		isDownloadable = true;
		file = null;
	}
</script>

{#if isOpen}
	<div class="relative z-100" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<BlurOverlay class="flex min-h-full items-center justify-center p-4 sm:p-0">
			<div
				class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
				role="document"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => {
					if (e.key === 'Escape') onClose();
				}}
			>
				<!-- Header -->
				<div
					class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4"
				>
					<Heading level="h3" class="text-xl font-bold text-slate-900">Subir Material</Heading>
					<button
						type="button"
						class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
						onclick={onClose}
					>
						<XIcon class="h-6 w-6" />
					</button>
				</div>

				<!-- Form -->
				<form onsubmit={handleSubmit} class="space-y-5 p-6">
					<div>
						<label for="material-title" class="mb-1 block text-sm font-semibold text-slate-700">
							Título del material *
						</label>
						<Input
							id="material-title"
							bind:value={title}
							placeholder="Ej. Guía de Repostería"
							required
							disabled={uploading}
						/>
					</div>

					<div>
						<label for="material-file" class="mb-1 block text-sm font-semibold text-slate-700">
							Archivo *
						</label>
						<div
							class="relative mt-1 flex justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 pt-5 pb-6 transition-colors hover:border-light-four"
						>
							<div class="space-y-1 text-center">
								<DownloadIcon class="mx-auto h-12 w-12 text-slate-400" />
								<div class="flex text-sm text-slate-600">
									<label
										for="file-upload"
										class="relative cursor-pointer rounded-md font-bold text-light-four underline focus-within:outline-none hover:text-light-three"
									>
										<span>Subir un archivo</span>
										<input
											id="file-upload"
											name="file-upload"
											type="file"
											class="sr-only"
											onchange={handleFileChange}
											required
											disabled={uploading}
										/>
									</label>
									<p class="pl-1">o arrastra y suelta</p>
								</div>
								<p class="text-xs text-slate-500">PDF, ZIP, DOCX, PNG, JPG hasta 50MB</p>
								{#if file}
									<div class="mt-2 max-w-xs truncate text-sm font-semibold text-green-600">
										{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
									</div>
								{/if}
							</div>
						</div>
					</div>

					<div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
						<input
							id="is_downloadable"
							type="checkbox"
							bind:checked={isDownloadable}
							class="h-5 w-5 rounded border-slate-300 text-light-four focus:ring-light-four"
							disabled={uploading}
						/>
						<label for="is_downloadable" class="cursor-pointer text-sm font-medium text-slate-700">
							Permitir descarga por los estudiantes
						</label>
					</div>

					<div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
						<Button
							type="button"
							variant="ghost"
							onclick={onClose}
							disabled={uploading}
							fullWidth
							class="sm:w-auto"
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							variant="primary"
							loading={uploading}
							fullWidth
							class="px-8 sm:w-auto"
						>
							Subir Material
						</Button>
					</div>
				</form>
			</div>
		</BlurOverlay>
	</div>
{/if}
