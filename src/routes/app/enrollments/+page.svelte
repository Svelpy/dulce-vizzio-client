<script lang="ts">
	import { onMount } from 'svelte';
	import { enrollmentService } from '$lib/services';
	import type { Enrollment, EnrollmentStatus, EnrollmentListResponse } from '$lib/interfaces';
	import EnrollmentCard from '$lib/components/features/enrollments/EnrollmentCard.svelte';
	import EnrollmentsTable from '$lib/components/features/enrollments/EnrollmentsTable.svelte';
	import EnrollmentFilters from '$lib/components/features/enrollments/EnrollmentFilters.svelte';
	import CreateEnrollmentModal from '$lib/components/features/enrollments/CreateEnrollmentModal.svelte';
	import { Pagination, Button, DropdownMenu, Heading } from '$lib/components/ui';
	import { courseService } from '$lib/services';
	import type { Course, DropdownOption } from '$lib/interfaces';
	import ExtendEnrollmentModal from '$lib/components/features/enrollments/ExtendEnrollmentModal.svelte';
	import { PlusIcon, DotsVerticalIcon, RefreshIcon, TrashIcon } from '$lib/icons/outline';
	import { ModalConfirm } from '$lib/components/ui';
	import { alert } from '$lib/utils';
	import { AlertTriangleIcon, ExclamationCircleIcon } from '$lib/icons/solid';

	// State
	let enrollmentsData: EnrollmentListResponse | null = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let isModalOpen = $state(false);
	let selectedCourseForEnrollment = $state<Course | null>(null);

	// Courses for quick enrollment
	let coursesData = $state<Course[]>([]);
	let loadingCourses = $state(true);
	let openDropdownId = $state<string | null>(null);

	// Extension Modal
	let isExtendModalOpen = $state(false);
	let selectedEnrollment = $state<Enrollment | null>(null);

	// Delete Modal
	let isDeleteModalOpen = $state(false);
	let isDeleting = $state(false);

	// Filters
	let searchQuery = $state('');
	let selectedStatus: EnrollmentStatus | null = $state(null);
	let currentPage = $state(1);
	let perPage = $state(10);

	onMount(() => {
		loadEnrollments();
		loadCourses();
	});

	async function loadCourses() {
		loadingCourses = true;
		try {
			const resp = await courseService.getAll({ limit: 10, status: 'PUBLISHED' });
			coursesData = resp.data;
		} catch (err) {
			console.error('Error loading courses for quick enrollment:', err);
		} finally {
			loadingCourses = false;
		}
	}

	async function loadEnrollments() {
		loading = true;
		error = null;

		try {
			const filters = {
				page: currentPage,
				size: perPage,
				search: searchQuery || undefined,
				status: selectedStatus || undefined
			};

			enrollmentsData = await enrollmentService.getAll(filters);
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Error al cargar inscripciones';
			error = errorMessage;
			console.error('Error loading enrollments:', err);
		} finally {
			loading = false;
		}
	}

	function handleSearchChange() {
		currentPage = 1;
		loadEnrollments();
	}

	function handleStatusChange() {
		currentPage = 1;
		loadEnrollments();
	}

	function handlePageChange(page: number) {
		currentPage = page;
		loadEnrollments();
	}

	function handlePerPageChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		perPage = parseInt(target.value);
		currentPage = 1;
		loadEnrollments();
	}

	function handleEnrollmentAction(enrollment: Enrollment) {
		console.log('Action for enrollment:', enrollment);
	}

	function handleResetFilters() {
		searchQuery = '';
		selectedStatus = null;
		currentPage = 1;
		loadEnrollments();
	}

	function toggleDropdown(id: string) {
		openDropdownId = openDropdownId === id ? null : id;
	}

	function openEnrollmentModal(course?: Course) {
		selectedCourseForEnrollment = course || null;
		isModalOpen = true;
	}

	function getCourseOptions(course: Course): DropdownOption[] {
		return [
			{
				id: 'enroll',
				label: 'Inscribir Alumno',
				icon: PlusIcon,
				action: () => openEnrollmentModal(course)
			}
		];
	}

	function openExtendModal(enrollment: Enrollment) {
		selectedEnrollment = enrollment;
		isExtendModalOpen = true;
	}

	function getEnrollmentOptions(enrollment: Enrollment): DropdownOption[] {
		return [
			{
				id: 'extend',
				label: 'Extender Inscripción',
				icon: RefreshIcon,
				action: () => openExtendModal(enrollment)
			},
			{
				id: 'delete',
				label: 'Eliminar Inscripción',
				icon: TrashIcon,
				action: () => openDeleteModal(enrollment),
				divider: true,
				variant: 'destructive'
			}
		];
	}

	function openDeleteModal(enrollment: Enrollment) {
		selectedEnrollment = enrollment;
		isDeleteModalOpen = true;
	}

	async function handleDeleteConfirm() {
		if (!selectedEnrollment) return;
		isDeleting = true;
		try {
			await enrollmentService.cancel(selectedEnrollment.id);
			alert('success', 'Inscripción eliminada exitosamente');
			if (enrollmentsData) {
				enrollmentsData.data = enrollmentsData.data.filter((e) => e.id !== selectedEnrollment!.id);
			}
			isDeleteModalOpen = false;
		} catch (err) {
			console.error('Error deleting enrollment:', err);
			alert('error', 'Ocurrió un error al eliminar la inscripción');
		} finally {
			isDeleting = false;
			selectedEnrollment = null;
		}
	}

	function handleEnrollmentUpdate(updated: Enrollment) {
		if (!enrollmentsData) return;
		enrollmentsData.data = enrollmentsData.data.map((e) => (e.id === updated.id ? updated : e));
	}
