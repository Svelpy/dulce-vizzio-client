<script lang="ts">
	import { onMount } from 'svelte';
	import CourseCard from '$lib/components/features/course/courseCard.svelte';
	import {
		Input,
		Select,
		Pagination,
		Button,
		MainLayout,
		DropdownMenu,
		ModalConfirm,
		Heading
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
		CreateCourseRequest,
		UpdateCourseRequest,
		DropdownOption
	} from '$lib/interfaces';
	import { debounce, redirect, alert } from '$lib/utils';
	import {
		FiltersIcon,
		PlusIcon,
		BookIcon,
		PencilIcon,
		DotsVerticalIcon,
		TrashIcon
	} from '$lib/icons/outline';
	import { CourseModal, CreateLessonModal } from '$lib/components/features/course';
	import { CourseCardSkeleton } from '$lib/components/skeletons/course';

	let courses: Course[] = $state([]);
	let loading = $state(true);
	let totalCourses = $state(0);
	let totalPages = $state(2000);
	let isModalOpen = $state(false);
	let isCourseModalOpen = $state(false);
	let isCreateLessonModalOpen = $state(false);
	let selectedCourse = $state<Course | null>(null);
	let isSubmittingCourse = $state(false);
	let openDropdownId = $state<string | null>(null);

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
		console.log('selectedCourse 01', selectedCourse);
		try {
			await courseService.delete(selectedCourse.id);
			console.log('selectedCourse', selectedCourse);
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
				// Update
				const updatedCourse = await courseService.update(selectedCourse.id, data);
				courses = courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c));
				alert('success', 'Curso actualizado exitosamente');
			} else {
				// Create
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

	// Filters — only sent when user explicitly picks a value
	let searchQuery: string = $state('');
	let selectedCategory: string = $state('');
	let selectedDifficulty: CourseDifficulty = $state('');
	let currentPage: number = $state(1);
	let perPage: number = $state(12);

	const categories = COURSE_CATEGORIES;

	const difficulties: { value: CourseDifficulty | ''; label: string }[] = [
		{ value: '', label: 'Todas las dificultades' },
		...COURSE_DIFFICULTIES
	];

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
			if (selectedCategory) filters.category = selectedCategory;
			if (selectedDifficulty) filters.difficulty = selectedDifficulty;

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

	const handleSearch = () => {
		currentPage = 1;
		loadCourses();
	};

	const handleCategoryChange = (category: string) => {
		selectedCategory = category;
		currentPage = 1;
		loadCourses();
	};

	const handleDifficultyChange = (difficulty: CourseDifficulty | '') => {
		selectedDifficulty = difficulty;
		currentPage = 1;
		loadCourses();
	};

	const handlePageChange = (page: number) => {
		currentPage = page;
		loadCourses();
	};

	const handleResetFilters = () => {
		searchQuery = '';
		selectedCategory = '';
		selectedDifficulty = '';
		currentPage = 1;
		loadCourses();
	};

	const handleCourseClick = (slug: string) => {
		redirect(`/app/courses/${slug}`);
	};
</script>

<MainLayout
	title="Cursos"
	description="Administra los cursos de la plataforma"
	noIndex={true}
	class="container mx-auto"
>
	<div class="space-y-8">
		<!-- ─── Page Header ─── -->
		<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<Heading level="h4">Cursos</Heading>
			</div>

			{#if $authStore.user?.role === Role.SUPERADMIN || $authStore.user?.role === Role.ADMIN}
				<Button
					variant="primary"
					class="px-5 py-2.5 shadow-lg shadow-rose-500/20"
					onclick={openCreateCourseModal}
				>
					{#snippet leftIcon()}
						<PlusIcon class="mr-2 size-5" />
					{/snippet}
					<span>Nuevo Curso</span>
				</Button>
			{/if}
		</div>

		<!-- ─── Filters & Search ─── -->
		<div class="mb-8">
			<div class="flex flex-col gap-4 md:flex-row md:items-center">
				<!-- Search -->
				<div class="flex-1">
					<Input
						bind:value={searchQuery}
						placeholder="Buscar cursos por título..."
						oninput={handleSearchInput}
						onkeydown={(e) => {
							if (e.key === 'Enter') handleSearch();
						}}
					/>
				</div>

				<!-- Filters -->
				<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
					<div class="min-w-[180px]">
						<Select
							bind:value={selectedCategory}
							onchange={() => handleCategoryChange(selectedCategory)}
						>
							<option value="">Todas las categorías</option>
							{#each categories as category, index (index)}
								<option value={category}>{category}</option>
							{/each}
						</Select>
					</div>

					<div class="min-w-[180px]">
						<Select
							bind:value={selectedDifficulty}
							onchange={() => handleDifficultyChange(selectedDifficulty)}
						>
							{#each difficulties as difficulty, index (index)}
								<option value={difficulty.value}>{difficulty.label}</option>
							{/each}
						</Select>
					</div>

					<!-- Reset Button -->
					<Button
						variant="outline"
						class="h-[42px] px-4"
						onclick={handleResetFilters}
						title="Limpiar filtros"
					>
						<span class="hidden sm:inline">Limpiar Filtros</span>
						<span class="flex items-center gap-2 sm:hidden">
							<FiltersIcon class="size-4" /> Limpiar
						</span>
					</Button>
				</div>
			</div>
		</div>

		<!-- ─── Content Grid ─── -->
		{#if loading}
			<!-- Loading state -->
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each Array(8) as _, index (index)}
					<CourseCardSkeleton />
				{/each}
			</div>
		{:else if courses.length > 0}
			<!-- Courses Grid -->
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each courses as course (course.id)}
					<CourseCard {course} onclick={() => handleCourseClick(course.slug)}>
						{#snippet actions()}
							{#if $authStore.user?.role === Role.SUPERADMIN || $authStore.user?.role === Role.ADMIN}
								<div class="action-dropdown-container relative">
									<button
										class="flex size-9 items-center justify-center rounded-full bg-stone-900/40 text-white backdrop-blur-md transition-all hover:bg-stone-900/60 dark:bg-stone-900/60 dark:hover:bg-stone-900"
										onclick={(e) => {
											e.stopPropagation();
											toggleDropdown(course.id);
										}}
									>
										<DotsVerticalIcon class="size-5" />
									</button>
									<div class="relative">
										<DropdownMenu
											isOpen={openDropdownId === course.id}
											options={getCourseOptions(course)}
											width={190}
											class="absolute top-full right-0 z-50 mt-2 border border-stone-100 shadow-xl dark:border-stone-800"
										/>
									</div>
								</div>
							{/if}
						{/snippet}
					</CourseCard>
				{/each}
			</div>

			<!-- Pagination Footer -->
			<div>
				<Pagination
					{currentPage}
					{totalPages}
					{perPage}
					total={totalCourses}
					onPageChange={handlePageChange}
				/>
			</div>
		{:else}
			<!-- Empty State -->
			<div
				class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-stone-50/50 px-6 py-24 text-center dark:border-stone-700 dark:bg-stone-900/20"
			>
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-stone-800"
				>
					<span class="text-3xl">🔍</span>
				</div>
				<h3 class="mb-2 text-xl font-bold text-stone-900 dark:text-white">
					No se encontraron cursos
				</h3>
				<p class="mb-6 max-w-sm text-sm font-medium text-stone-500 dark:text-stone-400">
					No hay cursos que coincidan con tu búsqueda actual. Intenta ajustar los filtros de
					categoría o dificultad.
				</p>
				<button
					class="rounded-xl bg-stone-900 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
					onclick={handleResetFilters}
				>
					Limpiar Todos los Filtros
				</button>
			</div>
		{/if}
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
