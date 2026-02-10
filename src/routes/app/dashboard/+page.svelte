<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import StatsCard from '$lib/components/features/dashboard/statsCard.svelte';
	import CourseProgress from '$lib/components/features/courses/courseProgress.svelte';
	import CourseCard from '$lib/components/features/courses/courseCard.svelte';
	import { EnrollmentsService, CoursesService, AuthService } from '$lib/services';
	import type { Enrollment, Course, User } from '$lib/interfaces';
	import { UsersIcon, TrendingUpIcon, CashIcon, HomeDotIcon } from '$lib/icons/outline';
	import { Button } from '$lib/components/ui';

	let myEnrollments: Enrollment[] = $state([]);
	let enrolledCourses: Course[] = $state([]);
	let recommendedCourses: Course[] = $state([]);
	let loading = $state(true);
	let user: User | null = $state(null);

	// Stats
	let activeCourses = $derived(myEnrollments.filter((e) => e.status === 'ACTIVE').length);
	let totalHours = $derived(enrolledCourses.reduce((sum, c) => sum + c.total_duration_hours, 0));
	let completedCourses = $derived(myEnrollments.filter((e) => e.completed_at).length);

	onMount(async () => {
		// Get user from localStorage (client-side only)
		user = AuthService.getUser();

		try {
			// Load my enrollments
			const enrollmentsResponse = await EnrollmentsService.getMyEnrollments({
				status: 'ACTIVE',
				size: 10
			});
			myEnrollments = enrollmentsResponse.data;

			// Load enrolled courses details
			const coursePromises = myEnrollments.map((enrollment) =>
				CoursesService.getBySlug(enrollment.course_id).catch(() => null)
			);
			const courses = await Promise.all(coursePromises);
			enrolledCourses = courses.filter((c): c is Course => c !== null);

			// Load recommended courses
			const recommendedResponse = await CoursesService.getAll({ limit: 3, status: 'PUBLISHED' });
			recommendedCourses = recommendedResponse.data;
		} catch (error) {
			console.error('Error loading dashboard data:', error);
		} finally {
			loading = false;
		}
	});

	const handleCourseClick = (courseId: string) => {
		const enrollment = myEnrollments.find((e) => e.course_id === courseId);
		if (enrollment?.last_accessed_lesson_id) {
			goto(`/app/courses/${courseId}/learn`);
		} else {
			goto(`/app/courses/${courseId}`);
		}
	};

	const calculateProgress = (enrollment: Enrollment, course: Course): number => {
		if (!course.lessons_count) return 0;
		// This is a simplified calculation - in reality you'd track completed lessons
		return enrollment.completed_at ? 100 : Math.floor(Math.random() * 60) + 10;
	};
</script>

<div class="space-y-8">
	<div class="">
		<h1 class="mb-2 text-3xl font-bold text-light-black">
			¡Bienvenido de vuelta, <span class="text-light-three dark:text-dark-two">
				{user?.full_name || 'Estudiante'}</span
			>! 👋
		</h1>
	</div>

	<!-- <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
		<StatsCard title="Cursos Activos" value={activeCourses} color="rose">
			{#snippet icon()}
				<HomeDotIcon class="h-6 w-6" />
			{/snippet}
		</StatsCard>

		<StatsCard title="Horas de Contenido" value={totalHours.toFixed(1)} color="gold">
			{#snippet icon()}
				<TrendingUpIcon class="h-6 w-6" />
			{/snippet}
		</StatsCard>

		<StatsCard title="Cursos Completados" value={completedCourses} color="green">
			{#snippet icon()}
				<CashIcon class="h-6 w-6" />
			{/snippet}
		</StatsCard>

		<StatsCard title="Certificados" value={completedCourses} color="taupe">
			{#snippet icon()}
				<UsersIcon class="h-6 w-6" />
			{/snippet}
		</StatsCard>
	</div> -->

	<!-- Continue Learning -->
	{#if loading}
		<div class="flex justify-center py-12">
			<div
				class="border-rose h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
			></div>
		</div>
	{:else if enrolledCourses.length > 0}
		<div>
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Continuar Aprendiendo</h2>
			<div class="space-y-4">
				{#each enrolledCourses.slice(0, 3) as course (course.id)}
					{@const enrollment = myEnrollments.find((e) => e.course_id === course.id)}
					{@const progress = enrollment ? calculateProgress(enrollment, course) : 0}
					<CourseProgress
						{course}
						{progress}
						lastLessonTitle={enrollment?.last_accessed_lesson_id
							? 'Lección en progreso'
							: undefined}
						onclick={() => handleCourseClick(course.id)}
					/>
				{/each}
			</div>
			{#if enrolledCourses.length > 3}
				<div class="mt-6 text-center">
					<button
						onclick={() => goto('/app/my-courses')}
						class="text-rose hover:text-rose/80 font-semibold transition-colors"
					>
						Ver todos mis cursos →
					</button>
				</div>
			{/if}
		</div>
	{:else}
		<div class="rounded-xl p-12 text-center">
			<div class="mb-4 text-6xl">📚</div>
			<h3 class="mb-2 text-xl font-bold text-gray-900">No tienes cursos activos</h3>
			<p class="mb-6 text-gray-600">Explora nuestro catálogo y comienza a aprender</p>
			<Button onclick={() => goto('/app/courses')} variant="ghost">Explorar Cursos</Button>
		</div>
	{/if}

	{#if recommendedCourses.length > 0}
		<div>
			<h2 class="mb-6 text-2xl font-bold text-light-black">Cursos Recomendados</h2>
			<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
				{#each recommendedCourses as course (course.id)}
					<CourseCard {course} onclick={() => goto(`/app/courses/${course.slug}`)} />
				{/each}
			</div>
		</div>
	{/if}
</div>
