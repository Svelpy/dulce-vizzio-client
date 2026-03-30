<script lang="ts">
	import { Button, BlurOverlay, Input, Select, TextArea } from '$lib/components/ui';
	import { XIcon, BookIcon, TagIcon, CashIcon, WorldIcon, WhatsappIcon, PlusIcon, RefreshIcon } from '$lib/icons/outline';
	import { scale, fade } from 'svelte/transition';
	import { COURSE_CATEGORIES, COURSE_DIFFICULTIES } from '$lib/data';
	import type { CreateCourseRequest, UpdateCourseRequest, Course, CourseDifficulty } from '$lib/interfaces';

	interface Props {
		isOpen: boolean;
		course?: Course | null;
		isSubmitting?: boolean;
		onClose: () => void;
		onSubmit: (data: CreateCourseRequest | UpdateCourseRequest) => void;
	}

	let { isOpen, course = null, isSubmitting = false, onClose, onSubmit }: Props = $props();

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

	// Initialize form when course prop changes
	$effect(() => {
		if (isOpen && course) {
			title = course.title;
			description = course.description;
			category = course.category;
			subcategory = course.subcategory || '';
			difficulty = course.difficulty;
			tagsInput = course.tags.join(', ');
			price = course.price;
			currency = course.currency;
			whatsappGroupUrl = course.whatsapp_group_url || '';
		} else if (isOpen && !course) {
			resetForm();
		}
	});

	function handleSubmit() {
		const tags = tagsInput
			.split(',')
			.map((tag) => tag.trim())
			.filter((tag) => tag.length > 0);

		const formData: CreateCourseRequest = {
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

		onSubmit(formData);
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
				role="dialog"
				aria-modal="true"
				tabindex="-1"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => {
					if (e.key === 'Escape') handleClose();
				}}
			>
				<!-- Header -->
				<div class="bg-stone-900 px-6 py-6 text-white sm:px-8">
					<div class="flex items-center justify-between">
						<div class="space-y-1">
							<h2 class="text-2xl font-bold tracking-tight">
								{course ? 'Actualizar Curso' : 'Crear Nuevo Curso'}
							</h2>
							<p class="text-xs font-semibold tracking-widest text-stone-400 uppercase">
								{course ? 'Modificar contenido existente' : 'Gestión de Contenido'}
							</p>
						</div>
						<button
							class="rounded-full p-2 transition-all hover:bg-white/10 active:scale-90"
							onclick={handleClose}
							aria-label="Cerrar modal"
						>
							<XIcon class="size-6" />
						</button>
					</div>
				</div>

				<!-- Form Content -->
				<div class="custom-scrollbar max-h-[70vh] space-y-8 overflow-y-auto p-6 sm:p-8">
					<div class="grid gap-6 md:grid-cols-2">
						<!-- Title -->
						<div class="md:col-span-2">
							<label class="mb-2 block text-sm font-bold text-stone-700" for="title">Título del Curso *</label>
							<div class="relative group">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 transition-colors group-focus-within:text-stone-900 text-stone-400">
									<BookIcon class="size-5" />
								</div>
								<Input
									id="title"
									placeholder="Ej. Pastelería Creativa desde Cero"
									bind:value={title}
									class="pl-10 focus:ring-2 focus:ring-stone-900/5 transition-all"
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
								class="focus:ring-2 focus:ring-stone-900/5 transition-all"
							/>
							<div class="mt-1 flex justify-end">
								<span class="text-[10px] font-medium {description.length < 20 ? 'text-rose-500' : 'text-emerald-500'}">
									{description.length} caracteres
								</span>
							</div>
						</div>

						<!-- Category -->
						<div class="space-y-1.5">
							<label class="block text-sm font-bold text-stone-700" for="category">Categoría *</label>
							<Select bind:value={category} id="category" class="focus:ring-2 focus:ring-stone-900/5 transition-all">
								<option value="" disabled selected>Selecciona una categoría</option>
								{#each COURSE_CATEGORIES as cat, i (i)}
									<option value={cat}>{cat}</option>
								{/each}
							</Select>
						</div>

						<!-- Subcategory -->
						<div class="space-y-1.5">
							<label class="block text-sm font-bold text-stone-700" for="subcategory">Subcategoría (Opcional)</label>
							<Input
								id="subcategory"
								placeholder="Ej. Decoración"
								bind:value={subcategory}
								class="focus:ring-2 focus:ring-stone-900/5 transition-all"
							/>
						</div>

						<!-- Difficulty -->
						<div class="space-y-1.5">
							<label class="block text-sm font-bold text-stone-700" for="difficulty">Dificultad *</label>
							<Select bind:value={difficulty} id="difficulty" class="focus:ring-2 focus:ring-stone-900/5 transition-all">
								{#each COURSE_DIFFICULTIES as diff, i (i)}
									<option value={diff.value}>{diff.label}</option>
								{/each}
							</Select>
						</div>

						<!-- Tags -->
						<div class="space-y-1.5">
							<label class="block text-sm font-bold text-stone-700" for="tags">Etiquetas</label>
							<div class="relative group">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400 group-focus-within:text-stone-900">
									<TagIcon class="size-5" />
								</div>
								<Input
									id="tags"
									placeholder="pasteles, chocolate..."
									bind:value={tagsInput}
									class="pl-10 focus:ring-2 focus:ring-stone-900/5 transition-all"
								/>
							</div>
						</div>

						<!-- Price -->
						<div class="space-y-1.5">
							<label class="block text-sm font-bold text-stone-700" for="price">Precio *</label>
							<div class="relative group">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400 group-focus-within:text-stone-900">
									<CashIcon class="size-5" />
								</div>
								<Input
									id="price"
									type="number"
									placeholder="0.00"
									bind:value={price}
									class="pl-10 focus:ring-2 focus:ring-stone-900/5 transition-all"
								/>
							</div>
						</div>

						<!-- Currency -->
						<div class="space-y-1.5">
							<label class="block text-sm font-bold text-stone-700" for="currency">Moneda *</label>
							<div class="relative group">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400 group-focus-within:text-stone-900">
									<WorldIcon class="size-5" />
								</div>
								<Input
									id="currency"
									placeholder="USD"
									bind:value={currency}
									class="pl-10 focus:ring-2 focus:ring-stone-900/5 transition-all"
								/>
							</div>
						</div>

						<!-- WhatsApp Group URL -->
						<div class="md:col-span-2">
							<label class="mb-2 block text-sm font-bold text-stone-700" for="whatsapp">Link Grupo de WhatsApp *</label>
							<div class="relative group">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400 group-focus-within:text-green-600">
									<WhatsappIcon class="size-5 transition-colors" />
								</div>
								<Input
									id="whatsapp"
									placeholder="https://chat.whatsapp.com/..."
									bind:value={whatsappGroupUrl}
									class="pl-10 focus:ring-2 focus:ring-stone-900/5 transition-all"
								/>
							</div>
						</div>
					</div>

					<!-- Info Box -->
					{#if !course}
						<div class="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50/50 p-4" transition:fade>
							<BookIcon class="mt-0.5 size-5 shrink-0 text-rose-400" />
							<p class="text-xs leading-relaxed font-medium text-stone-600">
								El curso se creará inicialmente en estado
								<span class="font-bold tracking-wider text-rose-600 uppercase">Borrador (DRAFT)</span>.
								Podrás editarlo y publicarlo más tarde desde el panel de administración.
							</p>
						</div>
					{:else}
						<div class="flex items-start gap-3 rounded-2xl border border-stone-100 bg-stone-50/50 p-4" transition:fade>
							<RefreshIcon class="mt-0.5 size-5 shrink-0 text-stone-400" />
							<p class="text-xs leading-relaxed font-medium text-stone-600">
								Estás editando el curso <span class="font-bold text-stone-900">"{course.title}"</span>. 
								Los cambios se aplicarán inmediatamente (si el curso está publicado, los alumnos verán los cambios).
							</p>
						</div>
					{/if}
				</div>

				<!-- Footer Actions -->
				<div class="flex flex-col gap-3 border-t border-stone-100 bg-stone-50/50 px-8 py-6 sm:flex-row">
					<Button 
						variant="outline" 
						class="flex-1 order-2 sm:order-1 border-stone-200 py-4 hover:bg-white hover:border-stone-300 transition-all font-bold" 
						onclick={handleClose}
					>
						Cancelar
					</Button>
					<Button
						class="flex-1 order-1 sm:order-2 bg-stone-900 py-4 text-white shadow-lg shadow-stone-900/20 transition-all hover:bg-stone-800 active:scale-95 font-bold"
						loading={isSubmitting}
						onclick={handleSubmit}
						disabled={isSubmitting}
					>
						{#if isSubmitting}
							{course ? 'Guardando...' : 'Creando...'}
						{:else if course}
							<RefreshIcon class="mr-2 size-5" />
							Actualizar Curso
						{:else}
							<PlusIcon class="mr-2 size-5" />
							Crear Curso
						{/if}
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
