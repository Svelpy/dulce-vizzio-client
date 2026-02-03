<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import CourseCard from '$lib/components/features/courses/courseCard.svelte';
	import { EnrollmentsService, CoursesService } from '$lib/services';
	import type { Enrollment, Course, EnrollmentStatus } from '$lib/interfaces';

	let enrollments: Enrollment[] = $state([]);
	let courses: Map<string, Course> = $state(new Map());
	let loading = $state(true);
	let activeTab: EnrollmentStatus | 'ALL' = $state('ACTIVE');

	const tabs = [
		{ value: 'ALL' as const, label: 'Todos' },
		{ value: 'ACTIVE' as const, label: 'Activos' },
		{ value: 'EXPIRED' as const, label: 'Expirados' },
		{ value: 'CANCELLED' as const, label: 'Cancelados' }
	];

	const filteredEnrollments = $derived(
		activeTab === 'ALL' ? enrollments : enrollments.filter((e) => e.status === activeTab)
	);

	onMount(async () => {
		await loadEnrollments();
	});

	const loadEnrollments = async () => {
		loading = true;
		try {
			const response = await EnrollmentsService.getMyEnrollments({ size: 100 });
			enrollments = response.data;

			// Load course details for each enrollment
			const coursePromises = enrollments.map(async (enrollment) => {
				try {
					const course = await CoursesService.getBySlug(enrollment.course_id);
					return { id: enrollment.course_id, course };
				} catch (error) {
					console.error(`Error loading course ${enrollment.course_id}:`, error);
					return null;
				}
			});

			const courseResults = await Promise.all(coursePromises);
			const newCourses = new Map<string, Course>();
			courseResults.forEach((result) => {
				if (result) {
					newCourses.set(result.id, result.course);
				}
			});
			courses = newCourses;
		} catch (error) {
			console.error('Error loading enrollments:', error);
		} finally {
			loading = false;
		}
	};

	const calculateProgress = (enrollment: Enrollment, course?: Course): number => {
		if (!course) return 0;
		if (enrollment.completed_at) return 100;
		// Simplified - in reality you'd track completed lessons
		return Math.floor(Math.random() * 60) + 10;
	};

	const handleCourseClick = (enrollment: Enrollment) => {
		const course = courses.get(enrollment.course_id);
		if (!course) return;

		if (enrollment.status === 'ACTIVE') {
			if (enrollment.last_accessed_lesson_id) {
				goto(`/app/courses/${course.slug}/learn`);
			} else {
				goto(`/app/courses/${course.slug}`);
			}
		} else {
			goto(`/app/courses/${course.slug}`);
		}
	};
</script>

<div class="space-y-8">
	<!-- Header -->
	<div>
		<h1 class="mb-2 text-3xl font-bold text-gray-900">Mis Cursos</h1>
		<p class="text-gray-600">Gestiona tus cursos inscritos y continúa aprendiendo</p>
	</div>

	<!-- Tabs -->
	<div class="border-grey/30 border-b">
		<div class="flex gap-4">
			{#each tabs as tab}
				<button
					class="border-b-2 px-4 py-3 font-semibold transition-colors {activeTab === tab.value
						? 'border-rose text-rose'
						: 'border-transparent text-gray-600 hover:text-gray-900'}"
					onclick={() => (activeTab = tab.value)}
				>
					{tab.label}
					{#if tab.value === 'ALL'}
						({enrollments.length})
					{:else}
						({enrollments.filter((e) => e.status === tab.value).length})
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- Content -->
	{#if loading}
		<div class="flex justify-center py-12">
			<div
				class="border-rose h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
			></div>
		</div>
	{:else if filteredEnrollments.length > 0}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredEnrollments as enrollment (enrollment.id)}
				{@const course = courses.get(enrollment.course_id)}
				{#if course}
					<div class="relative">
						<CourseCard
							{course}
							showProgress={enrollment.status === 'ACTIVE'}
							progress={calculateProgress(enrollment, course)}
							onclick={() => handleCourseClick(enrollment)}
						/>

						<!-- Status Badge -->
						{#if enrollment.status !== 'ACTIVE'}
							<div class="absolute top-3 right-3">
								<span
									class="rounded-full px-3 py-1 text-xs font-semibold {enrollment.status ===
									'EXPIRED'
										? 'bg-orange-100 text-orange-800'
										: 'bg-red-100 text-red-800'}"
								>
									{enrollment.status === 'EXPIRED' ? 'Expirado' : 'Cancelado'}
								</span>
							</div>
						{/if}

						<!-- Expiration Info -->
						{#if enrollment.status === 'ACTIVE' && enrollment.expires_at}
							{@const daysLeft = Math.ceil(
								(new Date(enrollment.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
							)}
							{#if daysLeft < 30}
								<div class="mt-2 text-sm text-orange-600">
									⚠️ Expira en {daysLeft} días
								</div>
							{/if}
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	{:else}
		<div class="border-grey/30 rounded-xl border bg-white p-12 text-center">
			<div class="mb-4 text-6xl">📚</div>
			<h3 class="mb-2 text-xl font-bold text-gray-900">
				{activeTab === 'ALL'
					? 'No tienes cursos inscritos'
					: `No tienes cursos ${activeTab.toLowerCase()}`}
			</h3>
			<p class="mb-6 text-gray-600">
				{activeTab === 'ALL'
					? 'Explora nuestro catálogo y comienza a aprender'
					: 'Cambia de pestaña para ver otros cursos'}
			</p>
			{#if activeTab === 'ALL'}
				<button
					onclick={() => goto('/app/courses')}
					class="bg-rose hover:bg-rose/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-colors"
				>
					Explorar Cursos
				</button>
			{/if}
		</div>
	{/if}
</div>
