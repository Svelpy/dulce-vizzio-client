<script lang="ts">
	import { onMount } from 'svelte';
	import DashboardCourseCard from '$lib/components/features/course/dashboardCourseCard.svelte';
	import { enrollmentService, courseService } from '$lib/services';
	import { currentUser } from '$lib/stores/auth.store';
	import type { Enrollment, Course } from '$lib/interfaces';
	import { Heading, MainLayout } from '$lib/components/ui';
	import { redirect } from '$lib/utils';
	import { DashboardSkeleton } from '$lib/components/skeletons/dashboard';

	let myEnrollments: Enrollment[] = $state([]);
	let enrolledCourses: Course[] = $state([]);
	let recommendedCourses: Course[] = $state([]);
	let loading = $state(true);
	const greeting = getGreetingMessage($currentUser?.full_name);

	onMount(async () => {
		try {
			// Load my enrollments
			const enrollmentsResponse = await enrollmentService.getMyEnrollments();
			myEnrollments = enrollmentsResponse.data;

			// Derive enrolled courses from enrollments
			enrolledCourses = myEnrollments
				.map((e) => e.course)
				.filter((c): c is NonNullable<typeof c> => c !== undefined && c !== null) as Course[];

			// Load recommended courses
			const recommendedResponse = await courseService.getAll({ limit: 4, status: 'PUBLISHED' });
			recommendedCourses = recommendedResponse.data;
		} catch (error) {
			console.error('Error loading dashboard data:', error);
		} finally {
			loading = false;
		}
	});

	export function getGreetingMessage(name?: string): string {
		const hour = new Date().getHours();

		let greeting = '';

		if (hour >= 5 && hour < 12) {
			const options = [
				'¡Buenos días',
				'¡Buen día',
				'¡Arriba, que hoy será un gran día',
				'¡A empezar con todo este día'
			];
			greeting = options[Math.floor(Math.random() * options.length)];
		} else if (hour >= 12 && hour < 18) {
			const options = [
				'¡Buenas tardes',
				'¡Qué tal va tu día',
				'¡Seguimos con todo esta tarde',
				'¡Aún queda mucho por lograr hoy'
			];
			greeting = options[Math.floor(Math.random() * options.length)];
		} else if (hour >= 18 && hour < 23) {
			const options = [
				'¡Buenas noches',
				'¡Cerrando el día con todo',
				'¡Excelente noche para avanzar',
				'¡Relájate, pero no te detengas'
			];
			greeting = options[Math.floor(Math.random() * options.length)];
		} else {
			const options = [
				'¡Trabajando hasta tarde',
				'¡Eres de los que no se rinden',
				'¡La noche también es productiva'
			];
			greeting = options[Math.floor(Math.random() * options.length)];
		}

		return `${greeting}, ${name || 'Estudiante'}! 👋`;
	}

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
		<div class="relative space-y-10">
			<!-- Background Decorations (Optional subtle touches) -->
			<div class="pointer-events-none absolute -top-10 -right-10 overflow-hidden opacity-10">
				<div class="flex flex-wrap gap-20">
					{#each Array(5) as __, i (i)}
						<span class="text-9xl text-sweet-pink-300">💕</span>
					{/each}
				</div>
			</div>

			<!-- Welcome Header -->
			<div class="relative z-10 px-2 lg:px-0">
				<Heading level="h4">
					{greeting}
				</Heading>
			</div>

			<!-- Enrolled Courses Section (Horizontal Scroll) -->
			{#if enrolledCourses.length > 0}
				<div class="space-y-6">
					<div class="flex items-center justify-between px-2">
						<div class="flex items-center gap-2">
							<span class="text-sweet-pink-300">💕</span>
							<h2 class="text-xl font-black text-sweet-brown">Tus Cursos Actuales</h2>
							<span class="text-sweet-pink-300">💕</span>
						</div>
						<button
							onclick={() => redirect('/app/my-enrollments')}
							class="text-sm font-bold text-sweet-pink-400 decoration-2 transition-all hover:underline"
						>
							Ver Todos >
						</button>
					</div>

					<div
						class="scrollbar-hide flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:gap-6"
					>
						{#each enrolledCourses as course (course.id)}
							<DashboardCourseCard
								{course}
								variant="enrolled"
								onclick={() => handleCourseClick(course.slug)}
							/>
						{/each}
					</div>
				</div>
			{:else}
				<div
					class="glass-card flex flex-col items-center justify-center rounded-3xl p-12 text-center shadow-sweet"
				>
					<div class="mb-4 text-7xl">🍰</div>
					<h3 class="mb-2 text-2xl font-black text-sweet-brown">Aún no tienes cursos</h3>
					<p class="mb-8 font-medium text-sweet-pink-400/70">
						¡El horno está caliente! Empieza hoy mismo tu primer curso de repostería.
					</p>
					<button
						onclick={() => redirect('/app/courses')}
						class="sweet-gradient-intense rounded-2xl px-10 py-4 text-lg font-black text-white shadow-lg transition-all hover:scale-105 active:scale-95"
					>
						Explorar Cátalogo
					</button>
				</div>
			{/if}

			<!-- Recommended Courses Section (Grid) -->
			{#if recommendedCourses.length > 0}
				<div class="space-y-6">
					<div class="flex items-center justify-between px-2 text-sweet-brown">
						<div class="flex items-center gap-2">
							<span class="text-sweet-pink-300">💕</span>
							<h2 class="text-xl font-black">Sugeridos para Ti</h2>
							<span class="text-sweet-pink-300">💕</span>
						</div>
						<button
							onclick={() => redirect('/app/courses')}
							class="text-sm font-bold text-sweet-pink-400 transition-all hover:underline"
						>
							Explorar >
						</button>
					</div>

					<div class="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
						{#each recommendedCourses as course (course.id)}
							<DashboardCourseCard
								{course}
								variant="recommended"
								onclick={() => handleCourseClick(course.slug)}
							/>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</MainLayout>
