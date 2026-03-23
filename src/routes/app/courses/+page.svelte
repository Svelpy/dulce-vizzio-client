<script lang="ts">
	import { onMount } from 'svelte';
	import CourseCard from '$lib/components/features/course/courseCard.svelte';
	import { Input, Select, Pagination, Button } from '$lib/components/ui';
	import { CoursesService } from '$lib/services';
	import { authStore } from '$lib/stores';
	import { Role } from '$lib/constants/roles';
	import { COURSE_CATEGORIES, COURSE_DIFFICULTIES } from '$lib/data';
	import CreateEnrollmentModal from '$lib/components/features/enrollments/CreateEnrollmentModal.svelte';
	import type { Course, CourseDifficulty, CourseFilters } from '$lib/interfaces';
	import { debounce, redirect } from '$lib/utils';
	import { FiltersIcon, PlusIcon, BookIcon } from '$lib/icons/outline';
	import { CreateCourseModal, CreateLessonModal } from '$lib/components/features/course';

	let courses: Course[] = $state([]);
	let loading = $state(true);
	let totalCourses = $state(0);
	let totalPages = $state(2000);
	let isModalOpen = $state(false);
	let isCreateCourseModalOpen = $state(false);
	let isCreateLessonModalOpen = $state(false);
	let selectedCourse = $state<Course | null>(null);

	function openEnrollmentModal(course: Course) {
		selectedCourse = course;
		isModalOpen = true;
	}

	function openCreateCourseModal() {
		isCreateCourseModalOpen = true;
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

			const response = await CoursesService.getAll(filters);
			courses = response.data;
			totalCourses = response.total;
			totalPages = response.pages;
			console.log('courses', courses);
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

<div class="space-y-8">
	<div class="rounded-xl border border-light-four p-6">
		<div class="mb-4 flex items-center gap-2">
			<FiltersIcon class="text-taupe h-5 w-5" />
			<h2 class="text-lg font-bold text-light-black">Filtros</h2>
		</div>

		<div class="grid gap-4 md:grid-cols-3">
			<div>
				<Input
					bind:value={searchQuery}
					placeholder="Buscar cursos..."
					oninput={handleSearchInput}
					onkeydown={(e) => {
						if (e.key === 'Enter') handleSearch();
					}}
				></Input>
			</div>

			<div>
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

			<div>
				<Select
					bind:value={selectedDifficulty}
					onchange={() => handleDifficultyChange(selectedDifficulty)}
				>
					{#each difficulties as difficulty, index (index)}
						<option value={difficulty.value}>{difficulty.label}</option>
					{/each}
				</Select>
			</div>
		</div>

		<div class="mt-4 flex gap-3">
			<Button variant="outline" onclick={handleResetFilters}>Limpiar Filtros</Button>
		</div>
	</div>

	<!-- Results Count -->
	<div class="flex items-center justify-between">
		<p class="text-gray-600">
			Mostrando <span class="font-semibold text-gray-900">{courses.length}</span> de
			<span class="font-semibold text-gray-900">{totalCourses}</span> cursos
		</p>

		{#if $authStore.user?.role === Role.SUPERADMIN || $authStore.user?.role === Role.ADMIN}
			<Button
				variant="primary"
				class="bg-stone-900 px-6 font-bold text-white hover:bg-stone-800"
				onclick={openCreateCourseModal}
			>
				<PlusIcon class="mr-2 size-5" />
				Agregar Curso
			</Button>
		{/if}
	</div>

	<!-- Courses Grid -->
	{#if loading}
		<div class="flex justify-center py-12">
			<div
				class="border-rose h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
			></div>
		</div>
	{:else if courses.length > 0}
		<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
			{#each courses as course (course.id)}
				<div class="flex flex-col gap-2">
					<CourseCard {course} onclick={() => handleCourseClick(course.slug)} />
					{#if $authStore.user?.role === Role.SUPERADMIN || $authStore.user?.role === Role.ADMIN}
						<div class="flex gap-2">
							<Button
								variant="outline"
								class="flex-1 border-stone-200 text-stone-600 hover:border-rose-300 hover:bg-stone-50"
								onclick={(e) => {
									e.stopPropagation();
									openEnrollmentModal(course);
								}}
							>
								Inscribir
							</Button>
							<Button
								variant="outline"
								class="flex-1 border-stone-200 text-stone-600 hover:border-blue-300 hover:bg-stone-50"
								onclick={(e) => {
									e.stopPropagation();
									openCreateLessonModal(course);
								}}
							>
								<BookIcon class="mr-1 size-4" />
								Lección
							</Button>
						</div>
					{/if}
				</div>
			{/each}
		</div>

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

		<CreateCourseModal
			isOpen={isCreateCourseModalOpen}
			onClose={() => {
				isCreateCourseModalOpen = false;
			}}
			onSuccess={() => {
				isCreateCourseModalOpen = false;
				loadCourses();
			}}
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

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="flex justify-center">
				<Pagination
					{currentPage}
					{totalPages}
					{perPage}
					total={totalCourses}
					onPageChange={handlePageChange}
				/>
			</div>
		{/if}
	{:else}
		<div class="border-grey/30 rounded-xl border bg-white p-12 text-center">
			<div class="mb-4 text-6xl">🔍</div>
			<h3 class="mb-2 text-xl font-bold text-gray-900">No se encontraron cursos</h3>
			<p class="mb-6 text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
			<Button variant="outline" onclick={handleResetFilters}>Limpiar Filtros</Button>
		</div>
	{/if}
</div>
