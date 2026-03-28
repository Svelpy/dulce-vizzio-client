<script lang="ts">
	import { onMount } from 'svelte';
	import CourseCard from '$lib/components/features/course/courseCard.svelte';
	import { EnrollmentsService, CoursesService } from '$lib/services';
	import { currentUser } from '$lib/stores/auth.store';
	import type { Enrollment, Course } from '$lib/interfaces';
	import { Button, Heading, MainLayout } from '$lib/components/ui';
	import { getGreetingMessage, redirect } from '$lib/utils';
	import { DashboardSkeleton } from '$lib/components/skeletons/dashboard';

	let myEnrollments: Enrollment[] = $state([]);
	let enrolledCourses: Course[] = $state([]);
	let recommendedCourses: Course[] = $state([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			// Load my enrollments
			const enrollmentsResponse = await EnrollmentsService.getMyEnrollments();
			myEnrollments = enrollmentsResponse.data;

			// Derive enrolled courses from enrollments
			enrolledCourses = myEnrollments.map((e) => e.course).filter((c): c is Course => !!c);

			// Load recommended courses
			const recommendedResponse = await CoursesService.getAll({ limit: 3, status: 'PUBLISHED' });
			recommendedCourses = recommendedResponse.data;
		} catch (error) {
			console.error('Error loading dashboard data:', error);
		} finally {
			loading = false;
		}
	});

	const handleCourseClick = (slug: string) => {
		redirect(`/app/courses/${slug}`);
	};

	const calculateProgress = (enrollment: Enrollment, course: Course): number => {
		if (!course.lessons_count) return 0;
		return enrollment.completed_at ? 100 : Math.floor(Math.random() * 60) + 10;
	};
</script>

<MainLayout
	title="Dashboard"
	description="Bienvenido a tu plataforma de aprendizaje"
	class="container mx-auto"
>
	{#if loading}
		<DashboardSkeleton />
	{:else}
		<div class="space-y-8">
			<div class="">
				<Heading class="mb-2 " level="h3">
					{getGreetingMessage()},
					<span class="text-light-three dark:text-dark-two">
						{$currentUser?.full_name || 'Estudiante'}</span
					>
				</Heading>
			</div>

			{#if enrolledCourses.length > 0}
				<div>
					<h2 class="mb-6 text-2xl font-bold text-light-black">Mis Cursos</h2>
					<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
						{#each enrolledCourses as course (course.id)}
							{@const enrollment = myEnrollments.find((e) => e.course_id === course.id)}
							<CourseCard
								{course}
								showProgress={true}
								progress={enrollment ? calculateProgress(enrollment, course) : 0}
								onclick={() => handleCourseClick(course.slug)}
							/>
						{/each}
					</div>
				</div>
			{:else}
				<div class="rounded-xl p-12 text-center">
					<div class="mb-4 text-6xl">📚</div>
					<h3 class="mb-2 text-xl font-bold text-gray-900">No tienes cursos activos</h3>
					<p class="mb-6 text-gray-600">Explora nuestro catálogo y comienza a aprender</p>
					<Button onclick={() => redirect('/app/courses')} variant="ghost">Explorar Cursos</Button>
				</div>
			{/if}

			{#if recommendedCourses.length > 0}
				<div>
					<h2 class="mb-6 text-2xl font-bold text-light-black">Cursos Recomendados</h2>
					<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
						{#each recommendedCourses as course (course.id)}
							<CourseCard {course} onclick={() => redirect(`/app/courses/${course.slug}`)} />
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</MainLayout>
