<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui';
	import type { CourseDetail, CourseLesson } from '$lib/interfaces';
	import { courseService } from '$lib/services';
	import { ClockIcon, EyeOffIcon, PlayerPlayIcon, UsersIcon } from '$lib/icons/outline';
	import { BookIcon, FileDescriptionIcon, HomeIcon, LockIcon } from '$lib/icons/solid';

	let course = $state<CourseDetail | null>(null);
	let currentLesson = $state<CourseLesson | null>(null);
	let loading = $state(true);
	let error = $state('');

	const slug = $derived($page.params.slug);

	const difficultyLabels = {
		BEGINNER: 'Principiante',
		INTERMEDIATE: 'Intermedio',
		ADVANCED: 'Avanzado'
	};

	const difficultyColors = {
		BEGINNER: 'bg-green-100 text-green-800 border-green-300',
		INTERMEDIATE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
		ADVANCED: 'bg-red-100 text-red-800 border-red-300'
	};

	async function loadCourse() {
		if (!slug) {
			error = 'No se proporcionó un slug válido';
			loading = false;
			return;
		}

		try {
			loading = true;
			error = '';
			course = await courseService.getCourseBySlug(slug);

			// Auto-select first available lesson
			if (course && course.lessons.length > 0) {
				const firstAvailable = course.lessons.find((l) => l.is_preview || course?.is_enrolled);
				if (firstAvailable) {
					currentLesson = firstAvailable;
				}
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al cargar el curso';
			console.error('Error loading course:', err);
		} finally {
			loading = false;
		}
	}

	function selectLesson(lesson: CourseLesson) {
		if (lesson.is_preview || course?.is_enrolled) {
			currentLesson = lesson;
			// Scroll to top on mobile
			if (window.innerWidth < 1024) {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}
	}

	function formatDuration(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function formatTotalDuration(hours: number): string {
		if (hours < 1) {
			return `${Math.round(hours * 60)} min`;
		}
		const h = Math.floor(hours);
		const m = Math.round((hours - h) * 60);
		return m > 0 ? `${h}h ${m}m` : `${h}h`;
	}

	onMount(() => {
		loadCourse();
	});
</script>

<svelte:head>
	<title>{course?.title || 'Cargando...'} | Cursos</title>
	{#if course}
		<meta name="description" content={course.description} />
	{/if}
</svelte:head>

{#if loading}
	<!-- Loading State -->
	<div class="min-h-dvh">
		<div class="">
			<div class="mb-6 h-8 w-64 animate-pulse rounded-lg bg-slate-200"></div>
			<div class="grid gap-6 lg:grid-cols-3">
				<div class="lg:col-span-2">
					<div class="aspect-video w-full animate-pulse rounded-xl bg-slate-300"></div>
					<div class="mt-4 space-y-3">
						<div class="h-6 w-3/4 animate-pulse rounded bg-slate-200"></div>
						<div class="h-4 w-full animate-pulse rounded bg-slate-200"></div>
						<div class="h-4 w-5/6 animate-pulse rounded bg-slate-200"></div>
					</div>
				</div>
				<div class="space-y-3">
					{#each Array(5) as _}
						<div class="h-24 w-full animate-pulse rounded-lg bg-slate-200"></div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{:else if error}
	<!-- Error State -->
	<div class="flex min-h-dvh items-center justify-center">
		<div class="text-center">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
				<svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
			</div>
			<h2 class="mb-2 text-2xl font-bold text-slate-900">Error al cargar el curso</h2>
			<p class="mb-6 text-slate-600">{error}</p>
			<Button onclick={loadCourse}>Reintentar</Button>
		</div>
	</div>
{:else if course}
	<!-- Main Content -->
	<div class="min-h-dvh">
		<!-- Mobile Course Info Header -->
		<div class=" lg:hidden">
			<div class="mb-2 flex items-center gap-2">
				<span class="text-sm font-medium text-slate-600">{course.category}</span>
				<span class="text-slate-400">•</span>
				<span
					class="rounded-full border px-2 py-0.5 text-xs font-semibold {difficultyColors[
						course.difficulty
					]}"
				>
					{difficultyLabels[course.difficulty]}
				</span>
			</div>
			<h1 class="text-xl font-bold text-slate-900">{course.title}</h1>
		</div>

		<div class="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
			<div class="grid gap-6 lg:grid-cols-3">
				<!-- Video Player & Content Area (Left - 2/3) -->
				<div class="space-y-6 lg:col-span-2">
					<!-- Desktop Course Header -->
					<div class="hidden lg:block">
						<div class="mb-2 flex items-center gap-2">
							<span class="text-sm font-medium text-slate-600"
								>{course.category} / {course.subcategory}</span
							>
							<span
								class="rounded-full border px-3 py-1 text-xs font-semibold {difficultyColors[
									course.difficulty
								]}"
							>
								{difficultyLabels[course.difficulty]}
							</span>
						</div>
						<h1 class="text-3xl font-bold text-slate-900">{course.title}</h1>
					</div>

					<!-- Video Player -->
					<div class="overflow-hidden rounded-xl bg-black shadow-lg">
						{#if currentLesson}
							<div class="relative aspect-video w-full">
								<iframe
									src={currentLesson.video_url}
									title={currentLesson.title}
									allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
									allowfullscreen
									class="absolute inset-0 h-full w-full"
								></iframe>
							</div>
						{:else}
							<div class="flex aspect-video items-center justify-center">
								<div class="text-center text-white">
									<EyeOffIcon class="mx-auto mb-2 h-12 w-12 opacity-50" />
									<p class="text-sm opacity-75">Selecciona una lección para comenzar</p>
								</div>
							</div>
						{/if}
					</div>

					<!-- Current Lesson Info -->
					{#if currentLesson}
						<div class="rounded-xl bg-white p-6 shadow-sm">
							<h2 class="mb-2 text-2xl font-bold text-slate-900">{currentLesson.title}</h2>
							<p class="mb-4 text-slate-600">{currentLesson.summary}</p>

							{#if currentLesson.materials.length > 0}
								<div class="border-t border-slate-200 pt-4">
									<h3 class="mb-3 flex items-center gap-2 font-semibold text-slate-900">
										<FileDescriptionIcon class="h-5 w-5" />
										Materiales de descarga
									</h3>
									<div class="space-y-2">
										{#each currentLesson.materials as material}
											<a
												href={material.url}
												target="_blank"
												rel="noopener noreferrer"
												class="flex items-center justify-between rounded-lg border border-slate-200 p-3 transition-colors hover:border-blue-500 hover:bg-blue-50"
											>
												<span class="font-medium text-slate-900">{material.title}</span>
												<span
													class="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600"
													>{material.type}</span
												>
											</a>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					{/if}

					<!-- Course Description -->
					<div class="rounded-xl bg-white p-6 shadow-sm">
						<h3 class="mb-3 text-xl font-bold text-slate-900">Acerca del curso</h3>
						<p class="mb-4 leading-relaxed text-slate-700">{course.description}</p>

						<div class="flex flex-wrap gap-2">
							{#each course.tags as tag}
								<span
									class="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
								>
									#{tag}
								</span>
							{/each}
						</div>

						<div class="mt-6 grid grid-cols-2 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-4">
							<div class="text-center">
								<div class="mb-1 flex items-center justify-center text-light-four">
									<ClockIcon class="h-5 w-5" />
								</div>
								<div class="text-2xl font-bold text-slate-900">
									{formatTotalDuration(course.total_duration_hours)}
								</div>
								<div class="text-xs text-slate-600">Duración</div>
							</div>
							<div class="text-center">
								<div class="mb-1 flex items-center justify-center text-light-four">
									<BookIcon class="h-5 w-5" />
								</div>
								<div class="text-2xl font-bold text-slate-900">{course.lessons_count}</div>
								<div class="text-xs text-slate-600">Lecciones</div>
							</div>
							<div class="text-center">
								<div class="mb-1 flex items-center justify-center text-light-four">
									<UsersIcon class="h-5 w-5" />
								</div>
								<div class="text-2xl font-bold text-slate-900">{course.enrollment_count}</div>
								<div class="text-xs text-slate-600">Estudiantes</div>
							</div>
							<div class="text-center">
								<div class="mb-1 flex items-center justify-center text-light-four">
									<HomeIcon class="h-5 w-5" />
								</div>
								<div class="text-2xl font-bold text-slate-900">
									{course.is_enrolled ? 'Inscrito' : 'Gratis'}
								</div>
								<div class="text-xs text-slate-600">Acceso</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Lessons Sidebar (Right - 1/3) -->
				<div class="lg:col-span-1">
					<div class="sticky top-6 rounded-xl bg-white shadow-sm">
						<div class="border-b border-slate-200 p-4">
							<h3 class="font-bold text-slate-900">Contenido del curso</h3>
							<p class="text-sm text-slate-600">
								{course.lessons.length} lecciones • {formatTotalDuration(
									course.total_duration_hours
								)}
							</p>
						</div>

						<div class="max-h-[calc(100vh-200px)] overflow-y-auto">
							{#each course.lessons as lesson, index (lesson.id)}
								{@const canAccess = lesson.is_preview || course.is_enrolled}
								{@const isActive = currentLesson?.id === lesson.id}

								<button
									onclick={() => selectLesson(lesson)}
									disabled={!canAccess}
									class="w-full border-b border-slate-100 p-4 text-left transition-colors last:border-b-0 {isActive
										? 'bg-blue-50'
										: canAccess
											? 'cursor-pointer hover:bg-slate-50'
											: 'cursor-not-allowed opacity-50'}"
								>
									<div class="flex items-start gap-3">
										<div
											class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg {isActive
												? 'bg-light-two text-light-one'
												: canAccess
													? 'bg-slate-100 text-slate-600'
													: 'bg-slate-100 text-slate-400'}"
										>
											{#if !canAccess}
												<LockIcon class="h-4 w-4" />
											{:else if isActive}
												<PlayerPlayIcon class="h-4 w-4" />
											{:else}
												<span class="text-sm font-bold">{lesson.order}</span>
											{/if}
										</div>

										<div class="min-w-0 flex-1">
											<div class="mb-1 flex items-start justify-between gap-2">
												<h4
													class="font-semibold text-slate-900 {isActive
														? 'text-blue-700'
														: ''} line-clamp-2"
												>
													{lesson.title}
												</h4>
												{#if lesson.is_preview}
													<span
														class="shrink-0 rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700"
													>
														Gratis
													</span>
												{/if}
											</div>
											<p class="mb-2 line-clamp-2 text-sm text-slate-600">{lesson.summary}</p>
											<div class="flex items-center gap-3 text-xs text-slate-500">
												<span class="flex items-center gap-1">
													<ClockIcon class="h-3 w-3" />
													{formatDuration(lesson.duration_seconds)}
												</span>
												{#if lesson.materials.length > 0}
													<span class="flex items-center gap-1">
														<FileDescriptionIcon class="h-3 w-3" />
														{lesson.materials.length}
													</span>
												{/if}
											</div>
										</div>
									</div>
								</button>
							{/each}
						</div>

						{#if !course.is_enrolled}
							<div class="border-t border-slate-200 p-4">
								<Button class="w-full">Inscribirse al curso</Button>
								<p class="mt-2 text-center text-xs text-slate-600">
									Acceso completo a todas las lecciones
								</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
