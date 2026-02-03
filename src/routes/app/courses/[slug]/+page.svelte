<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui';
	import LessonList from '$lib/components/features/courses/lessonList.svelte';
	import { CoursesService, EnrollmentsService } from '$lib/services';
	import type { Course, Lesson, Enrollment } from '$lib/interfaces';
	import { WhatsappIcon, UsersIcon } from '$lib/icons/outline';

	let course: Course | null = $state(null);
	let lessons: Lesson[] = $state([]);
	let enrollment: Enrollment | null = $state(null);
	let loading = $state(true);
	let error = $state('');

	const slug = $derived($page.params.slug);

	onMount(async () => {
		if (!slug) return;

		try {
			// Load course details
			course = await CoursesService.getBySlug(slug);

			// Load lessons
			if (course) {
				lessons = await CoursesService.getLessons(course.id);

				// Check if user is enrolled
				try {
					const enrollmentsResponse = await EnrollmentsService.getMyEnrollments();
					enrollment =
						enrollmentsResponse.data.find(
							(e) => e.course_id === course!.id && e.status === 'ACTIVE'
						) || null;
				} catch (e) {
					// User might not be enrolled
					enrollment = null;
				}
			}
		} catch (err: any) {
			error = err.message || 'Error al cargar el curso';
			console.error('Error loading course:', err);
		} finally {
			loading = false;
		}
	});

	const formatDuration = (hours: number): string => {
		const h = Math.floor(hours);
		const m = Math.round((hours - h) * 60);
		if (h === 0) return `${m} minutos`;
		if (m === 0) return `${h} horas`;
		return `${h}h ${m}min`;
	};

	const formatPrice = (price: number, currency: string): string => {
		if (price === 0) return 'Gratis';
		return `${currency === 'USD' ? '$' : currency} ${price.toFixed(2)}`;
	};

	const difficultyLabels = {
		BEGINNER: 'Principiante',
		INTERMEDIATE: 'Intermedio',
		ADVANCED: 'Avanzado',
		EXPERT: 'Experto'
	};

	const handleEnroll = () => {
		// This would typically open a payment/enrollment modal
		// For now, just redirect to sign in if not authenticated
		goto('/auth/sign-in');
	};

	const handleStartLearning = () => {
		if (enrollment) {
			goto(`/app/courses/${slug}/learn`);
		}
	};

	const handleLessonClick = (lesson: Lesson) => {
		if (enrollment || lesson.is_preview) {
			goto(`/app/courses/${slug}/learn?lesson=${lesson.id}`);
		}
	};
</script>

{#if loading}
	<div class="flex justify-center py-12">
		<div
			class="border-rose h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
		></div>
	</div>
{:else if error}
	<div class="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
		<p class="text-red-600">{error}</p>
		<Button variant="outline" onclick={() => goto('/app/courses')} class="mt-4">
			Volver al catálogo
		</Button>
	</div>
{:else if course}
	<div class="space-y-8">
		<!-- Cover Image -->
		<div class="relative h-96 w-full overflow-hidden rounded-2xl">
			{#if course.cover_image_url}
				<img src={course.cover_image_url} alt={course.title} class="h-full w-full object-cover" />
			{:else}
				<div class="from-rose/20 to-gold/20 h-full w-full bg-gradient-to-br"></div>
			{/if}
			<div
				class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
			></div>

			<!-- Course Info Overlay -->
			<div class="absolute right-0 bottom-0 left-0 p-8 text-white">
				<div class="container mx-auto max-w-6xl">
					<div class="mb-3">
						<span class="bg-gold rounded-full px-3 py-1 text-sm font-semibold">
							{course.category}
						</span>
					</div>
					<h1 class="mb-4 text-4xl font-bold">{course.title}</h1>
					<div class="flex flex-wrap items-center gap-4 text-sm">
						<span>📚 {course.lessons_count} lecciones</span>
						<span>⏱️ {formatDuration(course.total_duration_hours)}</span>
						<span>📊 {difficultyLabels[course.difficulty]}</span>
						{#if course.rating_average}
							<span>⭐ {course.rating_average.toFixed(1)}</span>
						{/if}
						{#if course.enrollment_count > 0}
							<span class="flex items-center gap-1">
								<UsersIcon class="h-4 w-4" />
								{course.enrollment_count} estudiantes
							</span>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="grid gap-8 lg:grid-cols-3">
			<!-- Main Content -->
			<div class="space-y-8 lg:col-span-2">
				<!-- Description -->
				<div class="border-grey/30 rounded-xl border bg-white p-6">
					<h2 class="mb-4 text-2xl font-bold text-gray-900">Descripción del Curso</h2>
					<div class="prose max-w-none prose-gray">
						<p class="whitespace-pre-line text-gray-700">{course.description}</p>
					</div>
				</div>

				<!-- Lessons -->
				<div class="border-grey/30 rounded-xl border bg-white p-6">
					<h2 class="mb-4 text-2xl font-bold text-gray-900">Contenido del Curso</h2>
					<LessonList {lessons} isEnrolled={!!enrollment} onLessonClick={handleLessonClick} />
				</div>
			</div>

			<!-- Sidebar -->
			<div class="lg:col-span-1">
				<div class="sticky top-6 space-y-6">
					<!-- Price Card -->
					<div class="border-grey/30 rounded-xl border bg-white p-6 shadow-lg">
						<div class="mb-6 text-center">
							<p class="text-rose mb-2 text-4xl font-bold">
								{formatPrice(course.price, course.currency)}
							</p>
							{#if enrollment}
								<p class="text-sm font-semibold text-green-600">✓ Ya estás inscrito</p>
							{/if}
						</div>

						{#if enrollment}
							<Button variant="primary" fullWidth size="lg" onclick={handleStartLearning}>
								Continuar Aprendiendo
							</Button>
						{:else}
							<Button variant="primary" fullWidth size="lg" onclick={handleEnroll}>
								Inscribirse Ahora
							</Button>
						{/if}

						<!-- WhatsApp Group -->
						{#if course.whatsapp_group_url && enrollment}
							<a
								href={course.whatsapp_group_url}
								target="_blank"
								rel="noopener noreferrer"
								class="mt-4 flex items-center justify-center gap-2 rounded-lg border-2 border-green-500 bg-green-50 px-4 py-3 font-semibold text-green-700 transition-colors hover:bg-green-100"
							>
								<WhatsappIcon class="h-5 w-5" />
								Unirse al Grupo
							</a>
						{/if}
					</div>

					<!-- Course Stats -->
					<div class="border-grey/30 rounded-xl border bg-white p-6">
						<h3 class="mb-4 font-bold text-gray-900">Este curso incluye:</h3>
						<ul class="space-y-3 text-sm text-gray-700">
							<li class="flex items-start gap-2">
								<span class="text-green-600">✓</span>
								<span>{course.lessons_count} lecciones en video</span>
							</li>
							<li class="flex items-start gap-2">
								<span class="text-green-600">✓</span>
								<span>{formatDuration(course.total_duration_hours)} de contenido</span>
							</li>
							<li class="flex items-start gap-2">
								<span class="text-green-600">✓</span>
								<span>Acceso de por vida</span>
							</li>
							<li class="flex items-start gap-2">
								<span class="text-green-600">✓</span>
								<span>Certificado de finalización</span>
							</li>
							{#if course.whatsapp_group_url}
								<li class="flex items-start gap-2">
									<span class="text-green-600">✓</span>
									<span>Grupo de WhatsApp</span>
								</li>
							{/if}
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
