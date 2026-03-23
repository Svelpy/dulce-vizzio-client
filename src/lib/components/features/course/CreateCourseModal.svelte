<script lang="ts">
	import { Button, BlurOverlay, Input, Select, TextArea } from '$lib/components/ui';
	import { alert } from '$lib/utils';
	import { CoursesService } from '$lib/services';
	import { XIcon, BookIcon, TagIcon, CashIcon, WorldIcon, WhatsappIcon } from '$lib/icons/outline';
	import { scale } from 'svelte/transition';
	import { COURSE_CATEGORIES, COURSE_DIFFICULTIES } from '$lib/data';
	import type { CreateCourseRequest, CourseDifficulty } from '$lib/interfaces';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		onSuccess: () => void;
	}

	let { isOpen, onClose, onSuccess }: Props = $props();

	// Form State
	let title = $state('');
	let description = $state('');
	let category = $state('');
	let subcategory = $state('');
	let difficulty = $state<CourseDifficulty>('INTERMEDIATE');
	let tagsInput = $state('');
	let price = $state(0);
	let currency = $state('USD');
	let whatsappGroupUrl = $state('');
	let isSubmitting = $state(false);

	// Reset state when modal opens/closes
	$effect(() => {
		if (!isOpen) {
			resetForm();
		}
	});

	async function handleSubmit() {
		if (!title || !description || !category || !difficulty) {
			alert('error', 'Por favor, completa los campos obligatorios');
			return;
		}

		if (description.length < 20) {
			alert('error', 'La descripción debe tener al menos 20 caracteres');
			return;
		}

		isSubmitting = true;
		try {
			const tags = tagsInput
				.split(',')
				.map((tag) => tag.trim())
				.filter((tag) => tag.length > 0);

			const courseData: CreateCourseRequest = {
				title,
				description,
				category,
				subcategory: subcategory || undefined,
				difficulty,
				tags,
				price,
				currency,
				whatsapp_group_url: whatsappGroupUrl || undefined
			};

			await CoursesService.create(courseData);

			alert('success', 'Curso creado exitosamente');
			onSuccess();
			onClose();
		} catch (error) {
			console.error('Error creating course:', error);
			alert('error', 'Ocurrió un error al crear el curso');
		} finally {
			isSubmitting = false;
		}
	}

	function resetForm() {
		title = '';
		description = '';
		category = '';
		subcategory = '';
		difficulty = 'INTERMEDIATE';
		tagsInput = '';
		price = 0;
		currency = 'USD';
		whatsappGroupUrl = '';
	}

	function handleClose() {
		onClose();
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<BlurOverlay class="flex items-center justify-center p-4">
			<div
				class="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
				transition:scale={{ duration: 300, start: 0.95, opacity: 0 }}
				onclick={(e) => e.stopPropagation()}
			>
				<!-- Header -->
				<div class="bg-stone-900 px-6 py-5 text-white">
					<div class="flex items-center justify-between">
						<div>
							<h2 class="text-xl font-bold">Crear Nuevo Curso</h2>
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
				<div class="custom-scrollbar max-h-[75vh] space-y-6 overflow-y-auto p-8">
					<div class="grid gap-6 md:grid-cols-2">
						<!-- Title -->
						<div class="md:col-span-2">
							<label class="mb-2 block text-sm font-bold text-stone-700" for="title">Título del Curso *</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<BookIcon class="size-5 text-stone-400" />
								</div>
								<Input
									id="title"
									placeholder="Ej. Pastelería Creativa desde Cero"
									bind:value={title}
								/>
							</div>
						</div>

						<!-- Description -->
						<div class="md:col-span-2">
							<label class="mb-2 block text-sm font-bold text-stone-700" for="description">Descripción * (mín. 20 caracteres)</label>
							<TextArea
								id="description"
								placeholder="Describe de qué trata el curso, qué aprenderán los estudiantes..."
								bind:value={description}
								rows={4}
							/>
						</div>

						<!-- Category -->
						<div>
							<label class="mb-2 block text-sm font-bold text-stone-700" for="category">Categoría *</label>
							<Select bind:value={category} id="category">
								<option value="" disabled selected>Selecciona una categoría</option>
								{#each COURSE_CATEGORIES as cat, i (i)}
									<option value={cat}>{cat}</option>
								{/each}
							</Select>
						</div>

						<!-- Subcategory -->
						<div>
							<label class="mb-2 block text-sm font-bold text-stone-700" for="subcategory">Subcategoría (Opcional)</label>
							<Input
								id="subcategory"
								placeholder="Ej. Decoración"
								bind:value={subcategory}
							/>
						</div>

						<!-- Difficulty -->
						<div>
							<label class="mb-2 block text-sm font-bold text-stone-700" for="difficulty">Dificultad *</label>
							<Select bind:value={difficulty} id="difficulty">
								{#each COURSE_DIFFICULTIES as diff, i (i)}
									<option value={diff.value}>{diff.label}</option>
								{/each}
							</Select>
						</div>

						<!-- Tags -->
						<div>
							<label class="mb-2 block text-sm font-bold text-stone-700" for="tags">Etiquetas (separadas por coma)</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<TagIcon class="size-5 text-stone-400" />
								</div>
								<Input
									id="tags"
									placeholder="Ej. pasteles, chocolate, principiante"
									bind:value={tagsInput}
								/>
							</div>
						</div>

						<!-- Price -->
						<div>
							<label class="mb-2 block text-sm font-bold text-stone-700" for="price">Precio *</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<CashIcon class="size-5 text-stone-400" />
								</div>
								<Input
									id="price"
									type="number"
									placeholder="0.00"
									bind:value={price}
								/>
							</div>
						</div>

						<!-- Currency -->
						<div>
							<label class="mb-2 block text-sm font-bold text-stone-700" for="currency">Moneda *</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<WorldIcon class="size-5 text-stone-400" />
								</div>
								<Input
									id="currency"
									placeholder="USD"
									bind:value={currency}
								/>
							</div>
						</div>

						<!-- WhatsApp Group URL -->
						<div class="md:col-span-2">
							<label class="mb-2 block text-sm font-bold text-stone-700" for="whatsapp">Link Grupo de WhatsApp *</label>
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<WhatsappIcon class="size-5 text-green-500" />
								</div>
								<Input
									id="whatsapp"
									placeholder="https://chat.whatsapp.com/..."
									bind:value={whatsappGroupUrl}
								/>
							</div>
						</div>
					</div>

					<!-- Info Box -->
					<div class="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
						<BookIcon class="mt-0.5 size-5 shrink-0 text-rose-400" />
						<p class="text-xs leading-relaxed font-medium text-stone-500">
							El curso se creará inicialmente en estado
							<span class="font-bold tracking-wider text-rose-600 uppercase">Borrador (DRAFT)</span>.
							Podrás editarlo y publicarlo más tarde desde el panel de administración.
						</p>
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
						Crear Curso
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
