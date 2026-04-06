<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { MainLayout, Button } from '$lib/components/ui';
	import type { CourseDetail, CourseLesson } from '$lib/interfaces';
	import { courseService } from '$lib/services';
	import {
		ClockIcon,
		EyeOffIcon,
		PlayerPlayIcon,
		UsersIcon,
		DownloadIcon,
		PhotoIcon,
		ClipboardIcon,
		PlusIcon
	} from '$lib/icons/outline';
	import { BookIcon, FileDescriptionIcon, HomeIcon, LockIcon } from '$lib/icons/solid';
	import { currentUser } from '$lib/stores/auth.store';
	import { Role } from '$lib/constants/roles';
	import { MaterialUploadModal, CreateLessonModal } from '$lib/components/features/course';

	let course = $state<CourseDetail | null>(null);
	let currentLesson = $state<CourseLesson | null>(null);
	let loading = $state(true);
	let error = $state('');
	let isUploadModalOpen = $state(false);
	let isCreateLessonModalOpen = $state(false);

	const slug = $derived($page.params.slug);
	const isAdmin = $derived(
		$currentUser?.role === Role.ADMIN || $currentUser?.role === Role.SUPERADMIN
	);

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
			console.log('course slug', course);

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

	function getMaterialConfig(format: string = '') {
		const f = format.toLowerCase();
		if (f === 'pdf') {
			return { icon: FileDescriptionIcon, color: 'text-red-500', bgColor: 'bg-red-50' };
		}
		if (['doc', 'docx'].includes(f)) {
			return { icon: ClipboardIcon, color: 'text-blue-500', bgColor: 'bg-blue-50' };
		}
		if (['jpg', 'jpeg', 'png', 'gif'].includes(f)) {
			return { icon: PhotoIcon, color: 'text-purple-500', bgColor: 'bg-purple-50' };
		}
		return { icon: FileDescriptionIcon, color: 'text-slate-500', bgColor: 'bg-slate-50' };
	}

	async function downloadResource(url: string, filename: string, format: string) {
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const blobUrl = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = blobUrl;
			// Ensure filename has the correct extension if not already present
			const fullFilename =
				filename.toLowerCase().endsWith(`.${format.toLowerCase()}`) || !format
					? filename
					: `${filename}.${format}`;
			a.download = fullFilename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(blobUrl);
		} catch (err) {
			console.error('Download failed:', err);
			window.open(url, '_blank');
		}
	}

	onMount(() => {
		loadCourse();
	});

	const handleCtaClick = (e: MouseEvent) => {
		e.stopPropagation();
		if (!course?.is_enrolled) {
			const message = `Hola, estoy interesado en el curso \n ${course?.title}`;
			const encodedMessage = encodeURIComponent(message);
			const whatsappURL = `https://api.whatsapp.com/send?phone=59175618048&text=${encodedMessage}`;
			window.open(whatsappURL, '_blank');
		}
	};
</script>

<MainLayout
	title="{course?.title} | Cursos"
	description={course?.description || 'Detalles del curso'}
	class="container mx-auto"
