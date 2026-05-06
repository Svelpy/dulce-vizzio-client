<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { MainLayout, Button, ModalConfirm } from '$lib/components/ui';
	import type { CourseDetail, CourseLesson } from '$lib/interfaces';
	import { courseService } from '$lib/services';
	import { alert } from '$lib/utils';
	import {
		ClockIcon,
		EyeOffIcon,
		PlayerPlayIcon,
		UsersIcon,
		DownloadIcon,
		PhotoIcon,
		ClipboardIcon,
		ChevronUpIcon,
		ChevronDownIcon,
		PencilIcon,
		LoaderIcon,
		PlusIcon,
		TrashIcon
	} from '$lib/icons/outline';
	import { BookIcon, FileDescriptionIcon, HomeIcon, LockIcon } from '$lib/icons/solid';
	import { currentUser } from '$lib/stores/auth.store';
	import { Role } from '$lib/constants/roles';
	import { MaterialUploadModal, LessonModal } from '$lib/components/features/course';

	let course = $state<CourseDetail | null>(null);
	let currentLesson = $state<CourseLesson | null>(null);
	let loading = $state(true);
	let error = $state('');
	let isUploadModalOpen = $state(false);
	let isLessonModalOpen = $state(false);
	let lessonToEdit = $state<CourseLesson | null>(null);
	let deletingMaterial = $state(false);
	let isDeleteModalOpen = $state(false);
	let materialToDelete = $state<{ lessonId: string; order: number } | null>(null);
	let isLessonDeleteModalOpen = $state(false);
	let lessonToDelete = $state<CourseLesson | null>(null);
	let deletingLesson = $state(false);
	let reorderingLessonId = $state<string | null>(null);
	let isDeleteAllMaterialsModalOpen = $state(false);
	let deletingAllMaterials = $state(false);

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

	function handleDeleteMaterial(lessonId: string, order: number) {
		materialToDelete = { lessonId, order };
		isDeleteModalOpen = true;
	}

	async function confirmDeleteMaterial() {
		if (!materialToDelete) return;

		try {
			deletingMaterial = true;
			await courseService.deleteMaterial(materialToDelete.lessonId, materialToDelete.order);
			await loadCourse();
			alert('success', 'Material eliminado correctamente');
			isDeleteModalOpen = false;
			materialToDelete = null;
		} catch (err) {
			console.error('Error deleting material:', err);
			alert('error', 'Error al eliminar el material');
		} finally {
			deletingMaterial = false;
		}
	}

	function openCreateLessonModal() {
		lessonToEdit = null;
		isLessonModalOpen = true;
	}

	function handleEditLesson(lesson: CourseLesson) {
		lessonToEdit = lesson;
		isLessonModalOpen = true;
	}

	function handleDeleteLesson(lesson: CourseLesson) {
		lessonToDelete = lesson;
		isLessonDeleteModalOpen = true;
	}

	async function confirmDeleteLesson() {
		if (!lessonToDelete) return;

		try {
			deletingLesson = true;
			await courseService.deleteLesson(lessonToDelete.id);
			await loadCourse();
			alert('success', 'Lección eliminada correctamente');
			isLessonDeleteModalOpen = false;
			lessonToDelete = null;
		} catch (err) {
			console.error('Error deleting lesson:', err);
			alert('error', 'Error al eliminar la lección');
		} finally {
			deletingLesson = false;
		}
	}

	async function handleReorderLesson(lesson: CourseLesson, newOrder: number) {
		if (newOrder < 1 || newOrder > (course?.lessons.length || 0)) return;

		try {
			reorderingLessonId = lesson.id;
			const updatedLessons = await courseService.reorderLesson(lesson.id, newOrder);
			if (course) {
				// Map the returned Lesson objects back to CourseLesson if necessary
				// In this case they are compatible enough for display
				course.lessons = updatedLessons as any;
			}
			alert('success', 'Orden de lección actualizado');
		} catch (err) {
			console.error('Error reordering lesson:', err);
			alert('error', 'Error al reordenar la lección');
		} finally {
			reorderingLessonId = null;
		}
	}

	function handleDeleteAllMaterials() {
		if (!currentLesson) return;
		isDeleteAllMaterialsModalOpen = true;
	}

	async function confirmDeleteAllMaterials() {
		if (!currentLesson) return;

		try {
			deletingAllMaterials = true;
			await courseService.deleteAllMaterials(currentLesson.id);
			await loadCourse();
			alert('success', 'Todos los materiales han sido eliminados');
			isDeleteAllMaterialsModalOpen = false;
		} catch (err) {
			console.error('Error deleting all materials:', err);
			alert('error', 'Error al eliminar los materiales');
		} finally {
			deletingAllMaterials = false;
		}
	}
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
				<div class="glass-card flex flex-col rounded-3xl p-6 shadow-sweet lg:p-8">
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

															{#if currentLesson.materials.length > 0}
																<Button
																	variant="ghost"
																	size="sm"
																	onclick={handleDeleteAllMaterials}
																	class="text-red-500 hover:bg-red-50"
																>
																	{#snippet leftIcon()}
																		<TrashIcon class="h-4 w-4" />
																	{/snippet}
																	Limpiar
																</Button>
															{/if}
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
																		{#if isAdmin}
																			<button
																				class="rounded-lg p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
																				onclick={(e) => {
																					e.stopPropagation();
																					handleDeleteMaterial(
																						currentLesson?.id || '',
																						material.order
																					);
																				}}
																				title="Eliminar material"
																			>
																				<TrashIcon class="h-4 w-4" />
																			</button>
																		{/if}
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
												{course.is_enrolled ? 'Inscrito' : 'No inscrito'}
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
													onclick={openCreateLessonModal}
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
														class="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] shadow-sm transition-transform group-hover:scale-105 {isActive ||
														reorderingLessonId === lesson.id
															? 'bg-sweet-pink-400 text-white'
															: canAccess
																? 'bg-white text-sweet-pink-400'
																: 'bg-slate-100 text-slate-400'}"
													>
														{#if reorderingLessonId === lesson.id}
															<LoaderIcon class="h-5 w-5 animate-spin" />
														{:else if !canAccess}
															<LockIcon class="h-4 w-4" />
														{:else if isActive && !isAdmin}
															<PlayerPlayIcon class="h-5 w-5" />
														{:else}
															<span class="text-sm font-black">{lesson.order}</span>
														{/if}
													</div>

													{#if isAdmin}
														<div class="flex flex-col gap-0.5">
															<button
																class="hover:text-sweet-pink-600 rounded-md p-0.5 text-sweet-pink-300 transition-colors hover:bg-sweet-pink-100 disabled:opacity-30"
																onclick={(e) => {
																	e.stopPropagation();
																	handleReorderLesson(lesson, lesson.order - 1);
																}}
																disabled={lesson.order === 1 || !!reorderingLessonId}
																title="Subir orden"
															>
																<ChevronUpIcon class="h-3.5 w-3.5" />
															</button>
															<button
																class="hover:text-sweet-pink-600 rounded-md p-0.5 text-sweet-pink-300 transition-colors hover:bg-sweet-pink-100 disabled:opacity-30"
																onclick={(e) => {
																	e.stopPropagation();
																	handleReorderLesson(lesson, lesson.order + 1);
																}}
																disabled={lesson.order === course?.lessons.length ||
																	!!reorderingLessonId}
																title="Bajar orden"
															>
																<ChevronDownIcon class="h-3.5 w-3.5" />
															</button>
														</div>
													{/if}

													<div class="min-w-0 flex-1">
														<div class="mb-1 flex items-start justify-between gap-2">
															<h4
																class="font-black {isActive
																	? 'text-sweet-pink-500'
																	: 'group-hover:text-sweet-pink-600 text-sweet-brown'} line-clamp-2"
															>
																{lesson.title}
															</h4>
															<div class="flex items-center gap-2">
																{#if lesson.is_preview}
																	<span
																		class="shrink-0 rounded-lg bg-green-100 px-2 py-0.5 text-xs font-black text-green-700"
																	>
																		Gratis
																	</span>
																{/if}
																{#if isAdmin}
																	<button
																		class="rounded-lg p-1 text-slate-400 transition-colors hover:bg-sweet-pink-50 hover:text-sweet-pink-500"
																		onclick={(e) => {
																			e.stopPropagation();
																			handleEditLesson(lesson);
																		}}
																		title="Editar lección"
																	>
																		<PencilIcon class="h-4 w-4" />
																	</button>
																	<button
																		class="rounded-lg p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
																		onclick={(e) => {
																			e.stopPropagation();
																			handleDeleteLesson(lesson);
																		}}
																		title="Eliminar lección"
																	>
																		<TrashIcon class="h-4 w-4" />
																	</button>
																{/if}
															</div>
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
				<LessonModal
					isOpen={isLessonModalOpen}
					courseId={course?.id || ''}
					lesson={lessonToEdit}
					onClose={() => (isLessonModalOpen = false)}
					onSuccess={loadCourse}
				/>
			{/if}

			<ModalConfirm
				isOpen={isDeleteModalOpen}
				message="¿Estás seguro de que deseas eliminar este material? Esta acción no se puede deshacer."
				onConfirm={confirmDeleteMaterial}
				onCancel={() => (isDeleteModalOpen = false)}
				loading={deletingMaterial}
			/>

			<ModalConfirm
				isOpen={isLessonDeleteModalOpen}
				message={`¿Estás seguro de que deseas eliminar la lección "${lessonToDelete?.title}"? Esta acción no se puede deshacer y eliminará todos sus materiales asociados.`}
				onConfirm={confirmDeleteLesson}
				onCancel={() => (isLessonDeleteModalOpen = false)}
				loading={deletingLesson}
			/>

			<ModalConfirm
				isOpen={isDeleteAllMaterialsModalOpen}
				message={`¿Estás seguro de que deseas eliminar TODOS los materiales de la lección "${currentLesson?.title}"? Esta acción no se puede deshacer.`}
				onConfirm={confirmDeleteAllMaterials}
				onCancel={() => (isDeleteAllMaterialsModalOpen = false)}
				loading={deletingAllMaterials}
			/>
		</div>
	</div>
</MainLayout>
