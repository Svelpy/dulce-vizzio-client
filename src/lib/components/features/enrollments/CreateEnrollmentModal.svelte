<script lang="ts">
	import type { User, Course, Enrollment } from '$lib/interfaces';
	import { Button, BlurOverlay, Skeleton } from '$lib/components/ui';
	import { alert } from '$lib/utils';
	import { CoursesService, EnrollmentsService } from '$lib/services';
	import { UsersService } from '$lib/services/users.service';
	import { UserIcon, XIcon, BookIcon, ZoomIcon } from '$lib/icons/outline';
	import { fade, scale } from 'svelte/transition';
	import { AlertTriangleIcon } from '$lib/icons/solid';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		onSuccess: (enrollment: Enrollment) => void;
		initialCourse?: Course | null;
	}

	let { isOpen, onClose, onSuccess, initialCourse = null }: Props = $props();

	// Form State
	let selectedUser = $state<User | null>(null);
	let selectedCourse = $state<Course | null>(initialCourse);
	let notes = $state('');
	let isSubmitting = $state(false);

	// Search State
	let userSearch = $state('');
	let courseSearch = $state('');
	let users = $state<User[]>([]);
	let courses = $state<Course[]>([]);
	let isLoadingUsers = $state(false);
	let isLoadingCourses = $state(false);

	// Options
	let showUserResults = $state(false);
	let showCourseResults = $state(false);

	// Reset state when modal opens/closes
	$effect(() => {
		if (isOpen) {
			selectedCourse = initialCourse;
			// Don't reset selectedUser or notes here if they were partial,
			// though usually you'd want a clean state.
		} else {
			selectedUser = null;
			selectedCourse = null;
			notes = '';
			userSearch = '';
			courseSearch = '';
		}
	});

	async function searchUsers() {
		if (userSearch.length < 2) {
			users = [];
			return;
		}

		isLoadingUsers = true;
		try {
			const resp = await UsersService.getAll({ q: userSearch, per_page: 5 });
			users = resp.data;
			showUserResults = true;
		} catch (err) {
			console.error('Error searching users:', err);
		} finally {
			isLoadingUsers = false;
		}
	}

	async function searchCourses() {
		if (courseSearch.length < 2) {
			courses = [];
			return;
		}

		isLoadingCourses = true;
		try {
			const resp = await CoursesService.getAll({ search: courseSearch, limit: 5 });
			courses = resp.data;
			showCourseResults = true;
		} catch (err) {
			console.error('Error searching courses:', err);
		} finally {
			isLoadingCourses = false;
		}
	}

	function selectUser(user: User) {
		selectedUser = user;
		userSearch = user.full_name;
		showUserResults = false;
	}

	function selectCourse(course: Course) {
		selectedCourse = course;
		courseSearch = course.title;
		showCourseResults = false;
	}

	async function handleSubmit() {
		if (!selectedUser || !selectedCourse) {
			alert('error', 'Por favor, selecciona un usuario y un curso');
			return;
		}

		isSubmitting = true;
		try {
			const newEnrollment = await EnrollmentsService.create({
				user_id: selectedUser.id,
				course_id: selectedCourse.id,
				notes: notes || undefined
			});

			alert('success', `Usuario inscrito exitosamente en ${selectedCourse.title}`);
			resetForm();
			onSuccess(newEnrollment);
			onClose();
		} catch {
			alert('error', 'Ocurrió un error al crear la inscripción');
		} finally {
			isSubmitting = false;
		}
	}

	function resetForm() {
		selectedUser = null;
		selectedCourse = null;
		notes = '';
		userSearch = '';
		courseSearch = '';
		users = [];
		courses = [];
	}

	function handleClose() {
		resetForm();
		onClose();
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<BlurOverlay class="flex items-center justify-center p-4">
			<div
				class="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
				transition:scale={{ duration: 300, start: 0.95, opacity: 0 }}
				onclick={(e) => e.stopPropagation()}
			>
				<!-- Header -->
				<div class="bg-stone-900 px-6 py-5 text-white">
					<div class="flex items-center justify-between">
						<div>
							<h2 class="text-xl font-bold">Nueva Inscripción</h2>
							<p class="mt-1 text-xs font-medium tracking-widest text-stone-400 uppercase">
								Gestión administrativa
							</p>
						</div>
						<button
							class="rounded-full p-2 transition-colors hover:bg-white/10"
							onclick={handleClose}
						>
							<XIcon class="size-6" />
						</button>
					</div>
				</div>

				<!-- Form Content -->
				<div class="custom-scrollbar max-h-[70vh] space-y-6 overflow-y-auto p-8">
					<!-- User Selector -->
					<div class="relative">
						<label class="mb-2 block text-sm font-bold text-stone-700">Seleccionar Estudiante</label
						>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<ZoomIcon class="size-5 text-stone-400" />
							</div>
							<input
								type="text"
								class="block w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pr-3 pl-10 text-stone-800 placeholder-stone-400 transition-all focus:border-stone-900 focus:ring-2 focus:ring-stone-900 sm:text-sm"
								placeholder="Buscar por nombre o email..."
								bind:value={userSearch}
								oninput={searchUsers}
								onfocus={() => {
									if (users.length > 0) showUserResults = true;
								}}
							/>
						</div>

						{#if isLoadingUsers}
							<div
								class="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-stone-100 bg-white shadow-lg"
								transition:fade={{ duration: 150 }}
							>
								{#each Array(3), i (i)}
									<div
										class="flex items-center gap-3 border-b border-stone-50 px-4 py-3 last:border-0"
									>
										<Skeleton class="size-8" shape="circle" />
										<div class="flex-1 space-y-2">
											<Skeleton class="h-4 w-2/3" />
											<Skeleton class="h-3 w-1/3" />
										</div>
									</div>
								{/each}
							</div>
						{/if}

						{#if showUserResults && users.length > 0}
							<div
								class="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-stone-100 bg-white shadow-lg"
								transition:fade={{ duration: 150 }}
							>
								{#each users as user (user.id)}
									<button
										class="flex w-full items-center gap-3 border-b border-stone-50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-rose-50"
										onclick={() => selectUser(user)}
									>
										<div
											class="flex size-8 items-center justify-center rounded-full bg-stone-100 text-stone-500"
										>
											<UserIcon class="size-4" />
										</div>
										<div>
											<p class="text-sm font-bold text-stone-800">{user.full_name}</p>
											<p class="text-xs text-stone-500">@{user.username}</p>
										</div>
									</button>
								{/each}
							</div>
						{/if}

						{#if selectedUser}
							<div
								class="mt-2 flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-3"
								transition:fade
							>
								<div
									class="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-600"
								>
									<UserIcon class="size-4" />
								</div>
								<div class="flex-1">
									<p class="text-xs font-bold text-green-800">Seleccionado</p>
									<p class="text-sm text-green-700">{selectedUser.full_name}</p>
								</div>
								<button
									class="p-1 text-green-400 hover:text-green-600"
									onclick={() => {
										selectedUser = null;
										userSearch = '';
									}}
								>
									<XIcon class="size-4" />
								</button>
							</div>
						{/if}
					</div>

					<!-- Course Selector -->
					{#if !initialCourse}
						<div class="relative">
							<label class="mb-2 block text-sm font-bold text-stone-700">Seleccionar Curso</label>

							<div class="relative mb-4">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<BookIcon class="size-5 text-stone-400" />
								</div>
								<input
									type="text"
									class="block w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pr-3 pl-10 text-stone-800 placeholder-stone-400 transition-all focus:border-stone-900 focus:ring-2 focus:ring-stone-900 sm:text-sm"
									placeholder="Buscar por título del curso..."
									bind:value={courseSearch}
									oninput={searchCourses}
									onfocus={() => {
										if (courses.length > 0) showCourseResults = true;
									}}
								/>
							</div>

							{#if isLoadingCourses}
								<div
									class="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-stone-100 bg-white shadow-lg"
									transition:fade={{ duration: 150 }}
								>
									{#each Array(3), i (i)}
										<div
											class="flex items-center gap-3 border-b border-stone-50 px-4 py-3 last:border-0"
										>
											<Skeleton class="size-10 rounded-lg" />
											<div class="flex-1 space-y-2">
												<Skeleton class="h-4 w-3/4" />
												<Skeleton class="h-3 w-1/4" />
											</div>
										</div>
									{/each}
								</div>
							{/if}

							{#if showCourseResults && courses.length > 0}
								<div
									class="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-stone-100 bg-white shadow-lg"
									transition:fade={{ duration: 150 }}
								>
									{#each courses as course (course.id)}
										<button
											class="flex w-full items-center gap-3 border-b border-stone-50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-rose-50"
											onclick={() => selectCourse(course)}
										>
											{#if course.cover_image_url}
												<img
													src={course.cover_image_url}
													alt=""
													class="size-10 rounded-lg object-cover"
												/>
											{:else}
												<div
													class="flex size-10 items-center justify-center rounded-lg bg-stone-100 text-stone-500"
												>
													<BookIcon class="size-5" />
												</div>
											{/if}
											<div>
												<p class="text-sm font-bold text-stone-800">{course.title}</p>
												<p class="text-xs text-stone-500">{course.price} {course.currency}</p>
											</div>
										</button>
									{/each}
								</div>
							{/if}

							{#if selectedCourse}
								<div
									class="mt-2 flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 p-3"
									transition:fade
								>
									{#if selectedCourse.cover_image_url}
										<img
											src={selectedCourse.cover_image_url}
											alt=""
											class="size-10 rounded-lg object-cover"
										/>
									{:else}
										<div
											class="flex size-10 items-center justify-center rounded-lg bg-stone-100 text-rose-600"
										>
											<BookIcon class="size-5" />
										</div>
									{/if}
									<div class="flex-1">
										<p class="text-xs font-bold text-rose-800">Curso Seleccionado</p>
										<p class="text-sm text-rose-700">{selectedCourse.title}</p>
									</div>
									<button
										class="p-1 text-rose-400 hover:text-rose-600"
										onclick={() => {
											selectedCourse = null;
											courseSearch = '';
										}}
									>
										<XIcon class="size-4" />
									</button>
								</div>
							{/if}
						</div>
					{/if}

					<!-- Notes -->
					<div>
						<label class="mb-2 block text-sm font-bold text-stone-700" for="notes"
							>Notas (Opcional)</label
						>
						<textarea
							id="notes"
							class="custom-scrollbar block w-full rounded-xl border border-stone-200 bg-stone-50 p-4 text-stone-800 placeholder-stone-400 transition-all focus:border-stone-900 focus:ring-2 focus:ring-stone-900 sm:text-sm"
							placeholder="Observaciones adicionales sobre la inscripción..."
							rows="3"
							bind:value={notes}
						></textarea>
					</div>

					<!-- Info Box -->
					<div class="flex items-start gap-3 rounded-2xl border border-stone-100 bg-stone-50 p-4">
						<AlertTriangleIcon class="mt-0.5 size-5 shrink-0 text-stone-400" />
						<p class="text-xs leading-relaxed font-medium text-stone-500">
							La inscripción tendrá una vigencia de <span class="font-bold text-stone-800"
								>1 año</span
							>
							a partir de hoy y el estado inicial será
							<span class="font-bold tracking-wider text-green-600 uppercase">Activo</span>.
						</p>
					</div>
				</div>

				<!-- Footer Actions -->
				<div class="flex flex-col gap-3 bg-stone-50 px-8 py-6 sm:flex-row">
					<Button variant="outline" class="flex-1 border-stone-200 py-4" onclick={handleClose}>
						Cancelar
					</Button>
					<Button
						class="flex-1 bg-rose-600 py-4 text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-700 active:scale-95"
						loading={isSubmitting}
						onclick={handleSubmit}
						disabled={isSubmitting}
					>
						Registrar Inscripción
					</Button>
				</div>
			</div>
		</BlurOverlay>
	</div>
{/if}
