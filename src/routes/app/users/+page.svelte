<script lang="ts">
	import { onMount } from 'svelte';
	import { UsersService } from '$lib/services/users.service';
	import type { User, UserRole, UsersListResponse } from '$lib/interfaces';
	import UserCard from '$lib/components/features/users/userCard.svelte';
	import UsersTable from '$lib/components/features/users/usersTable.svelte';
	import UsersFilters from '$lib/components/features/users/usersFilters.svelte';
	import UserModal from '$lib/components/features/users/userModal.svelte';
	import ResetPasswordModal from '$lib/components/features/users/resetPasswordModal.svelte';
	import ChangeRoleModal from '$lib/components/features/users/changeRoleModal.svelte';
	import { Pagination, Button, ModalConfirm } from '$lib/components/ui';
	import { alert } from '$lib/utils';

	// State
	let usersData: UsersListResponse | null = $state(null);
	let loading: boolean = $state(true);
	let error: string | null = $state(null);

	// Filters
	let searchQuery: string = $state('');
	let selectedRole: UserRole | null = $state(null);
	let isActiveFilter: boolean | null = $state(null);
	let currentPage: number = $state(1);
	let perPage: number = $state(10);

	// Modals
	let showModal: boolean = $state(false);
	let selectedUser: User | null = $state(null);
	let showDeleteConfirm: boolean = $state(false);
	let userToDelete: User | null = $state(null);
	let deleteLoading: boolean = $state(false);
	let showResetPasswordModal: boolean = $state(false);
	let showChangeRoleModal: boolean = $state(false);

	const colors = {
		cream: '#f4e9c4',
		taupe: '#a78d70',
		rose: '#ce7576',
		grey: '#cccccc',
		gold: '#b58b3a'
	};

	onMount(() => {
		loadUsers();
	});

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
		} catch (err: unknown) {
			const errorMsg = err instanceof Error ? err.message : 'Error al cargar usuarios';
			error = errorMsg;
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
		selectedUser = user;
		showModal = true;
	}

	function handleDeleteUser(user: User) {
		userToDelete = user;
		showDeleteConfirm = true;
	}

	async function handleConfirmDelete() {
		if (!userToDelete) return;

		deleteLoading = true;
		try {
			await UsersService.delete(userToDelete.id);
			loadUsers();
			showDeleteConfirm = false;
			userToDelete = null;
		} catch (err: unknown) {
			alert('error', 'Ocurrió un error al eliminar el usuario');
			console.error('Error deleting user:', err);
		} finally {
			deleteLoading = false;
		}
	}

	function handleCancelDelete() {
		showDeleteConfirm = false;
		userToDelete = null;
	}

	function handleResetPassword(user: User) {
		selectedUser = user;
		showResetPasswordModal = true;
	}

	function handleUpdateRole(user: User) {
		selectedUser = user;
		showChangeRoleModal = true;
	}

	function handleResetFilters() {
		searchQuery = '';
		selectedRole = null;
		isActiveFilter = null;
		currentPage = 1;
		loadUsers();
	}

	function handleSuccess() {
		loadUsers();
	}
</script>

<div class="users-page">
	<!-- Header -->
	<div class="page-header">
		<h1 class="page-title" style="color: {colors.taupe};">Gestión de Usuarios</h1>
		<div class="header-actions">
			<Button variant="outline" onclick={handleResetFilters}>Reiniciar</Button>
			<Button
				variant="primary"
				style="background-color: {colors.rose};"
				onclick={() => {
					selectedUser = null;
					showModal = true;
				}}
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<line x1="12" y1="5" x2="12" y2="19"></line>
					<line x1="5" y1="12" x2="19" y2="12"></line>
				</svg>
				Nuevo Usuario
			</Button>
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
	{#if usersData && !loading && !error}
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
		{:else}
			<!-- Mobile View: Cards -->
			<div class="block md:hidden">
				{#each usersData.data as user (user.id)}
					<UserCard
						{user}
						onAction={handleUserAction}
						onDelete={handleDeleteUser}
						onResetPassword={handleResetPassword}
						onUpdateRole={handleUpdateRole}
					/>
				{/each}
			</div>
			<!-- Desktop View: Table -->
			<div class="hidden md:block">
				<UsersTable
					users={usersData.data}
					onAction={handleUserAction}
					onDelete={handleDeleteUser}
					onResetPassword={handleResetPassword}
					onUpdateRole={handleUpdateRole}
				/>
			</div>
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

	<!-- Modals -->
	<UserModal
		isOpen={showModal}
		user={selectedUser}
		onClose={() => (showModal = false)}
		onSuccess={handleSuccess}
	/>

	<ModalConfirm
		isOpen={showDeleteConfirm}
		message={`¿Estás seguro de que deseas eliminar al usuario ${userToDelete?.full_name}?`}
		onConfirm={handleConfirmDelete}
		onCancel={handleCancelDelete}
		loading={deleteLoading}
	/>

	<ResetPasswordModal
		isOpen={showResetPasswordModal}
		user={selectedUser}
		onClose={() => (showResetPasswordModal = false)}
		onSuccess={() => alert('success', 'Contraseña restablecida con éxito')}
	/>

	<ChangeRoleModal
		isOpen={showChangeRoleModal}
		user={selectedUser}
		onClose={() => (showChangeRoleModal = false)}
		onSuccess={() => {
			alert('success', 'Rol actualizado con éxito');
			loadUsers();
		}}
	/>
</div>