>
	<div class="relative space-y-8 lg:space-y-10">
		<!-- Background Decorations -->
		<div class="pointer-events-none absolute -top-10 -right-10 overflow-hidden opacity-10">
			<div class="flex flex-wrap gap-20">
				{#each { length: 5 } as _, i (i)}
					<span class="text-9xl text-sweet-pink-300">💕</span>
				{/each}
			</div>
		</div>

		<div class="relative z-10 px-2 lg:px-0">
			{#if loading}
				<!-- Loading State -->
				<div class="glass-card flex flex-col rounded-[2rem] p-6 shadow-sweet lg:p-8">
					<div class="mb-6 h-8 w-64 animate-pulse rounded-lg bg-slate-200"></div>
					<div class="grid gap-6 lg:grid-cols-3">
						<div class="lg:col-span-2">
							<div class="aspect-video w-full animate-pulse rounded-2xl bg-slate-300"></div>
							<div class="mt-4 space-y-3">
								<div class="h-6 w-3/4 animate-pulse rounded bg-slate-200"></div>
								<div class="h-4 w-full animate-pulse rounded bg-slate-200"></div>
								<div class="h-4 w-5/6 animate-pulse rounded bg-slate-200"></div>
							</div>
						</div>
						<div class="space-y-3">
							{#each Array(5)}
								<div class="h-24 w-full animate-pulse rounded-2xl bg-slate-200"></div>
							{/each}
						</div>
					</div>
				</div>
			{:else if error}
				<!-- Error State -->
				<div
					class="glass-card flex min-h-[50vh] flex-col items-center justify-center rounded-[2rem] p-12 text-center shadow-sweet"
				>
					<div class="text-center">
						<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
							<svg
								class="h-8 w-8 text-red-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>
						<h2 class="mb-2 text-2xl font-black text-sweet-brown">Error al cargar el curso</h2>
						<p class="mb-6 font-medium text-sweet-pink-400/70">{error}</p>
						<button
							class="sweet-gradient-intense rounded-2xl px-8 py-3 text-sm font-black text-white shadow-lg transition-all hover:scale-105 active:scale-95"
							onclick={loadCourse}>Reintentar</button
						>
					</div>
				</div>
			{:else if course}
				<!-- Main Content -->
				<div class="space-y-6 lg:space-y-8">
					<!-- Mobile Course Info Header -->
					<div class="glass-card rounded-[2rem] p-6 text-center shadow-sweet lg:hidden">
						<div class="mb-4 flex items-center justify-center gap-2">
							<span class="text-sm font-medium text-sweet-pink-400">{course.category}</span>
							<span class="text-sweet-pink-200">•</span>
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-semibold {difficultyColors[
									course.difficulty
								]}"
							>
								{difficultyLabels[course.difficulty]}
							</span>
						</div>
						<h1 class="text-2xl font-black tracking-tight text-sweet-brown">{course.title}</h1>
					</div>

					<div class="">
						<div class="grid gap-6 lg:grid-cols-3">
							<!-- Video Player & Content Area (Left - 2/3) -->
							<div class="space-y-6 lg:col-span-2">
								<!-- Desktop Course Header -->
								<div class="hidden lg:block">
									<div class="mb-2 flex items-center gap-2">
										<span class="text-sm font-medium text-sweet-pink-400/80"
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
									<h1 class="text-3xl font-black tracking-tight text-sweet-brown lg:text-4xl">
										{course.title}
									</h1>
								</div>

								<!-- Video Player -->
								<div class="overflow-hidden rounded-[2rem] bg-black shadow-sweet">
									{#if currentLesson}
										<div class="relative aspect-video w-full">
											<iframe
												src="https://player.mediadelivery.net/embed/630797/{currentLesson.video_id}?autoplay=true&loop=false&muted=false&preload=true&responsive=true"
												title={currentLesson.title}
												allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
												allowfullscreen
												loading="lazy"
												class="absolute inset-0 h-full w-full"
											></iframe>
										</div>
										<!-- <div style="position:relative;padding-top:56.25%;">
											<iframe
												src="https://player.mediadelivery.net/embed/630797/11a622a1-93c1-4a1b-8f91-8c1ad9897fe2?autoplay=true&loop=false&muted=false&preload=true&responsive=true"
												loading="lazy"
												style="border:0;position:absolute;top:0;height:100%;width:100%;"
												allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
												allowfullscreen="true"
											></iframe>
										</div> -->
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
									<div class="glass-card rounded-[2rem] p-6 shadow-sweet lg:p-8">
										<h2 class="mb-2 text-2xl font-black text-sweet-brown">{currentLesson.title}</h2>
										<p class="mb-4 font-medium text-sweet-pink-400/80">{currentLesson.summary}</p>

										{#if currentLesson.materials.length > 0 || isAdmin}
											<div class="border-t border-slate-200 pt-6">
												<div class="mb-4 flex items-center justify-between">
													<h3 class="flex items-center gap-2 text-lg font-black text-sweet-brown">
														<span class="text-sweet-pink-300">💕</span>
														Materiales de la lección
													</h3>
													<div class="flex gap-2">
														{#if isAdmin}
															<Button
																variant="ghost"
																size="sm"
																onclick={() => (isUploadModalOpen = true)}
																class="text-light-four hover:bg-light-four/10"
															>
																{#snippet leftIcon()}
																	<PlusIcon class="h-4 w-4" />
																{/snippet}
																Material
															</Button>
														{/if}
													</div>
												</div>
												{#if currentLesson.materials.length > 0}
													<div class="grid gap-3 sm:grid-cols-2">
														{#each currentLesson.materials as material, index (index)}
															{@const config = getMaterialConfig(material.file_format)}
															<button
																onclick={() =>
																	downloadResource(
																		material.resource_url,
																		material.title,
																		material.file_format
																	)}
																class="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition-all hover:border-light-four hover:bg-slate-50 hover:shadow-sm"
															>
																<div
																	class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg {config.bgColor} {config.color} transition-transform group-hover:scale-110"
																>
																	<config.icon class="h-7 w-7" />
																</div>
																<div class="min-w-0 flex-1">
																	<div class="mb-1 flex items-center justify-between gap-2">
																		<span
																			class="truncate font-semibold text-slate-900"
																			title={material.title}
																		>
																			{material.title}
																		</span>
																	</div>
																	<div class="flex items-center gap-3 text-xs text-slate-500">
																		<span class="font-bold uppercase"
																			>{material.file_format || 'Archivo'}</span
																		>
																		{#if material.is_downloadable}
																			<span
																				class="flex items-center gap-1 font-medium text-light-four"
																			>
																				<DownloadIcon class="h-3 w-3" />
																				Descargar
																			</span>
																		{/if}
																	</div>
																</div>
															</button>
														{/each}
													</div>
												{/if}
											</div>
										{/if}
									</div>
								{/if}

								<!-- Course Description -->
								<div class="glass-card rounded-[2rem] p-6 shadow-sweet lg:p-8">
									<h3 class="mb-3 text-xl font-black text-sweet-brown">Acerca del curso</h3>
									<p class="mb-4 leading-relaxed text-slate-700">{course.description}</p>

									<div class="flex flex-wrap gap-2">
										{#each course.tags as tag, index (index)}
											<span
												class="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
											>
												#{tag}
											</span>
										{/each}
									</div>

									<div
										class="mt-6 grid grid-cols-2 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-4"
									>
										<div class="text-center">
											<div class="mb-1 flex items-center justify-center text-sweet-pink-400">
												<ClockIcon class="h-5 w-5" />
											</div>
											<div class="text-2xl font-black text-sweet-brown">
												{formatTotalDuration(course.total_duration_hours)}
											</div>
											<div class="text-xs font-bold text-sweet-pink-400/70">Duración</div>
										</div>
										<div class="text-center">
											<div class="mb-1 flex items-center justify-center text-sweet-pink-400">
												<BookIcon class="h-5 w-5" />
											</div>
											<div class="text-2xl font-black text-sweet-brown">{course.lessons_count}</div>
											<div class="text-xs font-bold text-sweet-pink-400/70">Lecciones</div>
										</div>
										<div class="text-center">
											<div class="mb-1 flex items-center justify-center text-sweet-pink-400">
												<UsersIcon class="h-5 w-5" />
											</div>
											<div class="text-2xl font-black text-sweet-brown">
												{course.enrollment_count}
											</div>
											<div class="text-xs font-bold text-sweet-pink-400/70">Estudiantes</div>
										</div>
										<div class="text-center">
											<div class="mb-1 flex items-center justify-center text-sweet-pink-400">
												<HomeIcon class="h-5 w-5" />
											</div>
											<div class="text-2xl font-black text-sweet-brown">
												{course.is_enrolled ? 'Inscrito' : 'Gratis'}
											</div>
											<div class="text-xs font-bold text-sweet-pink-400/70">Acceso</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Lessons Sidebar (Right - 1/3) -->
							<div class="lg:col-span-1">
								<div class="glass-card sticky top-6 overflow-hidden rounded-[2rem] shadow-sweet">
									<div class="border-b border-sweet-pink-200/50 p-6 lg:px-8">
										<div class="mb-2 flex items-center justify-between">
											<h3 class="flex items-center gap-2 font-black text-sweet-brown">
												Contenido <span class="hidden text-sweet-pink-300 lg:inline">💕</span>
											</h3>
											{#if isAdmin}
												<Button
													variant="ghost"
													size="sm"
													onclick={() => (isCreateLessonModalOpen = true)}
													class="text-light-four hover:bg-light-four/10"
												>
													{#snippet leftIcon()}
														<PlusIcon class="h-4 w-4" />
													{/snippet}
													Lección
												</Button>
											{/if}
										</div>
										<p class="text-sm text-slate-600">
											{course.lessons.length} lecciones • {formatTotalDuration(
												course.total_duration_hours
											)}
										</p>
									</div>

									<div class="max-h-[calc(100vh-200px)] overflow-y-auto">
										{#each course.lessons as lesson (lesson.id)}
											{@const canAccess = lesson.is_preview || course.is_enrolled}
											{@const isActive = currentLesson?.id === lesson.id}

											<button
												onclick={() => selectLesson(lesson)}
												disabled={!canAccess}
												class="group w-full border-b border-sweet-pink-100/50 p-5 text-left transition-colors last:border-b-0 lg:px-8 {isActive
													? 'bg-sweet-pink-100/80'
													: canAccess
														? 'cursor-pointer hover:bg-sweet-pink-50/50'
														: 'cursor-not-allowed opacity-50'}"
											>
												<div class="flex items-start gap-4">
													<div
														class="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] shadow-sm transition-transform group-hover:scale-105 {isActive
															? 'bg-sweet-pink-400 text-white'
															: canAccess
																? 'bg-white text-sweet-pink-400'
																: 'bg-slate-100 text-slate-400'}"
													>
														{#if !canAccess}
															<LockIcon class="h-4 w-4" />
														{:else if isActive}
															<PlayerPlayIcon class="h-5 w-5" />
														{:else}
															<span class="text-sm font-black">{lesson.order}</span>
														{/if}
													</div>

													<div class="min-w-0 flex-1">
														<div class="mb-1 flex items-start justify-between gap-2">
															<h4
																class="font-black {isActive
																	? 'text-sweet-pink-500'
																	: 'group-hover:text-sweet-pink-600 text-sweet-brown'} line-clamp-2"
															>
																{lesson.title}
															</h4>
															{#if lesson.is_preview}
																<span
																	class="shrink-0 rounded-lg bg-green-100 px-2 py-0.5 text-xs font-black text-green-700"
																>
																	Gratis
																</span>
															{/if}
														</div>
														<p class="mb-2 line-clamp-2 text-sm font-medium text-sweet-pink-400/80">
															{lesson.summary}
														</p>
														<div
															class="flex items-center gap-3 text-xs font-bold text-sweet-pink-400"
														>
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
										<div class="border-t border-sweet-pink-200/50 bg-sweet-pink-50/30 p-6 lg:px-8">
											<Button onclick={handleCtaClick} fullWidth variant="primary"
												>Inscribirse al curso</Button
											>
											<p class="mt-3 text-center text-sm font-bold text-sweet-pink-400/80">
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

			{#if course && currentLesson && isAdmin}
				<MaterialUploadModal
					isOpen={isUploadModalOpen}
					lessonId={currentLesson.id}
					onClose={() => (isUploadModalOpen = false)}
					onSuccess={() => {
						loadCourse();
					}}
				/>
			{/if}

			{#if course && isAdmin}
				<CreateLessonModal
					isOpen={isCreateLessonModalOpen}
					courseId={course.id}
					onClose={() => (isCreateLessonModalOpen = false)}
					onSuccess={() => {
						isCreateLessonModalOpen = false;
						loadCourse(); // Reload to get updated lessons
					}}
				/>
			{/if}
		</div>
	</div>
</MainLayout>