</script>

{#snippet enrollmentActions(enrollment: Enrollment)}
	<div class="relative">
		<button
			class="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-stone-400 shadow-sm ring-1 ring-stone-200 transition-all hover:bg-stone-50 hover:text-stone-800"
			onclick={(e) => {
				e.stopPropagation();
				toggleDropdown(enrollment.id);
			}}
		>
			<DotsVerticalIcon class="h-5 w-5" />
		</button>
		<DropdownMenu
			isOpen={openDropdownId === enrollment.id}
			options={getEnrollmentOptions(enrollment)}
			width={190}
			class="absolute top-11 right-0 z-50 rounded-2xl border-none p-2 shadow-sweet"
		/>
	</div>
{/snippet}

<svelte:head>
	<title>Inscripciones</title>
</svelte:head>

<div class="flex flex-col gap-6 p-4 md:p-8">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<Heading level="h3">Gestión de Inscripciones</Heading>
		</div>
		<div class="flex items-center gap-3">
			<Button
				class="bg-stone-900 text-white shadow-lg transition-all hover:bg-rose-600 hover:shadow-rose-600/20"
				onclick={() => openEnrollmentModal()}
			>
				Nueva Inscripción
			</Button>
		</div>
	</div>

	<!-- Filters -->
	<EnrollmentFilters
		bind:searchQuery
		bind:selectedStatus
		onSearchChange={handleSearchChange}
		onStatusChange={handleStatusChange}
	/>

	<!-- State Management -->
	{#if loading}
		<div class="flex min-h-[400px] flex-col items-center justify-center gap-4 py-20">
			<div
				class="h-12 w-12 animate-spin rounded-full border-4 border-stone-100 border-t-stone-400"
			></div>
			<p class="animate-pulse font-medium text-stone-500">Cargando inscripciones...</p>
		</div>
	{:else if error}
		<div
			class="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-2xl bg-rose-50 p-8 text-center text-light-error"
		>
			<ExclamationCircleIcon class="h-12 w-12 " />
			<div class="max-w-md">
				<h3 class="text-lg font-bold">Ocurrió un error</h3>
				<p class="mt-1 text-sm opacity-90">{error}</p>
				<Button
					variant="outline"
					class="mt-6 border-rose-200 hover:bg-rose-100"
					onclick={loadEnrollments}
				>
					Reintentar
				</Button>
			</div>
		</div>
	{:else if enrollmentsData}
		{#if enrollmentsData.data.length === 0}
			<div
				class="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-stone-200 py-20 text-center"
			>
				<div
					class="flex h-16 w-16 items-center justify-center rounded-full bg-stone-50 text-stone-300"
				>
					<AlertTriangleIcon class="h-12 w-12 " />
				</div>
				<div>
					<h3 class="text-lg font-semibold text-stone-800">No se encontraron inscripciones</h3>
					<p class="mt-1 text-sm text-stone-500">
						Intenta ajustar los filtros de búsqueda para obtener resultados.
					</p>
				</div>
			</div>
		{:else}
			<!-- List (Responsive) -->
			<div class="block lg:hidden">
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{#each enrollmentsData.data as enrollment (enrollment.id)}
						<EnrollmentCard {enrollment}>
							{#snippet actions()}
								{@render enrollmentActions(enrollment)}
							{/snippet}
						</EnrollmentCard>
					{/each}
				</div>
			</div>

			<div class="hidden lg:block">
				<EnrollmentsTable enrollments={enrollmentsData.data}>
					{#snippet actions(enrollment)}
						{@render enrollmentActions(enrollment)}
					{/snippet}
				</EnrollmentsTable>
			</div>

			<!-- Pagination (Bottom) -->
			{#if enrollmentsData.total_pages > 1}
				<div class="mt-8 flex justify-center">
					<div class="rounded-xl border border-stone-200 bg-white p-2 shadow-sm">
						<Pagination
							currentPage={enrollmentsData.page}
							totalPages={enrollmentsData.total_pages}
							perPage={enrollmentsData.per_page}
							total={enrollmentsData.total}
							onPageChange={handlePageChange}
						/>
					</div>
				</div>
			{/if}

			<!-- Summary -->
			<p class="mt-4 text-center text-xs font-medium text-stone-400 italic">
				Página {enrollmentsData.page} de {enrollmentsData.total_pages} — Sistema Administrativo Dulce
				Vizzio
			</p>
		{/if}
	{/if}

	<CreateEnrollmentModal
		isOpen={isModalOpen}
		initialCourse={selectedCourseForEnrollment}
		onClose={() => {
			isModalOpen = false;
			selectedCourseForEnrollment = null;
		}}
		onSuccess={() => loadEnrollments()}
	/>

	<ExtendEnrollmentModal
		isOpen={isExtendModalOpen}
		enrollment={selectedEnrollment}
		onClose={() => {
			isExtendModalOpen = false;
			selectedEnrollment = null;
		}}
		onSuccess={handleEnrollmentUpdate}
	/>

	<ModalConfirm
		isOpen={isDeleteModalOpen}
		message={`¿Estás seguro que deseas eliminar la inscripción de ${selectedEnrollment?.user?.full_name} en el curso ${selectedEnrollment?.course?.title}? Esta acción no se puede deshacer.`}
		onConfirm={handleDeleteConfirm}
		onCancel={() => {
			isDeleteModalOpen = false;
			selectedEnrollment = null;
		}}
		loading={isDeleting}
	/>
</div>
