<script lang="ts">
	import type { EnrollmentStatus } from '$lib/interfaces';

	let { 
		searchQuery = $bindable(''), 
		selectedStatus = $bindable(null),
		onSearchChange,
		onStatusChange
	} = $props<{
		searchQuery: string;
		selectedStatus: EnrollmentStatus | null;
		onSearchChange?: (value: string) => void;
		onStatusChange?: (status: EnrollmentStatus | null) => void;
	}>();

	const statuses: { value: EnrollmentStatus | null; label: string }[] = [
		{ value: null, label: 'Todos los estados' },
		{ value: 'ACTIVE', label: 'Activo' },
		{ value: 'EXPIRED', label: 'Vencido' },
		{ value: 'CANCELLED', label: 'Cancelado' }
	];

	function handleInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		searchQuery = value;
		onSearchChange?.(value);
	}

	function handleStatusChange(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		const status = value === 'null' ? null : value as EnrollmentStatus;
		selectedStatus = status;
		onStatusChange?.(status);
	}
</script>

<div class="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
	<div class="relative flex-1">
		<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
		</div>
		<input
			type="text"
			placeholder="Buscar por usuario o curso..."
			class="w-full rounded-lg border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-100"
			value={searchQuery}
			oninput={handleInput}
		/>
	</div>
	
	<div class="flex items-center gap-2">
		<label for="status-filter" class="hidden text-sm font-medium text-stone-500 md:block">Estado:</label>
		<select
			id="status-filter"
			class="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none transition-all focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-100"
			value={selectedStatus === null ? 'null' : selectedStatus}
			onchange={handleStatusChange}
		>
			{#each statuses as status, i (i)}
				<option value={status.value === null ? 'null' : status.value}>
					{status.label}
				</option>
			{/each}
		</select>
	</div>
</div>
