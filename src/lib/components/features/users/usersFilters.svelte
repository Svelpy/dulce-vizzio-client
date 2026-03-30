<script lang="ts">
	import type { UserRole } from '$lib/interfaces';

	interface Props {
		searchQuery: string;
		selectedRole: UserRole | null;
		onSearchChange: (value: string) => void;
		onRoleChange: (value: UserRole | null) => void;
	}

	let {
		searchQuery = $bindable(),
		selectedRole = $bindable(),
		onSearchChange,
		onRoleChange
	}: Props = $props();

	const roles = [
		{ value: '', label: 'Todos los Roles' },
		{ value: 'SUPERADMIN', label: 'Super Administrador' },
		{ value: 'ADMIN', label: 'Administrador' },
		{ value: 'MODERATOR', label: 'Moderador' },
		{ value: 'USER', label: 'Usuario' }
	];

	function handleRoleChange(value: string) {
		const role = value === '' ? null : (value as UserRole);
		selectedRole = role;
		onRoleChange(role);
	}
</script>

<div class="flex flex-col md:flex-row gap-4 mb-6 items-end">
	<!-- Search Input -->
	<div class="flex-1 w-full">
		<label for="search" class="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
			Buscar
		</label>
		<div class="relative group">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400 group-focus-within:text-rose-400 transition-colors">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="11" cy="11" r="8"></circle>
					<path d="m21 21-4.35-4.35"></path>
				</svg>
			</div>
			<input
				id="search"
				type="text"
				bind:value={searchQuery}
				oninput={(e) => onSearchChange((e.target as HTMLInputElement).value)}
				placeholder="Buscar por nombre, email o usuario..."
				class="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-stone-100 rounded-xl focus:outline-none focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all text-sm shadow-sm"
			/>
		</div>
	</div>

	<!-- Role Filter -->
	<div class="w-full md:w-64">
		<label for="role" class="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
			Filtrar por Rol
		</label>
		<div class="relative group">
			<select
				id="role"
				bind:value={selectedRole}
				onchange={(e) => handleRoleChange((e.target as HTMLSelectElement).value)}
				class="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border-2 border-stone-100 rounded-xl focus:outline-none focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all text-sm shadow-sm cursor-pointer"
			>
				{#each roles as role (role.value)}
					<option value={role.value}>{role.label}</option>
				{/each}
			</select>
			<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-stone-400">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="m6 9 6 6 6-6"></path>
				</svg>
			</div>
		</div>
	</div>
</div>

<style>
	/* Custom styles if needed, but keeping it simple with Tailwind-like logic for now */
</style>

