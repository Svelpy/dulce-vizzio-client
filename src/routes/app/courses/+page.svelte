<script lang="ts">
	import { onMount } from 'svelte';
	import CourseCard from '$lib/components/features/course/courseCard.svelte';
	import {
		Input,
		Select,
		Button,
		MainLayout,
		DropdownMenu,
		ModalConfirm
	} from '$lib/components/ui';
	import { courseService } from '$lib/services';
	import { authStore } from '$lib/stores';
	import { Role } from '$lib/constants/roles';
	import { COURSE_CATEGORIES, COURSE_DIFFICULTIES } from '$lib/data';
	import CreateEnrollmentModal from '$lib/components/features/enrollments/CreateEnrollmentModal.svelte';
	import type {
		Course,
		CourseDifficulty,
		CourseFilters,
		CourseStatus,
		CreateCourseRequest,
		UpdateCourseRequest,
		DropdownOption
	} from '$lib/interfaces';
	import { debounce, redirect, alert } from '$lib/utils';
	import {
		PlusIcon,
		BookIcon,
		PencilIcon,
		DotsVerticalIcon,
		TrashIcon,
		CakeIcon,
		FiltersIcon,
		ChevronLeftIcon,
		ZoomIcon,
		ChevronsRightIcon
	} from '$lib/icons/outline';
	import { CourseModal, CreateLessonModal } from '$lib/components/features/course';
	import { CourseCardSkeleton } from '$lib/components/skeletons/course';
	import { cn } from '$lib/utils';

	let courses: Course[] = $state([]);
	let loading = $state(true);
	let totalCourses = $state(0);
	let totalPages = $state(0);
	let isModalOpen = $state(false);
	let isCourseModalOpen = $state(false);
	let isCreateLessonModalOpen = $state(false);
	let selectedCourse = $state<Course | null>(null);
	let isSubmittingCourse = $state(false);
	let openDropdownId = $state<string | null>(null);

	// Pagination
	let currentPage: number = $state(1);
	let perPage: number = $state(12);

	// Filters
	let searchQuery: string = $state('');
	let selectedCategory: string | number = $state('');
	let selectedDifficulty: CourseDifficulty = $state('');
	let selectedStatus: CourseStatus | '' = $state('');

	const categories = [{ id: '', name: 'Todos', icon: null }, ...COURSE_CATEGORIES];

	const difficulties: { value: CourseDifficulty | ''; label: string }[] = [
		{ value: '', label: 'Todas las dificultades' },
		...COURSE_DIFFICULTIES
	];

	const statuses: { value: CourseStatus | ''; label: string }[] = [
		{ value: '', label: 'Estado: Todos' },
		{ value: 'DRAFT', label: 'Estado: Borrador' },
		{ value: 'REVIEW', label: 'Estado: En revisión' },
		{ value: 'PUBLISHED', label: 'Estado: Publicado' },
		{ value: 'ARCHIVED', label: 'Estado: Archivado' },
		{ value: 'RETIRED', label: 'Estado: Retirado' }
	];

	function getCourseOptions(course: Course): DropdownOption[] {
		return [
			{
				id: 'enroll',
				label: 'Inscribir Alumno',
				icon: PlusIcon,
				action: () => openEnrollmentModal(course)
			},
			{
				id: 'edit',
				label: 'Editar Curso',
				icon: PencilIcon,
				action: () => openEditCourseModal(course)
			},
			{
				id: 'lesson',
				label: 'Agregar Lección',
				icon: BookIcon,
				action: () => openCreateLessonModal(course)
			},
			{
				id: 'delete',
				label: 'Eliminar Curso',
				icon: TrashIcon,
				action: () => openDeleteModal(course),
				divider: true,
				variant: 'destructive'
			}
		];
	}

	function toggleDropdown(id: string) {
		openDropdownId = openDropdownId === id ? null : id;
	}

	let isDeleteModalOpen = $state(false);
	let isDeletingCourse = $state(false);

	function openDeleteModal(course: Course) {
		selectedCourse = course;
		isDeleteModalOpen = true;
	}

	async function handleDeleteConfirm() {
		if (!selectedCourse) return;
		isDeletingCourse = true;
		try {
			await courseService.delete(selectedCourse.id);
			courses = courses.filter((c) => c.id !== selectedCourse!.id);
			alert('success', 'Curso eliminado exitosamente');
			isDeleteModalOpen = false;
		} catch (error) {
			console.error('Error deleting course:', error);
			alert('error', 'Ocurrió un error al eliminar el curso');
		} finally {
			selectedCourse = null;
			isDeletingCourse = false;
		}
	}

	function openEnrollmentModal(course: Course) {
		selectedCourse = course;
		isModalOpen = true;
	}

	function openCreateCourseModal() {
		selectedCourse = null;
		isCourseModalOpen = true;
	}

	function openEditCourseModal(course: Course) {
		selectedCourse = course;
		isCourseModalOpen = true;
	}

	async function handleCourseSubmit(data: CreateCourseRequest | UpdateCourseRequest) {
		isSubmittingCourse = true;
		try {
			if (selectedCourse) {
				const updatedCourse = await courseService.update(selectedCourse.id, data);
				courses = courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c));
				alert('success', 'Curso actualizado exitosamente');
			} else {
				const newCourse = await courseService.create(data as CreateCourseRequest);
				courses = [newCourse, ...courses];
				alert('success', 'Curso creado exitosamente');
			}
			isCourseModalOpen = false;
			selectedCourse = null;
		} catch (error) {
			console.error('Error saving course:', error);
			alert('error', 'Ocurrió un error al guardar el curso');
		} finally {
			isSubmittingCourse = false;
		}
	}

	function openCreateLessonModal(course: Course) {
		selectedCourse = course;
		isCreateLessonModalOpen = true;
	}

	onMount(() => {
		loadCourses();
	});

	const loadCourses = async () => {
		loading = true;
		try {
			const filters: CourseFilters = {
				page: currentPage,
				limit: perPage
			};

			if (searchQuery) filters.search = searchQuery;
			if (selectedCategory !== '') filters.category = selectedCategory.toString();
			if (selectedDifficulty) filters.difficulty = selectedDifficulty;
			if (selectedStatus) filters.status = selectedStatus;

			const response = await courseService.getAll(filters);
			courses = response.data;
			totalCourses = response.total;
			totalPages = response.pages;
		} catch (error) {
			console.error('Error loading courses:', error);
		} finally {
			loading = false;
		}
	};

	const debouncedSearch = debounce(() => {
		currentPage = 1;
		loadCourses();
	}, 300);

	const handleSearchInput = () => {
		debouncedSearch();
	};

	function handleFilterChange() {
		currentPage = 1;
		loadCourses();
	}

	const handleCategoryChange = (categoryId: string | number) => {
		selectedCategory = categoryId;
		currentPage = 1;
		loadCourses();
	};

	const handlePageChange = (page: number) => {
		currentPage = page;
		loadCourses();
	};

	const handleCourseClick = (slug: string) => {
		redirect(`/app/courses/${slug}`);
	};
