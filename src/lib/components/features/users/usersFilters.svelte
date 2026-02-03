<script lang="ts">
	import { Input, Select } from '$lib/components/ui';
	import type { UserRole } from '$lib/interfaces';

	interface Props {
		searchQuery: string;
		selectedRole: UserRole | null;
		isActiveFilter: boolean | null;
		onSearchChange: (value: string) => void;
		onRoleChange: (value: UserRole | null) => void;
		onActiveChange: (value: boolean | null) => void;
	}

	let {
		searchQuery = $bindable(),
		selectedRole = $bindable(),
		isActiveFilter = $bindable(),
		onSearchChange,
		onRoleChange,
		onActiveChange
	}: Props = $props();

	const colors = {
		cream: '#f4e9c4',
		taupe: '#a78d70',
		rose: '#ce7576',
		grey: '#cccccc',
		gold: '#b58b3a'
	};

	function handleRoleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const value = target.value;
		const role = value === '' ? null : (value as UserRole);
		selectedRole = role;
		onRoleChange(role);
	}

	function handleActiveChange() {
		// Toggle entre true, false, null
		if (isActiveFilter === null) {
			isActiveFilter = true;
		} else if (isActiveFilter === true) {
			isActiveFilter = false;
		} else {
			isActiveFilter = null;
		}
		onActiveChange(isActiveFilter);
	}
</script>

<div class="filters-container">
	<!-- Search Input -->
	<div class="search-wrapper">
		<div class="search-icon">
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<circle cx="11" cy="11" r="8"></circle>
				<path d="m21 21-4.35-4.35"></path>
			</svg>
		</div>
		<input
			type="text"
			bind:value={searchQuery}
			oninput={(e) => onSearchChange((e.target as HTMLInputElement).value)}
			placeholder="Buscar usuarios..."
			class="search-input"
		/>
	</div>

	<!-- Filters Row -->
	<div class="filters-row">
		<!-- Role Filter -->
		<div class="filter-group">
			<label for="role-filter" class="filter-label" style="color: {colors.taupe};">Rol</label>
			<select
				id="role-filter"
				bind:value={selectedRole}
				onchange={handleRoleChange}
				class="filter-select"
				style="border-color: {colors.taupe};"
			>
				<option value="">Todos</option>
				<option value="SUPERADMIN">SUPERADMIN</option>
				<option value="ADMIN">ADMIN</option>
				<option value="MODERATOR">MODERATOR</option>
				<option value="USER">USER</option>
			</select>
		</div>

		<!-- Active/Inactive Toggle -->
		<div class="filter-group">
			<label class="filter-label" style="color: {colors.taupe};">Activo/Inactivo</label>
			<button
				type="button"
				onclick={handleActiveChange}
				class="toggle-button"
				style="background-color: {isActiveFilter === null
					? colors.grey
					: isActiveFilter
						? '#10b981'
						: colors.rose};"
			>
				<span class="toggle-slider" class:active={isActiveFilter !== false}></span>
			</button>
			<span class="toggle-label" style="color: {colors.taupe};">
				{isActiveFilter === null ? 'Todos' : isActiveFilter ? 'Activo' : 'Inactivo'}
			</span>
		</div>
	</div>
</div>

<style>
	.filters-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.search-wrapper {
		position: relative;
		width: 100%;
	}

	.search-icon {
		position: absolute;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		color: #9ca3af;
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem 1rem 0.75rem 3rem;
		border: 2px solid #e5e7eb;
		border-radius: 0.75rem;
		font-size: 1rem;
		transition: all 0.2s ease;
		background-color: white;
	}

	.search-input:focus {
		outline: none;
		border-color: #a78d70;
		box-shadow: 0 0 0 3px rgba(167, 141, 112, 0.1);
	}

	.filters-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: flex-end;
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 200px;
	}

	.filter-label {
		font-size: 0.875rem;
		font-weight: 600;
	}

	.filter-select {
		padding: 0.625rem 1rem;
		border: 2px solid;
		border-radius: 0.75rem;
		font-size: 0.875rem;
		background-color: white;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.filter-select:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(167, 141, 112, 0.1);
	}

	.toggle-button {
		position: relative;
		width: 3.5rem;
		height: 2rem;
		border-radius: 9999px;
		border: none;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.toggle-slider {
		position: absolute;
		top: 0.25rem;
		left: 0.25rem;
		width: 1.5rem;
		height: 1.5rem;
		background-color: white;
		border-radius: 50%;
		transition: transform 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.toggle-slider.active {
		transform: translateX(1.5rem);
	}

	.toggle-label {
		font-size: 0.875rem;
		font-weight: 600;
		margin-top: 0.25rem;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.filters-row {
			flex-direction: column;
		}

		.filter-group {
			width: 100%;
			min-width: unset;
		}
	}
</style>
