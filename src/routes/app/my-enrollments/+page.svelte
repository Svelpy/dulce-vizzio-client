<script lang="ts">
	import { onMount } from 'svelte';
	import { enrollmentService } from '$lib/services';
	import type { EnrollmentStatus, EnrollmentListResponse } from '$lib/interfaces';
	import { Pagination, Button } from '$lib/components/ui';
	import EnrollmentFilters from '$lib/components/features/enrollments/EnrollmentFilters.svelte';

	// State
	let enrollmentsData: EnrollmentListResponse | null = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Filters
	let searchQuery = $state('');
	let selectedStatus: EnrollmentStatus | null = $state(null);
	let currentPage = $state(1);
	let perPage = $state(12); // Grid looks better with multiples of 3/4

	onMount(() => {
		loadMyEnrollments();
	});

	async function loadMyEnrollments() {
		loading = true;
		error = null;

		try {
			const filters = {
				page: currentPage,
				size: perPage,
				search: searchQuery || undefined,
				status: selectedStatus || undefined
			};

			enrollmentsData = await enrollmentService.getMyEnrollments(filters);
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Error al cargar tus cursos';
			error = errorMessage;
			console.error('Error loading my enrollments:', err);
		} finally {
			loading = false;
		}
	}

	function handleSearchChange() {
		currentPage = 1;
		loadMyEnrollments();
	}

	function handleStatusChange() {
		currentPage = 1;
		loadMyEnrollments();
	}

	function handlePageChange(page: number) {
		currentPage = page;
		loadMyEnrollments();
	}

	function handleResetFilters() {
		searchQuery = '';
		selectedStatus = null;
		currentPage = 1;
		loadMyEnrollments();
	}

	function getStatusLabel(status: EnrollmentStatus) {
		const labels = {
			ACTIVE: 'Activo',
			EXPIRED: 'Vencido',
			CANCELLED: 'Cancelado'
		};
		return labels[status] || status;
	}

	function getStatusColor(status: EnrollmentStatus) {
		const colors = {
			ACTIVE: 'bg-green-100 text-green-700 border-green-200',
			EXPIRED: 'bg-amber-100 text-amber-700 border-amber-200',
			CANCELLED: 'bg-rose-100 text-rose-700 border-rose-200'
		};
		return colors[status] || 'bg-stone-100 text-stone-700 border-stone-200';
	}
</script>

<svelte:head>
	<title>Mis Cursos | Dulce Vizzio</title>
</svelte:head>

<div class="flex flex-col gap-6 p-4 md:p-8">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-stone-800 md:text-3xl">Mis Cursos</h1>
			<p class="mt-1 text-sm text-stone-500">Accede a tus cursos y sigue aprendiendo.</p>
		</div>
		<div class="flex items-center gap-3">
			<Button
				variant="outline"
				class="border-stone-200 text-stone-600 hover:bg-stone-50"
				onclick={handleResetFilters}
			>
				Limpiar filtros
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
			<p class="animate-pulse font-medium text-stone-500">Cargando tus cursos...</p>
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
					onclick={loadMyEnrollments}
				>
					Reintentar
				</Button>
			</div>
		</div>
	{:else if enrollmentsData}
		{#if enrollmentsData.data.length === 0}
			<div
				class="flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-stone-200 py-20 text-center"
			>
				<div
					class="flex h-20 w-20 items-center justify-center rounded-full bg-stone-50 text-stone-300"
				>
					<svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
						/>
					</svg>
				</div>
				<div class="max-w-md">
					<h3 class="text-xl font-bold text-stone-800">Aún no tienes cursos</h3>
					<p class="mt-2 text-stone-500">
						¡Explora nuestro catálogo y comienza tu viaje en la pastelería hoy mismo!
					</p>
					<div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
						<a
							href="/app/courses"
							class="inline-flex items-center justify-center rounded-lg bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-600"
						>
							Ver Catálogo de Cursos
						</a>
						<Button variant="outline" class="border-stone-200" onclick={handleResetFilters}>
							Limpiar filtros
						</Button>
					</div>
				</div>
			</div>
		{:else}
			<!-- Grid -->
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each enrollmentsData.data as enrollment (enrollment.id)}
					<div
						class="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all hover:border-rose-200 hover:shadow-xl hover:shadow-rose-500/5"
					>
						<!-- Course Image -->
						<div class="relative aspect-video overflow-hidden bg-stone-100">
							{#if enrollment.course?.cover_image_url}
								<img
									src={enrollment.course.cover_image_url}
									alt={enrollment.course.title}
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>
							{:else}
								<div class="flex h-full w-full items-center justify-center text-stone-300">
									<svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.5"
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/>
									</svg>
								</div>
							{/if}

							<!-- Status Badge -->
							<div class="absolute top-3 right-3">
								<span
									class="rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md {getStatusColor(
										enrollment.status as keyof typeof getStatusColor
									)} shadow-sm"
								>
									{getStatusLabel(enrollment.status as keyof typeof getStatusLabel)}
								</span>
							</div>
						</div>

						<!-- Content -->
						<div class="flex flex-1 flex-col p-5">
							<h3
								class="line-clamp-2 text-lg font-bold text-stone-800 transition-colors group-hover:text-rose-600"
							>
								{enrollment.course?.title || 'Curso sin título'}
							</h3>

							<div class="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
								<div class="flex flex-col">
									<span class="text-[10px] font-bold tracking-widest text-stone-400 uppercase"
										>Vence en</span
									>
									<span class="text-sm font-semibold text-stone-600">
										{new Date(enrollment.expires_at).toLocaleDateString('es-ES', {
											month: 'long',
											year: 'numeric'
										})}
									</span>
								</div>

								<div class="flex flex-col text-right">
									<span class="text-[10px] font-bold tracking-widest text-stone-400 uppercase"
										>Precio</span
									>
									<span class="text-sm font-bold text-stone-900">
										{enrollment.course?.price}
										{enrollment.course?.currency}
									</span>
								</div>
							</div>

							<div class="mt-6">
								<a
									href={`/app/courses/${enrollment.course?.slug}`}
									class="flex w-full items-center justify-center rounded-xl bg-stone-800 py-3 text-sm font-bold text-white transition-all hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-500/20 active:scale-95"
								>
									Continuar Aprendiendo
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Pagination -->
			{#if enrollmentsData.total_pages > 1}
				<div class="mt-12 flex justify-center">
					<div class="rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
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
			<p class="mt-6 text-center text-xs font-semibold tracking-widest text-stone-400 uppercase">
				Dulce Vizzio — Elevando tu pasión por la pastelería
			</p>
		{/if}
	{/if}
</div>
