<script lang="ts">
	import { onMount } from 'svelte';
	import { userService } from '$lib/services';
	import type { User, UserRole, UsersListResponse } from '$lib/interfaces';
	import ListTableUsers from '$lib/components/features/users/listTableUsers.svelte';
	import UsersFilters from '$lib/components/features/users/usersFilters.svelte';
	import UserModal from '$lib/components/features/users/userModal.svelte';
	import ResetPasswordModal from '$lib/components/features/users/resetPasswordModal.svelte';
	import ChangeRoleModal from '$lib/components/features/users/changeRoleModal.svelte';
	import { Pagination, Button, ModalConfirm, Heading } from '$lib/components/ui';
	import { alert } from '$lib/utils';
	import { PlusIcon } from '$lib/icons/outline';

	// State
	let usersData: UsersListResponse | null = $state(null);
	let loading: boolean = $state(true);
	let error: string | null = $state(null);

	// Filters
	let searchQuery: string = $state('');
	let selectedRole: UserRole | null = $state(null);
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
				role: selectedRole || undefined
			};

			usersData = await userService.getAll(filters);
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
		currentPage = 1;
		loadUsers();
	}

	function handleRoleChange(role: UserRole | null) {
		selectedRole = role;
		currentPage = 1;
		loadUsers();
	}

	function handlePageChange(page: number) {
		currentPage = page;
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
			await userService.delete(userToDelete.id);
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
		currentPage = 1;
		loadUsers();
	}

	function handleSuccess() {
		loadUsers();
	}
</script>

<div class="flex min-h-full flex-col gap-6 py-1">
	<!-- Page Header -->
	<div
		class="flex flex-col flex-wrap items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4"
	>
		<div class="flex items-center gap-4">
			<div>
				<Heading level="h4">Usuarios</Heading>
			</div>
		</div>
		<div class="flex items-center gap-3">
			<Button
				variant="primary"
				onclick={() => {
					selectedUser = null;
					showModal = true;
				}}
				class="px-4.5 py-2.5 shadow-[0_4px_12px_rgba(206,117,118,0.35)]"
			>
				{#snippet leftIcon()}
					<PlusIcon />
				{/snippet}
				<span>Nuevo Usuario</span>
			</Button>
		</div>
	</div>

	<!-- Filters Card -->
	<div class="">
		<UsersFilters
			bind:searchQuery
			bind:selectedRole
			onSearchChange={handleSearchChange}
			onRoleChange={handleRoleChange}
		/>
	</div>

	<!-- Content Area -->
	<div class="flex flex-col gap-4">
		<!-- Error State -->
		{#if error && !loading}
			<div
				class="flex items-center gap-3 rounded-[0.875rem] border border-red-200 bg-red-50 px-5 py-3.5 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-400"
			>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="15" y1="9" x2="9" y2="15"></line>
					<line x1="9" y1="9" x2="15" y2="15"></line>
				</svg>
				<span>{error}</span>
				<button
					onclick={loadUsers}
					class="ml-auto rounded-lg border border-red-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-600 transition-all hover:border-red-600 hover:bg-red-600 hover:text-white dark:border-red-800 dark:bg-stone-900 dark:hover:bg-red-900"
					>Reintentar</button
				>
			</div>
		{/if}

		<!-- Table -->
		<ListTableUsers
			users={loading || error ? [] : (usersData?.data ?? [])}
			{loading}
			onAction={handleUserAction}
			onDelete={handleDeleteUser}
			onResetPassword={handleResetPassword}
			onUpdateRole={handleUpdateRole}
		/>

		<!-- Bottom: summary + pagination -->
		{#if usersData && !loading && !error}
			{#if usersData.total_pages > 1}
				<Pagination
					currentPage={usersData.page}
					totalPages={usersData.total_pages}
					perPage={usersData.per_page}
					total={usersData.total}
					onPageChange={handlePageChange}
				/>
			{/if}
		{/if}
	</div>
</div>

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
