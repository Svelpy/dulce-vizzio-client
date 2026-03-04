<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import CourseCard from '$lib/components/features/course/courseCard.svelte';
	import { Input, Select, Pagination, Button } from '$lib/components/ui';
	import { CoursesService } from '$lib/services';
	import type { Course, CourseFilters } from '$lib/interfaces';
	import { ZoomIcon, FiltersIcon } from '$lib/icons/outline';

	let courses: Course[] = $state([]);
	let loading = $state(true);
	let totalCourses = $state(0);
	let totalPages = $state(2000);

	// Filters — only sent when user explicitly picks a value
	let searchQuery = $state('');
	let selectedCategory = $state('');
	let selectedDifficulty = $state('');
	let currentPage = $state(1);
	let perPage = $state(12);

	// Categories (you might want to fetch these from API)
	const categories = ['Pasteles', 'Macarons', 'Chocolatería', 'Panes', 'Decoración', 'Postres'];

	const difficulties = [
		{ value: '', label: 'Todas las dificultades' },
		{ value: 'BEGINNER', label: 'Principiante' },
		{ value: 'INTERMEDIATE', label: 'Intermedio' },
		{ value: 'ADVANCED', label: 'Avanzado' }
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
			if (selectedDifficulty) filters.difficulty = selectedDifficulty as any;

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

	const handleSearch = () => {
		currentPage = 1;
		loadCourses();
	};

	const handleCategoryChange = (category: string) => {
		selectedCategory = category;
		currentPage = 1;
		loadCourses();
	};

	const handleDifficultyChange = (difficulty: string) => {
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
		goto(`/app/courses/${slug}`);
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
					{#each categories as category}
						<option value={category}>{category}</option>
					{/each}
				</Select>
			</div>

			<div>
				<Select
					bind:value={selectedDifficulty}
					onchange={() => handleDifficultyChange(selectedDifficulty)}
				>
					{#each difficulties as difficulty}
						<option value={difficulty.value}>{difficulty.label}</option>
					{/each}
				</Select>
			</div>
		</div>

		<div class="mt-4 flex gap-3">
			<Button variant="primary" onclick={handleSearch}>Buscar</Button>
			<Button variant="outline" onclick={handleResetFilters}>Limpiar Filtros</Button>
		</div>
	</div>

	<!-- Results Count -->
	<div class="flex items-center justify-between">
		<p class="text-gray-600">
			Mostrando <span class="font-semibold text-gray-900">{courses.length}</span> de
			<span class="font-semibold text-gray-900">{totalCourses}</span> cursos
		</p>
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
				<CourseCard {course} onclick={() => handleCourseClick(course.slug)} />
			{/each}
		</div>

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
