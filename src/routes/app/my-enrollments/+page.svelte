<script lang="ts">
	import { onMount } from 'svelte';
	import { enrollmentService } from '$lib/services';
	import type { EnrollmentStatus, EnrollmentListResponse } from '$lib/interfaces';
	import { MainLayout, Pagination, Button, Heading } from '$lib/components/ui';
	import EnrollmentFilters from '$lib/components/features/enrollments/EnrollmentFilters.svelte';
	import { CourseCardSkeleton } from '$lib/components/skeletons/course';

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

<MainLayout title="Mis Cursos | Dulce Vizzio" class="container mx-auto">
	<div class="relative space-y-6">
		<!-- Background Decorations -->
		<div class="pointer-events-none absolute -top-10 -right-10 overflow-hidden opacity-10">
			<div class="flex flex-wrap gap-20">
				{#each { length: 5 } as _, i (i)}
					<span class="text-9xl text-sweet-pink-300">💕</span>
				{/each}
			</div>
		</div>

		<div class="relative z-10 px-2 lg:px-0">
			<!-- Header -->
			<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<Heading level="h4">Mis Cursos</Heading>
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
				<div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{#each { length: 8 } as _, i (i)}
						<CourseCardSkeleton />
					{/each}
				</div>
			{:else if error}
				<div
					class="glass-card mt-6 flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-[2rem] p-12 text-center shadow-sweet"
				>
					<svg
						class="mb-2 h-12 w-12 text-red-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<div class="max-w-md">
						<h3 class="mb-2 text-2xl font-black text-sweet-brown">Ocurrió un error</h3>
						<p class="mb-6 font-medium text-sweet-pink-400/70">{error}</p>
						<button
							class="sweet-gradient-intense rounded-2xl px-8 py-3 text-sm font-black text-white shadow-lg transition-all hover:scale-105 active:scale-95"
							onclick={loadMyEnrollments}>Reintentar</button
						>
					</div>
				</div>
			{:else if enrollmentsData}
				{#if enrollmentsData.data.length === 0}
					<div
						class="glass-card mt-6 flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-[2rem] p-12 text-center shadow-sweet"
					>
						<div class="mb-4 text-7xl">🍰</div>
						<div class="max-w-md">
							<h3 class="mb-2 text-2xl font-black text-sweet-brown">Aún no tienes cursos</h3>
							<p class="mb-8 font-medium text-sweet-pink-400/70">
								¡Explora nuestro catálogo y comienza tu viaje en la pastelería hoy mismo!
							</p>
							<div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
								<a
									href="/app/courses"
									class="sweet-gradient-intense rounded-2xl px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
								>
									Ver Catálogo
								</a>
								<Button
									variant="outline"
									class="rounded-2xl border-stone-200"
									onclick={handleResetFilters}
								>
									Limpiar filtros
								</Button>
							</div>
						</div>
					</div>
				{:else}
					<!-- Grid -->
					<div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{#each enrollmentsData.data as enrollment (enrollment.id)}
							<div
								class="glass-card group flex flex-col overflow-hidden rounded-[2rem] border-none shadow-sweet transition-all hover:shadow-lg hover:shadow-sweet-pink-300/30"
							>
								<!-- Course Image -->
								<div class="relative aspect-video overflow-hidden bg-sweet-pink-50/50">
									{#if enrollment.course?.cover_image_url}
										<img
											src={enrollment.course.cover_image_url}
											alt={enrollment.course.title}
											class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
										/>
									{:else}
										<div class="flex h-full w-full items-center justify-center text-sweet-pink-200">
											<div class="text-4xl text-sweet-pink-300">🍰</div>
										</div>
									{/if}
								</div>

								<!-- Content -->
								<div class="flex flex-1 flex-col p-6">
									<h3
										class="line-clamp-2 text-xl font-black text-sweet-brown transition-colors group-hover:text-sweet-pink-500"
									>
										{enrollment.course?.title || 'Curso sin título'}
									</h3>

									<div
										class="mt-4 flex items-center justify-between border-t border-sweet-pink-100/50 pt-4"
									>
										<div class="flex flex-col">
											<span
												class="text-[10px] font-bold tracking-widest text-sweet-pink-400 uppercase"
												>Vence en</span
											>
											<span class="text-sm font-bold text-sweet-brown">
												{new Date(enrollment.expires_at).toLocaleDateString('es-ES', {
													month: 'long',
													year: 'numeric'
												})}
											</span>
										</div>
									</div>

									<div class="mt-6">
										<a
											href={`/app/courses/${enrollment.course?.slug}`}
											class="flex w-full items-center justify-center rounded-2xl bg-sweet-pink-400 py-3 text-sm font-black text-white transition-all hover:bg-sweet-pink-500 hover:shadow-lg hover:shadow-sweet-pink-500/20 active:scale-95"
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
							<Pagination
								currentPage={enrollmentsData.page}
								totalPages={enrollmentsData.total_pages}
								perPage={enrollmentsData.per_page}
								total={enrollmentsData.total}
								onPageChange={handlePageChange}
							/>
						</div>
					{/if}
				{/if}
			{/if}
		</div>
	</div>
</MainLayout>
