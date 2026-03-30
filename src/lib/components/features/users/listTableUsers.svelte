<script lang="ts">
	import type { User } from '$lib/interfaces';
	import RowUser from './rowUser.svelte';
	import CardUser from './cardUser.svelte';
	import UserSkeleton from './userSkeleton.svelte';
	import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '$lib/components/ui';

	interface Props {
		users: User[];
		loading?: boolean;
		onAction: (user: User) => void;
		onDelete: (user: User) => void;
		onResetPassword: (user: User) => void;
		onUpdateRole: (user: User) => void;
	}

	let { 
		users = [], 
		loading = false, 
		onAction, 
		onDelete, 
		onResetPassword, 
		onUpdateRole 
	}: Props = $props();
</script>

<!-- Mobile Cards View -->
<div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
	{#if loading}
		<div class="col-span-full rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
			<UserSkeleton rows={3} />
		</div>
	{:else if users.length === 0}
		<div class="col-span-full flex flex-col items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-500 shadow-sm dark:border-stone-800 dark:bg-stone-900">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="opacity-30">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="8" x2="12" y2="12"></line>
				<line x1="12" y1="16" x2="12.01" y2="16"></line>
			</svg>
			<span class="text-sm font-medium">No se encontraron usuarios</span>
		</div>
	{:else}
		{#each users as user (user.id)}
			<CardUser 
				{user} 
				{onAction} 
				{onDelete} 
				{onResetPassword} 
				{onUpdateRole} 
			/>
		{/each}
	{/if}
</div>

<!-- Desktop Table View -->
<div class="hidden w-full overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm md:block dark:border-stone-800 dark:bg-stone-900">
	<Table>
		<TableHeader class="bg-stone-50/50">
			<TableRow>
				<TableHead class="w-[300px] text-xs font-semibold uppercase tracking-wider text-stone-500">
					Usuario
				</TableHead>
				<TableHead class="hidden md:table-cell text-xs font-semibold uppercase tracking-wider text-stone-500">
					Rol
				</TableHead>
				<TableHead class="hidden lg:table-cell text-xs font-semibold uppercase tracking-wider text-stone-500">
					Fecha Registro
				</TableHead>
				<TableHead class="text-xs font-semibold uppercase tracking-wider text-stone-500">
					Estado
				</TableHead>
				<TableHead class="text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
					Acciones
				</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#if loading}
				<UserSkeleton rows={5} />
			{:else if users.length === 0}
				<TableRow>
					<TableCell colspan={5} class="h-32 text-center text-stone-500">
						<div class="flex flex-col items-center justify-center gap-2">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="opacity-20">
								<circle cx="12" cy="12" r="10"></circle>
								<line x1="12" y1="8" x2="12" y2="12"></line>
								<line x1="12" y1="16" x2="12.01" y2="16"></line>
							</svg>
							<span>No se encontraron usuarios</span>
						</div>
					</TableCell>
				</TableRow>
			{:else}
				{#each users as user (user.id)}
					<RowUser 
						{user} 
						{onAction} 
						{onDelete} 
						{onResetPassword} 
						{onUpdateRole} 
					/>
				{/each}
			{/if}
		</TableBody>
	</Table>
</div>