</script>

<MainLayout
	title="Cursos"
	description="Explora nuestros cursos de repostería"
	noIndex={true}
	class="bg-sweet-pink-50/20"
>
	<div class="space-y-8 pb-32">
		<!-- ─── Header Section ─── -->
		<div class="flex flex-col items-start justify-between gap-4 px-2 sm:flex-row sm:items-center">
			<div>
				<h1 class="flex items-center gap-2 text-3xl font-black text-sweet-brown">
					Explorar Cursos 🧁
				</h1>
				<p class="mt-1 text-sm font-bold text-sweet-brown/40">
					Descubre deliciosos cursos de repostería
				</p>
			</div>

			{#if $authStore.user?.role === Role.SUPERADMIN || $authStore.user?.role === Role.ADMIN}
				<Button
					onclick={openCreateCourseModal}
					class="sweet-gradient-intense h-11 rounded-2xl px-6 text-sm font-black text-white shadow-sweet active:scale-95"
				>
					<PlusIcon class="mr-2 h-5 w-5" />
					<span>Nuevo Curso</span>
				</Button>
			{/if}
		</div>

		<!-- ─── Optimized Filters Section ─── -->
		<div class="flex flex-col gap-6 px-2">
			<!-- Search and Status row -->
			<div class="flex flex-col gap-4 md:flex-row">
				<div class="relative flex-1">
					<Input
						bind:value={searchQuery}
						placeholder="Buscar cursos..."
						oninput={handleSearchInput}
						icon={ZoomIcon}
					/>
				</div>

				<div class="flex flex-col gap-4 sm:flex-row">
					{#if $authStore.user?.role === Role.SUPERADMIN || $authStore.user?.role === Role.ADMIN}
						<div class="min-w-[200px]">
							<Select bind:value={selectedStatus} onchange={handleFilterChange}>
								{#each statuses as status, index (index)}
									<option value={status.value}>{status.label}</option>
								{/each}
							</Select>
						</div>
					{/if}

					<div class="min-w-[200px]">
						<Select bind:value={selectedDifficulty} onchange={handleFilterChange}>
							{#each difficulties as diff, index (index)}
								<option value={diff.value}>{diff.label}</option>
							{/each}
						</Select>
					</div>
				</div>
			</div>

			<div class="scrollbar-none flex items-center gap-3 overflow-x-auto pb-4">
				{#each categories as category, index (index)}
					<button
						onclick={() => handleCategoryChange(category.id)}
						class={cn(
							'flex shrink-0 items-center gap-2 rounded-2xl border-2 px-5 py-2.5 text-sm font-black transition-all duration-300',
							selectedCategory === category.id
								? 'sweet-gradient-intense border-transparent text-white shadow-sweet'
								: 'border-white bg-white/60 text-sweet-brown/60 ring-2 ring-transparent hover:border-sweet-pink-100 hover:ring-sweet-pink-50'
						)}
					>
						{#if category.id === ''}
							<FiltersIcon class="h-4 w-4" />
						{:else}
							<span class="text-base">{category.icon}</span>
						{/if}
						{category.name}
					</button>
				{/each}
			</div>
		</div>

		<!-- ─── Course Listing Grid ─── -->
		<div class="px-2">
			<div class="mb-6 flex items-center gap-2">
				<div class="h-1.5 w-1.5 rounded-full bg-sweet-pink-300"></div>
				<h3 class="text-xl font-black text-sweet-brown">Todos los Cursos</h3>
				<div class="h-1.5 w-1.5 rounded-full bg-sweet-pink-300"></div>
			</div>

			{#if loading}
				<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
					{#each Array(6) as _, index (index)}
						<CourseCardSkeleton />
					{/each}
				</div>
			{:else if courses.length > 0}
				<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
					{#each courses as course (course.id)}
						<CourseCard {course} onclick={() => handleCourseClick(course.slug)}>
							{#snippet actions()}
								{#if $authStore.user?.role === Role.SUPERADMIN || $authStore.user?.role === Role.ADMIN}
									<div class="relative">
										<button
											class="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-sweet-pink-400 shadow-md backdrop-blur-sm transition-all hover:bg-sweet-pink-400 hover:text-white"
											onclick={(e) => {
												e.stopPropagation();
												toggleDropdown(course.id);
											}}
										>
											<DotsVerticalIcon class="h-5 w-5" />
										</button>
										<DropdownMenu
											isOpen={openDropdownId === course.id}
											options={getCourseOptions(course)}
											width={190}
											class="absolute top-12 right-0 z-50 rounded-2xl border-none p-2 shadow-sweet"
										/>
									</div>
								{/if}
							{/snippet}
						</CourseCard>
					{/each}
				</div>

				<!-- ─── Enhanced Pagination ─── -->
				{#if totalPages > 1}
					<div class="mt-16 flex items-center justify-center gap-2">
						<button
							onclick={() => handlePageChange(Math.max(1, currentPage - 1))}
							disabled={currentPage === 1}
							class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white font-black text-sweet-brown shadow-sm transition-all hover:bg-sweet-pink-50 disabled:opacity-30"
						>
							<ChevronLeftIcon class="h-5 w-5" />
						</button>

						<div class="flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-sm">
							{#each Array.from({ length: totalPages }, (_, i) => i + 1) as page, index (index)}
								{#if Math.abs(page - currentPage) < 3 || page === 1 || page === totalPages}
									<button
										onclick={() => handlePageChange(page)}
										class={cn(
											'flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black transition-all duration-300',
											currentPage === page
												? 'sweet-gradient-intense text-white shadow-md'
												: 'text-sweet-brown/40 hover:bg-sweet-pink-50'
										)}
									>
										{page}
									</button>
								{:else if Math.abs(page - currentPage) === 3}
									<span class="px-2 text-sweet-brown/20">...</span>
								{/if}
							{/each}
						</div>

						<button
							onclick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
							disabled={currentPage === totalPages}
							class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white font-black text-sweet-brown shadow-sm transition-all hover:bg-sweet-pink-50 disabled:opacity-30"
						>
							<ChevronsRightIcon class="h-5 w-5" />
						</button>
					</div>
				{/if}
			{:else}
				<!-- Empty State -->
				<div class="flex flex-col items-center justify-center py-32 text-center">
					<div
						class="mb-6 flex h-24 w-24 items-center justify-center rounded-[32px] bg-white shadow-sweet"
					>
						<CakeIcon class="h-12 w-12 text-sweet-pink-100" />
					</div>
					<h3 class="text-2xl font-black text-sweet-brown">No se encontraron cursos</h3>
					<p class="mt-2 text-sm font-bold text-sweet-brown/40">
						Intenta ajustar los filtros de búsqueda o categoría
					</p>
					<Button
						variant="outline"
						class="mt-8 h-12 rounded-2xl border-2 border-sweet-pink-100 px-8 font-black text-sweet-pink-400 hover:bg-sweet-pink-50"
						onclick={() => {
							searchQuery = '';
							selectedCategory = '';
							selectedDifficulty = '';
							selectedStatus = '';
							loadCourses();
						}}
					>
						Reestablecer búsqueda
					</Button>
				</div>
			{/if}
		</div>
	</div>

	<!-- Modals -->
	<CreateEnrollmentModal
		isOpen={isModalOpen}
		initialCourse={selectedCourse}
		onClose={() => {
			isModalOpen = false;
			selectedCourse = null;
		}}
		onSuccess={() => {
			isModalOpen = false;
			selectedCourse = null;
			loadCourses();
		}}
	/>

	<CourseModal
		isOpen={isCourseModalOpen}
		course={selectedCourse}
		isSubmitting={isSubmittingCourse}
		onClose={() => {
			isCourseModalOpen = false;
			selectedCourse = null;
		}}
		onSubmit={handleCourseSubmit}
	/>

	{#if selectedCourse}
		<CreateLessonModal
			isOpen={isCreateLessonModalOpen}
			courseId={selectedCourse.id}
			onClose={() => {
				isCreateLessonModalOpen = false;
				selectedCourse = null;
			}}
			onSuccess={() => {
				isCreateLessonModalOpen = false;
				selectedCourse = null;
				loadCourses();
			}}
		/>
	{/if}

	<ModalConfirm
		isOpen={isDeleteModalOpen}
		message={`¿Estás seguro que deseas eliminar el curso "${selectedCourse?.title}"? Esta acción no se puede deshacer.`}
		onConfirm={handleDeleteConfirm}
		onCancel={() => {
			isDeleteModalOpen = false;
			selectedCourse = null;
		}}
		loading={isDeletingCourse}
	/>
</MainLayout>
