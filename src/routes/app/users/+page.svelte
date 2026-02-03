<script lang="ts">
	import { onMount } from 'svelte';
	import { UsersService } from '$lib/services/users.service';
	import type { User, UserRole, UsersListResponse } from '$lib/interfaces';
	import UserCard from '$lib/components/features/users/userCard.svelte';
	import UsersTable from '$lib/components/features/users/usersTable.svelte';
	import UsersFilters from '$lib/components/features/users/usersFilters.svelte';
	import { Pagination, Button } from '$lib/components/ui';

	// State
	let usersData: UsersListResponse | null = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Filters
	let searchQuery = $state('');
	let selectedRole: UserRole | null = $state(null);
	let isActiveFilter: boolean | null = $state(null);
	let currentPage = $state(1);
	let perPage = $state(10);

	// Responsive
	let isMobile = $state(false);

	const colors = {
		cream: '#f4e9c4',
		taupe: '#a78d70',
		rose: '#ce7576',
		grey: '#cccccc',
		gold: '#b58b3a'
	};

	onMount(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);
		loadUsers();

		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});

	function checkMobile() {
		isMobile = window.innerWidth < 1024;
	}

	async function loadUsers() {
		loading = true;
		error = null;

		try {
			const filters = {
				page: currentPage,
				per_page: perPage,
				q: searchQuery || undefined,
				role: selectedRole || undefined,
				is_active: isActiveFilter !== null ? isActiveFilter : undefined
			};

			usersData = await UsersService.getAll(filters);
		} catch (err: any) {
			error = err.message || 'Error al cargar usuarios';
			console.error('Error loading users:', err);
		} finally {
			loading = false;
		}
	}

	function handleSearchChange(value: string) {
		searchQuery = value;
		currentPage = 1; // Reset to first page on search
		loadUsers();
	}

	function handleRoleChange(role: UserRole | null) {
		selectedRole = role;
		currentPage = 1;
		loadUsers();
	}

	function handleActiveChange(active: boolean | null) {
		isActiveFilter = active;
		currentPage = 1;
		loadUsers();
	}

	function handlePageChange(page: number) {
		currentPage = page;
		loadUsers();
	}

	function handlePerPageChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		perPage = parseInt(target.value);
		currentPage = 1;
		loadUsers();
	}

	function handleUserAction(user: User) {
		console.log('Action for user:', user);
		// TODO: Implement action menu
	}

	function handleResetFilters() {
		searchQuery = '';
		selectedRole = null;
		isActiveFilter = null;
		currentPage = 1;
		loadUsers();
	}
</script>

<div class="users-page">
	<!-- Header -->
	<div class="page-header">
		<h1 class="page-title" style="color: {colors.taupe};">Gestión de Usuarios</h1>
		<div class="header-actions">
			<Button variant="outline" onclick={handleResetFilters}>Reiniciar</Button>
			<!-- <Button variant="default" style="background-color: {colors.rose};">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="12" y1="5" x2="12" y2="19"></line>
					<line x1="5" y1="12" x2="19" y2="12"></line>
				</svg>
				Nuevo Usuario
			</Button> -->
		</div>
	</div>

	<!-- Filters -->
	<UsersFilters
		bind:searchQuery
		bind:selectedRole
		bind:isActiveFilter
		onSearchChange={handleSearchChange}
		onRoleChange={handleRoleChange}
		onActiveChange={handleActiveChange}
	/>

	<!-- Pagination Controls (Top) -->
	{#if usersData && !loading}
		<div class="pagination-controls">
			<div class="per-page-selector">
				<label for="per-page" style="color: {colors.taupe};">Página:</label>
				<input
					type="number"
					id="current-page"
					min="1"
					max={usersData.total_pages}
					bind:value={currentPage}
					onchange={() => loadUsers()}
					class="page-input"
				/>
				<span style="color: {colors.taupe};">Por página:</span>
				<select
					id="per-page"
					bind:value={perPage}
					onchange={handlePerPageChange}
					class="per-page-select"
				>
					<option value="10">10</option>
					<option value="25">25</option>
					<option value="50">50</option>
					<option value="100">100</option>
				</select>
			</div>
			<div class="action-buttons">
				<Button
					variant="outline"
					size="sm"
					onclick={loadUsers}
					style="background-color: {colors.rose}; color: white; border: none;"
				>
					Buscar
				</Button>
			</div>
		</div>
	{/if}

	<!-- Loading State -->
	{#if loading}
		<div class="loading-container">
			<div class="spinner"></div>
			<p style="color: {colors.taupe};">Cargando usuarios...</p>
		</div>
	{/if}

	<!-- Error State -->
	{#if error && !loading}
		<div class="error-container" style="background-color: {colors.rose};">
			<p>{error}</p>
		</div>
	{/if}

	<!-- Users List -->
	{#if usersData && !loading && !error}
		{#if usersData.data.length === 0}
			<div class="empty-state">
				<svg
					width="64"
					height="64"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					style="color: {colors.grey};"
				>
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
					<circle cx="9" cy="7" r="4"></circle>
					<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
					<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
				</svg>
				<p style="color: {colors.taupe};">No se encontraron usuarios</p>
			</div>
		{:else if isMobile}
			<!-- Mobile View: Cards -->
			<div class="users-cards">
				{#each usersData.data as user (user.id)}
					<UserCard {user} onAction={handleUserAction} />
				{/each}
			</div>
		{:else}
			<!-- Desktop View: Table -->
			<UsersTable users={usersData.data} onAction={handleUserAction} />
		{/if}

		<!-- Pagination (Bottom) -->
		{#if usersData.total_pages > 1}
			<div class="pagination-wrapper">
				<Pagination
					currentPage={usersData.page}
					totalPages={usersData.total_pages}
					perPage={usersData.per_page}
					total={usersData.total}
					onPageChange={handlePageChange}
				/>
			</div>
		{/if}

		<!-- Summary -->
		<div class="summary" style="color: {colors.taupe};">
			Total: {usersData.total}, Página: {usersData.page}, Por página: {usersData.per_page}, Total
			páginas: {usersData.total_pages}
		</div>
	{/if}
</div>

<style>
	.users-page {
		padding: 1.5rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.page-title {
		font-size: 2rem;
		font-weight: 700;
		margin: 0;
	}

	.header-actions {
		display: flex;
		gap: 0.75rem;
	}

	.pagination-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding: 1rem;
		background-color: white;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.per-page-selector {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
	}

	.page-input {
		width: 4rem;
		padding: 0.375rem 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		text-align: center;
	}

	.per-page-select {
		padding: 0.375rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		background-color: white;
		cursor: pointer;
	}

	.action-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		gap: 1rem;
	}

	.spinner {
		width: 3rem;
		height: 3rem;
		border: 4px solid #f3f4f6;
		border-top-color: #a78d70;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.error-container {
		padding: 1rem;
		border-radius: 0.5rem;
		color: white;
		text-align: center;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		gap: 1rem;
	}

	.users-cards {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.pagination-wrapper {
		margin-top: 2rem;
	}

	.summary {
		margin-top: 1rem;
		text-align: center;
		font-size: 0.875rem;
		font-weight: 500;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.users-page {
			padding: 1rem;
		}

		.page-title {
			font-size: 1.5rem;
		}

		.pagination-controls {
			flex-direction: column;
			align-items: stretch;
		}

		.per-page-selector {
			flex-wrap: wrap;
		}
	}
</style>
