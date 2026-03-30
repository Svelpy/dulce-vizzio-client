<script lang="ts">
	import { onMount } from 'svelte';
	import { enrollmentService } from '$lib/services';
	import type { Enrollment, EnrollmentStatus, EnrollmentListResponse } from '$lib/interfaces';
	import EnrollmentCard from '$lib/components/features/enrollments/EnrollmentCard.svelte';
	import EnrollmentsTable from '$lib/components/features/enrollments/EnrollmentsTable.svelte';
	import EnrollmentFilters from '$lib/components/features/enrollments/EnrollmentFilters.svelte';
	import CreateEnrollmentModal from '$lib/components/features/enrollments/CreateEnrollmentModal.svelte';
	import { Pagination, Button } from '$lib/components/ui';

	// State
	let enrollmentsData: EnrollmentListResponse | null = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let isModalOpen = $state(false);

	// Filters
	let searchQuery = $state('');
	let selectedStatus: EnrollmentStatus | null = $state(null);
	let currentPage = $state(1);
	let perPage = $state(10);

	onMount(() => {
		loadEnrollments();
	});

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
</script>

<svelte:head>
	<title>Inscripciones | Dulce Vizzio</title>
</svelte:head>

<div class="flex flex-col gap-6 p-4 md:p-8">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-stone-800 md:text-3xl">
				Gestión de Inscripciones
			</h1>
			<p class="mt-1 text-sm text-stone-500">
				Administra las inscripciones de tus estudiantes a los cursos.
			</p>
		</div>
		<div class="flex items-center gap-3">
			<Button
				variant="outline"
				class="border-stone-200 text-stone-600 hover:bg-stone-50"
				onclick={handleResetFilters}
			>
				Reiniciar filtros
			</Button>
			<Button
				class="bg-stone-900 text-white shadow-lg transition-all hover:bg-rose-600 hover:shadow-rose-600/20"
				onclick={() => (isModalOpen = true)}
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

	<!-- Pagination Controls (Top) -->
	{#if enrollmentsData && !loading}
		<div
			class="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="flex items-center gap-4 text-sm text-stone-600">
				<div class="flex items-center gap-2">
					<span>Mostrando:</span>
					<select
						bind:value={perPage}
						onchange={handlePerPageChange}
						class="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 transition-all outline-none focus:border-stone-400"
					>
						<option value={10}>10</option>
						<option value={20}>20</option>
						<option value={50}>50</option>
					</select>
				</div>
				<span class="hidden sm:inline">|</span>
				<span>Total: <span class="font-semibold">{enrollmentsData.total}</span> inscripciones</span>
			</div>

			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					class="border-none bg-rose-500 text-white shadow-sm hover:bg-rose-600"
					onclick={loadEnrollments}
				>
					Actualizar lista
				</Button>
			</div>
		</div>
	{/if}

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
			class="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-2xl bg-rose-50 p-8 text-center text-rose-800"
		>
			<svg class="h-12 w-12 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
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
					<svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
						/>
					</svg>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-stone-800">No se encontraron inscripciones</h3>
					<p class="mt-1 text-sm text-stone-500">
						Intenta ajustar los filtros de búsqueda para obtener resultados.
					</p>
					<Button variant="outline" class="mt-6 border-stone-200" onclick={handleResetFilters}>
						Limpiar filtros
					</Button>
				</div>
			</div>
		{:else}
			<!-- List (Responsive) -->
			<div class="block lg:hidden">
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{#each enrollmentsData.data as enrollment (enrollment.id)}
						<EnrollmentCard {enrollment} onAction={handleEnrollmentAction} />
					{/each}
				</div>
			</div>

			<div class="hidden lg:block">
				<EnrollmentsTable enrollments={enrollmentsData.data} onAction={handleEnrollmentAction} />
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
		onClose={() => (isModalOpen = false)}
		onSuccess={() => loadEnrollments()}
	/>
</div>
